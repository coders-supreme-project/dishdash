"use client";

import MetricCard from "../MetricCard/page";
import { FaBox, FaDollarSign, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from "react";

export default function DeliveryPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    delivered: 0,
    balance: 0,
    available: 0
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOrdersClick = () => {
    router.push('/DeliveryPages/order');
  };

  return (
    <main className="flex flex-col items-center justify-center gap-8 pt-40 p-4">
      <div className="flex flex-row flex-wrap justify-center gap-4">
        <MetricCard 
          title="Orders Delivered" 
          value={stats.delivered} 
          icon={<FaBox className="text-[#FC8A06] text-3xl mb-4" />} 
        />
        <MetricCard 
          title="Money Made" 
          value={`$${stats.balance}`} 
          icon={<FaDollarSign className="text-[#FC8A06] text-3xl mb-4" />} 
        />
        <MetricCard 
          title="Orders available" 
          value={stats.available} 
          icon={<FaClipboardList className="text-[#FC8A06] text-3xl mb-4" />}
          onClick={handleOrdersClick}
          className="cursor-pointer hover:scale-105 transition-transform"
        />
        <MetricCard 
          title="Tasks Completed" 
          value={89} 
          icon={<FaCheckCircle className="text-[#FC8A06] text-3xl mb-4" />} 
        />
      </div>

      <div className="relative w-full max-w-4xl h-96 bg-[#03081F] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FC8A06] to-[#028643] opacity-30"></div>
        <div className="absolute w-40 h-40 bg-[#FC8A06] rounded-full -top-20 -left-20 opacity-20"></div>
        <div className="absolute w-60 h-60 bg-[#028643] rounded-full -bottom-20 -right-20 opacity-20"></div>
        
        <button 
          className="relative z-10 px-8 py-4 bg-[#FC8A06] text-white text-xl font-semibold rounded-full hover:bg-[#028643] transition-colors duration-300 shadow-lg"
          onClick={() => router.push('/DeliveryPages/workspace')}
        >
          Start Working
        </button>
      </div>

      <div className="mt-auto w-full">
        <Image 
          src="/delivery-image.jpg"
          alt="delivery image"
          width={1200}
          height={400}
          className="w-full h-auto object-cover rounded-t-3xl shadow-2xl"
        />
      </div>
    </main>
  );
}