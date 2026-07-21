import type { Metadata } from 'next';
import DeangClient from '@/components/deang-saju/DeangClient';
import ReferralTracker from '@/components/ReferralTracker';

interface Props {
  params: Promise<{ resultId: string }>;
}

// TODO(Phase 2): Supabase deang_saju_results 연동 후 resultId로 실제 결과를 조회해
// generateMetadata에 동적 OG(견종명/한줄팩폭)를 채워 넣습니다 (gisaeng [resultId] 패턴 참고).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: '댕댕사주 — 사주를 강아지로 번역해드립니다',
    description: '친구가 뽑은 댕댕이 사주 결과를 확인해보세요 🐾',
  };
}

export default async function DeangSajuResultPage({ params }: Props) {
  const { resultId } = await params;
  return (
    <>
      <ReferralTracker featureType="deang_saju" referrerId={resultId} />
      <DeangClient resultId={resultId} />
    </>
  );
}
