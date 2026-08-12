import { supabase } from '@/lib/supabase';
import type { ChemiStat, CoupleGuideFormState, CoupleGuideResult } from '@/types/couple-guide';

export interface RawCoupleGuideResult {
  resultId: string;
  totalScore: number;
  rawScore: string;
  description: string;
  relationshipTitle: string;
  relationshipSubtitle: string;
  maxScore: number;
  hashtags: string[];
  chemiStats: ChemiStat[];
  createdAt: string;
}

/** analyze-couple-guide Edge Function을 호출하여 결과를 받아옵니다. */
export async function analyzeCoupleGuide(input: CoupleGuideFormState): Promise<RawCoupleGuideResult> {
  const { data, error } = await supabase.functions.invoke('analyze-couple-guide', {
    body: {
      person1: {
        birthday: input.person1.birthday,
        birthTime: input.person1.birthTimeUnknown ? '모름' : input.person1.birthTime,
        gender: input.person1.gender,
      },
      person2: {
        birthday: input.person2.birthday,
        birthTime: input.person2.birthTimeUnknown ? '모름' : input.person2.birthTime,
        gender: input.person2.gender,
      },
      calendarType: input.calendarType,
    },
  });

  if (error) throw new Error(error.message ?? '커플 궁합 분석 요청에 실패했습니다.');
  if (!data?.success) throw new Error(data?.error ?? '분석 결과를 불러오지 못했습니다.');

  return {
    ...data.result,
    createdAt: new Date().toISOString(),
  };
}

const STORAGE_PREFIX = 'couple-guide-result-';

/** 결과를 localStorage에 저장합니다. */
export function saveCoupleGuideResult(result: RawCoupleGuideResult): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${result.resultId}`, JSON.stringify(result));
  } catch {
    // 저장 실패해도 흐름 유지
  }
}

/** resultId로 localStorage에서 결과를 읽습니다. */
export function loadCoupleGuideResult(resultId: string): RawCoupleGuideResult | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${resultId}`);
    if (!raw) return null;
    return JSON.parse(raw) as RawCoupleGuideResult;
  } catch {
    return null;
  }
}

/** 원본 데이터를 결과 화면(CoupleResultView)이 소비하는 형태로 매핑합니다. */
export function mapToCoupleResult(raw: RawCoupleGuideResult): CoupleGuideResult {
  return {
    totalScore: raw.totalScore,
    maxScore: raw.maxScore,
    relationshipTitle: raw.relationshipTitle,
    relationshipDescription: raw.relationshipSubtitle,
    hashtags: raw.hashtags ?? [],
    summary: raw.description ?? '',
    stats: raw.chemiStats ?? [],
  };
}