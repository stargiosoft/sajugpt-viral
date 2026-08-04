export type OhengKey = 'BI' | 'SIK' | 'JAE' | 'GWAN' | 'IN';

export interface OhengScores {
  BI: number;
  SIK: number;
  JAE: number;
  GWAN: number;
  IN: number;
}

export type WangSangHyuSuSaOrder = OhengKey[];

export interface SelectedLoveType {
  section: string;
  contentKey: string;
  topElements: Array<{ key: OhengKey; score: number }>;
}

/**
 * 상위 2개 오행 및 조건에 따른 타입 결정 함수
 */
export function selectLoveType(
  scores: OhengScores,
  wshsOrder: WangSangHyuSuSaOrder = ['BI', 'SIK', 'JAE', 'GWAN', 'IN']
): SelectedLoveType {
  const keys = (Object.keys(scores) as OhengKey[]).sort((a, b) => {
    const diff = (scores[b] || 0) - (scores[a] || 0);
    if (diff !== 0) return diff;
    const idxA = wshsOrder.indexOf(a);
    const idxB = wshsOrder.indexOf(b);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });

  const firstKey = keys[0] || 'BI';
  const secondKey = keys[1] || 'SIK';
  const scoreA = scores[firstKey] || 0;
  const scoreB = scores[secondKey] || 0;

  // 2-1: 둘 다 45 이상
  if (scoreA >= 45 && scoreB >= 45) {
    const combinedKey = [firstKey, secondKey].sort().join('_');
    return {
      section: '3-2',
      contentKey: combinedKey,
      topElements: [
        { key: firstKey, score: scoreA },
        { key: secondKey, score: scoreB }
      ]
    };
  }

  // 2-2: 둘 중 하나만 45 이상
  if (scoreA >= 45 || scoreB >= 45) {
    const singleKey = scoreA >= 45 ? firstKey : secondKey;
    return {
      section: '3-3',
      contentKey: singleKey,
      topElements: [
        { key: firstKey, score: scoreA },
        { key: secondKey, score: scoreB }
      ]
    };
  }

  // 2-3: 둘 다 45 미만
  const combinedKey = [firstKey, secondKey].sort().join('_');
  return {
    section: '3-1',
    contentKey: combinedKey,
    topElements: [
      { key: firstKey, score: scoreA },
      { key: secondKey, score: scoreB }
    ]
  };
}

/**
 * Supabase DB에서 contentKey에 해당하는 콘텐츠 조회
 */
export async function lookupContentFromDB(supabase: any, contentKey?: string) {
  if (!contentKey || typeof contentKey !== 'string') {
    console.warn('[DB Lookup] 유효하지 않은 contentKey:', contentKey);
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('solo_guide_results')
      .select('*')
      .eq('content_key', contentKey)
      .maybeSingle();

    if (error) {
      console.error('[DB Lookup Error]:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('[DB Lookup Exception]:', err);
    return null;
  }
}