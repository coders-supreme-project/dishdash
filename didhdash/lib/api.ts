import axios from "axios";

const API_URL = "http://localhost:3000/api/user"; // Update with your backend URL

// Function to register a new user
export const registerUser = async (name: string, email: string, password: string, phoneNumber?: string, address?: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      phoneNumber,
      address,
    });
    return response.data;
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
};

// Function to login a user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

// Function to fetch user profile (protected route)
export const getUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching profile failed", error);
    throw error;
  }
};
