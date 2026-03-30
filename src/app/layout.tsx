import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '색기 배틀 — 사주GPT',
  description: '얼굴 가리고 사주만으로 남자를 홀려보세요. 나한테 꼬인 AI 짐승남은 몇 명?',
  openGraph: {
    title: '색기 배틀 — 누가 더 야한 사주인가 🔥',
    description: '얼굴 가리고 사주만으로 남자를 홀려보세요',
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
      </head>
      <body>{children}</body>
    </html>
  );
}
