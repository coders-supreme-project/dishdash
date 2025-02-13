'use client';
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';

const Register = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    console.error("AuthContext is not available.");
    return <p>Error: Authentication service is unavailable.</p>;
  }

  const { register } = authContext;

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
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://static.wixstatic.com/media/da0588_12bcab534add4215a707f22d870dea1c~mv2.jpg/v1/fill/w_325,h_243,q_90/da0588_12bcab534add4215a707f22d870dea1c~mv2.jpg")' }}>
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-4xl font-bold text-center text-orange-600 mb-6">
          Welcome to <span className="text-orange-700">Foodie</span>Hub
        </h2>
        <p className="text-center text-gray-700 mb-8">
          Create your account to explore delicious dishes and exclusive offers.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
            <input
              type="text"
              placeholder="+1 234 567 890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
            <input
              type="text"
              placeholder="123 Main St, City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white p-4 rounded-lg font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 active:scale-95"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-orange-600 hover:underline font-semibold"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
