import { supabase } from '@/lib/supabase';

// 1. 결과 생성 및 저장 함수
export async function generateJobDnaResult(
  birthDate: string,
  birthTime: string,
  unknownTime: boolean,
  gender: 'female' | 'male',
  calendarType: 'solar' | 'lunar' = 'solar'
) {
  const cleanBirthday = birthDate.replace(/[^0-9]/g, '');

  const { data: fnResult, error } = await supabase.functions.invoke('analyze-job-dna', {
    body: {
      birthday: birthDate,
      birthTime,
      gender,
      calendarType,
      birthTimeUnknown: unknownTime,
    },
  });

  if (error || !fnResult?.success) {
    console.error('직업 DNA 분석 함수 호출 에러:', error || fnResult);
    throw new Error('직업 DNA 분석에 실패했습니다.');
  }

  const { page1, page2, siliSummary } = fnResult.data;

  return {
    resultId: fnResult.resultId,
    payload: {
      gender,
      birthday: cleanBirthday,
      page1,
      page2,
      siliSummary,
    },
  };
}

// 2. ID로 조회 함수
export async function fetchJobDnaResultById(resultId: string) {
  const { data, error } = await supabase
    .from('viral_saju_results')
    .select('id, payload')
    .eq('id', resultId)
    .single();

  if (error || !data?.payload) return null;

  return {
    resultId: data.id,
    payload: data.payload,
  };
}