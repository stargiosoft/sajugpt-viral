import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
