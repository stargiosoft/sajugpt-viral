import type { Metadata } from 'next';
import JobDnaClient from '@/components/job-dna/JobDnaClient';
import ReferralTracker from '@/components/ReferralTracker';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ resultId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const { data } = await supabase
      .from('viral_saju_results')
      .select('payload')
      .eq('id', resultId)
      .maybeSingle();

    const page1 = data?.payload?.page1;
    const page2 = data?.payload?.page2;
    if (page1?.group || page2?.element) {
      const label = [page1?.group, page2?.element].filter(Boolean).join(' × ');
      return {
        title: `직업운 DNA — 나의 직업 DNA는 [${label}]! 🧬`,
        description: `친구가 분석한 사주 기반 직업운 DNA 결과를 확인해보세요! 당신의 천직은 무엇일까요? ✨`,
        openGraph: {
          title: `직업운 DNA — 나의 직업 DNA는 [${label}]! 🧬`,
          description: `친구가 분석한 사주 기반 직업운 DNA 결과를 확인해보세요!`,
          images: [{ url: '/job-dna/og-share.png', width: 1200, height: 600 }],
        },
      };
    }
  } catch (_e) {
    console.error('[generateMetadata] Supabase 조회 실패:', _e);
  }

  return {
    title: '직업운 DNA — 사주로 알아보는 나의 천직 테스트',
    description: '친구가 공유한 사주 기반 직업운 DNA 결과를 확인해보세요 🚀',
  };
}

export default async function JobDnaResultPage({ params }: Props) {
  const { resultId } = await params;

  // 서버 측에서 미리 결과 데이터를 조회해서 클라이언트로 넘겨줍니다.
  // JobDnaClient는 result.payload.page1 형태로 접근하므로, payload로 한 번 감싸서 넘겨야 합니다.
  const { data } = await supabase
    .from('viral_saju_results')
    .select('payload')
    .eq('id', resultId)
    .maybeSingle();

  const initialData = {
    resultId,
    payload: data?.payload || { page1: null, page2: null, siliSummary: '' },
  };

  return (
    <>
      <ReferralTracker featureType="job_dna" referrerId={resultId} />
      <JobDnaClient resultId={resultId} initialData={initialData} />
    </>
  );
}
