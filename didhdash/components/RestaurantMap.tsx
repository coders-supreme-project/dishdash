// import Image from "next/image";
// import styles from "./page.module.css";
// import '@/styles/globals.css';
// export default function RestaurantMap() {
//     const { isLoaded, loadError } = useLoadScript({
//         googleMapsApiKey: 'AIzaSyB5gnUWjb84t6klt5vcPjMOQylhQRFB5Wc', // Replace with your Google Maps API key
//     });

//     useEffect(() => {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 setUserLat(latitude);
//                 setUserLng(longitude);
//             console.log(latitude," ",longitude,"possitiiion");
            
//                 axios.post('http://127.0.0.1:5000/api/doctor/location', { lat: latitude, lng: longitude })
//                     .then((response) => {
//                         setDoctors(response.data);
//                         console.log(response.data, "doctors");
//                     })
//                     .catch((error) => console.error("Error fetching doctors:", error));
//             },
//             (error) => console.error("Error getting user location:", error)
//         );
//     }, []);

//     if (loadError) return <div>Error loading maps</div>;
//     if (!isLoaded) return <div>Loading Maps...</div>;
//     if (userLat === null || userLng === null) return <div>Loading...</div>;



//   return (
//     <div>
//        <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 zoom={13}
//                 center={{ lat: userLat, lng: userLng }}
//             >
//                 <Marker
//                     position={{ lat: userLat, lng: userLng }}
//                     icon={{
//                         url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
//                     }}
//                 />

//                 {doctors?.map((doctor) => (
//                     <Marker
//                         key={doctor.id}
//                         position={{ lat: parseFloat(doctor.LocationLatitude), lng: parseFloat(doctor.LocationLongitude) }}
//                         onClick={() =>{ setSelectedDoctor(doctor)

//                             console.log(selectedDoctor,"doctoor");

//                         }}
//                         icon={{
//                             url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
//                         }}
//                     />
//                 ))}

//                 {selectedDoctor && (
//                     <InfoWindow
//                         position={{ lat:parseFloat( selectedDoctor.LocationLatitude), lng:parseFloat( selectedDoctor.LocationLongitude) }}
//                         onCloseClick={() =>{ 
//                             console.log(selectedDoctor,"doctoor");
                            
//                             setSelectedDoctor(null)}}
//                     >
//                         <div>
//                             <h3>{`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</h3>
//                             <p>{selectedDoctor.specialty}</p>
//                             <p>{`Distance: ${selectedDoctor.distance.toFixed(2)} km`}</p>
//                         </div>
//                     </InfoWindow>
//                 )}
//             </GoogleMap>
//     </div>
//   );
// }
