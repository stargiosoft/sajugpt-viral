import type { Metadata } from 'next';
import CoupleGuideClient from '@/components/couple-guide/CoupleGuideClient';

export const metadata: Metadata = {
  title: '우리 사이 궁합 설명서💕 — 사주GPT',
  description: '100일 후에도 만날 사이일까? 사주 기반 AI 궁합 분석',
  openGraph: {
    title: '우리 사이 궁합 설명서💕',
    description: '100일 후에도 만날 사이일까? 사주 기반 AI 궁합 분석',
    images: [
      {
        url: '/couple-guide/og-share.jpg',
        width: 1774,
        height: 887,
      },
    ],
  },
};

export default function CoupleGuidePage() {
  return <CoupleGuideClient />;
}