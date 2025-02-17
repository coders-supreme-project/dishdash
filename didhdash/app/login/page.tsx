'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { GiKnifeFork } from 'react-icons/gi';

const Login = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.error("AuthContext is not available.");
    return <p>Error: Authentication service is unavailable.</p>;
  }

  const { login } = authContext;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await axios.post("http://localhost:3000/api/user/login", { email, password });

      if (response.status === 200 && response.data.token) {
        await login(email, password);
        
        const user = response.data.user;
        const userRole = user?.role || user?.customer?.role;
  
        // Redirect user based on role
        switch (userRole) {
          case "customer":
            router.push("/");
            break;
          case "restaurantOwner":
            router.push("/dashboardrestaurent");
            break;
          case "driver":
            router.push("/dashboarddriver");
            break;
          default:
            router.push("/");
            break;
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };
  
  
  
  
  const handleGoogleLogin = async () => {
    try {
      window.location.href = "http://localhost:3000/api/auth/google";
    } catch (err) {
      console.error("Google login failed:", err);
      setError('Failed to login with Google');
    }
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100"
    >
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-[420px] space-y-6">
        <div className="text-center mb-6">
          <GiKnifeFork className="text-5xl mx-auto text-orange-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-sm mt-2">Sign in to your restaurant account</p>
        </div>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 p-3.5 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-orange-600 text-white p-3.5 rounded-lg font-semibold hover:bg-orange-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          Sign in
        </button>

        <p className="text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-all duration-200">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
