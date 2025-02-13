"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, ChevronRight, Search, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { fetchOrders, updateOrderStatus, deleteOrderItem, updateOrderItem } from "../services/api";
import type { Order, OrderItem } from "../services/api";

// Constants
const DEFAULT_FOOD_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop";

interface NewOrder {
  name: string;
  price: number;
  restaurant: string;
}

export default function FoodOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState<NewOrder>({
    name: '',
    price: 0,
    restaurant: ''
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOrderQuantity = async (orderId: number, itemId: number, action: 'increase' | 'decrease') => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) return;

      const itemToUpdate = orderToUpdate.items.find(item => item.id === itemId);
      if (!itemToUpdate) return;

      const newQuantity = action === 'increase' 
        ? itemToUpdate.quantity + 1 
        : Math.max(0, itemToUpdate.quantity - 1);

      if (newQuantity === 0) {
        await deleteOrderItem(orderId, itemId);
      } else {
        await updateOrderItem(orderId, itemId, newQuantity);
      }

      // Reload orders to get updated data
      loadOrders();
    } catch (error) {
      console.error('Error updating order quantity:', error);
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const handlePurchase = async (orderId: number) => {
    try {
      await updateOrderStatus(orderId, 'completed');
      loadOrders();
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handleAddOrder = () => {
    if (!newOrder.name || !newOrder.price || !newOrder.restaurant) {
      alert('Please fill in all fields');
      return;
    }

    const newOrderItem: Order = {
      id: orders.length + 1,
      items: [
        {
          id: orders.length + 1,
          name: newOrder.name,
          price: newOrder.price,
          quantity: 1,
          image: DEFAULT_FOOD_IMAGE,
        }
      ],
      totalAmount: newOrder.price,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      restaurant: newOrder.restaurant
    };

    setOrders(prev => [...prev, newOrderItem]);
    setShowAddModal(false);
    setNewOrder({ name: '', price: 0, restaurant: '' });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.restaurant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'active' ? order.status === 'pending' : order.status === 'completed';
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto p-4"> {/* Reduced max-width for better centering */}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-semibold">Food Orders</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 w-[300px]"
              />
            </div>
            <button 
              className="bg-yellow text-white px-4 py-2 rounded-xl flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4" /> Add Order
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-xl ${activeTab === 'active' ? 'bg-yellow text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('active')}
          >
            Active Orders
          </button>
          <button
            className={`px-4 py-2 rounded-xl ${activeTab === 'completed' ? 'bg-yellow text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Orders
          </button>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col">
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{order.restaurant}</h3>
                    <p className="text-sm text-gray-400">Order #{order.id} • {order.date}</p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm
                    ${order.status === 'pending' ? 'bg-yellow/10 text-yellow' : 
                      order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                      'bg-red-100 text-red-600'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-t">
                      <div className="flex gap-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-yellow font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button 
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                          onClick={() => handleOrderQuantity(order.id, item.id, 'decrease')}
                        >
                          -
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 rounded-full bg-yellow text-white flex items-center justify-center"
                          onClick={() => handleOrderQuantity(order.id, item.id, 'increase')}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <div className="text-xl font-semibold">
                    Total: <span className="text-yellow">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-600 flex items-center gap-2"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete Order
                    </button>
                    {order.status === 'pending' && (
                      <button 
                        className="px-6 py-2 rounded-xl bg-yellow text-white font-medium"
                        onClick={() => handlePurchase(order.id)}
                      >
                        Purchase Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No orders found</div>
            <button 
              className="bg-yellow text-white px-6 py-2 rounded-xl"
              onClick={() => setShowAddModal(true)}
            >
              Create New Order
            </button>
          </div>
        )}

        {/* Add Order Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Order</h2>
                <button onClick={() => setShowAddModal(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Order Name</label>
                  <input
                    type="text"
                    value={newOrder.name}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                    placeholder="Enter order name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    value={newOrder.price}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                    placeholder="Enter price"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Restaurant</label>
                  <input
                    type="text"
                    value={newOrder.restaurant}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, restaurant: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200"
                    placeholder="Enter restaurant name"
                  />
                </div>
                
                <button
                  className="w-full bg-yellow text-white py-2 rounded-xl mt-4"
                  onClick={handleAddOrder}
                >
                  Add Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 