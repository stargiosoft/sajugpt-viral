import type { Metadata } from 'next';
import StockClient from '@/components/stock/StockClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '주가 조작단 — 사주GPT',
  description: '저평가된 당신의 연애운, 주가 조작 작전을 세워드립니다. 사주증권 리서치센터.',
  openGraph: {
    title: '주가 조작단 — 연애 시장 내 값어치는? 📊',
    description: '저평가된 당신의 연애운, 주가 조작 작전을 세워드립니다',
  },
};

export default function StockPage() {
  return (<><LandingTracker featureType="saju_stock" /><StockClient /></>);
}
