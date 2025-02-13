import { i18n } from 'next-i18next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "loremflickr.com",
      "picsum.photos"  // Ensure this domain is correctly included
    ],
  },
  i18n, // ✅ Ensure i18n is properly included
};

export default nextConfig;  // ✅ ES module export (works with Next.js TypeScript support)
