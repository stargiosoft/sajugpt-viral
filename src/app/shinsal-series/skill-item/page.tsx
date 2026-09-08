import type { Metadata } from 'next';
import SkillClient from '@/components/shinsal-series/skill-item/SkillClient';

export const metadata: Metadata = {
  title: '내 사주에도 도화살이? — 사주GPT',
  description:
    '도화살부터 역마살까지! 숨겨진 스킬 찾기',
  openGraph: {
    title: '내 사주에도 도화살이?',
    description:
      '도화살부터 역마살까지! 숨겨진 스킬 찾기',
    images: [
      {
        url: '/shinsal-series/skill-item/og-share.jpg',
        width: 1200,
        height: 600,
      },
    ],
  },
};

export default function SkillItemPage() {
  return <SkillClient />;
}