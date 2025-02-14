import axios from 'axios';

const DEFAULT_FOOD_IMAGE = 'path/to/default/image.jpg'; // Adjust the path as needed
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


  export const fetchRestaurants = async (all: boolean = false):Promise<[]> => {
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
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
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
  name: string;
  price: number;
  quantity: number;
  image: string;
  menuItemId: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  date: string;
  restaurant: string;
  customerId: number;
  orderItems: {
    menuItem: {
      name: string;
      price: number;
      imageUrl?: string;
    };
    quantity: number;
  }[];
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
    items: order.orderItems.map(item => ({
      id: item.menuItem.id,
      name: item.menuItem.name,
      price: Number(item.menuItem.price),
      quantity: item.quantity,
      image: item.menuItem.imageUrl || DEFAULT_FOOD_IMAGE,
      menuItemId: item.menuItem.id
    }))
  }));

  return transformedOrders;
};

// Update the createOrder function
export const createOrder = async (orderData: {
  items: Array<{ id: number; quantity: number; price: number }>;
  totalAmount: number;
  restaurantId: number;
}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await api.post<{ success: boolean; order: Order }>('/orders', orderData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
  


export const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await api.patch(`/orders/${orderId}`, 
    { status }, 
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

