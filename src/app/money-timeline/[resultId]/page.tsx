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
      .select(`
        overall_score,
        best_period_label,
        money_style_title
      `)
      .eq('id', resultId)
      .maybeSingle();

    if (data) {
      return {
        title: `${data.money_style_title} · 재물운 ${data.overall_score}점`,
        description: `친구의 재물 성향은 '${data.money_style_title}'! 평생 재물운 ${data.overall_score}점, 황금기는 ${data.best_period_label}. 내 결과도 확인해보세요 💰`,
        openGraph: {
          title: `${data.money_style_title} · 재물운 ${data.overall_score}점`,
          description: `친구의 재물 성향은 '${data.money_style_title}'! 평생 재물운 ${data.overall_score}점, 황금기는 ${data.best_period_label}.`,
          images: [
            {
              url: '/money-timeline/og-share.png',
              width: 1200,
              height: 630,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${data.money_style_title} · 재물운 ${data.overall_score}점`,
          description: `평생 재물운 ${data.overall_score}점 · 황금기는 ${data.best_period_label}`,
          images: ['/money-timeline/og-share.png'],
        },
      };
    }
  } catch (error) {
    console.error('[generateMetadata]', error);
  }

  return {
    title: '내 돈복 그래프 | 사주로 보는 평생 재물운',
    description: '사주를 기반으로 평생 재물운과 인생 자산 황금기를 확인해보세요.',
    openGraph: {
      title: '내 돈복 그래프 | 사주로 보는 평생 재물운',
      description: '사주를 기반으로 평생 재물운과 인생 자산 황금기를 확인해보세요.',
      images: [
        {
          url: '/money-timeline/og-share.png',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: '내 돈복 그래프 | 사주로 보는 평생 재물운',
      description: '사주를 기반으로 평생 재물운과 인생 자산 황금기를 확인해보세요.',
      images: ['/money-timeline/og-share.png'],
    },
  };
}

export default async function MoneyTimelineResultPage({ params }: Props) {
  const { resultId } = await params;

  return (
    <>
      <ReferralTracker
        featureType="money_timeline"
        referrerId={resultId}
      />
      <MoneyClient resultId={resultId} />
    </>
  );
}