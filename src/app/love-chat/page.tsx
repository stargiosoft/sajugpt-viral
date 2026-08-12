import type { Metadata } from 'next';
import LoveChatClient from '@/components/love-chat/LoveChatClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '카톡 연애도감 — 연애 테스트·심리테스트 | 광필연구소',
  description: '카톡 습관만 봐도 연애 스타일이 보인다. 무료 연애 테스트이자 심리테스트로 나와 가장 닮은 연애 카톡 캐릭터를 찾아보세요.',
  keywords: ['연애 테스트', '심리테스트', '카톡 테스트', '연애 성격 테스트', '무료 연애 테스트'],
  openGraph: {
    title: '카톡만 봐도 연애 성격 다 나옴',
    description: '답장만 봐도 연애 스타일이 보인다!',
    type: 'website',
    images: [{ url: '/love-chat/og-share.png', width: 1200, height: 600 }],
  },
};

export default function LoveChatPage() {
  return (
    <>
      <LandingTracker featureType="love_chat" />
      <h1 className="sr-only">카톡 연애도감 — 연애 테스트</h1>
      <p className="sr-only">
        카톡 답장 습관만 봐도 연애 스타일이 보이는 무료 연애 테스트이자 심리테스트예요.
        나와 가장 닮은 연애 카톡 캐릭터를 찾아보세요.
      </p>
      <LoveChatClient />
    </>
  );
}
