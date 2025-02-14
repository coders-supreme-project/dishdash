// 'use client';

// import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';

// // Dynamically import components to improve performance
// const Navbar = dynamic(() => import('@/components/Navbar'));
// const Sidebar = dynamic(() => import('@/components/Sidebar'));
// const MainContent = dynamic(() => import('@/components/MainContent'));

// const Dashboard: React.FC = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [selectedMenuItem, setSelectedMenuItem] = useState('home');

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const closeSidebar = () => setIsSidebarOpen(false);

//   // Scroll to top when menu item changes
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [selectedMenuItem]);

//   const handleMenuItemClick = (menuItem: string) => {
//     setSelectedMenuItem(menuItem);
//     closeSidebar();
//   };

//   return (
//     <div className="min-h-screen bg-white text-[#03081F]">
//       <Navbar toggleSidebar={toggleSidebar} />
//       <Sidebar
//         isSidebarOpen={isSidebarOpen}
//         closeSidebar={closeSidebar}
//         onMenuItemClick={handleMenuItemClick}
//       />
//       <MainContent selectedMenuItem={selectedMenuItem} />
//     </div>
//   );
// };

// export default Dashboard;
