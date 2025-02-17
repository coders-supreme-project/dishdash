"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../navbar/page";
import Sidebar from "../sidebar/page";
import { LoadScript } from "@react-google-maps/api";

const WorkSpace: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleMenuItemClick = (menuItem: string): void => {
    console.log(`Selected menu item: ${menuItem}`);
  };

  const handleMapLoaded = (): void => {
    console.log("Map loaded successfully!");
    setIsMapLoaded(true); // Set map loaded state to true
  };

  useEffect(() => {
    if (isMapLoaded) {
      // Perform any additional actions after the map is loaded
    }
  }, [isMapLoaded]);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        paddingTop: isMapLoaded ? "80px" : "0",
      }}
    >
      {isMapLoaded && (
        <>
          <Navbar toggleSidebar={toggleSidebar} />
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            closeSidebar={() => setIsSidebarOpen(false)}
            onMenuItemClick={handleMenuItemClick}
          />
        </>
      )}
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        onLoad={() => console.log("Google Maps script loaded!")}
      >
     
      </LoadScript>
    </div>
  );
};

export default WorkSpace;