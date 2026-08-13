import type { Metadata } from 'next';
import ZiweiClient from '@/components/ziwei-chart/ZiweiClient';

export const metadata: Metadata = {
  title: '자미두수 명반 | 광필연구소',
  description: '나의 운명을 결정짓는 12궁과 별자리를 확인해보세요.',
  openGraph: {
    title: '자미두수 명반 | 광필연구소',
    description: '나의 운명을 결정짓는 12궁과 별자리를 확인해보세요.',
    images: [
      {
        url: '/money-timeline/og-share.png', // 추후 자미두수 전용 썸네일로 교체
        width: 1200,
        height: 600,
      },
    ],
  },
};

export default function ZiweiChartPage() {
  return <ZiweiClient />;
}