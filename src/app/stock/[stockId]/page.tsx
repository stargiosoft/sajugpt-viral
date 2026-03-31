import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import StockClient from '@/components/stock/StockClient';
import ReferralTracker from '@/components/ReferralTracker';

interface Props {
  params: Promise<{ stockId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stockId } = await params;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data } = await supabase
      .from('saju_stocks')
      .select('current_price, fair_value, investment_opinion, analyst_comment')
      .eq('id', stockId)
      .single();

    if (data) {
      const opinionLabels: Record<string, string> = {
        strong_buy: '강력 매수',
        buy: '매수',
        hold: '보유(존버)',
        reduce: '비중 축소',
        warning: '관리종목',
      };
      const opinionLabel = opinionLabels[data.investment_opinion] ?? data.investment_opinion;

      return {
        title: `현재가 ${data.current_price.toLocaleString()}원 | ${opinionLabel} — 주가 조작단`,
        description: data.analyst_comment,
        openGraph: {
          title: `연애 주가 ${data.current_price.toLocaleString()}원 — 적정가 ${data.fair_value.toLocaleString()}원 📊`,
          description: `${opinionLabel} | ${data.analyst_comment}`,
        },
      };
    }
  } catch (err) {
    console.error('OG metadata 생성 실패:', err);
  }

  return {
    title: '주가 조작단 — 사주GPT',
    description: '저평가된 당신의 연애운, 주가 조작 작전을 세워드립니다',
  };
}

export default async function StockResultPage({ params }: Props) {
  const { stockId } = await params;
  return (
    <>
      <ReferralTracker featureType="saju_stock" referrerId={stockId} />
      <StockClient stockId={stockId} />
    </>
  );
}
