import type { Metadata } from 'next';
import DeangClient from '@/components/deang-saju/DeangClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '댕댕사주 — 사주테스트·심리테스트로 보는 강아지 유형 | 광필연구소',
  description: '생년월일만 입력하면 내 사주를 대표하는 강아지 캐릭터로 성격, 연애, 직장 스타일까지 알려주는 무료 사주테스트, 심리테스트예요.',
  keywords: ['사주테스트', '심리테스트', '성격 테스트', '강아지 유형 테스트', '무료 사주'],
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
      <h1 className="sr-only">댕댕사주 — 사주테스트</h1>
      <p className="sr-only">
        생년월일만 입력하면 내 사주를 강아지 캐릭터로 번역해주는 무료 사주테스트이자 심리테스트예요.
        성격, 연애, 직장 스타일까지 나와 꼭 닮은 견종을 확인해보세요.
      </p>
      <DeangClient />
    </>
  );
}
