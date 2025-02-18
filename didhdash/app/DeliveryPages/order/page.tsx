"use client";

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/page';
import DriverMap from "../map/DriverMap";

interface MenuItem {
  name: string;
  price: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  priceAtTimeOfOrder: number;
  menuItem: MenuItem;
}

interface Order {
  id: number;
  customerId: number;
  restaurantId: number;
  driverId: number;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  paymentStatus: string;
  customer: {
    user: {
      email: string;
      phoneNumber: string;
    };
  };
  restaurant: {
    name: string;
    address: string;
  };
  orderItems: OrderItem[];
}

interface OrderResponse {
  success: boolean;
  data: {
    totalOrders: number;
    groupedOrders: {
      pending: Order[];
      prepared: Order[];
      confirmed: Order[];
      delivered: Order[];
      cancelled: Order[];
    };
  };
}

interface AuthContextType {
  user?: {
    id: number;
  };
  token?: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderResponse['data']['groupedOrders']>({
    pending: [],
    prepared: [],
    confirmed: [],
    delivered: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const auth = useContext(AuthContext) as AuthContextType; // Cast AuthContext to the correct type

  useEffect(() => {
    const fetchDriverId = async () => {
      const userId = auth?.user?.id;
      console.log("userId", userId);
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:3000/api/driver/${userId}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });
        const data = await response.json();
        setDriverId(data.id);
      } catch (error) {
        console.error('Error fetching driver ID:', error);
      }
    };

    fetchDriverId();
  }, [auth]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!driverId || !auth?.token) return;

      try {
        const response = await fetch(`http://localhost:3000/api/orders/${driverId}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });
        const data: OrderResponse = await response.json();
        setOrders(data.data.groupedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchOrders();
    }
  }, [driverId, auth?.token]);

  const handleAcceptOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Orders Dashboard</h1>
        
        {Object.entries(orders).map(([status, orderList]) => (
          orderList.length > 0 && (
            <div key={status} className="mb-10">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 capitalize">{status} Orders</h2>
                <span className="ml-3 px-3 py-1 bg-[#FC8A06] text-white rounded-full text-sm">
                  {orderList.length}
                </span>
              </div>

              {selectedOrderId && (
                <DriverMap orderId={selectedOrderId} />
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orderList.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.paymentStatus === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ${order.totalAmount}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {order.deliveryAddress}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {order.restaurant.name}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {order.customer.user.email}
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-4">
                        <p className="font-semibold text-gray-700 mb-2">Order Items:</p>
                        <div className="space-y-2">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {item.quantity}x {item.menuItem.name}
                              </span>
                              <span className="font-medium text-gray-800">
                                ${item.priceAtTimeOfOrder}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.status === 'prepared' && (
                        <button 
                          className="mt-6 w-full bg-[#FC8A06] text-white py-3 rounded-lg hover:bg-[#028643] transition-colors duration-300 flex items-center justify-center font-medium"
                          onClick={() => handleAcceptOrder(order.id)}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Accept Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;