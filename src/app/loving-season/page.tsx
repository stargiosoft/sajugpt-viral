import type { Metadata } from 'next';
import { LoveSeasonClient } from '@/components/loving-season/LoveSeasonClient';

export const metadata: Metadata = {
  title: '내 연애의 계절은 언제?🌸 — 사주GPT',
  description: '설레는 사랑이 찾아오는 시기, 사주로 알아보는 나만의 연애 계절',
  openGraph: {
    title: '내 연애의 계절은 언제?🌸',
    description: '설레는 사랑이 찾아오는 시기, 사주로 알아보는 나만의 연애 계절',
    images: [{ url: '/loving-season/og-share.jpg', width: 1200, height: 600 }],
  },
};

export default function LovingSeasonPage() {
  return <LoveSeasonClient />;
}