import type { Metadata } from 'next';
import LoveSpotClient from '@/components/love-spot/LoveSpotClient';

export const metadata: Metadata = {
  title: '내 인연은 어디에?💘 — 사주GPT',
  description: '설레는 만남이 시작되는 곳, 사주로 알아보는 나만의 인연 스팟',
  openGraph: {
    title: '내 인연은 어디에?💘',
    description: '설레는 만남이 시작되는 곳, 사주로 알아보는 나만의 인연 스팟',
    images: [{ url: '/love-spot/og-share.jpg', width: 1200, height: 600 }],
  },
};

export default function LoveSpotPage() {
  return <LoveSpotClient />;
}