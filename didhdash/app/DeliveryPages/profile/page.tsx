"use client";

import React, { useState, useEffect } from 'react';
import { FaUser, FaCar, FaIdCard, FaLock, FaEdit } from 'react-icons/fa';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const Profile = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    vehicleType: '',
    licenseNumber: '',
  });
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch driver data on component mount
  useEffect(() => {
    console.log("session",user);
    const fetchDriverData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/driver/${user.id}`);
     
          setUserData(response.data);
          console.log("response",response.data);
       
        
      } catch (error) {
        console.error('Error fetching driver data:', error);
        setError('Failed to load driver information');
      }
    };

    fetchDriverData();
  }, []);

  const handleEditClick = (field: string) => {
    setEditingField(field);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Only send fields that are being edited
      const updateData: any = {};
      if (editingField) {
        updateData[editingField] = userData[editingField as keyof typeof userData];
      }

      const response = await axios.put(`http://localhost:3000/api/driver/updateDriver/${user.id}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.driver) {
        setUserData(prevData => ({
          ...prevData,
          ...response.data.driver
        }));
        setEditingField(null);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-[120px]">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-[600px] transform transition-all duration-500 hover:scale-105">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
                  />
                ) : (
                  <p className="text-gray-900">{userData[key as keyof typeof userData]}</p>
                )}
              </div>
              <button
                onClick={() => handleEditClick(key)}
                className="text-[#FC8A06] hover:text-[#028643] transition-all duration-300"
                disabled={isLoading}
              >
                <FaEdit />
              </button>
            </div>
          ))}

          {/* Save Button */}
          {editingField && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`bg-[#FC8A06] text-white px-6 py-2 rounded-lg hover:bg-[#028643] transition-all duration-300 
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;