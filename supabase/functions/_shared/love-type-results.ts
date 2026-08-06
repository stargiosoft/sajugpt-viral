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

// 상생 순환 순서: 비겁(0) → 식상(1) → 재성(2) → 관성(3) → 인성(4) → (비겁)
const CYCLE_INDEX: Record<OhengKey, number> = {
  BI: 0,
  SIK: 1,
  JAE: 2,
  GWAN: 3,
  IN: 4
};

/**
 * 두 오행 중 상생 순환상 "더 짧은 방향"으로 도달하는 쪽을 앞에 오도록 정렬
 */
function getCanonicalPairOrder(k1: OhengKey, k2: OhengKey): [OhengKey, OhengKey] {
  const i1 = CYCLE_INDEX[k1];
  const i2 = CYCLE_INDEX[k2];
  const forward = (i2 - i1 + 5) % 5; 
  const backward = (i1 - i2 + 5) % 5; 
  return forward <= backward ? [k1, k2] : [k2, k1];
}

/**
 * 상생 순환 기준 canonical 조합 키 생성 (프론트/백엔드 공통)
 */
function getMappedCombinationKey(k1: OhengKey, k2: OhengKey, prefix: string = ''): string {
  const [start, end] = getCanonicalPairOrder(k1, k2);
  return `${prefix}${OHENG_KOREAN_MAP[start]}${OHENG_KOREAN_MAP[end]}`;
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

  // 1. [3-2 하드 조합] 1위와 2위가 둘 다 45 이상으로 높을 때
  if (scoreA >= 45 && scoreB >= 45) {
    return {
      section: '3-2',
      contentKey: getMappedCombinationKey(firstKey, secondKey, '하드'),
      topElements: [
        { key: firstKey, score: scoreA },
        { key: secondKey, score: scoreB }
      ]
    };
  }

// 2. [3-3 단독 지배] 1위는 45 이상이면서, 2위와의 점수 차이가 15점 이상 압도적으로 벌어질 때만!
  if (scoreA >= 45 && (scoreA - scoreB) >= 15) {
    return {
      section: '3-3',
      contentKey: OHENG_SINGLE_KOREAN_MAP[firstKey],
      topElements: [
        { key: firstKey, score: scoreA },
        { key: secondKey, score: scoreB }
      ]
    };
  }

  // 3. [3-1 일반 조합] 그 외 모든 경우 (두 점수 모두 45 미만 등)
  return {
    section: '3-1',
    contentKey: getMappedCombinationKey(firstKey, secondKey),
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