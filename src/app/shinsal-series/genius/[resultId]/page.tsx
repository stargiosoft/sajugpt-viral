import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GeniusResultView from '@/components/shinsal-series/genius/GeniusResultCard';
import ReferralTracker from '@/components/ReferralTracker';
import { supabase } from '@/lib/supabase'; // Supabase DB 연동 추가

export const metadata: Metadata = {
  title: '내 안의 천재 지수 결과 — 사주GPT',
  description: '사주 스탯으로 알아보는 나만의 천재성 결과를 확인해보세요.',
  openGraph: {
    title: '내 안의 천재 지수 결과 — 사주GPT',
    description: '사주 스탯으로 알아보는 나만의 천재성 결과를 확인해보세요.',
    images: [{ url: '/shinsal-series/shinsal-genius/og-share.jpg', width: 1200, height: 600 }],
  },
};

interface Props {
  params: Promise<{ resultId: string }>;
}

export default async function GeniusResultPage({ params }: Props) {
  const { resultId } = await params;

  // 1. Supabase에서 resultId와 일치하는 전체 데이터를 가져옵니다.
  // ⚠️ 'shinsal_genius' 부분은 실제 Supabase에 만들어두신 테이블 이름으로 꼭 수정해 주세요!
  const { data, error } = await supabase
    .from('shinsal_genius') 
    .select('*')
    .eq('id', resultId)
    .single();

  // 2. 만약 잘못된 링크거나 데이터가 없다면 404 에러 페이지를 띄웁니다.
  if (error || !data) {
    notFound();
  }

  return (
    <>
      <ReferralTracker featureType="shinsal_genius" referrerId={resultId} />
      {/* 3. 단순 ID 문자열이 아닌, DB에서 가져온 전체 결과 데이터(data)를 넘겨줍니다. */}
      <GeniusResultView result={data} />
    </>
  );
}