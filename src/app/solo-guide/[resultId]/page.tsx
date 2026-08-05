import type { Metadata } from 'next';
import SoloGuideResultView from '@/components/solo-guide/SoloGuideResultView';
import ReferralTracker from '@/components/ReferralTracker';

// 결과가 localStorage(클라이언트 전용)에만 존재해 서버에서 DB 조회로 동적 OG를 만들 수 없다.
// 실제 백엔드가 붙기 전까지는 정적 메타데이터로 대체한다.
export const metadata: Metadata = {
  title: '내 연애 유형 결과 — 솔로 탈출 지침서',
  description: '친구가 받은 솔로 탈출 지침서 결과를 확인해보세요.',
  openGraph: {
    title: '내 연애 유형 결과 — 솔로 탈출 지침서',
    description: '친구가 받은 솔로 탈출 지침서 결과를 확인해보세요.',
    images: [{ url: '/solo-guide/og-share.jpg', width: 1200, height: 600 }],
  },
};

interface Props {
  params: Promise<{ resultId: string }>;
}

export default async function SoloGuideResultPage({ params }: Props) {
  const { resultId } = await params;
  return (
    <>
      <ReferralTracker featureType="solo_guide" referrerId={resultId} />
      <SoloGuideResultView resultId={resultId} />
    </>
  );
}
