import type { Metadata } from 'next';
import LoveChatClient from '@/components/love-chat/LoveChatClient';

export const metadata: Metadata = {
  title: '카톡 연애도감 — 내 연애 카톡 캐릭터는?',
  description: '카톡 습관만 봐도 연애 스타일이 보인다. 나와 가장 닮은 연애 카톡 캐릭터를 찾아보세요.',
  openGraph: {
    title: '카톡만 봐도 연애 성격 다 나옴',
    description: '답장만 봐도 연애 스타일이 보인다!',
    type: 'website',
    images: [{ url: '/love-chat/og-share.png', width: 1200, height: 600 }],
  },
};

export default function LoveChatPage() {
  return <LoveChatClient />;
}
