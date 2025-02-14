"use client";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";

// ✅ Define TypeScript Interface
interface RestaurantOwner {
  id: number;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
}

const FAKE_RESTAURANT_OWNER_ID = 1;

export default function ProfilePage() {
  const [owner, setOwner] = useState<RestaurantOwner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedOwner, setUpdatedOwner] = useState<RestaurantOwner | null>(null);

  useEffect(() => {
    fetchOwnerProfile();
  }, []);

  // ✅ Fetch Restaurant Owner Profile
  const fetchOwnerProfile = async () => {
    try {
      const response = await axios.get<RestaurantOwner>(`http://localhost:5000/api/restaurant-owner/${FAKE_RESTAURANT_OWNER_ID}`);
      setOwner(response.data);
      setUpdatedOwner(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedOwner((prev) => prev ? { ...prev, [name]: value } : null);
  };

  // ✅ Update Profile
  const handleUpdate = async () => {
    if (!updatedOwner) return;

    try {
      await axios.put(`http://localhost:5000/api/restaurant-owner/${FAKE_RESTAURANT_OWNER_ID}`, updatedOwner);
      setOwner(updatedOwner);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-8">
      <h1 className="text-2xl font-semibold text-[#1e293b] mb-6">My Profile</h1>

      {loading ? (
        <p className="text-gray-500">Loading profile...</p>
      ) : owner ? (
        <div className="bg-white p-6 rounded-xl shadow-md w-96 text-center">
          <Image
            src={owner.imageUrl || "/placeholder.jpg"}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full mx-auto mb-4"
          />

          {!isEditing ? (
            <>
              <p className="text-lg font-semibold">{owner.name}</p>
              <p className="text-gray-600">{owner.email}</p>
              <p className="text-gray-600">{owner.phone}</p>
              <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <input type="text" name="name" value={updatedOwner?.name} onChange={handleChange} className="border p-2 w-full mb-2" />
              <input type="email" name="email" value={updatedOwner?.email} onChange={handleChange} className="border p-2 w-full mb-2" />
              <input type="text" name="phone" value={updatedOwner?.phone} onChange={handleChange} className="border p-2 w-full mb-2" />
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
