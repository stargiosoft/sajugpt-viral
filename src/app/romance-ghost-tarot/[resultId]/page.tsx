import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import TarotResultShareView from '@/components/tarot/TarotResultShareView';
import ReferralTracker from '@/components/ReferralTracker';
import { supabase } from '@/lib/supabase';
import { romanceTarotConfig } from '@/lib/tarot/configs/romance-tarot.config';
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
      .from(romanceTarotConfig.table)
      .select('card_name, august_title, august_summary')
      .eq('id', resultId)
      .single();

    if (data) {
      const { title, summary } = romanceTarotConfig.toResultContent(data);
      return {
        title: `👻 귀신 타로 연애편 — ${data.card_name}`,
        description: `${title}. ${summary}`,
        openGraph: {
          title: `내 귀신 타로 연애편 결과 👻 ${data.card_name}`,
          description: `${title} | ${summary}`,
        },
      };
    }
  } catch (err) {
    console.error('Romance Ghost Tarot OG metadata 생성 실패:', err);
  }
  return {
    title: '귀신 타로 연애편 — 사주GPT',
    description: '당신에게 붙은 존재가 인연의 신호를 속삭입니다.',
  };
}

export default async function RomanceGhostTarotSharePage({
  params,
}: Props) {
  const { resultId } = await params;

  const { data: row, error } = await supabase
    .from(romanceTarotConfig.table)
    .select('*')
    .eq('id', resultId)
    .single();

  if (error || !row) {
    notFound();
  }

  const result: TarotResult = { ...row, ...romanceTarotConfig.toResultContent(row) };

  return (
    <>
      <ReferralTracker
        featureType="romance_tarot"
        referrerId={resultId}
      />
      <main className="min-h-screen bg-[#050403] text-white">
        <TarotResultShareView slug={romanceTarotConfig.slug} result={result} />
      </main>
    </>
  );
}
