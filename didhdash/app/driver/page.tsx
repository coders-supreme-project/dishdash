"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Driver() {
  const [accepted, setAccepted] = useState<boolean>(false);
  const router = useRouter();

  const handleProceed = () => {
    if (accepted) {
      router.push("/nextPage"); // Replace this with the actual page you want to navigate to
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">
          Driver Rules
        </h1>
        
        <p className="text-xl text-center mb-6">
          Please read and accept the following rules to proceed:
        </p>
        
        <ul className="list-disc ml-8 text-lg text-gray-700 mb-6">
          <li>✔ You must have a valid driver's license.</li>
          <li>✔ Follow all traffic laws and safety guidelines.</li>
          <li>✔ Maintain a clean driving record.</li>
          <li>✔ Keep your vehicle in good condition.</li>
        </ul>

        <div className="flex items-center justify-center gap-2 mb-6">
          <input
            type="checkbox"
            id="acceptRules"
            className="w-6 h-6"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <label htmlFor="acceptRules" className="text-lg text-gray-700">
            I accept the rules
          </label>
        </div>

        <div className="flex justify-center">
          <button
            className={`px-8 py-3 rounded-lg text-xl text-white transition-all duration-300 ${
              accepted
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleProceed}
            disabled={!accepted}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
