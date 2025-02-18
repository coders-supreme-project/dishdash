"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// Define TypeScript Interfaces
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number | null;
}

interface Category {
  id: number;
  name: string;
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
  address: string;
  cuisineType: string;
  closingH: string;
  contactNumber: string;
  geoLocation: any[]; // You may want to type this more specifically
  openingH: string;
  rating: number;
  restaurantOwner: {
    id: number;
    firstName: string;
    lastName: string;
    userId: number;
    user: {
      id: number;
      email: string;
      // Add any other fields that are part of the user object here
    };
  };
  restaurantOwnerId: number;
  restaurantRcId: string;
  media: any[]; // You might want to define this more specifically depending on the structure of media
  menuItems: any[]; // You may also want to define this depending on the structure of menu items
}

interface User {
  id: string;
  email: string;
}

export default function Home() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [restaurant, setRestaurant] = useState<number | null>(null);
  const userString = localStorage.getItem("user");
  const user: User = userString ? JSON.parse(userString) : null;

  // Fetch Restaurant by User ID
  const fetchRestaurant = async () => {
    const userString = localStorage.getItem("user");
    if (!userString) return;

    const user: User = JSON.parse(userString);
    if (!user.id) return;
    console.log(user,"userrrr");
    
    try {
      const response = await axios.get<Restaurant>(
        `http://127.0.0.1:3000/api/restaurants/get/${user.id}`
      );
      console.log("Restaurant Data:", response.data);

      setRestaurant(response.data.id);
      localStorage.setItem("restaurant", JSON.stringify(response.data.id));

    } catch (error) {
      console.error("❌ Error fetching restaurant:", error);
    }
  };

  // Fetch Menu Items
  const fetchMenuItems = async () => {
    const restId = localStorage.getItem("restaurant");
    
    if (!restaurant) return;
    try {
      console.log("id rest",restId)
      const response = await axios.get<MenuItem[]>(
        `http://localhost:3000/api/owner/menu/${restId}`
      );
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(
        "http://localhost:3000/api/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Open Edit Modal
  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Handle Input Changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingItem((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Handle Toggle for isAvailable
  const handleToggleAvailability = () => {
    setEditingItem((prev) =>
      prev ? { ...prev, isAvailable: !prev.isAvailable } : null
    );
  };

  // Update Menu Item
  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      await axios.put(
        `http://localhost:3000/api/restaurant-owner/menu-item/${editingItem.id}`,
        editingItem
      );
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? editingItem : item
        )
      );
      closeModal();
      alert("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  // Delete Menu Item
  const handleDelete = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/owner/menu-item/${itemId}`
      );
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    fetchRestaurant();
    console.log("Restaurant Data:", restaurant);

    fetchCategories();
  }, []);

  

  // Fetch Menu Items When Restaurant is Set
  useEffect(() => {
    if (restaurant) {
      fetchMenuItems();
    }
  }, [restaurant]);
  

  // Update the return statement with this professional design
return (
  <div className="min-h-screen bg-gray-50 flex">
    {/* Sidebar */}
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-8 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Dashboard
      </h2>
      <nav>
        <ul className="space-y-3">
          <li>
            <a href="#" className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </a>
          </li>
          <li>
            <a href="/profilerestaurentowner" className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </a>
          </li>
          <li>
            <a href="/additemrestaurent" className="flex items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </a>
          </li>
        </ul>
      </nav>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Good morning, {user.customer.firstName} 👋</h1>
        <p className="text-gray-600">Here's what's happening with your store today</p>
      </header>

      {/* Restaurant Menu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Menu Items</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{menuItems.length} items</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-500">No menu items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden">
                      {item.imageUrl ? (
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.categoryId ? categories.find(c => c.id === item.categoryId)?.name : "Uncategorized"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-blue-600">${item.price}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2 border-t border-gray-100 pt-3">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="flex-1 text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-md hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 text-sm text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Edit Modal */}
    {isModalOpen && editingItem && (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Edit Menu Item</h2>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input
                type="text"
                name="name"
                value={editingItem.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={editingItem.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={editingItem.price}
                    onChange={handleChange}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <button
                  onClick={handleToggleAvailability}
                  className={`w-full px-3 py-2 rounded-lg transition-colors ${editingItem.isAvailable ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                >
                  {editingItem.isAvailable ? 'Available' : 'Out of Stock'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                  {editingItem.imageUrl && (
                    <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      try {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("upload_preset", "dvborwee");
                        
                        const uploadResponse = await axios.post(
                          "https://api.cloudinary.com/v1_1/drliudydx/image/upload",
                          formData
                        );
                        
                        setEditingItem(prev => prev ? {
                          ...prev,
                          imageUrl: uploadResponse.data.secure_url
                        } : null);
                      } catch (error) {
                        console.error("Image upload failed:", error);
                        alert("Failed to upload image");
                      }
                    }}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="inline-block px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    Upload New Image
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
