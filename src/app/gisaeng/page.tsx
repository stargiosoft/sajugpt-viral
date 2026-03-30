import type { Metadata } from 'next';
import GisaengClient from '@/components/gisaeng/GisaengClient';

export const metadata: Metadata = {
  title: '기생 시뮬레이션 — 조선시대 기생이었다면?',
  description: '사주로 기생 능력치 카드를 뽑고, 선비 3명을 동시에 관리해보세요',
  openGraph: {
    title: '기생 시뮬레이션 — 넌 밤새 얼마를 벌었을까? 🏮',
    description: '사주 기반 기생 능력치 + 선비 3명 관리 시뮬레이션',
    type: 'website',
    siteName: '사주GPT',
  },
};

export default function GisaengPage() {
  return <GisaengClient />;
}
