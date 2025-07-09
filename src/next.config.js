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
    const isDev = process.env.NODE_ENV === 'development';
    
    // More permissive CSP for development, stricter for production
    const cspValue = isDev 
      ? "default-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob: ws: wss: http: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' ws: wss: https: http: localhost:*; frame-src 'self' https:; child-src 'self' https:;"
      : "default-src 'self'; script-src 'self' https://challenges.cloudflare.com https://accounts.google.com https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://accounts.google.com; img-src 'self' data: blob: https://res.cloudinary.com https://*.googleusercontent.com https://avatars.githubusercontent.com https://cdn.discordapp.com; font-src 'self' https://accounts.google.com; object-src 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com; frame-ancestors 'none'; child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://accounts.google.com https://discord.com https://github.com; frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com https://accounts.google.com https://discord.com https://github.com; connect-src 'self' https://auth.privy.io https://accounts.google.com https://api.github.com https://discord.com https://discordapp.com https://api.telegram.org wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.rpc.privy.systems https://explorer-api.walletconnect.com https://www.google-analytics.com https://analytics.google.com; worker-src 'self'; manifest-src 'self';";

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
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspValue,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 