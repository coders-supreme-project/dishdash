'use client';

import { useState } from 'react';
import axios from 'axios';
import CustomerProfileForm from '@/components/CustomerProfileForm';
import { CustomerProfile } from '@/types/customer';

export default function CustomerProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (data: CustomerProfile) => {
    setIsLoading(true);
    try {
      const response = await axios.put('/api/customer/profile', data);

      // Handle success (e.g., show notification)
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Profile</h1>
        <CustomerProfileForm onSubmit={handleUpdateProfile} isLoading={isLoading} />
      </div>
    </div>
  );
} 