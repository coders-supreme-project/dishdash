import { i18n } from 'next-i18next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "loremflickr.com",
      "picsum.photos",
      "upload.wikimedia.org"  // ✅ Add this to allow Wikimedia images
    ],
  },
  i18n, // ✅ Ensure i18n is properly included
};

export default nextConfig;
