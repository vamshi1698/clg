/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.0.107', '0ed780f2ce17.ngrok-free.app', '1c0e-2409-40f2-216b-4eb5-91ff-d9e-15cc-971d.ngrok-free.app'],
  transpilePackages: ['@react-three/fiber', '@react-three/drei', 'three', '@react-three/rapier', 'meshline'],

  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
    ]
    return [
      { source: '/cms/:path*', headers: securityHeaders },
      { source: '/api/:path*', headers: securityHeaders },
      { source: '/results/:path*', headers: securityHeaders },
    ]
  },
};

module.exports = nextConfig;

