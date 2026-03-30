import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import GisaengClient from '@/components/gisaeng/GisaengClient';

interface Props {
  params: Promise<{ resultId: string }>;
}

const TIER_LABELS: Record<string, string> = {
  S: '전설의 명기',
  A: '위태로운 해어화',
  B: '쏠쏠한 기생',
  C: '외길 춘향',
  D: '기방에서 쫓겨남',
};

const GISAENG_TYPE_NAMES: Record<string, string> = {
  haeeohwa: '해어화',
  hongryeon: '홍련',
  mukran: '묵란',
  chunhyang: '춘향',
  wolha: '월하',
  hwangjini: '황진이',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data } = await supabase
      .from('gisaeng_results')
      .select('gisaeng_name, gisaeng_type, final_tier, monthly_salary, modern_value, status')
      .eq('id', resultId)
      .single();

    if (data?.status === 'completed' && data.final_tier) {
      const tierLabel = TIER_LABELS[data.final_tier] ?? '';
      const salary = data.monthly_salary?.toLocaleString() ?? '0';
      const modern = data.modern_value
        ? `약 ${(data.modern_value / 10000).toLocaleString()}만원`
        : '';

      return {
        title: `기생 시뮬 — ${data.final_tier}티어 ${tierLabel} 🏮`,
        description: `${data.gisaeng_name} | 월 ${salary}냥 (${modern}) | 넌 몇 냥이야?`,
        openGraph: {
          title: `기생 시뮬 — ${data.final_tier}티어 월 ${salary}냥 🏮`,
          description: `${data.gisaeng_name} ${tierLabel} | 넌 몇 냥이야? ㅋㅋ`,
        },
      };
    } else if (data) {
      const typeName = GISAENG_TYPE_NAMES[data.gisaeng_type] ?? '';
      return {
        title: `기생 시뮬 — 나의 기생 유형: ${typeName} 🏮`,
        description: `${data.gisaeng_name} | 선비 3명이 기다리고 있다`,
      };
    }
  } catch (err) {
    console.error('OG metadata 생성 실패:', err);
  }

  return {
    title: '기생 시뮬레이션 — 사주GPT',
    description: '조선시대 기생이었다면, 넌 밤새 얼마를 벌었을까?',
  };
}

export default async function GisaengResultPage({ params }: Props) {
  const { resultId } = await params;
  return <GisaengClient resultId={resultId} />;
}
