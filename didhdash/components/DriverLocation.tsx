import { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 36.7749, 
  lng: 10.4194,
};

const DriverLiveTracking = ({ driverId }: { driverId: number }) => {
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Add your Google Maps API key
  });

  // Get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          console.log("navigator",position.coords.latitude," ", position.coords.longitude);
          
        },
        
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Fetch driver location periodically
  useEffect(() => {
    const fetchDriverLocation = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/driver/location/${driverId}`);
        const { latitude, longitude } = response.data;
        setDriverLocation({ lat: latitude, lng: longitude });
        console.log("driver lat and log ",response.data);
        console.log('blastii ',userLocation);
        
        
      } catch (error) {
        console.error('Error fetching driver location:', error);
      }
    };

    fetchDriverLocation();
    const interval = setInterval(fetchDriverLocation, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, [driverId]);

  // Calculate route, distance, and duration when driver or user location changes
  useEffect(() => {
    if (driverLocation && userLocation && isLoaded && window.google) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: driverLocation,
          destination: userLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            setDistance(result.routes[0].legs[0].distance?.text || null);
            setDuration(result.routes[0].legs[0].duration?.text || null);
          } else if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
            console.error('No route found between the locations.');
            setDistance('N/A');
            setDuration('N/A');
          } else {
            console.error('Error fetching directions:', status);
          }
        }
      );
    }
  }, [driverLocation, userLocation, isLoaded]);

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
        {userLocation && <Marker position={userLocation} title="Your Location" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default DriverLiveTracking;