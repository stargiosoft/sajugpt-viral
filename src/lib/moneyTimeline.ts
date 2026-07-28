import { supabase } from '@/lib/supabase';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import type { Gender } from '@/types/battle';
import type { MoneyTimelineResult, MoneyTimelineProfile } from '@/types/money-timeline';

interface AnalyzeMoneyTimelineResponse {
  success: boolean;
  resultId?: string;
  profile?: MoneyTimelineProfile;
}

export async function generateMoneyTimelineResult(
  birthDate: string,
  birthTime: string,
  unknownTime: boolean,
  gender: Gender,
): Promise<MoneyTimelineResult> {
  const data = await callEdgeFunction<AnalyzeMoneyTimelineResponse>('analyze-money-timeline', {
    birthday: birthDate,
    birthTime,
    birthTimeUnknown: unknownTime,
    gender,
  });

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

export async function fetchMoneyTimelineResultById(resultId: string): Promise<MoneyTimelineResult | null> {
  const { data, error } = await supabase
    .from('money_timeline_results')
    .select('*')
    .eq('id', resultId)
    .single();

  if (error || !data) return null;

  return {
    resultId: data.id,
    birthDate: '',
    birthTime: '',
    unknownTime: true,
    gender: (data.gender as Gender) ?? 'female',
    profile: data.result as MoneyTimelineProfile,
    createdAt: data.created_at,
  };
}
