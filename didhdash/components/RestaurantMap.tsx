import axios from 'axios';
import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';

// Define the type for a restaurant
interface Restaurant {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Google Maps configuration
const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 37.7749, // Default center (San Francisco)
  lng: -122.4194,
};

const RestaurantsMapPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Add your Google Maps API key in .env.local
  });

  // Fetch restaurants from the backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/api/restaurants/location'); // Replace with your API endpoint
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  // Get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Function to calculate the distance between two coordinates using the Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <h1>Restaurants on Map</h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={userLocation || center} // Center the map on the user's location if available
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
            title={restaurant.name}
            onClick={() => {
              setSelectedRestaurant(restaurant);
            }}
          />
        ))}

        {selectedRestaurant && (
          <InfoWindow
            position={{ lat: selectedRestaurant.latitude, lng: selectedRestaurant.longitude }}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <div>
              <h3>{selectedRestaurant.name}</h3>
              <p>{selectedRestaurant.address}</p>
              {userLocation && (
                <p>
                  Distance:{' '}
                  {calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    selectedRestaurant.latitude,
                    selectedRestaurant.longitude
                  ).toFixed(2)}{' '}
                  km
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default RestaurantsMapPage;