// src/app/loving-season/[resultId]/page.tsx
import type { Metadata } from 'next';
import LoveSeasonResultView from '@/components/loving-season/LoveSeasonResultView';
import ReferralTracker from '@/components/ReferralTracker';

export const metadata: Metadata = {
  title: '내 연애의 계절 결과 — 사주GPT',
  description: '사주로 알아보는 나만의 연애 계절 결과를 확인해보세요.',
  openGraph: {
    title: '내 연애의 계절 결과 — 사주GPT',
    description: '사주로 알아보는 나만의 연애 계절 결과를 확인해보세요.',
    images: [{ url: '/loving-season/og-share.jpg', width: 1200, height: 600 }],
  },
};

interface Props {
  params: Promise<{ resultId: string }>;
}

export default async function LoveSeasonResultPage({ params }: Props) {
  const { resultId } = await params;

  return (
    <>
      <ReferralTracker featureType="loving_season" referrerId={resultId} />
      <LoveSeasonResultView resultId={resultId} />
    </>
  );
}