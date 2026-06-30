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
  experimental: {
    // Tree-shake large icon/animation libraries to reduce unused CSS and JS
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
  },
};

module.exports = nextConfig;