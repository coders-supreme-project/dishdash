"use client";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";

// ✅ Define TypeScript Interface for Restaurant
interface Restaurant {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  imageUrl: string;
  description: string;
}

const DEFAULT_RESTAURANT_ID = 3; // Change this as needed

export default function ProfilePage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedRestaurant, setUpdatedRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    fetchRestaurantProfile();
  }, []);

  // ✅ Fetch Restaurant Profile
  const fetchRestaurantProfile = async () => {
    try {
      const response = await axios.get<Restaurant>(`http://localhost:3000/api/restaurants/${DEFAULT_RESTAURANT_ID}`);
      setRestaurant(response.data);
      setUpdatedRestaurant(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedRestaurant((prev) => prev ? { ...prev, [name]: value } : null);
  };

  // ✅ Update Profile
  const handleUpdate = async () => {
    if (!updatedRestaurant) return;

    try {
      await axios.put(`http://localhost:3000/api/restaurants/${DEFAULT_RESTAURANT_ID}`, updatedRestaurant);
      setRestaurant(updatedRestaurant);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-8">
      <h1 className="text-2xl font-semibold text-[#1e293b] mb-6">Restaurant Profile</h1>

      {loading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : restaurant ? (
        <div className="bg-white p-6 rounded-xl shadow-md w-96 text-center">
          <Image
            src={restaurant.imageUrl || "/placeholder.jpg"}
            alt="Restaurant Picture"
            width={100}
            height={100}
            className="rounded-full mx-auto mb-4"
          />

          {!isEditing ? (
            <>
              <p className="text-lg font-semibold">{restaurant.name}</p>
              <p className="text-gray-600">{restaurant.email}</p>
              <p className="text-gray-600">{restaurant.phone}</p>
              <p className="text-gray-600">{restaurant.address}</p>
              <p className="text-gray-600">{restaurant.description}</p>
              <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <input type="text" name="name" value={updatedRestaurant?.name} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Name" />
              <input type="email" name="email" value={updatedRestaurant?.email} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Email" />
              <input type="text" name="phone" value={updatedRestaurant?.phone} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Phone" />
              <input type="text" name="address" value={updatedRestaurant?.address} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Address" />
              <textarea name="description" value={updatedRestaurant?.description} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Description" />
              <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded mt-2 ml-2">
                Cancel
              </button>
            </>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No profile found.</p>
      )}
    </div>
  );
}
