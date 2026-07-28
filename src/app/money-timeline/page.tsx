import type { Metadata } from 'next';
import MoneyClient from '@/components/money-timeline/MoneyClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '내 돈복 테스트 — 사주로 보는 평생 재물운 타임라인',
  description: '생년월일만 입력하면 평생의 재물운 흐름을 그래프 하나로 확인해요.',
  openGraph: {
    title: '내 돈복 테스트 💰',
    description: '생년월일로 알아보는 내 평생 재물운 타임라인',
    type: 'website',
    siteName: '사주GPT',
    images: [{ url: '/money-timeline/og-share.png', width: 1200, height: 600 }],
  },
};

export default function MoneyTimelinePage() {
  return (
    <>
      <LandingTracker featureType="money_timeline" />
      <MoneyClient />
    </>
  );
}
