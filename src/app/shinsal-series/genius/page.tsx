import type { Metadata } from 'next';
import GeniusClient from '@/components/shinsal-series/genius/GeniusClient';

export const metadata: Metadata = {
  title: '내 안의 천재 지수 측정기⚡️ — 사주GPT',
  description: '귀문관살부터 백호살까지! 사주 스탯으로 측정하는 나만의 숨겨진 천재 등급',
  openGraph: {
    title: '내 안의 천재 지수 측정기⚡️',
    description: '귀문관살부터 백호살까지! 사주 스탯으로 측정하는 나만의 숨겨진 천재 등급',
    images: [{ url: '/shinsal-series/og-share.jpg', width: 1200, height: 600 }],
  },
};

export default function ShinsalGeniusPage() {
  return <GeniusClient />;
}