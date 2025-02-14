"use client"

import { useState, ChangeEvent, FormEvent } from "react";
import "@/styles/globals.css";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

interface FormData {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  issuingCountry: string;
  licenseCategory: string;
  vehicleMakeModelYear: string;
  vehicleRegistrationNumber: string;
  vehicleType: string;
  insuranceNumber: string;
  insuranceExpiry: string;
  drivingExperience: string;
  insuranceProof: File | null;
}

interface DecodedToken {
  id: number;
  userId: number;
  // Add other token fields if needed
}

export default function DriverInfoForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    licenseNumber: "",
    issuingCountry: "",
    licenseCategory: "",
    vehicleMakeModelYear: "",
    vehicleRegistrationNumber: "",
    vehicleType: "",
    insuranceNumber: "",
    insuranceExpiry: "",
    drivingExperience: "",
    insuranceProof: null,
  });

  const token = localStorage.getItem('token') || '{}';
  const decoded = jwtDecode<DecodedToken>(token); // Decode the token to get the user ID
  const userId = decoded.id; // Extract the user ID from the decoded token
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        insuranceProof: e.target.files ? e.target.files[0] : null,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData ,"user",user);
    try {
      // Register the driver
      const driverResponse = await axios.post(
        'http://localhost:3000/api/driver/register',
        {
          firstName: user.customer.firstName || "saka",
          lastName: user.customer.lastName || "last",
          vehicleType: formData.vehicleType,
          licenseNumber: formData.licenseNumber,
          userId: userId, // Include the user ID from the decoded token
        }
      );

      console.log('Driver registration response:', driverResponse.data);

      // Handle media upload (insurance proof)
      if (formData.insuranceProof) {
        const formDataMedia = new FormData();
        formDataMedia.append('file', formData.insuranceProof);
        formDataMedia.append('driverId', driverResponse.data.driver.id);
        console.log(formDataMedia," mediaa form");
        await axios.post('http://localhost:3000/api/media/create', formDataMedia);
      }

      console.log('Registration successful');

      // Show SweetAlert and redirect to login page
      Swal.fire({
        title: 'Switched to a driver',
        text: 'Please login again',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/login');
      });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration failed:', error.response?.data?.message || error.message);
      } else {
        console.error('Registration failed:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Driver's License Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Driver's License Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={user.customer.firstName}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={user.customer.lastName}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">License Number</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
            <input
              type="text"
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Proof of Insurance */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Proof of Insurance</h2>
        <div>
          <label htmlFor="insuranceProof" className="block text-sm font-medium text-gray-700">Upload Proof of Insurance</label>
          <input
            type="file"
            id="insuranceProof"
            name="insuranceProof"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
}