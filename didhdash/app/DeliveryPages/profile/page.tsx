"use client";

import React, { useState } from 'react';
import { FaUser, FaCar, FaIdCard, FaLock, FaEdit } from 'react-icons/fa';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    firstName: session?.user?.name?.split(' ')[0] || 'John',
    lastName: session?.user?.name?.split(' ')[1] || 'Doe',
    vehicleType: 'Sedan',
    licenseNumber: 'ABC123',
    password: '********',
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);

    return { hasMinLength, hasSpecialChar, hasUppercase };
  };

  const { hasMinLength, hasSpecialChar, hasUppercase } = validatePassword(newPassword);

  const getPasswordStrengthColor = () => {
    const strength = [hasMinLength, hasSpecialChar, hasUppercase].filter(Boolean).length;
    if (strength === 0) return 'bg-red-500';
    if (strength === 1) return 'bg-yellow-500';
    if (strength === 2) return 'bg-yellow-300';
    return 'bg-green-500';
  };

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleEditClick = (field: string) => {
    setEditingField(field);
  };

  const handleSave = async () => {
    try {
      if (editingField === 'password') {
        if (currentPassword !== userData.password) {
          throw new Error('Current password is incorrect');
        }
        
        await fetch('/api/user/update-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword }),
        });
      } else {
        await fetch('/api/user/update-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            field: editingField, 
            value: userData[editingField as keyof typeof userData] 
          }),
        });
      }

      setEditingField(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-[120px]">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-[600px] transform transition-all duration-500 hover:scale-105">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={session?.user?.image || "/default-avatar.png"}
              alt="Profile"
              fill
              className="rounded-full border-4 border-[#FC8A06] object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold mt-4 text-[#03081F]">
            {userData.firstName} {userData.lastName}
          </h1>
        </div>

        <div className="mt-6 space-y-4">
          {/* Profile Fields */}
          {[
            { key: 'firstName', icon: FaUser, label: 'First Name' },
            { key: 'lastName', icon: FaUser, label: 'Last Name' },
            { key: 'vehicleType', icon: FaCar, label: 'Vehicle Type' },
            { key: 'licenseNumber', icon: FaIdCard, label: 'License Number' },
          ].map(({ key, icon: Icon, label }) => (
            <div key={key} className="flex items-center space-x-4">
              <Icon className="text-[#FC8A06] w-6 h-6" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                {editingField === key ? (
                  <input
                    type="text"
                    value={userData[key as keyof typeof userData]}
                    onChange={(e) => setUserData({ ...userData, [key]: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                  />
                ) : (
                  <p className="text-gray-900">{userData[key as keyof typeof userData]}</p>
                )}
              </div>
              <button
                onClick={() => handleEditClick(key)}
                className="text-[#FC8A06] hover:text-[#028643] transition-all duration-300"
              >
                <FaEdit />
              </button>
            </div>
          ))}

          {/* Password Section */}
          {editingField === 'password' && (
            <>
              {/* Password fields */}
              {[
                { key: 'current', label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
                { key: 'new', label: 'New Password', value: newPassword, setter: setNewPassword },
                { key: 'confirm', label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword },
              ].map(({ key, label, value, setter }) => (
                <div key={key} className="flex items-center space-x-4">
                  <FaLock className="text-[#FC8A06] w-6 h-6" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="password"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                    />
                    {key === 'new' && value && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`}
                          style={{ width: `${([hasMinLength, hasSpecialChar, hasUppercase].filter(Boolean).length / 3) * 100}%` }}
                        />
                      </div>
                    )}
                    {key === 'confirm' && value && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className={`h-2.5 rounded-full ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: '100%' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Change Password Button */}
          {editingField !== 'password' && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handleEditClick('password')}
                className="bg-[#FC8A06] text-white px-6 py-2 rounded-lg hover:bg-[#028643] transition-all duration-300"
              >
                Change Password
              </button>
            </div>
          )}

          {/* Save Button */}
          {editingField && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSave}
                className="bg-[#FC8A06] text-white px-6 py-2 rounded-lg hover:bg-[#028643] transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;