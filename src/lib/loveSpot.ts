import type { Gender } from '@/types/battle';
import type { LoveSpotResult } from '@/types/love-spot';
import { supabase } from '@/lib/supabase';

export interface LoveSpotInput {
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
}

export async function analyzeLoveSpot(input: LoveSpotInput): Promise<LoveSpotResult> {
  const { data, error } = await supabase.functions.invoke('analyze-love-spot', {
    body: {
      birthday: input.birthDate,
      birthTime: input.unknownTime ? '모름' : input.birthTime,
      gender: input.gender,
      calendarType: 'solar',
    },
  });

  if (error) throw new Error(error.message ?? '분석 요청에 실패했습니다.');
  if (!data?.success) throw new Error(data?.error ?? '분석 결과를 불러오지 못했습니다.');
  if (!data.dbContent) throw new Error('해당 유형의 인연 스팟 콘텐츠를 찾을 수 없습니다.');

  return {
    resultId: crypto.randomUUID(),
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    unknownTime: input.unknownTime,
    gender: input.gender,
    scores: data.scores,
    topElements: data.selectedType.topElements,
    section: data.selectedType.section,
    content: {
      contentKey: data.dbContent.content_key,
      places: data.dbContent.place,
      placeDesc: data.dbContent.place_desc,
      tip: data.dbContent.tip,
      imageSlug: data.dbContent.image_slug,
    },
    createdAt: new Date().toISOString(),
  };
}

const STORAGE_PREFIX = 'love-spot-result-';

export function saveLoveSpotResult(result: LoveSpotResult): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${result.resultId}`, JSON.stringify(result));
  } catch {
  }
}

export function loadLoveSpotResult(resultId: string): LoveSpotResult | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${resultId}`);
    if (!raw) return null;
    return JSON.parse(raw) as LoveSpotResult;
  } catch {
    return null;
  }
}