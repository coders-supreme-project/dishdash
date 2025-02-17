"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { data: session } = useSession();
  const [driver, setDriver] = useState({
    firstName: '',
    lastName: '',
    profileImage: ''
  });

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/driver/profile');
        const data = await response.json();
        setDriver(data);
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };

    fetchDriverData();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white p-4 flex justify-between items-center shadow-lg z-40 overflow-hidden">
      {/* Left Side: Toggle Button and Circle */}
      <div className="flex items-center space-x-4 relative">
        {/* Circle on the Right of the Menu Button */}
        <div 
          className="w-4 h-4 bg-[#FC8A06] rounded-full opacity-30 absolute left-16 animate-pulse"
          aria-hidden="true"
        />
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-[#FC8A06] hover:bg-[#e67e00] transition-colors duration-300 shadow-md relative z-10"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Right Side: Circle, Dashboard Title, and Profile Picture */}
      <div className="flex items-center space-x-4 relative">
        {/* Circle on the Left of the Dashboard Text */}
        <div 
          className="w-4 h-4 bg-[#028643] rounded-full opacity-30 absolute -left-6 animate-pulse"
          aria-hidden="true"
        />
        <span className="text-lg font-semibold text-[#03081F]">
          {driver.firstName} {driver.lastName}
        </span>
        <div className="relative w-[50px] h-[50px]">
          <Image
            src={driver.profileImage || "/default-avatar.png"}
            alt="Profile picture"
            fill
            className="rounded-full border-2 border-[#FC8A06] object-cover shadow-md"
            priority
          />
        </div>
      </div>

      {/* Animated Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Line from Left Circle */}
        <div
          className="h-[2px] bg-[#FC8A06] absolute top-1/2 left-16 animate-moveLineLeft"
          style={{
            width: 'calc(40% - 4rem)',
            transformOrigin: 'left',
            left: '90px',
          }}
          aria-hidden="true"
        />
        {/* Line from Right Circle */}
        <div
          className="h-[2px] bg-[#028643] absolute top-1/2 right-20 animate-moveLineRight"
          style={{
            width: 'calc(32% - 4rem)',
            transformOrigin: 'right',
            right: '200px',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes moveLineLeft {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
        @keyframes moveLineRight {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .animate-moveLineLeft {
          animation: moveLineLeft 4s linear infinite;
        }
        .animate-moveLineRight {
          animation: moveLineRight 4s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;