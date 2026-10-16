import type { Metadata } from 'next';
import LifeTurningPointClient from '@/components/life-turning-point/LifeTurningPointClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '인생 반전 시기 — 내 인생의 반전은 언제 시작될까? | 광필연구소',
  description:
    '지금 내 인생이 막혀 있는 이유부터 귀인운과 앞으로 주목할 전환 시기까지. 생년월일을 바탕으로 나의 운 흐름을 확인해 보세요.',
  keywords: [
    '인생 반전 시기','사주 운세','귀인운 테스트','대운 테스트','인생 전환점','무료 사주','광필연구소',
  ],
  openGraph: {
    title: '내 인생의 반전은 언제 시작될까? ✨',
    description:
      '지금의 정체기를 지나, 나를 도와줄 귀인과 앞으로의 운 흐름을 확인해 보세요.',
    images: [
      {
        url: '/life-turning-point/og-share.png',
        width: 1200,
        height: 600,
      },
    ],
    type: 'website',
    siteName: '광필연구소',
  },
};

export default function LifeTurningPointPage() {
  return (
    <>
      <LandingTracker featureType="life_turning_point" />

      <h1 className="sr-only">
        내 인생의 반전은 언제 시작될까? — 사주로 알아보는 인생 전환점
      </h1>

      <p className="sr-only">
        생년월일을 바탕으로 현재의 운 흐름과 귀인운, 앞으로 주목할 전환 시기를
        살펴보고 기회를 준비하기 위한 행동 가이드를 제공하는 무료 사주 콘텐츠예요.
      </p>

      <LifeTurningPointClient />
    </>
  );
}