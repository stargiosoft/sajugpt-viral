import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import AutopsyClient from '@/components/autopsy/AutopsyClient';

interface Props {
  params: Promise<{ autopsyId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { autopsyId } = await params;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data } = await supabase
      .from('saju_autopsies')
      .select('cause_of_death_label, discernment_grade, regret_probability, coroner_id')
      .eq('id', autopsyId)
      .single();

    if (data) {
      const coronerName = data.coroner_id === 'yoon-taesan' ? '윤태산' : '서휘윤';

      return {
        title: `${data.cause_of_death_label} 판정 — 사주 부검실`,
        description: `매력 감별 ${data.discernment_grade}등급 | 후회 확률 ${data.regret_probability}% | 검시관 ${coronerName}`,
        openGraph: {
          title: `연애 사망진단서: ${data.cause_of_death_label} 🔬`,
          description: `매력 감별 능력 ${data.discernment_grade}등급, 후회 확률 ${data.regret_probability}%`,
        },
      };
    }
  } catch (err) {
    console.error('OG metadata 생성 실패:', err);
  }

  return {
    title: '사주 부검실 — 사주GPT',
    description: '너를 못 알아본 놈, 사주로 부검합니다',
  };
}

export default async function AutopsyResultPage({ params }: Props) {
  const { autopsyId } = await params;
  return <AutopsyClient autopsyId={autopsyId} />;
}
