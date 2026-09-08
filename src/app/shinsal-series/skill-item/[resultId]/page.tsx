import type { Metadata } from 'next';
import SkillResultContainer from '@/components/shinsal-series/skill-item/SkillResultContainer';
import ReferralTracker from '@/components/ReferralTracker';

export const metadata: Metadata = {
  title: '나의 12신살 결과 — 사주GPT',
  description:
    '12신살로 알아보는 나의 성격과 신살을 확인해보세요.',
  openGraph: {
    title: '나의 12신살 결과 — 사주GPT',
    description:
      '12신살로 알아보는 나의 성격과 신살을 확인해보세요.',
    images: [
      {
        url: '/shinsal-series/skill-item/og-share.jpg',
        width: 1200,
        height: 600,
      },
    ],
  },
};

interface Props {
  params: Promise<{ resultId: string }>;
}

export default async function SkillResultPage({ params }: Props) {
  const { resultId } = await params;

  return (
    <>
      <ReferralTracker featureType="shinsal_skill" referrerId={resultId} />
      <SkillResultContainer resultId={resultId} />
    </>
  );
}