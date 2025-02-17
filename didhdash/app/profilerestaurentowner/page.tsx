"use client";
import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";

interface Restaurant {
  id: number;
  name: string;
  contactNumber: string;
  address: string;
  imageUrl: string;
  openingH: string;
  closingH: string;
  cuisineType: string;
}



export default function ProfilePage() {
  const user = localStorage.getItem("user");
  console.log(user,);
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedRestaurant, setUpdatedRestaurant] = useState<Restaurant | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  
  
  const restId = localStorage.getItem("restaurant");

  console.log("hello",restId);

useEffect(() => {
  if (restId) setRestaurantId(Number(restId));
  fetchRestaurantProfile()

}, []);
  const fetchRestaurantProfile = async () => {
    if (!restId) return;
    
    try {
      console.log("hello",restId);

      const response = await axios.get<Restaurant>(
        `http://localhost:3000/api/restaurent/${restId}`
      );
      setRestaurant(response.data);
      setUpdatedRestaurant(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setImageFile(e.target.files[0]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedRestaurant((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleUpdate = async () => {
    if (!updatedRestaurant || !restaurantId) return;
  
    try {
      let image = updatedRestaurant.imageUrl;
  
      if (imageFile) {
        const timestamp = Math.floor(Date.now() / 1000);
        const { data } = await axios.post(
          "http://localhost:3000/api/restaurent/sign-cloudinary",
          { timestamp }
        );

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "dvborwee");
        formData.append("api_key", data.apiKey);

        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/drliudydx/image/upload`,
          formData
        );
        image = uploadResponse.data.secure_url;
      }

      await axios.put(
       `http://localhost:3000/api/restaurent/${restaurantId}`,
        {
          ...updatedRestaurant,
          image,
          contactNumber: updatedRestaurant.contactNumber,
          openingH: updatedRestaurant.openingH,
          closingH: updatedRestaurant.closingH
        }
      );

      setRestaurant((prev) => prev ? { ...prev, imageUrl: image } : null);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Check Cloudinary settings.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Restaurant Profile</h1>
              <p className="mt-1 text-gray-600">Manage your restaurant information</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : restaurant ? (
            <div className="space-y-6">
              {!isEditing ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2 flex justify-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={restaurant.imageUrl || "/placeholder.jpg"}
                        alt="Restaurant"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="mt-1 text-gray-900">{restaurant.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                    <p className="mt-1 text-gray-900">{restaurant.contactNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Opening Time</label>
                    <p className="mt-1 text-gray-900">{restaurant.openingH}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Closing Time</label>
                    <p className="mt-1 text-gray-900">{restaurant.closingH}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-gray-900">{restaurant.address}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Cuisine Type</label>
                    <p className="mt-1 text-gray-900">{restaurant.cuisineType}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Image
                      </label>
                      <div className="flex items-center space-x-6">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                          <img
                            src={updatedRestaurant?.imageUrl || "/placeholder.jpg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="profileImage"
                          />
                          <label
                            htmlFor="profileImage"
                            className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Change Photo
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={updatedRestaurant?.name || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={updatedRestaurant?.contactNumber || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        name="openingH"
                        value={updatedRestaurant?.openingH || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        name="closingH"
                        value={updatedRestaurant?.closingH || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={updatedRestaurant?.address || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuisine Type
                      </label>
                      <input
                        type="text"
                        name="cuisineType"
                        value={updatedRestaurant?.cuisineType || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No restaurant profile found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}