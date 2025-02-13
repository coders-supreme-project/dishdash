import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust port as needed

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
  const response = await api.get('/restaurants', {
    params: {
      limit: all ? undefined : 3,
      include: 'categories,menuItems'
    }
  });
  return response.data;
};

export const searchRestaurants = async (params: { 
  name?: string; 
  minPrice?: number; 
  maxPrice?: number;
  limit?: number;
}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
  );
  
  const response = await api.get('/restaurants/search', { 
    params: cleanParams
  });
  return response.data;
  };

export const fetchMenuItemsByCategory = async (categoryId: number) => {
  try {
    const response = await api.get(`/categories/${categoryId}/menu-items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const fetchRestaurantMenuByCategory = async (restaurantId: number) => {
  const response = await api.get(`/restaurants/${restaurantId}/menu-categories`);
  return response.data;
};

// Add new interfaces
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  restaurant: string;
  customerId: number;
}

// Add new API functions
export const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'date'>) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: Order['status']) => {
  const response = await api.patch(`/api/orders/${orderId}/status`, { status });
  return response.data;
};

export const deleteOrderItem = async (orderId: number, itemId: number) => {
  const response = await api.delete(`/api/orders/${orderId}/items/${itemId}`);
  return response.data;
};

export const updateOrderItem = async (orderId: number, itemId: number, quantity: number) => {
  const response = await api.patch(`/api/orders/${orderId}/items/${itemId}`, { quantity });
  return response.data;
}; 

