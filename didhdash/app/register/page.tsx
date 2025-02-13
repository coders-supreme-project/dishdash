// /app/register/page.tsx
'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';

const Register = () => {
  const authContext = useContext(AuthContext); // ✅ Get AuthContext at the top
  const router = useRouter();

  if (!authContext) {
    console.error("AuthContext is not available.");
    return <p>Error: Authentication service is unavailable.</p>;
  }

  const { register } = authContext; // ✅ Destructure register function

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register(name, email, password, phoneNumber, address);
      router.push('/login'); // Redirect after successful registration
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-2" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded mb-2" required />
        <input type="text" placeholder="Phone Number (Optional)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <input type="text" placeholder="Address (Optional)" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
        <p className="mt-4">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
      </form>
    </div>
  );
};

export default Register;
