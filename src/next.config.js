/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
  output: 'standalone',
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure public assets are properly served
  basePath: '',
  // Add asset prefix for Docker environment
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  
  // Increase request body size limit for proxying socket.io requests
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Optimize for API routes
  rewrites: async () => {
    return [
      // Rewrite socket.io requests directly to backend during development
      // This can be useful when developing locally with two separate servers
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' && process.env.DIRECT_API_PROXY === 'true' 
          ? '/api/:path*' 
          : '/api/:path*',
      },
    ];
  },
  
  // Ensure service worker is properly served
  headers: async () => {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 