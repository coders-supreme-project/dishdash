"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

// ✅ Define TypeScript Interfaces
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

const DEFAULT_RESTAURANT_ID = 3;

export default function Home() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  // ✅ Fetch Menu Items
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get<MenuItem[]>(`http://localhost:3000/api/restaurant-owner/menu/${DEFAULT_RESTAURANT_ID}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>("http://localhost:3000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // ✅ Open Edit Modal
  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // ✅ Handle Input Changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingItem((prev) => prev ? { ...prev, [name]: value } : null);
  };

  // ✅ Handle Toggle for isAvailable
  const handleToggleAvailability = () => {
    setEditingItem((prev) => prev ? { ...prev, isAvailable: !prev.isAvailable } : null);
  };

  // ✅ Update Menu Item
  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      await axios.put(`http://localhost:3000/api/restaurant-owner/menu-item/${editingItem.id}`, editingItem);
      setMenuItems((prevItems) => prevItems.map(item => item.id === editingItem.id ? editingItem : item));
      closeModal();
      alert("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  // ✅ Delete Menu Item
  const handleDelete = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
  
    try {
      await axios.delete(`http://localhost:3000/api/restaurant-owner/menu-item/${itemId}`);
      setMenuItems((prevItems) => prevItems.filter(item => item.id !== itemId));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 card-shadow">
        <h2 className="text-lg font-semibold text-[#1e293b] mb-6">Navigation</h2>
        <ul className="space-y-4">
          <li><a href="#" className="text-[#64748b] hover:text-[#3b82f6]">Home</a></li>
          <li><a href="/profilerestaurentowner" className="text-[#64748b] hover:text-[#3b82f6]">Profile</a></li>
          <li><a href="/additemrestaurent" className="text-[#64748b] hover:text-[#3b82f6]">Add Product</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1e293b]">Good morning, Sarah</h1>
          <p className="text-[#64748b]">Here's what's happening with your store today</p>
        </header>

        {/* Restaurant Menu */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h2 className="text-lg font-semibold text-[#1e293b] mb-6">Restaurant Menu</h2>

          {loading ? (
            <p className="text-gray-500">Loading menu items...</p>
          ) : menuItems.length === 0 ? (
            <p className="text-gray-500">No menu items found.</p>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-[#1e293b]">{item.name}</p>
                      <p className="text-sm text-[#64748b]">{item.categoryId ? `Category: ${item.categoryId}` : "No Category"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleEditClick(item)} className="text-blue-500 text-sm">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Menu Item</h2>
            <input type="text" name="name" value={editingItem.name} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Name" />
            <textarea name="description" value={editingItem.description} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Description"></textarea>
            <input type="number" name="price" value={editingItem.price} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Price" />
            <input type="text" name="imageUrl" value={editingItem.imageUrl} onChange={handleChange} className="border p-2 w-full mb-2" placeholder="Image URL" />
            <button onClick={handleToggleAvailability} className={`p-2 w-full ${editingItem.isAvailable ? "bg-green-500" : "bg-red-500"} text-white rounded`}>
              {editingItem.isAvailable ? "Available" : "Not Available"}
            </button>
            <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
            <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
