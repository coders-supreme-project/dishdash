'use client';

import { useState } from 'react';
import CustomerProfileForm from '@/components/CustomerProfileForm';
import { CustomerProfile } from '@/types/customer';

export default function CustomerProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (data: CustomerProfile) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
        <CustomerProfileForm onSubmit={handleUpdateProfile} isLoading={isLoading} />
      </div>
    </div>
  );
} 