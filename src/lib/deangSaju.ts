import { supabase, supabaseUrl, supabaseKey } from '@/lib/supabase';
import type { Gender } from '@/types/battle';
import type { DeangResult } from '@/types/deang-saju';

export async function generateDeangResult(
  birthDate: string,
  birthTime: string,
  unknownTime: boolean,
  gender: Gender
): Promise<DeangResult> {
  const response = await fetch(`${supabaseUrl}/functions/v1/analyze-dog-saju`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      birthday: birthDate,
      birthTime,
      birthTimeUnknown: unknownTime,
      gender,
    }),
  });

  if (!response.ok) {
    throw new Error('Supabase Edge Function 통신 에러');
  }

  const data = await response.json();

  if (!data.success || !data.profile) {
    throw new Error('분석 실패');
  }

  return {
    resultId: data.resultId || crypto.randomUUID(),
    birthDate,
    birthTime,
    unknownTime,
    gender,
    profile: data.profile,
    createdAt: new Date().toISOString(),
  };
}

export async function fetchDeangResultById(resultId: string): Promise<DeangResult | null> {
  const { data, error } = await supabase
    .from('deang_saju_results')
    .select('*')
    .eq('id', resultId)
    .single();

  if (error || !data) return null;

  return {
    resultId: data.id,
    birthDate: '',
    birthTime: '',
    unknownTime: true,
    gender: 'female',
    profile: data.profile,
    createdAt: data.created_at,
  };
}