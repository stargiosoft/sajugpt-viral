import type { Metadata } from 'next';
import OhengClient from '@/components/oheng/OhengClient';
import ReferralTracker from '@/components/ReferralTracker';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ resultId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const { data } = await supabase
      .from('oheng_results')
      .select('prescription')
      .eq('id', resultId)
      .maybeSingle();

    const title = data?.prescription?.diagnosisTitle;
    const elementName = data?.prescription?.dominantElementName;
    if (title && elementName) {
      const ogTitle = `내 오행 처방전 — ${title}`;
      const ogDescription = `대표 오행 ${elementName}! 친구가 받은 오행 처방전 결과를 확인해보세요.`;
      return {
        title: ogTitle,
        description: ogDescription,
        openGraph: { title: ogTitle, description: ogDescription, images: [{ url: '/oheng/og-share.jpg', width: 1200, height: 600 }] },
        twitter: { title: ogTitle, description: ogDescription, images: ['/oheng/og-share.jpg'] },
      };
    }
  } catch (_e) {
    console.error('[generateMetadata] Supabase 조회 실패:', _e);
  }

  const fallbackTitle = '내 오행 처방전 — 사주GPT';
  const fallbackDescription = '친구가 받은 오행 처방전 결과를 확인해보세요.';
  return {
    title: fallbackTitle,
    description: fallbackDescription,
    openGraph: { title: fallbackTitle, description: fallbackDescription, images: [{ url: '/oheng/og-share.jpg', width: 1200, height: 600 }] },
    twitter: { title: fallbackTitle, description: fallbackDescription, images: ['/oheng/og-share.jpg'] },
  };
}

export default async function OhengResultPage({ params }: Props) {
  const { resultId } = await params;
  return (
    <>
      <ReferralTracker featureType="oheng" referrerId={resultId} />
      <OhengClient resultId={resultId} />
    </>
  );
}
