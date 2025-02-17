"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  onMenuItemClick: (menuItem: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, closeSidebar, onMenuItemClick }) => {
  const pathname = usePathname();
  const isWorkSpace = pathname?.includes('/delivery/workSpace');

  const handleMenuItemClick = (menuItem: string) => {
    onMenuItemClick(menuItem);
    closeSidebar();
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-0 left-0 h-screen w-64 bg-[#FC8A06] shadow-lg z-50"
        >
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors duration-300"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#FC8A06]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-4 mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Menu</h2>
            <nav>
              <ul className="space-y-2">
                {isWorkSpace ? (
                  <>
                    <motion.li
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/delivery/dashboard"
                        className="block hover:bg-white hover:text-[#FC8A06] p-2 rounded-lg transition-colors duration-300 text-white"
                      >
                        Back to Dashboard
                      </Link>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/"
                        className="block hover:bg-white hover:text-[#FC8A06] p-2 rounded-lg transition-colors duration-300 text-white"
                      >
                        Back to Home
                      </Link>
                    </motion.li>
                  </>
                ) : (
                  <>
                    <motion.li
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => handleMenuItemClick('home')}
                        className="w-full text-left hover:bg-white hover:text-[#FC8A06] p-2 rounded-lg transition-colors duration-300 text-white"
                      >
                        Home
                      </button>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => handleMenuItemClick('profile')}
                        className="w-full text-left hover:bg-white hover:text-[#FC8A06] p-2 rounded-lg transition-colors duration-300 text-white"
                      >
                        Profile
                      </button>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => handleMenuItemClick('settings')}
                        className="w-full text-left hover:bg-white hover:text-[#FC8A06] p-2 rounded-lg transition-colors duration-300 text-white"
                      >
                        Settings
                      </button>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/"
                        className="block hover:bg-white hover:text-[#FC8A06] p-2 rounded-lg transition-colors duration-300 text-white"
                      >
                        Back to Shop
                      </Link>
                    </motion.li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;