import type { Metadata } from 'next';
import CoupleGuideResultView from '@/components/couple-guide/CoupleResultView';
import ReferralTracker from '@/components/ReferralTracker';

export const metadata: Metadata = {
  title: '우리 궁합 분석 결과 — 커플 궁합 지침서',
  description: '친구가 공유한 커플 궁합 지침서 결과를 확인해보세요.',
  openGraph: {
    title: '우리 궁합 분석 결과 — 커플 궁합 지침서',
    description: '친구가 공유한 커플 궁합 지침서 결과를 확인해보세요.',
    images: [{ url: '/couple-guide/og-share.jpg', width: 1200, height: 600 }],
  },
};

interface Props {
  params: Promise<{ resultId: string }>;
}

export default async function CoupleGuideResultPage({ params }: Props) {
  const { resultId } = await params;

  return (
    <>
      <ReferralTracker featureType="couple_guide" referrerId={resultId} />
      <CoupleGuideResultView resultId={resultId} />
    </>
  );
}