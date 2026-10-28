import type { Metadata } from 'next';
import LifeTurningPointClient from '@/components/life-turning-point/LifeTurningPointClient';
import LandingTracker from '@/components/LandingTracker';

type PageProps = {
  params: Promise<{ resultId: string }>;
};

export const metadata: Metadata = {
  title: '인생 반전 시기 결과 — 내 인생의 반전은 언제 시작될까? | 광필연구소',
  description:
    '친구가 공유한 인생 반전 시기 결과예요. 생년월일만 입력하면 내 운 흐름과 귀인운, 전환 시기도 무료로 확인할 수 있어요.',
  openGraph: {
    title: '내 인생의 반전은 언제 시작될까? ✨',
    description: '친구의 인생 반전 시기 결과를 확인하고, 내 결과도 알아보세요.',
    images: [{ url: '/life-turning-point/og-share.png', width: 1200, height: 600 }],
    type: 'website',
    siteName: '광필연구소',
  },
  robots: { index: false, follow: true },
};

// 공유 링크로 들어온 경우: 저장된 결과를 불러와 결과 화면을 바로 보여준다.
export default async function LifeTurningPointResultPage({ params }: PageProps) {
  const { resultId } = await params;

  return (
    <>
      <LandingTracker featureType="life_turning_point" />
      <LifeTurningPointClient resultId={resultId} />
    </>
  );
}
