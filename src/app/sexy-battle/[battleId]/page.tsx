import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import SexyBattleClient from '@/components/SexyBattleClient';

interface Props {
  params: Promise<{ battleId: string }>;
}

/** 배틀별 동적 OG 메타태그 — 카카오톡/인스타 링크 프리뷰에 마릿수+등급 표시 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { battleId } = await params;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase
      .from('sexy_battles')
      .select('challenger_headcount, challenger_grade, challenger_result')
      .eq('id', battleId)
      .single();

    if (data) {
      const headcount = data.challenger_headcount;
      const title = (data.challenger_result as Record<string, string>)?.title ?? '';

      return {
        title: `색기 배틀 — 나한테 꼬인 남자 ${headcount}명 🔥`,
        description: `${title} | 넌 몇 명이나 꼬이나 해봐 ㅋㅋ`,
        openGraph: {
          title: `색기 배틀 — 나한테 꼬인 남자 ${headcount}명 🔥`,
          description: `${data.challenger_grade}등급 ${title} | 넌 몇 명이나 꼬이나 해봐`,
        },
      };
    }
  } catch (err) {
    console.error('OG metadata 생성 실패:', err);
  }

  return {
    title: '색기 배틀 — 사주GPT',
    description: '얼굴 가리고 사주만으로 남자를 홀려보세요',
  };
}

export default async function BattlePage({ params }: Props) {
  const { battleId } = await params;
  return <SexyBattleClient battleId={battleId} />;
}
