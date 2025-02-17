"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from '@/context/page';
import { SessionProvider } from 'next-auth/react';
// import Layout from '@/components/Layout'; // Import the Layout component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Driver Dashboard",
//   description: "Dashboard for restaurant drivers",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}