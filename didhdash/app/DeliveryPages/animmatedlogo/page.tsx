"use client";

import React from "react";

const AnimatedLogo = () => (
  <div className="relative w-24 h-24 mx-auto">
    {/* Animated gradient ring */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#FC8A06] to-[#028643] rounded-full animate-spin-slow"></div>
    
    {/* White circle with checkmark */}
    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
      <svg
        className="w-12 h-12 text-[#028643]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  </div>
);

export default AnimatedLogo; 