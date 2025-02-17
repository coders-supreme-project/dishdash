"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../navbar/page";
import Sidebar from "../sidebar/page";
import MainContent from "../Maincontent/page";
import { useRouter, usePathname } from 'next/navigation';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Function to handle menu item clicks
  const handleMenuItemClick = (menuItem: string) => {
    switch (menuItem) {
      case 'home':
        router.push('/');
        break;
      case 'orders':
        router.push('/DeliveryPages/orders');
        break;
      case 'profile':
        router.push('/DeliveryPages/profile');
        break;
      case 'settings':
        router.push('/DeliveryPages/settings');
        break;
      default:
        router.push('/');
    }
    closeSidebar();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white text-[#03081F]">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        onMenuItemClick={handleMenuItemClick}
      />
      <MainContent />
    </div>
  );
};

export default Dashboard;