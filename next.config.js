/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.0.107'],
  transpilePackages: ['@react-three/fiber', '@react-three/drei', 'three', '@react-three/rapier', 'meshline'],
};

module.exports = nextConfig;