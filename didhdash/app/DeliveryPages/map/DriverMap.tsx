"use client";
import { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import Swal from "sweetalert2"; // For showing SweetAlert

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 36.7749,
  lng: 10.4194,
};

const DriverLiveTracking = ({ orderId }: { orderId: number }) => {
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Add your Google Maps API key
  });

  // Fetch customer location by orderId
  useEffect(() => {
    const fetchCustomerLocation = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/driver/locationorder/${orderId}`);
        const { latitude, longitude } = response.data;
        setCustomerLocation({ lat: latitude, lng: longitude });
        console.log("Customer Location:", latitude, longitude);
      } catch (error) {
        console.error("Error fetching customer location:", error);
      }
    };

    fetchCustomerLocation();
  }, [orderId]);

  // Get the driver's current location and update it in the database every 5 seconds
  useEffect(() => {
    const updateDriverLocation = async (latitude: number, longitude: number) => {
      const driverId = localStorage.getItem("driverId"); // Retrieve driverId from localStorage
      if (!driverId) {
        console.error("Driver ID not found in localStorage");
        return;
      }

      try {
        // Update the driver's location in the database
        await axios.put("http://127.0.0.1:3000/api/driver/location", {
          driverId: 2,
          latitude,
          longitude,
        });
        console.log("Driver location updated:", latitude, longitude);
      } catch (error) {
        console.error("Error updating driver location:", error);
      }
    };

    const fetchDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDriverLocation({ lat: latitude, lng: longitude }); // Update driver location on the map
            updateDriverLocation(latitude, longitude); // Update driver location in the database
          },
          (error) => {
            console.error("Error getting driver location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    fetchDriverLocation(); // Fetch and update immediately
    const interval = setInterval(fetchDriverLocation, 5000); // Fetch and update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate route, distance, and duration when driver or customer location changes
  useEffect(() => {
    if (driverLocation && customerLocation && isLoaded && window.google) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: driverLocation,
          destination: customerLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            setDistance(result.routes[0].legs[0].distance?.text || null);
            setDuration(result.routes[0].legs[0].duration?.text || null);
          } else if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
            console.error("No route found between the locations.");
            setDistance("N/A");
            setDuration("N/A");
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [driverLocation, customerLocation, isLoaded]);

  // Check if the driver has arrived at the customer's location
  useEffect(() => {
    if (driverLocation && customerLocation) {
      const isArrived =
        driverLocation.lat.toFixed(4) === customerLocation.lat.toFixed(4) &&
        driverLocation.lng.toFixed(4) === customerLocation.lng.toFixed(4);

      if (isArrived) {
        Swal.fire({
          title: "Arrived!",
          text: "You have reached the customer's location.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    }
  }, [driverLocation, customerLocation]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <h2>Driver Live Tracking</h2>
      {distance && duration && (
        <div>
          <p>Distance: {distance}</p>
          <p>Estimated Time of Arrival (ETA): {duration}</p>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={driverLocation || center}
      >
        {driverLocation && <Marker position={driverLocation} title="Driver Location" />}
        {customerLocation && <Marker position={customerLocation} title="Customer Location" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default DriverLiveTracking;