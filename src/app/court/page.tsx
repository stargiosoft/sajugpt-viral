import type { Metadata } from 'next';
import SajuCourtClient from '@/components/court/SajuCourtClient';

export const metadata: Metadata = {
  title: '사주 법정 — 사주GPT',
  description: '당신이 연애 못한 이유, 사주로 기소합니다. 검사가 팩폭하고, 변호사가 뒤집어줍니다.',
  openGraph: {
    title: '⚖️ 사주 법정 — 당신이 연애 못한 이유, 사주로 기소합니다',
    description: '검사가 팩폭하고, 변호사가 뒤집어줍니다. 형량이 높을수록 매력이 높다는 뜻.',
  },
};

export default function CourtPage() {
  return <SajuCourtClient />;
}
