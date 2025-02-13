import axios from 'axios';

const API_BASE_URL = 'http://localhost:3300/api'; // Adjust port as needed

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

