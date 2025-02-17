"use client";

import React from "react";

const AnimatedDots = () => {
  return (
    <div className="flex justify-center space-x-2">
      <div className="w-3 h-3 bg-[#FC8A06] rounded-full animate-[bounce_1s_infinite_100ms]"></div>
      <div className="w-3 h-3 bg-[#028643] rounded-full animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-3 h-3 bg-[#FC8A06] rounded-full animate-[bounce_1s_infinite_300ms]"></div>
    </div>
  );
};

export default AnimatedDots;