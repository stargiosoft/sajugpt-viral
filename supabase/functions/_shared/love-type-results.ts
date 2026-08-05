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

const OHENG_KOREAN_MAP: Record<OhengKey, string> = {
  BI: '비',
  SIK: '식',
  JAE: '재',
  GWAN: '관',
  IN: '인'
};

const OHENG_SINGLE_KOREAN_MAP: Record<OhengKey, string> = {
  BI: '비겁',
  SIK: '식상',
  JAE: '재성',
  GWAN: '관성',
  IN: '인성'
};

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

  // 2-1: 둘 다 45 이상 -> 3-2 하드 조합 (예: "하드비식")
  if (scoreA >= 45 && scoreB >= 45) {
    const sortedKor = [firstKey, secondKey].sort().map(k => OHENG_KOREAN_MAP[k]).join('');
    return {
      section: '3-2',
      contentKey: `하드${sortedKor}`,
      topElements: [
        { key: firstKey, score: scoreA },
        { key: secondKey, score: scoreB }
      ]
    };
  }

  // 2-2: 둘 중 하나만 45 이상 -> 3-3 단독 오성 데이터 (예: "식상")
  if (scoreA >= 45 || scoreB >= 45) {
    const singleKey = scoreA >= 45 ? firstKey : secondKey;
    return {
      section: '3-3',
      contentKey: OHENG_SINGLE_KOREAN_MAP[singleKey],
      topElements: [
        { key: firstKey, score: scoreA },
        { key: secondKey, score: scoreB }
      ]
    };
  }

  // 2-3: 둘 다 45 미만 -> 3-1 일반 조합 (예: "식재")
  const sortedKor = [firstKey, secondKey].sort().map(k => OHENG_KOREAN_MAP[k]).join('');
  return {
    section: '3-1',
    contentKey: sortedKor,
    topElements: [
      { key: firstKey, score: scoreA },
      { key: secondKey, score: scoreB }
    ]
  };
}

/**
 * Supabase DB에서 contentKey에 해당하는 콘텐츠 조회
 */
export async function lookupContentFromDB(
  supabase: any,
  contentKey?: string,
  section?: string
) {
  if (!contentKey || !section) {
    console.warn("[DB Lookup]", { contentKey, section });
    return null;
  }

  const { data, error } = await supabase
    .from("solo_guide_results")
    .select("*")
    .eq("section", section)
    .eq("content_key", contentKey)
    .maybeSingle();

  console.log("DB RESULT", data);

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}