import type { Metadata } from 'next';
import DeangClient from '@/components/deang-saju/DeangClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '댕댕사주 — 사주를 강아지로 번역해드립니다',
  description: '생년월일만 입력하면 내 사주를 대표하는 강아지 캐릭터로 성격, 연애, 직장 스타일까지',
  openGraph: {
    title: '사주로 알아보는 나의 댕댕이 유형 🐶',
    description: '생년월일시로 알아보는 나와 꼭 닮은 강아지',
    images: [{ url: '/deang-saju/og-share.png', width: 1200, height: 600 }],
    type: 'website',
    siteName: '사주GPT',
  },
};

export default function DeangSajuPage() {
  return (
    <>
      <LandingTracker featureType="deang_saju" />
      <DeangClient />
    </>
  );
}
