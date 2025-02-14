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
  getToken: () => string | null;
  updateUserData: (userData: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
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
      const response = await axios.post("http://localhost:5000/api/user/login", { email, password });
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      console.log("Login Successful - Token:", token);
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phoneNumber?: string, address?: string) => {
    try {
      await axios.post("http://localhost:5000/api/user/register", { name, email, password, phoneNumber, address });
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
    router.push("/login");
  };

  const updateUserData = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      register, 
      logout, 
      getToken: () => token || localStorage.getItem("token"),
      updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};
