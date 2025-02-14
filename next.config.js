/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
    responseLimit: '4mb',
  },
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
}

module.exports = nextConfig 