'use client';

import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNumber?: string, address?: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);
  

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/user/login", { email, password });
    const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
  
      if (user.role === "restaurantOwner") {
        console.log("Fetching restaurant ID for owner:", user.id);
  
        const restaurantId = await fetchRestaurantId(user.id);
        
        if (restaurantId) {
          console.log("✅ Restaurant ID found:", restaurantId);
          localStorage.setItem("restaurantId", restaurantId);
          router.push(`/dashboardrestaurent/${restaurantId}`);
        } else {
          console.error("❌ No restaurant found for this owner.");
        }
      } else if (user.role === "customer") {
        router.push("/");
      } else if (user.role === "driver") {
        router.push("/dashboarddriver");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("❌ Login failed", error);
    }
  };
  
  
  const fetchRestaurantId = async (ownerId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/restaurants?ownerId=${ownerId}`
      );
      return response.data[0]?.id?.toString() || null;
    } catch (error) {
      console.error("Error fetching restaurant ID", error);
      return null;
    }
  };
  
  
  

  const register = async (name: string, email: string, password: string, phoneNumber?: string, address?: string) => {
    try {
      await axios.post("http://localhost:3000/api/user/register", { name, email, password, phoneNumber, address });
      router.push("/login");
    } catch (error: any) {
      console.error("Registration failed", error.response?.data || error.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("restaurantId");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
