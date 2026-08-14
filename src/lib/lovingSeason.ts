import type { LovingSeasonInput, LovingSeasonRecord } from '@/types/loving-season';

export async function createLovingSeasonResult(
  input: LovingSeasonInput
): Promise<LovingSeasonRecord> {
  const { gender, birthday, birthTime } = input;

  if (!gender || !birthday) {
    throw new Error('필수 정보가 누락되었습니다.');
  }

  const endpoint = 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/functions/v1/analyze-loving-season';

  // Next.js 환경변수에서 Supabase Anon Key 가져오기
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey || '',
      'Authorization': `Bearer ${supabaseAnonKey || ''}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? '분석 요청에 실패했습니다.');
  }

  const data = await res.json();
  const requestId = data.requestId || crypto.randomUUID().slice(0, 8);

  const record: LovingSeasonRecord = {
    resultId: requestId,
    gender,
    birthday,
    birthTime: birthTime || null,
    allSeasons: data.allSeasons,
    firstSeason: data.firstSeason,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`loving_season_${requestId}`, JSON.stringify(record));
  }

  return record;
}

export async function getLovingSeasonResultClient(
  resultId: string
): Promise<LovingSeasonRecord | null> {
  if (typeof window === 'undefined') return null;

  try {
    const cached = sessionStorage.getItem(`loving_season_${resultId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.error('세션 데이터 로드 실패:', err);
  }

  return null;
}

export async function getLovingSeasonResult(resultId: string): Promise<LovingSeasonRecord | null> {
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(`loving_season_${resultId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.error('세션 데이터 로드 실패:', err);
    }
  }

  return null;
}