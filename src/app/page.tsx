import type { Metadata } from 'next';
import ViralHub from '@/components/ViralHub';

export const metadata: Metadata = {
  title: '모아모아',
  description: '사주 기반 바이럴 콘텐츠 모음',
};

export default function Home() {
  return <ViralHub />;
}
