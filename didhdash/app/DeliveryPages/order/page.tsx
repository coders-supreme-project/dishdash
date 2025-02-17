"use client";

import React, { useEffect, useState } from 'react';

interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  deliveryAddress: string;
  paymentStatus: string;
  restaurantId: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched orders:', data); // Debug log
        setOrders(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
        // Fallback to mock data for testing
        setOrders([
          {
            id: 1,
            customerId: 1,
            totalAmount: 25.99,
            deliveryAddress: "123 Main St",
            paymentStatus: "paid",
            restaurantId: 1
          },
          {
            id: 2,
            customerId: 2,
            totalAmount: 34.50,
            deliveryAddress: "456 Oak Ave",
            paymentStatus: "paid",
            restaurantId: 2
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FC8A06]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Orders</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Order #{order.id}</h2>
            <p className="text-gray-600">Amount: ${order.totalAmount}</p>
            <p className="text-gray-600">Address: {order.deliveryAddress}</p>
            <p className="text-gray-600">Status: {order.paymentStatus}</p>
            <button 
              className="mt-4 w-full bg-[#FC8A06] text-white py-2 rounded-md hover:bg-[#028643] transition-colors"
              onClick={() => {/* Add accept order logic */}}
            >
              Accept Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;