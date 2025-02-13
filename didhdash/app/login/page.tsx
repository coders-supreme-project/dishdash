'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';

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
      const response = await axios.post("http://localhost:3000/api/user/login", {
        email,
        password
      });

      if (response.status === 200 && response.data.token) {
        await login(email, password);
        router.push('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || 'Invalid email or password');
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login</h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-white border border-gray-300 p-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:border-blue-500"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
