import type { Metadata } from 'next';
import GeniusResultView from '@/components/shinsal-series/genius/GeniusResultCard';
import ReferralTracker from '@/components/ReferralTracker';

export const metadata: Metadata = {
  title: '내 안의 천재 지수 결과 — 사주GPT',
  description: '사주 스탯으로 알아보는 나만의 천재성 결과를 확인해보세요.',
  openGraph: {
    title: '내 안의 천재 지수 결과 — 사주GPT',
    description: '사주 스탯으로 알아보는 나만의 천재성 결과를 확인해보세요.',
    // [수정] 폴더 경로 변경 반영
    images: [{ url: '/shinsal-series/shinsal-genius/og-share.jpg', width: 1200, height: 600 }],
  },
};

interface Props {
  params: Promise<{ resultId: string }>;
}

export default async function GeniusResultPage({ params }: Props) {
  const { resultId } = await params;

  return (
    <>
      <ReferralTracker featureType="shinsal_genius" referrerId={resultId} />
      <GeniusResultView resultId={resultId} />
    </>
  );
}