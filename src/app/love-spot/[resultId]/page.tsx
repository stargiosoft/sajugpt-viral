import type { Metadata } from 'next';
import LoveSpotResultView from '@/components/love-spot/LoveSpotResultView';
import ReferralTracker from '@/components/ReferralTracker';

export const metadata: Metadata = {
  title: '내 인연 스팟 결과 — 내 인연은 어디에?',
  description: '친구가 받은 인연 스팟 결과를 확인해보세요.',
  openGraph: {
    title: '내 인연 스팟 결과 — 내 인연은 어디에?',
    description: '친구가 받은 인연 스팟 결과를 확인해보세요.',
    images: [{ url: '/love-spot/og-share.jpg', width: 1200, height: 600 }],
  },
};

interface Props {
  params: Promise<{ resultId: string }>;
}

export default async function LoveSpotResultPage({ params }: Props) {
  const { resultId } = await params;
  return (
    <>
      <ReferralTracker featureType="love_spot" referrerId={resultId} />
      <LoveSpotResultView resultId={resultId} />
    </>
  );
}