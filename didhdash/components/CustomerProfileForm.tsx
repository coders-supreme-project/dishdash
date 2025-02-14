'use client';

import { useState, useContext } from 'react';
import Image from 'next/image';
import { CustomerProfile } from '@/types/customer';
import { User, Camera, MapPin, Phone, Mail, Lock } from 'lucide-react';
import { AuthContext } from '@/context/page';

interface CustomerProfileFormProps {
  onSubmit: (data: CustomerProfile) => Promise<void>;
  isLoading: boolean;
}

export default function CustomerProfileForm({ onSubmit, isLoading }: CustomerProfileFormProps) {
  const authContext = useContext(AuthContext);

  const [formData, setFormData] = useState<CustomerProfile>(() => ({
    firstName: authContext?.user?.customer?.firstName || '',
    lastName: authContext?.user?.customer?.lastName || '',
    email: authContext?.user?.email || '',
    phoneNumber: authContext?.user?.phoneNumber || '',
    deliveryAddress: authContext?.user?.customer?.deliveryAddress || '',
    password: '',
    imageUrl: authContext?.user?.customer?.imageUrl || '',
  }));

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert('Image size should be less than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: CustomerProfile = {
      ...formData,
      ...Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
      ),
    };

    try {
      const updatedProfile = await onSubmit(updateData);
      
      // Update the AuthContext with the new user data
      if (authContext?.updateUserData && updatedProfile) {
        const updatedUserData = {
          ...authContext.user,
          email: updateData.email || authContext.user.email,
          phoneNumber: updateData.phoneNumber || authContext.user.phoneNumber,
          customer: {
            ...authContext.user.customer,
            firstName: updateData.firstName || authContext.user.customer?.firstName,
            lastName: updateData.lastName || authContext.user.customer?.lastName,
            deliveryAddress: updateData.deliveryAddress || authContext.user.customer?.deliveryAddress,
            imageUrl: updateData.imageUrl || authContext.user.customer?.imageUrl,
          }
        };
        authContext.updateUserData(updatedUserData);
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-[300px] bg-white rounded-2xl p-6 h-fit">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <label
              htmlFor="image-upload"
              className="absolute bottom-0 right-0 p-2 bg-yellow rounded-full cursor-pointer hover:bg-yellow/90 transition"
            >
              <Camera className="w-4 h-4 text-white" />
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <h3 className="text-xl font-semibold mb-1">
            {formData.firstName || 'Your'} {formData.lastName || 'Profile'}
          </h3>
          <p className="text-gray-500 text-sm mb-6">{formData.email || 'customer@example.com'}</p>
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{formData.deliveryAddress || 'No address set'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{formData.phoneNumber || 'No phone set'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-yellow focus:ring-yellow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-yellow focus:ring-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:border-yellow focus:ring-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:border-yellow focus:ring-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:border-yellow focus:ring-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:border-yellow focus:ring-yellow"
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-yellow text-white px-6 py-2 rounded-xl hover:bg-yellow/90 transition disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 