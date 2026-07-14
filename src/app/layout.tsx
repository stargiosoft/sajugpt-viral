import type { Metadata, Viewport } from 'next';
import './globals.css';
import AnalyticsInit from '@/components/AnalyticsInit';

export const metadata: Metadata = {
  metadataBase: new URL('https://sajugpt-viral.vercel.app'),
  title: '7월 귀신타로',
  description: '이번 달, 당신을 찾아올 경고를 확인하세요.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: '7월 귀신타로',
    description: '이번 달, 당신을 찾아올 경고를 확인하세요.',
    type: 'website',
    siteName: '사주GPT',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1a2e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body>
        <AnalyticsInit />
        {children}
      </body>
    </html>
  );
}
