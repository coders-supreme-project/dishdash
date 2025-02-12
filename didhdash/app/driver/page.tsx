"use client"; // Ensure this component is client-side rendered
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13+ App Router
import '@/styles/globals.css';

export default function Driver() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter(); // Initialize the router

  // Use useEffect to handle the redirect after state change
  useEffect(() => {
    if (accepted) {
      router.push('/driverrequirement'); // Redirect to the RequirementDriver page
    }
  }, [accepted, router]); // Dependency array ensures this runs when `accepted` changes

  const handleAccept = () => {
    setAccepted(true); // Update state to trigger the redirect
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Driver Terms & Conditions</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-medium mb-2">Welcome to the Driver Program!</h2>
          </div>

          <p className="text-gray-700">
            Please read and accept the following terms and conditions before you can proceed. These rules ensure safety and professionalism while you drive with us.
          </p>

          <div className="space-y-6 max-h-96 overflow-y-auto">
            {/* Legal Requirements */}
            <div>
              <h3 className="font-semibold text-xl text-gray-800">1. Legal Requirements</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>✅ Valid Driver’s License – Ensure you have the correct category of license (e.g., commercial for trucks).</li>
                <li>✅ Minimum Age Requirement – Age limits depend on the country and type of vehicle.</li>
                <li>✅ Clean Driving Record – Avoid traffic violations and accidents.</li>
                <li>✅ Vehicle Registration & Insurance – Ensure your vehicle is properly registered and insured.</li>
              </ul>
            </div>

            {/* Safe Driving Practices */}
            <div>
              <h3 className="font-semibold text-xl text-gray-800">2. Safe Driving Practices</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>Follow Traffic Laws – Obey speed limits, signals, and road signs.</li>
                <li>Avoid Distractions – No texting, eating, or other distractions while driving.</li>
                <li>Use Indicators & Check Mirrors – Signal your turns and lane changes properly.</li>
                <li>Keep a Safe Distance – Maintain enough space between vehicles to prevent collisions.</li>
              </ul>
            </div>

            {/* Professionalism & Customer Service */}
            <div>
              <h3 className="font-semibold text-xl text-gray-800">3. Professionalism & Customer Service</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>Be Courteous & Respectful – Treat passengers, clients, and pedestrians with kindness.</li>
                <li>Be Punctual – Arrive on time for pickups or deliveries.</li>
                <li>Maintain Vehicle Cleanliness – Keep your car neat and comfortable.</li>
              </ul>
            </div>

            {/* Vehicle Maintenance */}
            <div>
              <h3 className="font-semibold text-xl text-gray-800">4. Vehicle Maintenance</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>Regular Checkups – Inspect brakes, tires, oil levels, and lights.</li>
                <li>Fuel Up in Advance – Avoid running out of gas mid-route.</li>
                <li>Emergency Preparedness – Carry a spare tire, tools, and emergency kit.</li>
              </ul>
            </div>

            {/* Special Rules for Commercial Drivers */}
            <div>
              <h3 className="font-semibold text-xl text-gray-800">5. Special Rules for Commercial Drivers</h3>
              <ul className="list-disc ml-8 text-gray-700">
                <li>Follow Working Hour Limits – Rest properly if driving long hours.</li>
                <li>Secure Cargo Properly – Prevent loose loads from causing hazards.</li>
                <li>Keep Logbooks Updated – Track driving hours and routes if required.</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <button
              onClick={handleAccept} // Call handleAccept on button click
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

          {accepted && (
            <div className="text-center text-green-600 font-medium mt-4">
              Redirecting to Requirements...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}