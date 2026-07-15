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
        {/* Google Tag Manager — 직접 gtag.js를 로드하면 이 계정에서 브라우저발 GA4
            히트가 전송되지 않아 GTM 경유로 전환함(원인 미상이지만 GTM 경유는 정상 동작 확인됨) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WK59VS2L');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WK59VS2L"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AnalyticsInit />
        {children}
      </body>
    </html>
  );
}
