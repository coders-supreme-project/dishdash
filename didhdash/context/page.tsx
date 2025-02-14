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
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [token]); // Ensure token is updated whenever it changes
  

  const getToken = () => {
    const token = localStorage.getItem("token");
    console.log("Current Token:", token);
    return token;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/user/login", { email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Login Successful - Token:", token);
      router.push("/");
    } catch (error) {
      console.error("Login failed", error);
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
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
