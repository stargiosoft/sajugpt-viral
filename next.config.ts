import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tdrmvbsmxcewwaeuoqdx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  turbopack: {
    root: '.',
  },
  async redirects() {
    return [
      {
        source: '/chat/:path*',
        destination: 'https://www.sajugpt.co.kr/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
