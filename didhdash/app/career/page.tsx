"use client";
import { useState } from "react";
import Link from "next/link";
import "@/styles/globals.css";

const Career = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleCareerClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default anchor behavior
    setShowDropdown((prev) => !prev); // Toggle dropdown visibility
  };

  return (
    <div className="relative inline-block">
      <a
        href="#"
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-3 rounded"
        onClick={handleCareerClick}
      >
        Career
      </a>

      {showDropdown && (
        <ul className="absolute left-0 mt-1 w-40 bg-gray-800 text-white rounded shadow-lg z-10">
          <li>
            <Link href="/driver" className="block px-4 py-2 hover:bg-gray-700">
              Driver
            </Link>
          </li>
          <li>
            <Link href="/owner" className="block px-4 py-2 hover:bg-gray-700">
              Restaurant Owner
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Career;
