import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import DatingSimClient from '@/components/dating-sim/DatingSimClient';

const CHARACTER_NAMES: Record<string, string> = {
  'yoon-taesan': '윤태산',
  'do-haegyeol': '도해결',
  'seo-hwiyoon': '서휘윤',
  'gi-jimun': '기지문',
  'choi-seolgye': '최설계',
};

interface PageProps {
  params: Promise<{ resultId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { resultId } = await params;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );

    const { data } = await supabase
      .from('dating_results')
      .select('character_id, total_score, user_rank, total_count')
      .eq('id', resultId)
      .eq('status', 'completed')
      .single();

    if (data) {
      const charName = CHARACTER_NAMES[data.character_id as string] ?? '캐릭터';
      const score = data.total_score as number;
      const rank = data.user_rank as number;
      const total = data.total_count as number;

      return {
        title: `${charName}한테 ${score}점 받음ㅋㅋ | 데이트 시뮬레이션`,
        description: `${total}명 중 ${rank}등. 너는 몇 점 받을 수 있어?`,
        openGraph: {
          title: `${charName}한테 ${score}점 받았대ㅋㅋ`,
          description: `${total}명 중 ${rank}등 | 너는 몇 점?`,
        },
      };
    }
  } catch {
    // 에러 시 기본 메타
  }

  return {
    title: '데이트 시뮬레이션 — 사주GPT',
    description: '5턴 안에 AI 캐릭터의 마음을 사로잡아보세요.',
  };
}

export default async function DatingSimResultPage({ params }: PageProps) {
  const { resultId } = await params;
  return <DatingSimClient sharedResultId={resultId} />;
}
