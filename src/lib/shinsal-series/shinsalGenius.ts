import { callEdgeFunction } from '@/lib/fetchWithRetry';
import type { Gender } from '@/types/battle';
import type { ShinsalGeniusResult } from '@/types/shinsal-series';

export async function generateGeniusResult(
  birthDate: string,
  birthTime: string,
  gender: Gender
): Promise<ShinsalGeniusResult> {
  return callEdgeFunction<ShinsalGeniusResult>('shinsal-genius', {
    birthDate,
    birthTime,
    gender,
  });
}