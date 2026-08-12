import type { Metadata } from 'next';
import SoloGuideClient from '@/components/solo-guide/SoloGuideClient';

export const metadata: Metadata = {
  title: '솔로 탈출 지침서💕 — 연애 테스트·사주테스트 | 광필연구소',
  description: '연애는 용기보다, 나를 아는 것부터. 사주 속 오성 분포로 알아보는 무료 연애 테스트, 심리테스트예요.',
  keywords: ['연애 테스트', '심리테스트', '사주테스트', '연애 유형 테스트', '솔로 탈출'],
  openGraph: {
    title: '솔로 탈출 지침서💕',
    description: '연애는 용기보다, 나를 아는 것부터',
    images: [{ url: '/solo-guide/og-share.jpg', width: 1774, height: 887 }],
  },
};

export default function SoloGuidePage() {
  return (
    <>
      <h1 className="sr-only">솔로 탈출 지침서 — 연애 테스트</h1>
      <p className="sr-only">
        내 사주 속 오성 분포로 알아보는 무료 연애 테스트이자 심리테스트예요. 진짜 연애 유형과
        솔로 탈출 처방전을 확인해보세요.
      </p>
      <SoloGuideClient />
    </>
  );
}
