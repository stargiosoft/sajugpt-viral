import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    // Vercel 프리뷰 배포도 NODE_ENV='production'으로 빌드되어 로컬 개발만으로는
    // 구분이 안 됨 — VERCEL_ENV를 클라이언트에 노출해 실제 프로덕션만 걸러낸다.
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV,
  },
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
