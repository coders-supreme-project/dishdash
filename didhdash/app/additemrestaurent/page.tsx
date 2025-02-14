"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const DEFAULT_RESTAURANT_ID = 5; // Set default restaurant ID

const MenuItemForm = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    isAvailable: "true",
    categoryId: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/restaurant-owner/menu-item", {
        restaurantId: DEFAULT_RESTAURANT_ID, // Use default ID
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
        isAvailable: formData.isAvailable === "true",
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      });

      console.log("Item Created:", response.data);
      alert("Item created successfully!");
      router.push("/dashboardrestaurent"); // Redirect after success
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Failed to create item. Check console for details.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Create Menu Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" required className="border p-2 w-full" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="border p-2 w-full" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="border p-2 w-full" />
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required className="border p-2 w-full" />
        
        <select name="isAvailable" value={formData.isAvailable} onChange={handleChange} className="border p-2 w-full">
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        {/* Categories Dropdown */}
        <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="border p-2 w-full">
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Item</button>
      </form>

      {/* Profile Button to Navigate to Dashboard */}
      <button onClick={() => router.push("/dashboardrestaurent")} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Go to Dashboard
      </button>
    </div>
  );
};

export default MenuItemForm;
