import type { Metadata } from 'next';
import ChildPersonalityClient from '@/components/child-personality/ChildPersonalityClient';

type PageProps = {
  params: Promise<{ resultId: string }>;
};

export const metadata: Metadata = {
  title: '우리 아이 사용설명서 결과 | 광필연구소',
  description: '친구가 공유한 우리 아이 사용설명서 결과예요. 생년월일만 입력하면 우리 아이 성향도 무료로 확인할 수 있어요.',
  openGraph: {
    title: '🧸 우리 아이 사용설명서 결과는?',
    description: '우리 아이의 타고난 성향과 맞춤 칭찬법을 확인해 보세요.',
    images: [{ url: '/child-personality/og-share.png', width: 1200, height: 600 }],
    type: 'website',
    siteName: '광필연구소',
  },
  robots: { index: false, follow: true },
};

// 공유 링크로 들어온 경우: 저장된 결과를 불러와 결과 화면을 바로 보여준다.
export default async function ChildPersonalityResultPage({ params }: PageProps) {
  const { resultId } = await params;

  return (
    <ChildPersonalityClient resultId={resultId} />
  );
}
