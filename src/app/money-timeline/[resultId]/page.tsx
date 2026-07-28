import type { Metadata } from 'next';
import MoneyClient from '@/components/money-timeline/MoneyClient';
import ReferralTracker from '@/components/ReferralTracker';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ resultId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const { data } = await supabase
      .from('money_timeline_results')
      .select('overall_score, best_period_label')
      .eq('id', resultId)
      .maybeSingle();

    if (data?.overall_score != null) {
      return {
        title: `내 돈복 테스트 — 재물운 ${data.overall_score}점`,
        description: `친구의 평생 재물운 점수는 ${data.overall_score}점! 최고의 재물 황금기는 ${data.best_period_label}. 내 결과도 확인해보세요.`,
        openGraph: {
          title: `내 돈복 테스트 — 재물운 ${data.overall_score}점`,
          description: `친구의 평생 재물운 점수는 ${data.overall_score}점! 최고의 재물 황금기는 ${data.best_period_label}. 내 결과도 확인해보세요.`,
          images: [{ url: '/money-timeline/og-share.png', width: 1200, height: 600 }],
        },
      };
    }
  } catch (_e) {
    console.error('[generateMetadata] Supabase 조회 실패:', _e);
  }

  return {
    title: '내 돈복 테스트 — 사주로 보는 평생 재물운 타임라인',
    description: '친구가 뽑은 평생 재물운 결과를 확인해보세요 💰',
    openGraph: {
      title: '내 돈복 테스트 — 사주로 보는 평생 재물운 타임라인',
      description: '친구가 뽑은 평생 재물운 결과를 확인해보세요 💰',
      images: [{ url: '/money-timeline/og-share.png', width: 1200, height: 600 }],
    },
  };
}

export default async function MoneyTimelineResultPage({ params }: Props) {
  const { resultId } = await params;
  return (
    <>
      <ReferralTracker featureType="money_timeline" referrerId={resultId} />
      <MoneyClient resultId={resultId} />
    </>
  );
}
