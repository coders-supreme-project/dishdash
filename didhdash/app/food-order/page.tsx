"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, ChevronRight, Search, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { fetchOrders, deleteOrderItem, updateOrderItem, createPaymentIntent, confirmOrderPayment } from "../services/api";
import type { Order } from "../services/api";
import {jwtDecode} from "jwt-decode";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {NewOrder,DecodedToken} from "./types"
import Swal from 'sweetalert2';


const DEFAULT_FOOD_IMAGE = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function FoodOrder() {
  const router = useRouter();
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
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load orders');
      if (error.response?.status === 401) {
        router.push('/login');
      }
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

      await loadOrders();
    } catch (error) {
      console.error('Error updating order quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this order?');
      if (!confirmed) return;

      await deleteOrderItem(orderId, 0);
      await loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
    }
  };

  const handlePurchase = async (orderId: number) => {
    try {
      const { clientSecret } = await createPaymentIntent(orderId);
      
      // Store cart items in local storage
      localStorage.setItem('cartItems', JSON.stringify(orders));
      
      // Redirect to payment page with order ID
      router.push(`/payment/${orderId}?clientSecret=${clientSecret}`);
    } catch (error: any) {
      console.error('Error processing payment:', error);
      Swal.fire({
        title: 'No Orders',
        text: 'Failed to process payment',
        icon: 'info',
        confirmButtonColor: '#ffc107'
      });
    
    }
  };

  const getUserIdFromToken = (): number => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return 0;
      }
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
      return 0;
    }
  };

  const handleAddOrder = () => {
    if (!newOrder.name || !newOrder.price || !newOrder.restaurant) {
      alert('Please fill in all fields');
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) return;

    const newOrderItem: Order = {
      id: orders.length + 1,
      items: [
        {
          id: orders.length + 1,
          name: newOrder.name,
          price: newOrder.price,
          quantity: 1,
          image: DEFAULT_FOOD_IMAGE,
          menuItemId: orders.length + 1,
        }
      ],
      totalAmount: newOrder.price,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      restaurant: newOrder.restaurant,
      customerId: userId
    };

    setOrders(prev => [...prev, newOrderItem]);
    setShowAddModal(false)
    setNewOrder({ name: '', price: 0, restaurant: '' });

    // Trigger the display of categories in the Home component
    router.push('/?showCategories=true');
  };

  const handlePurchaseAllOrders = async () => {
    const pendingOrders = orders.filter(order => order.status === 'pending');
    
    if (pendingOrders.length === 0) {
      Swal.fire({
        title: 'No Orders',
        text: 'No pending orders to purchase',
        icon: 'info',
        confirmButtonColor: '#ffc107'
      });
      return;
    }

    try {
      // Show loading state
      Swal.fire({
        title: 'Processing Orders',
        text: 'Please wait while we process your orders...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Purchase all pending orders
      for (const order of pendingOrders) {
        await handlePurchase(order.id);
      }

      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'All orders purchased successfully!',
        icon: 'success',
        confirmButtonColor: '#ffc107'
      });
    } catch (error) {
      console.error('Error purchasing orders:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to purchase some orders',
        icon: 'error',
        confirmButtonColor: '#ffc107'
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'active' ? order.status === 'pending' : order.status === 'completed';
    return matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto p-4">
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

        {orders.some(order => order.status === 'pending') && (
          <div className="mb-6">
            <button 
              className="w-full bg-yellow text-white py-3 rounded-xl hover:bg-yellow-600 transition-colors"
              onClick={handlePurchaseAllOrders}
            >
              Purchase All Pending Orders
            </button>
          </div>
        )}

        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {order.items.map(item => item.name).join(', ')}
                    </h3>
                    <p className="text-sm text-gray-400">Order #{order.id} • {order.date}</p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm
                    ${order.status === 'pending' ? 'bg-yellow/10 text-yellow' : 
                      order.status === 'completed' ? 'bg-green-100 text-green-600' : 
                      'bg-red-100 text-red-600'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-4">
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-4 border-t">
                        <div className="flex gap-4">
                          <Image
                            src={item.image || DEFAULT_FOOD_IMAGE}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-yellow font-medium">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <button 
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                            onClick={() => handleOrderQuantity(order.id, item.id, 'decrease')}
                          >
                            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
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
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No items in this order
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <div className="text-xl font-semibold">
                    Total: <span className="text-yellow">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-600 flex items-center gap-2"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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