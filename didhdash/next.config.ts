import { i18n } from 'next-i18next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "loremflickr.com",
      "picsum.photos"  // Add this domain
    ],
  },
  i18n, // ✅ Ensure i18n is properly included
};

export default nextConfig; // ✅ Use ES module export if your project supports it

// OR, if using CommonJS:
module.exports = nextConfig;
