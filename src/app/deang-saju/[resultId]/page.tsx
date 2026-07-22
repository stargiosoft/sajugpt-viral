import type { Metadata } from 'next';
import DeangClient from '@/components/deang-saju/DeangClient';
import ReferralTracker from '@/components/ReferralTracker';
import { createClient } from '@supabase/supabase-js';

interface Props {
  params: Promise<{ resultId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data } = await supabase
      .from('deang_saju_results')
      .select('profile')
      .eq('id', resultId)
      .maybeSingle();

    if (data?.profile?.breed?.breedName) {
      const breedName = data.profile.breed.breedName;
      const title = data.profile.breed.title || '나만의 댕댕사주 결과';
      return {
        title: `댕댕사주 — ${breedName} (${title})`,
        description: `친구가 분석한 ${breedName} 사주 결과를 확인해보세요! 🐾`,
      };
    }
  } catch (_e) {
    console.error('[generateMetadata] Supabase 조회 실패:', _e);
    // DB 조회 실패 시 기본값 사용
  }

  return {
    title: '댕댕사주 — 사주를 강아지로 번역해드립니다',
    description: '친구가 뽑은 댕댕이 사주 결과를 확인해보세요 🐾',
  };
}

export default async function DeangSajuResultPage({ params }: Props) {
  const { resultId } = await params;
  return (
    <>
      <ReferralTracker featureType="deang_saju" referrerId={resultId} />
      <DeangClient resultId={resultId} />
    </>
  );
}