'use client';
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GiKnifeFork } from 'react-icons/gi';

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[480px] space-y-6">
        <div className="text-center mb-6">
          <GiKnifeFork className="text-5xl mx-auto text-orange-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 text-sm mt-2">Join our restaurant community</p>
        </div>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 
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
                  At least one special character
                </li>
              </ul>
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              value={phoneNumber}
              placeholder="Phone Number (Optional)"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <input
              type="text"
              value={address}
              placeholder="Address (Optional)"
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white p-3.5 rounded-lg font-semibold hover:bg-orange-700 transition-all duration-200 transform hover:scale-[1.02] mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-all duration-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
