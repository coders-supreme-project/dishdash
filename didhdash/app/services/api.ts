  import axios from 'axios';

  const DEFAULT_FOOD_IMAGE = 'path/to/default/image.jpg'; // Adjust the path as needed
  const API_BASE_URL = 'http://localhost:3000/api'; // Match your backend port

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  export const fetchCategories = async (all: boolean = false) => {
    try {
      const response = await api.get('/categories', {
        params: {
          limit: all ? undefined : 6
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  export const fetchRestaurants = async (all: boolean = false) => {
    try {
      const response = await api.get('/restaurants', {
        params: {
          limit: all ? undefined : 6,
          include: 'categories'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  };

  export const searchRestaurants = async (params: { 
    name?: string; 
    minPrice?: number; 
    maxPrice?: number;
    limit?: number;
  }) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    );
    
    const response = await api.get('/restaurants/search', { 
      params: cleanParams
    });
    return response.data;
  };

  export const fetchMenuItemsByCategory = async (categoryId: number) => {
    try {
      const response = await api.get(`/categories/menu-items/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  };

  export const fetchRestaurantMenuByCategory = async (restaurantId: number) => {
    const response = await api.get(`/restaurants/menu-categories/${restaurantId}`);
    return response.data;
  };

  // Update or add these interfaces
  export interface MenuItem {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    restaurantId: number;
  }

  export interface OrderItem {
    id: number;
    menuItemId: number;
    quantity: number;
    price: number;
    name: string;
    image?: string;
  }

  export interface Order {
    id: number;
    items: OrderItem[];
    totalAmount: number | string | { toFixed: (n: number) => string };
    status: OrderStatus;
    date: string;
    restaurant: string | number;
    customerId: number;
  }

  export type OrderStatus = 'pending' | 'completed' | 'cancelled';

  // Add this helper function at the top
  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  // Update the fetchOrders function
  export const fetchOrders = async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get<Order[]>('/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Transform the response to get menu item names
    const transformedOrders = response.data.map(order => ({
      ...order,
      //@ts-ignore
      items: order.orderItems.map(item => ({
        
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: Number(item.menuItem.price),
        quantity: item.quantity,
        image: item.menuItem.imageUrl || DEFAULT_FOOD_IMAGE,
        //@ts-ignore
        menuItemId: item.menuItem.id
      })),
      totalAmount: Number(order.totalAmount) // Convert Decimal to Number
    }));

    return transformedOrders;
  };

  // Update the createOrder function
  export const createOrder = async (orderData: {
    items: Array<{
      menuItemId: number;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    restaurant: number;
    status: string;
    paymentStatus: string;
    deliveryAddress: string;
  }) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.post<{
      success: boolean;
      order: Order;
      clientSecret: string;
    }>('/orders/create', orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };
    


  export const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert "completed" to "delivered" before sending to the backend
      const convertStatus = (status: string) => {
        if (status.toLowerCase() === "completed") return "delivered";
        return status.toLowerCase();
      };

      const validStatuses = ["pending", "confirmed", "prepared", "out_for_delivery", "delivered"];
      const normalizedStatus = convertStatus(status);

      if (!validStatuses.includes(normalizedStatus)) {
        throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
      }

      console.log('Sending request with:', { orderId, status: normalizedStatus });

      const response = await api.patch(
        '/orders/' + orderId,
        { orderId, status: normalizedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Order status updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating order status:', error.response?.data || error.message);
      throw error;
    }
  };




  // Add these payment functions
  export const createPaymentIntent = async (orderId: number) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.post('/orders/payment-intent', 
      { orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  };

  export const confirmOrderPayment = async (paymentIntentId: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.post('/orders/confirm-payment',
      { paymentIntentId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  };

  export const deleteOrderItem = async (orderId: number, itemId: number) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    await api.delete(`/orders/${orderId}/items/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  export const updateOrderItem = async (orderId: number, itemId: number, quantity: number) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.patch(`/orders/${orderId}/items/${itemId}`, 
      { quantity }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  };

  export const deleteOrder = async (orderId: number) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    await api.delete(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };