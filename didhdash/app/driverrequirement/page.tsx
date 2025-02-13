"use client"

import { useState, ChangeEvent, FormEvent } from "react";
import "@/styles/globals.css";
interface FormData {
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

export default function DriverInfoForm() {
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData); // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Driver's License Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Driver's License Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <label htmlFor="issuingCountry" className="block text-sm font-medium text-gray-700">Issuing Country or State</label>
            <input
              type="text"
              id="issuingCountry"
              name="issuingCountry"
              value={formData.issuingCountry}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="licenseCategory" className="block text-sm font-medium text-gray-700">Category of License</label>
            <select
              id="licenseCategory"
              name="licenseCategory"
              value={formData.licenseCategory}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="commercial">Commercial</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Vehicle Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="vehicleMakeModelYear" className="block text-sm font-medium text-gray-700">Vehicle Make, Model, and Year</label>
            <input
              type="text"
              id="vehicleMakeModelYear"
              name="vehicleMakeModelYear"
              value={formData.vehicleMakeModelYear}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="vehicleRegistrationNumber" className="block text-sm font-medium text-gray-700">Vehicle Registration Number</label>
            <input
              type="text"
              id="vehicleRegistrationNumber"
              name="vehicleRegistrationNumber"
              value={formData.vehicleRegistrationNumber}
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

          <div>
            <label htmlFor="insuranceNumber" className="block text-sm font-medium text-gray-700">Vehicle Insurance Number</label>
            <input
              type="text"
              id="insuranceNumber"
              name="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="insuranceExpiry" className="block text-sm font-medium text-gray-700">Insurance Expiry Date</label>
            <input
              type="date"
              id="insuranceExpiry"
              name="insuranceExpiry"
              value={formData.insuranceExpiry}
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

      {/* Driving Experience */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Driving Experience</h2>
        <div>
          <label htmlFor="drivingExperience" className="block text-sm font-medium text-gray-700">Years of Driving Experience</label>
          <input
            type="number"
            id="drivingExperience"
            name="drivingExperience"
            value={formData.drivingExperience}
            onChange={handleChange}
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
