/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.0.107'],
  transpilePackages: ['@react-three/fiber', '@react-three/drei', 'three', '@react-three/rapier', 'meshline'],
};

module.exports = nextConfig;