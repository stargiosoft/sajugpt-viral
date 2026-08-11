import type { Metadata } from 'next';
import ViralHub from '@/components/ViralHub';

export const metadata: Metadata = {
  title: '광필연구소 | 재밌는 심리·연애·운세 테스트 모음',
  description: '매일 새로운 심리테스트와 사주·타로 콘텐츠를 만나보세요.',
};

export default function Home() {
  return <ViralHub />;
}
