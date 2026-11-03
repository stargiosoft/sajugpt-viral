import type { Metadata } from 'next';
import LifeTurningPointClient from '@/components/life-turning-point/LifeTurningPointClient';
import LandingTracker from '@/components/LandingTracker';

type PageProps = {
  params: Promise<{ resultId: string }>;
};

const DEFAULT_TITLE = '인생 반전 시기 결과 — 내 인생의 반전은 언제 시작될까? | 광필연구소';
const OG_IMAGE = { url: '/life-turning-point/og-share.png', width: 1200, height: 600 };

// 저장된 결과에서 '터닝포인트' 제목(예: 2034년 전후의 변화 지점)을 읽어 미리보기 문구로 쓴다.
async function fetchTurningPointTitle(resultId: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const response = await fetch(
      `${url}/functions/v1/analyze-life-turningpoint?resultId=${encodeURIComponent(resultId)}`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 3600 } },
    );
    if (!response.ok) return null;
    const data = await response.json();
    const turningPoint = data?.result?.turningPoint;
    const title = typeof turningPoint === 'object' && turningPoint ? turningPoint.title : null;
    return typeof title === 'string' && title.trim() ? title.trim() : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { resultId } = await params;
  const turningTitle = await fetchTurningPointTitle(resultId);

  const ogTitle = turningTitle
    ? `내 인생의 반전은 ${turningTitle} ✨`
    : '내 인생의 반전은 언제 시작될까? ✨';

  return {
    title: turningTitle ? `${turningTitle} — 인생 반전 시기 결과 | 광필연구소` : DEFAULT_TITLE,
    description:
      '친구가 공유한 인생 반전 시기 결과예요. 생년월일만 입력하면 내 운 흐름과 귀인운, 전환 시기도 무료로 확인할 수 있어요.',
    openGraph: {
      title: ogTitle,
      description: '친구의 인생 반전 시기 결과를 확인하고, 내 결과도 알아보세요.',
      images: [OG_IMAGE],
      type: 'website',
      siteName: '광필연구소',
    },
    robots: { index: false, follow: true },
  };
}

// 공유 링크로 들어온 경우: 저장된 결과를 불러와 결과 화면을 바로 보여준다.
export default async function LifeTurningPointResultPage({ params }: PageProps) {
  const { resultId } = await params;

  return (
    <>
      <LandingTracker featureType="life_turning_point" />
      <LifeTurningPointClient resultId={resultId} />
    </>
  );
}
