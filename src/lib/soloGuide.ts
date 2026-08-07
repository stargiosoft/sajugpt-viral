import type { Gender } from '@/types/battle';
import type { SoloGuideResult } from '@/types/solo-guide';
import { supabase } from '@/lib/supabase';

export interface SoloGuideInput {
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
}

/** analyze-solo-guide Edge Function을 호출해 오행 점수 + 매칭된 연애 유형 콘텐츠를 받아온다. */
export async function analyzeSoloGuide(input: SoloGuideInput): Promise<SoloGuideResult> {
  const { data, error } = await supabase.functions.invoke('analyze-solo-guide', {
    body: {
      birthday: input.birthDate,
      birthTime: input.unknownTime ? '모름' : input.birthTime,
      gender: input.gender,
      calendarType: 'solar',
    },
  });

  if (error) throw new Error(error.message ?? '분석 요청에 실패했습니다.');
  if (!data?.success) throw new Error(data?.error ?? '분석 결과를 불러오지 못했습니다.');
  if (!data.dbContent) throw new Error('해당 유형의 콘텐츠를 찾을 수 없습니다.');

  return {
    resultId: data.resultId,
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    unknownTime: input.unknownTime,
    gender: input.gender,
    scores: data.scores,
    topElements: data.selectedType.topElements,
    section: data.selectedType.section,
    contentKey: data.selectedType.contentKey,
    content: {
      title: data.dbContent.title,
      reasonSolo: data.dbContent.reason_solo,
      charmPoint: data.dbContent.charm_point,
      compatibility: data.dbContent.compatibility,
      tip: data.dbContent.tip,
    },
    createdAt: new Date().toISOString(),
  };
}

const STORAGE_PREFIX = 'solo-guide-result-';

/** 결과를 localStorage에 저장한다 (사용자별 결과 저장 테이블이 없어 공유 링크는 같은 브라우저에서만 열림) */
export function saveSoloGuideResult(result: SoloGuideResult): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${result.resultId}`, JSON.stringify(result));
  } catch {
    // 저장 실패(프라이빗 모드 등)해도 흐름은 계속 진행
  }
}

/** resultId로 localStorage에서 결과를 읽는다. 없으면 null (다른 기기/캐시 삭제 등) */
export function loadSoloGuideResult(resultId: string): SoloGuideResult | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${resultId}`);
    if (!raw) return null;
    return JSON.parse(raw) as SoloGuideResult;
  } catch {
    return null;
  }
}
