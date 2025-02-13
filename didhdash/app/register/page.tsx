'use client';
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [passwordError, setPasswordError] = useState<string>('');

  const validatePassword = (password: string): boolean => {
    const conditions = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (!conditions.minLength) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!conditions.hasUpperCase || !conditions.hasLowerCase) {
      setPasswordError('Password must contain both uppercase and lowercase letters');
      return false;
    }
    if (!conditions.hasNumber) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!conditions.hasSpecialChar) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      return;
    }

    try {
      await register(name, email, password, phoneNumber, address);
      router.push('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://static.wixstatic.com/media/da0588_12bcab534add4215a707f22d870dea1c~mv2.jpg/v1/fill/w_325,h_243,q_90/da0588_12bcab534add4215a707f22d870dea1c~mv2.jpg")' }}>
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-bold text-center text-orange-600 mb-6">
          Welcome to <span className="text-orange-700">Foodie</span>Hub
        </h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 
                ${passwordError ? 'border-red-500' : ''}`}
              required
            />
            
            {/* Password Requirements List */}
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-semibold mb-1">Password must contain:</p>
              <ul className="space-y-1 list-disc pl-4">
                <li className={password.length >= 8 ? "text-green-500" : ""}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-500" : ""}>
                  Both uppercase and lowercase letters
                </li>
                <li className={/\d/.test(password) ? "text-green-500" : ""}>
                  At least one number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-500" : ""}>
                  At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                </li>
              </ul>
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white p-4 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
