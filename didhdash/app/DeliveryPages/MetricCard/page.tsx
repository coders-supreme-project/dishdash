"use client";

import React, { ReactNode } from "react";

import {MetricCardProps} from "./types"

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 border border-gray-100 flex-1 min-w-[250px] max-w-[300px] mx-4 relative overflow-hidden group">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FC8A06] to-[#e67e00] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

      {/* Icon */}
      <div className="text-[#FC8A06] text-3xl mb-4 z-10 relative">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#03081F] mb-4 z-10 relative">
        {title}
      </h3>

      {/* Value */}
      <p className="text-4xl font-bold text-[#FC8A06] z-10 relative">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      {/* Trend Indicator (Dynamic) */}
      {trend && (
        <div className="mt-6 flex items-center justify-between z-10 relative">
          <span className="text-sm text-gray-500">Last 30 days</span>
          <span
            className={`text-sm font-semibold flex items-center ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            {trend.value}%
          </span>
        </div>
      )}

      {/* Hover Effect: Shine */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
    </div>
  );
};

export default MetricCard;
