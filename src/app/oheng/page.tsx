import type { Metadata } from 'next';
import OhengClient from '@/components/oheng/OhengClient';

export const metadata: Metadata = {
  title: '내 오행 처방전 — 사주GPT',
  description: '내 사주에 부족한 기운, 무엇으로 채워야 할까? 수호동물·음식·컬러로 알려주는 오행 처방전.',
  openGraph: {
    title: '내 오행 처방전',
    description: '내 사주에 부족한 기운, 무엇으로 채워야 할까?',
  },
};

export default function OhengPage() {
  return <OhengClient />;
}
