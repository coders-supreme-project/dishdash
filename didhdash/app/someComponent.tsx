import { useEffect, useState } from "react";
import axios from "axios";

export default function SomeComponent() {
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

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
  }, []);

  return (
    <div>
      {restaurantId ? <p>Restaurant ID: {restaurantId}</p> : <p>Loading...</p>}
    </div>
  );
} 