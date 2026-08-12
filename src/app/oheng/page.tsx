import type { Metadata } from 'next';
import OhengClient from '@/components/oheng/OhengClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '인간 사용설명서 — 오행 심리테스트 | 광필연구소',
  description: '오행으로 분석하는 무료 심리테스트이자 사주테스트로 나의 진짜 성향을 확인해보세요.',
  keywords: ['심리테스트', '사주테스트', '오행 테스트', '성향 테스트', '무료 심리테스트'],
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
      <h1 className="sr-only">인간 사용설명서 — 오행 심리테스트</h1>
      <p className="sr-only">
        생년월일로 알아보는 무료 오행 심리테스트이자 사주테스트예요. 나의 오행 분포로 진짜 성향과
        기운 보완 처방을 확인해보세요.
      </p>
      <OhengClient />
    </>
  );
}
