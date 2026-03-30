import type { Metadata } from 'next';
import AutopsyClient from '@/components/autopsy/AutopsyClient';

export const metadata: Metadata = {
  title: '사주 부검실 — 사주GPT',
  description: '너를 못 알아본 놈, 사주로 부검합니다. 전남친 사주를 넣으면 검시관이 사망진단서를 발급합니다.',
  openGraph: {
    title: '사주 부검실 — 전남친 연애 사망진단서 🔬',
    description: '너를 못 알아본 놈, 사주로 부검합니다',
  },
};

export default function AutopsyPage() {
  return <AutopsyClient />;
}
