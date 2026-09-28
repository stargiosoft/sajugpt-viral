import type { Metadata } from 'next';
import FutureSpouseMain from '@/components/future-spouse/FutureSpouseMain';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '미래 배우자 미리보기🔮 — 사주GPT',
  description: '내 사주 속 배우자 기운으로 미래 배우자의 특징을 미리 확인해보세요.',
  openGraph: {
    title: '미래 배우자 미리보기🔮',
    description: '내 미래 배우자는 어떤 사람일까? 사주로 미리 알아보세요.',
    images: [
      {
        url: '/future-spouse/og-share.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function FutureSpousePage() {
  return (
    <>
      <LandingTracker featureType="future_spouse" />
      <FutureSpouseMain />
    </>
  );
}