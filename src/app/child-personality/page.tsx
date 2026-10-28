import type { Metadata } from 'next';

import ChildPersonalityClient from '@/components/child-personality/ChildPersonalityClient';

export const metadata: Metadata = {
  title: '우리 아이 사용설명서 — 사주로 보는 아이 성향',
  description:
    '사주로 알아보는 우리 아이의 성향, 공부 스타일, 칭찬법',
  openGraph: {
    title: '우리 아이 사용설명서 👶',
    description: '사주로 알아보는 우리 아이의 성향, 공부 스타일, 칭찬법',
    images: [{ url: '/child-personality/og-share.png', width: 1200, height: 600 }],
    type: 'website',
    siteName: '광필연구소',
  },
};

export default function ChildPersonalityPage() {
  return (
    <ChildPersonalityClient />
  );
}