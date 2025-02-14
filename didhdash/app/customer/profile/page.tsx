'use client';

import { useState, useContext } from 'react';
import axios from 'axios';
import CustomerProfileForm from '@/components/CustomerProfileForm';
import { CustomerProfile } from '@/types/customer';
import { AuthContext } from '@/context/page';
import { useRouter } from 'next/navigation';

export default function CustomerProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter();

// page.tsx
const handleUpdateProfile = async (data: CustomerProfile) => {
  setIsLoading(true);
  try {
    const token = auth?.getToken(); // Use getToken() to ensure the latest token
    console.log('Token used for request:', token);
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.put(
      'http://localhost:5000/api/customers/profile',
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    console.log('Update response:', response.data);
    alert('Profile updated successfully');
  } catch (error: any) {
    console.error('Update error:', error.response?.data || error);
    alert(error.response?.data?.error || 'Failed to update profile');
  } finally {
    setIsLoading(false);
  }
};

  // If no auth, show loading or redirect
  if (!auth?.token) {
    return <div>Please login to view this page</div>;
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