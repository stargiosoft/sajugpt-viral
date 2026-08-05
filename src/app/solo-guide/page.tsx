import type { Metadata } from 'next';
import SoloGuideClient from '@/components/solo-guide/SoloGuideClient';

export const metadata: Metadata = {
  title: '솔로 탈출 지침서💕 — 사주GPT',
  description: '연애는 용기보다, 나를 아는 것부터',
  openGraph: {
    title: '솔로 탈출 지침서💕',
    description: '연애는 용기보다, 나를 아는 것부터',
    images: [{ url: '/solo-guide/og-share.jpg', width: 1774, height: 887 }],
  },
};

export default function SoloGuidePage() {
  return <SoloGuideClient />;
}
