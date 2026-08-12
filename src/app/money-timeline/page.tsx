import type { Metadata } from 'next';
import MoneyClient from '@/components/money-timeline/MoneyClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '내 돈복 테스트 — 사주테스트로 보는 평생 재물운 타임라인 | 광필연구소',
  description: '생년월일만 입력하면 평생의 재물운 흐름을 그래프 하나로 확인하는 무료 사주테스트예요.',
  keywords: ['사주테스트', '재물운 테스트', '돈복 테스트', '무료 사주', '평생 재물운'],
  openGraph: {
    title: '내 돈복 테스트 💰',
    description: '생년월일로 알아보는 내 평생 재물운 타임라인',
    type: 'website',
    siteName: '사주GPT',
    images: [{ url: '/money-timeline/og-share.png?v=2', width: 1200, height: 600 }],
  },
};

export default function MoneyTimelinePage() {
  return (
    <>
      <LandingTracker featureType="money_timeline" />
      <h1 className="sr-only">내 돈복 테스트 — 사주테스트</h1>
      <p className="sr-only">
        생년월일만 입력하면 평생의 재물운 흐름을 그래프 하나로 확인하는 무료 사주테스트예요.
        나의 평생 돈복 타임라인을 지금 확인해보세요.
      </p>
      <MoneyClient />
    </>
  );
}
