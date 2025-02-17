"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import components
const Profile = dynamic(() => import('../profile/page'));
const HomePage = dynamic(() => import('../home/page'));
const Settings = dynamic(() => import('../settings/page'));


interface MainContentProps {
  selectedMenuItem?: string;
}

const MainContent: React.FC<MainContentProps> = ({ selectedMenuItem }) => {
  const pathname = usePathname();

  // Determine which component to render based on pathname
  const renderContent = () => {
    switch (pathname) {
      case '/DeliveryPages/pages':
        return <HomePage />;
      case '/DeliveryPages/profile':
        return <Profile />;
      case '/DeliveryPages/settings':
        return <Settings />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
          {(() => {
  const lastSegment = pathname?.split('/').filter(Boolean).pop() || 'dashboard';
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
})()}
          </h1>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MainContent;