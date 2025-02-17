// // useSocket.js
// import { useEffect } from "react";
// import { io } from "socket.io-client";

// // Custom hook to manage socket connection and handle location updates
// const useSocket = (callback) => {
//   useEffect(() => {
//     const socket = io("http://localhost:3000", {
//       withCredentials: true,
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       transports: ["websocket", "polling"],
//       autoConnect: true,
//     });

//     socket.on("locationUpdate", callback);

//     return () => {
//       socket.off("locationUpdate");
//     };
//   }, [callback]);
// };

// export default useSocket;
