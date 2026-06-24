/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: false,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
