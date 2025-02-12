"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import '@/styles/globals.css';

export default function RestaurantOwner() {
  const router = useRouter();

  const handleAccept = () => {
    router.push('/restaurentrequirement'); // Navigate directly on button click
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Restaurant Owner Terms & Conditions</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-medium mb-2">Welcome to the Restaurant Partnership Program!</h2>
          </div>

          <p className="text-gray-700">
            Please read and accept the following terms and conditions before proceeding. These rules ensure a smooth and professional partnership.
          </p>

          <div className="space-y-6 max-h-96 overflow-y-auto">
            <div>
              <h3 className="font-semibold text-xl text-gray-800">1. Legal Requirements</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>✅ Must have a valid business license to operate a restaurant.</li>
                <li>✅ Compliance with local health and safety regulations.</li>
                <li>✅ Maintain proper tax records and follow local tax laws.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xl text-gray-800">2. Food Safety & Hygiene</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>Adhere to food handling and storage regulations.</li>
                <li>Ensure staff is trained in hygiene and safe food preparation.</li>
                <li>Maintain cleanliness in kitchen and dining areas.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xl text-gray-800">3. Operational Standards</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>Provide accurate business details, including hours of operation.</li>
                <li>Ensure food quality meets customer expectations.</li>
                <li>Deliver orders promptly if offering delivery services.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xl text-gray-800">4. Customer Service & Ethics</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>Treat customers and staff with respect.</li>
                <li>Handle customer complaints professionally.</li>
                <li>No false advertising or misleading menu descriptions.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xl text-gray-800">5. Financial & Transaction Policies</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>Accept payments legally and provide receipts.</li>
                <li>No fraudulent activities or hidden charges.</li>
                <li>If using a third-party platform, comply with its transaction policies.</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <button
              onClick={handleAccept}
              className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors"
            >
              I have read and accept the terms of service
            </button>
            <button
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
