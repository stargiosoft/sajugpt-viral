import type { Metadata } from 'next';
import CoupleGuideClient from '@/components/couple-guide/CoupleGuideClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '우리 사이 궁합 설명서💕 — 사주GPT',
  description: '100일 후에도 만날 사이일까? 사주 기반 AI 궁합 분석',
  openGraph: {
    title: '우리 사이 궁합 설명서💕',
    description: '100일 후에도 만날 사이일까? 사주 기반 AI 궁합 분석',
    images: [
      {
        url: '/couple-guide/og-share.jpg',
        width: 1448,
        height: 1086,
      },
    ],
  },
};

export default function CoupleGuidePage() {
  return (
    <>
      <LandingTracker featureType="couple_guide" />
      <CoupleGuideClient />
    </>
  );
}