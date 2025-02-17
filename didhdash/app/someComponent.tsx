import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function SomeComponent() {
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [socketMessage, setSocketMessage] = useState<string>("");

  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        const ownerId = localStorage.getItem("ownerId"); // Assume ownerId is stored in local storage
        if (!ownerId) return;

        const response = await axios.get(`http://localhost:3000/api/owner/${ownerId}/restaurant-id`);
        setRestaurantId(response.data.restaurantId);
        localStorage.setItem("restaurantId", response.data.restaurantId.toString());
      } catch (error) {
        console.error("Error fetching restaurant ID:", error);
      }
    };

    fetchRestaurantId();

    // Connect to the WebSocket server
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");

      // Emit an example event
      socket.emit("exampleEvent", { data: "Hello from client!" });
    });

    // Listen for a response from the server
    socket.on("exampleResponse", (data) => {
      console.log("Received exampleResponse:", data);
      setSocketMessage(data.message);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {restaurantId ? <p>Restaurant ID: {restaurantId}</p> : <p>Loading...</p>}
      <p>Socket Message: {socketMessage}</p>
    </div>
  );
} 