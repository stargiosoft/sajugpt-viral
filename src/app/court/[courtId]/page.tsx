import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import SajuCourtClient from '@/components/court/SajuCourtClient';
import ReferralTracker from '@/components/ReferralTracker';

interface Props {
  params: Promise<{ courtId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courtId } = await params;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data } = await supabase
      .from('saju_courts')
      .select('crime_label, final_sentence, charm_score, percentile')
      .eq('id', courtId)
      .single();

    if (data) {
      return {
        title: `${data.crime_label} — 징역 ${data.final_sentence}년 | 사주 법정`,
        description: `매력 점수 ${data.charm_score}점 | 상위 ${data.percentile}% | 넌 뭐 나올지 해봐`,
        openGraph: {
          title: `⚖️ ${data.crime_label} — 징역 ${data.final_sentence}년 선고`,
          description: `매력 점수 ${data.charm_score}점, 상위 ${data.percentile}% | 넌 뭐 나올지 해봐 ㅋㅋ`,
        },
      };
    }
  } catch (err) {
    console.error('OG metadata 생성 실패:', err);
  }

  return {
    title: '사주 법정 — 사주GPT',
    description: '당신이 연애 못한 이유, 사주로 기소합니다',
  };
}

export default async function CourtResultPage({ params }: Props) {
  const { courtId } = await params;
  return (
    <>
      <ReferralTracker featureType="saju_court" referrerId={courtId} />
      <SajuCourtClient />
    </>
  );
}
