import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Adjust port as needed

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCategories = async (all: boolean = false) => {
  const response = await api.get('/categories', {
    params: {
      limit: all ? undefined : 6
    }
  });
  return response.data;
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
  const response = await api.get('/restaurants/search', { params });
  return response.data;
};

export const fetchMenuItemsByCategory = async (categoryId: number) => {
  const response = await api.get(`/categories/${categoryId}/menu-items`);
  return response.data;
};

export const fetchRestaurantMenuByCategory = async (restaurantId: number) => {
  const response = await api.get(`/restaurants/${restaurantId}/menu-categories`);
  return response.data;
}; 