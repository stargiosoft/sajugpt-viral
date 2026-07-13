// src/app/ghost-tarot/[resultId]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

import GhostResultShareView from '@/components/ghost-tarot/GhostResultShareView';
import ReferralTracker from '@/components/ReferralTracker';
import { GhostResult } from '@/types/ghost-tarot';

interface Props {
  params: Promise<{
    resultId: string;
  }>;
}

function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const supabase = createSupabaseClient();
    const { data } = await supabase
      .from('ghost_tarot_results')
      .select('card_name, july_title, july_summary')
      .eq('id', resultId)
      .single();

    if (data) {
      return {
        title: `👻 귀신 타로 — ${data.card_name}`,
        description: `${data.july_title}. ${data.july_summary}`,
        openGraph: {
          title: `내 귀신 타로 결과 👻 ${data.card_name}`,
          description: `${data.july_title} | ${data.july_summary}`,
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
  const supabase = createSupabaseClient();

  const { data: result, error } = await supabase
    .from('ghost_tarot_results')
    .select('*')
    .eq('id', resultId)
    .single();

  if (error || !result) {
    notFound();
  }

  return (
    <>
      <ReferralTracker
        featureType="ghost_tarot"
        referrerId={resultId}
      />
      <main className="min-h-screen bg-[#050403] text-white">
        <GhostResultShareView result={result as GhostResult} />
      </main>
    </>
  );
}