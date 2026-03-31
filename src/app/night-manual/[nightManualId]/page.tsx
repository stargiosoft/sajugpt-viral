import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import NightManualClient from '@/components/night-manual/NightManualClient';
import ReferralTracker from '@/components/ReferralTracker';

interface Props {
  params: Promise<{ nightManualId: string }>;
}

const CONSTITUTION_NAMES: Record<string, string> = {
  simhwa: '심화(心火)',
  noejeon: '뇌전(雷電)',
  myohyang: '묘향(妙香)',
  seu: '세우(細雨)',
  janggang: '장강(長江)',
  yonghwa: '용화(龍火)',
};

const SERVANT_NAMES: Record<string, string> = {
  beast: '윤태산(야수형)',
  poet: '서휘윤(시인형)',
  butler: '도해결(집사형)',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nightManualId } = await params;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase
      .from('night_manuals')
      .select('constitution_type, total_charm, selected_servant, stats')
      .eq('id', nightManualId)
      .single();

    if (data) {
      const constitutionName = CONSTITUTION_NAMES[data.constitution_type] ?? data.constitution_type;
      const stats = data.stats as Record<string, number>;
      const topEntry = Object.entries(stats).sort(([, a], [, b]) => b - a)[0];
      const statLabels: Record<string, string> = {
        sensitivity: '감도', dominance: '지배력', addiction: '중독성',
        awareness: '민감도', endurance: '지구력',
      };
      const topStatName = statLabels[topEntry[0]] ?? topEntry[0];
      const topStatValue = topEntry[1];

      const servantText = data.selected_servant
        ? ` ${SERVANT_NAMES[data.selected_servant] ?? data.selected_servant}을 선택.`
        : '';

      return {
        title: `밤(夜) 설명서 — ${constitutionName} 체질 | 매혹력 ${data.total_charm}`,
        description: `시종 3명이 쟁탈전을 벌였습니다.${servantText} ${topStatName} ${topStatValue}점.`,
        openGraph: {
          title: `나의 은밀한 체질: ${constitutionName} 🌙`,
          description: `${topStatName} ${topStatValue} | 총 매혹력 ${data.total_charm}/500`,
        },
      };
    }
  } catch (err) {
    console.error('OG metadata 생성 실패:', err);
  }

  return {
    title: '밤(夜) 설명서 — 사주GPT',
    description: '사주 기반 은밀한 체질을 진단받고, 시종 3명의 쟁탈전을 엿들어보세요.',
  };
}

export default async function NightManualSharePage({ params }: Props) {
  const { nightManualId } = await params;
  return (
    <>
      <ReferralTracker featureType="night_manual" referrerId={nightManualId} />
      <NightManualClient nightManualId={nightManualId} />
    </>
  );
}
