/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'tailwindui.com',
      'firebasestorage.googleapis.com',
    ],
  },
  reactStrictMode: false,
}

module.exports = nextConfig
