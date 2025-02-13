// /app/login/page.tsx
'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext); // ✅ Get AuthContext at the top
  
  if (!authContext) {
    console.error("AuthContext is not available.");
    return <p>Error: Authentication service is unavailable.</p>;
  }

  const { login } = authContext; // ✅ Destructure login function

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      router.push('/'); // Redirect after login
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-2" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded mb-2" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
        <p className="mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
