import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import TarotResultShareView from '@/components/tarot/TarotResultShareView';
import ReferralTracker from '@/components/ReferralTracker';
import { supabase } from '@/lib/supabase';
import { ghostTarotConfig } from '@/lib/tarot/configs/ghost-tarot.config';
import type { TarotResult } from '@/types/tarot';

interface Props {
  params: Promise<{
    resultId: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const { data } = await supabase
      .from(ghostTarotConfig.table)
      .select('card_name, august_title, august_summary')
      .eq('id', resultId)
      .single();

    if (data) {
      const { title, summary } = ghostTarotConfig.toResultContent(data);
      return {
        title: `👻 귀신 타로 — ${data.card_name}`,
        description: `${title}. ${summary}`,
        openGraph: {
          title: `내 귀신 타로 결과 👻 ${data.card_name}`,
          description: `${title} | ${summary}`,
        },
      };
    }
  } catch (err) {
    console.error('Ghost Tarot OG metadata 생성 실패:', err);
  }
  return {
    title: '귀신 타로 — 사주GPT',
    description: '당신에게 붙은 귀신이 이번 달 운세를 알려드립니다.',
  };
}

export default async function GhostTarotSharePage({
  params,
}: Props) {
  const { resultId } = await params;

  const { data: row, error } = await supabase
    .from(ghostTarotConfig.table)
    .select('*')
    .eq('id', resultId)
    .single();

  if (error || !row) {
    notFound();
  }

  const result: TarotResult = { ...row, ...ghostTarotConfig.toResultContent(row) };

  return (
    <>
      <ReferralTracker
        featureType="ghost_tarot"
        referrerId={resultId}
      />
      <main className="min-h-screen bg-[#050403] text-white">
        <TarotResultShareView slug={ghostTarotConfig.slug} result={result} />
      </main>
    </>
  );
}