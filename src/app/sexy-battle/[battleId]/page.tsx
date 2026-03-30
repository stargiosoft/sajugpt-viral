import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import SexyBattleClient from '@/components/SexyBattleClient';
import type { ChallengerPreview, Grade } from '@/types/battle';

interface Props {
  params: Promise<{ battleId: string }>;
}

async function fetchChallengerData(battleId: string): Promise<{
  preview: ChallengerPreview | null;
  isCompleted: boolean;
}> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase
      .from('sexy_battles')
      .select('challenger_headcount, challenger_grade, challenger_result, status')
      .eq('id', battleId)
      .single();

    if (data) {
      const title = (data.challenger_result as Record<string, string>)?.title ?? '';
      return {
        preview: {
          headcount: data.challenger_headcount,
          grade: data.challenger_grade as Grade,
          title,
        },
        isCompleted: data.status === 'completed',
      };
    }
  } catch (err) {
    console.error('Challenger data 조회 실패:', err);
  }
  return { preview: null, isCompleted: false };
}

/** 배틀별 동적 OG 메타태그 — 카카오톡/인스타 링크 프리뷰에 마릿수+등급 표시 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { battleId } = await params;
  const { preview } = await fetchChallengerData(battleId);

  if (preview) {
    return {
      title: `색기 배틀 — 나한테 꼬인 남자 ${preview.headcount}명 🔥`,
      description: `${preview.title} | 넌 몇 명이나 꼬이나 해봐 ㅋㅋ`,
      openGraph: {
        title: `색기 배틀 — 나한테 꼬인 남자 ${preview.headcount}명 🔥`,
        description: `${preview.grade}등급 ${preview.title} | 넌 몇 명이나 꼬이나 해봐`,
      },
    };
  }

  return {
    title: '색기 배틀 — 사주GPT',
    description: '얼굴 가리고 사주만으로 남자를 홀려보세요',
  };
}

export default async function BattlePage({ params }: Props) {
  const { battleId } = await params;
  const { preview, isCompleted } = await fetchChallengerData(battleId);

  return (
    <SexyBattleClient
      battleId={battleId}
      challengerPreview={isCompleted ? null : preview}
    />
  );
}
