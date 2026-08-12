import type { Metadata } from 'next';
import ViralHub from '@/components/ViralHub';

export const metadata: Metadata = {
  title: '광필연구소 | 연애 테스트·심리테스트·사주테스트·타로테스트 모음',
  description: '카톡연애도감, 귀신타로, 댕댕사주 등 매일 새로운 연애 테스트, 심리테스트, 사주테스트, 타로테스트를 무료로 즐겨보세요.',
  keywords: [
    '연애 테스트', '심리 테스트', '사주 테스트', '타로 테스트',
    '무료 심리테스트', '무료 사주', '온라인 타로', '연애운 테스트',
    '성격 테스트', '광필연구소',
  ],
};

export default function Home() {
  return (
    <>
      <h2 className="sr-only">연애 테스트, 심리테스트, 사주테스트, 타로테스트 무료 모음 — 광필연구소</h2>
      <p className="sr-only">
        광필연구소에서 카톡연애도감, 귀신타로 운세편·연애편, 댕댕사주, 내 돈복 테스트, 인간 사용설명서, 솔로 탈출 지침서 등
        다양한 연애 테스트, 심리 테스트, 사주 테스트, 타로 테스트를 회원가입 없이 무료로 즐겨보세요.
      </p>
      <ViralHub />
    </>
  );
}
