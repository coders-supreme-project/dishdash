'use client';

import { useState, useContext, useEffect } from 'react';
import CustomerProfileForm from '@/components/CustomerProfileForm';
import { CustomerProfile } from '@/types/customer';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';

export default function CustomerProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter();

  // Add debugging logs
  useEffect(() => {
    console.log('Auth Context:', {
      token: auth?.token,
      user: auth?.user,
      isAuthenticated: Boolean(auth?.token && auth?.user)
    });

    // Check localStorage as well
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    console.log('LocalStorage:', {
      token: storedToken,
      user: storedUser
    });

    // More robust authentication check
    const isAuthenticated = Boolean(auth?.token || storedToken);
    if (!isAuthenticated) {
      console.log('No authentication found, redirecting to login...');
      router.push('/login');
    }
  }, [auth, router]);

  const handleUpdateProfile = async (data: CustomerProfile) => {
    setIsLoading(true);
    try {
      const token = auth?.token || localStorage.getItem("token");
      
      if (!token) {
        console.error('No authentication token found');
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/customers/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Failed to update profile');
      }

      return responseData;
    } catch (error: any) {
      console.error('Update error:', error);
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (typeof window !== 'undefined' && !auth?.token && !localStorage.getItem("token")) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Profile</h1>
        <CustomerProfileForm onSubmit={handleUpdateProfile} isLoading={isLoading} />
      </div>
    </div>
  );
}