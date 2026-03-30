import type { Metadata } from 'next';
import DatingSimClient from '@/components/dating-sim/DatingSimClient';

export const metadata: Metadata = {
  title: '데이트 시뮬레이션 — 사주GPT',
  description: '5턴 안에 AI 캐릭터의 마음을 사로잡아보세요. 사주 궁합 기반 데이트 시뮬레이션.',
  openGraph: {
    title: '5턴 안에 데이트 따낼 수 있어? 💜',
    description: '사주 궁합 기반 AI 캐릭터와 데이트 시뮬레이션',
  },
};

export default function DatingSimPage() {
  return <DatingSimClient />;
}
