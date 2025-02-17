"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";

interface Restaurant {
  name: string;
  id: number;
  lat: number;
  lng: number;
}

interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  deliveryAddress: string;
  paymentStatus: string;
  restaurantId: number;
}

interface LiveMapProps {
  onMapLoaded: () => void;
}

const Map: React.FC<LiveMapProps> = ({ onMapLoaded }) => {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const mapCenter = userLocation || { lat: 36.812048, lng: 10.138082 };
  
  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  // Watch user location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log("📍 Updated User position:", latitude, longitude);
        },
        (error) => console.error("⚠️ Error watching position:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Fetch restaurants and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:3000/api/restaurants'),
          fetch('http://localhost:3000/api/orders')
        ]);

        const restaurantsData = await restaurantsRes.json();
        const ordersData = await ordersRes.json();

        setRestaurants(restaurantsData);
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedRestaurant(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC8A06]"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px] bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full relative">
      <GoogleMap
        mapContainerClassName="w-full h-full rounded-lg shadow-lg"
        center={mapCenter}
        zoom={12}
        options={mapOptions}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "/user-marker.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        )}

        {/* Restaurant Markers */}
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            onClick={() => handleRestaurantClick(restaurant)}
            icon={{
              url: "/restaurant-marker.png",
              scaledSize: new google.maps.Size(35, 35),
            }}
          />
        ))}

        {/* Info Window */}
        {selectedRestaurant && (
          <InfoWindow
            position={{ lat: selectedRestaurant.lat, lng: selectedRestaurant.lng }}
            onCloseClick={handleCloseInfoWindow}
          >
            <div className="p-4 max-w-sm">
              <h3 className="text-lg font-semibold mb-2">{selectedRestaurant.name}</h3>
              <div className="space-y-2">
                {orders
                  .filter((order) => order.restaurantId === selectedRestaurant.id)
                  .map((order) => (
                    <div key={order.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">${order.totalAmount}</p>
                      <button
                        onClick={() => router.push(`/delivery/orders/${order.id}`)}
                        className="mt-2 w-full bg-[#FC8A06] text-white px-4 py-2 rounded-md hover:bg-[#028643] transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;