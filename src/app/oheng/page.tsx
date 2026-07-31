import type { Metadata } from 'next';
import OhengClient from '@/components/oheng/OhengClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '인간 사용설명서 — 사주GPT',
  description: '오행으로 분석한 나의 진짜 성향을 확인해보세요.',
  openGraph: {
    title: '인간 사용설명서',
    description: '오행으로 분석한 나의 진짜 성향을 확인해보세요.',
    images: [{ url: '/oheng/og-share.jpg', width: 1200, height: 600 }],
  },
};

export default function OhengPage() {
  return (
    <>
      <LandingTracker featureType="oheng" />
      <OhengClient />
    </>
  );
}
