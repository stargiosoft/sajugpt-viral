import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/* =========================================================
 * Types
 * ======================================================= */

interface AnalyzeRequest {
  mode: 'analyze';
  birthday: string;
  birthTime?: string;
  gender: 'female' | 'male';
  calendarType?: 'solar' | 'lunar';
  birthTimeUnknown?: boolean;
}

interface SaveRequest {
  mode: 'save';
  result: Record<string, unknown>;
}

type RequestBody = AnalyzeRequest | SaveRequest;

/* =========================================================
 * 결과 저장 / 조회 (공유 링크용)
 * - 결과 화면에 보여주는 내용만 저장한다. 생년월일은 저장하지 않는다.
 * ======================================================= */

const RESULT_TABLE = 'child_personality_results';
const MAX_RESULT_BYTES = 20000;

function getServiceSupabase() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');
  return createClient(url, key);
}

/* =========================================================
 * CORS
 * ======================================================= */

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin');

  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonResponse(
  req: Request,
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(req),
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function errorResponse(
  req: Request,
  message: string,
  status = 500,
): Response {
  return jsonResponse(
    req,
    {
      success: false,
      error: message,
    },
    status,
  );
}

/* =========================================================
 * Stargio API Headers
 * ======================================================= */

const BROWSER_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  Host: 'service.stargio.co.kr:8400',
  Origin: 'https://nadaunse.com',
  Referer: 'https://nadaunse.com/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
};

/* =========================================================
 * Utility
 * ======================================================= */

function cleanBirthday(birthday: string): string {
  return birthday.replace(/[^0-9]/g, '');
}

function convertBirthTime(
  birthTime?: string,
  unknown = false,
): string {
  // 출생시간 모름
  if (
    unknown ||
    !birthTime ||
    birthTime === '모름'
  ) {
    return '0000';
  }

  const match = birthTime.match(
    /(오전|오후)\s*(\d{1,2}):(\d{2})/,
  );

  if (!match) {
    const direct = birthTime.match(
      /(\d{1,2}):(\d{2})/,
    );

    if (!direct) {
      return '0000';
    }

    const hour = parseInt(direct[1], 10);
    const minute = direct[2];

    if (
      Number.isNaN(hour) ||
      hour < 0 ||
      hour > 23
    ) {
      return '0000';
    }

    return (
      String(hour).padStart(2, '0') +
      minute
    );
  }

  let hour = parseInt(match[2], 10);
  const minute = match[3];

  if (
    Number.isNaN(hour) ||
    hour < 1 ||
    hour > 12
  ) {
    return '0000';
  }

  // 오후
  if (match[1] === '오후' && hour < 12) {
    hour += 12;
  }

  // 오전 12시 → 00시
  if (match[1] === '오전' && hour === 12) {
    hour = 0;
  }

  return (
    String(hour).padStart(2, '0') +
    minute
  );
}

/* =========================================================
 * Stargio Saju API
 * ======================================================= */

async function requestStargio(
  body: AnalyzeRequest,
) {
  const apiKey =
    Deno.env.get('SAJU_API_KEY')?.trim();

  if (!apiKey) {
    throw new Error(
      'SAJU_API_KEY가 설정되지 않았습니다.',
    );
  }

  const birthday = cleanBirthday(body.birthday);

  if (birthday.length !== 8) {
    throw new Error(
      '생년월일 형식이 올바르지 않습니다.',
    );
  }

  const time = convertBirthTime(
    body.birthTime,
    body.birthTimeUnknown,
  );

  const apiBirthday =
    birthday + time;

  const isLunar =
    body.calendarType === 'lunar';

  const url =
    `https://service.stargio.co.kr:8400/StargioSaju` +
    `?birthday=${encodeURIComponent(apiBirthday)}` +
    `&lunar=${encodeURIComponent(String(isLunar))}` +
    `&gender=${encodeURIComponent(body.gender)}` +
    `&apiKey=${encodeURIComponent(apiKey)}`;

  let sajuData: Record<string, any> | null =
    null;

  /*
   * 최대 3회 재시도
   */
  for (
    let attempt = 1;
    attempt <= 3;
    attempt++
  ) {
    try {
      console.log(
        `[ChildPersonality] Stargio 요청 ${attempt}/3`,
      );

      const response = await fetch(url, {
        method: 'GET',
        headers: BROWSER_HEADERS,
      });

      if (!response.ok) {
        throw new Error(
          `Stargio HTTP ${response.status}`,
        );
      }

      const parsed =
        await response.json();

      if (
        parsed &&
        typeof parsed === 'object' &&
        Object.keys(parsed).length > 0
      ) {
        sajuData = parsed;
        break;
      }

      throw new Error(
        'Stargio 응답 데이터가 비어 있습니다.',
      );
    } catch (error) {
      console.error(
        `[ChildPersonality] Stargio ${attempt}/3 실패`,
        error,
      );

      if (attempt < 3) {
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            1000 * attempt,
          ),
        );
      }
    }
  }

  if (!sajuData) {
    throw new Error(
      'Stargio 사주 분석에 실패했습니다.',
    );
  }

  return sajuData;
}

/* =========================================================
 * Main
 * ======================================================= */

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(req),
    });
  }

  /*
   * =======================================================
   * GET: 공유 링크 결과 조회 (?resultId=)
   * =======================================================
   */
  if (req.method === 'GET') {
    try {
      const resultId = new URL(req.url).searchParams.get('resultId')?.trim();
      if (!resultId) return errorResponse(req, 'resultId가 필요합니다.', 400);

      const { data, error } = await getServiceSupabase()
        .from(RESULT_TABLE)
        .select('result_id,result')
        .eq('result_id', resultId)
        .maybeSingle();

      if (error) return errorResponse(req, `결과 조회 실패: ${error.message}`, 500);
      if (!data) return errorResponse(req, '해당 결과를 찾을 수 없습니다.', 404);

      return jsonResponse(req, { success: true, resultId: data.result_id, result: data.result });
    } catch (error) {
      return errorResponse(req, error instanceof Error ? error.message : '서버 오류가 발생했습니다.', 500);
    }
  }

  if (req.method !== 'POST') {
    return errorResponse(
      req,
      '지원하지 않는 요청입니다.',
      405,
    );
  }

  /*
   * =======================================================
   * POST (ANALYZE)
   * =======================================================
   */
  try {
    const body =
      (await req.json()) as RequestBody;

    if (body.mode === 'save') {
      const result = body.result;
      if (!result || typeof result !== 'object' || Array.isArray(result)) {
        return errorResponse(req, '저장할 결과가 없습니다.', 400);
      }
      if (JSON.stringify(result).length > MAX_RESULT_BYTES) {
        return errorResponse(req, '결과 크기가 너무 큽니다.', 400);
      }

      const resultId = crypto.randomUUID();
      const { error } = await getServiceSupabase()
        .from(RESULT_TABLE)
        .insert({ result_id: resultId, result });

      if (error) return errorResponse(req, `결과 저장 실패: ${error.message}`, 500);

      return jsonResponse(req, { success: true, resultId });
    }

    if (body.mode === 'analyze') {
      if (
        !body.birthday ||
        !body.gender
      ) {
        return errorResponse(
          req,
          '생년월일과 성별은 필수입니다.',
          400,
        );
      }

      const sajuData =
        await requestStargio(body);
        
      return jsonResponse(
        req,
        {
          success: true,
          sajuData,
        },
      );
    }

    return errorResponse(
      req,
      '지원하지 않는 요청입니다.',
      400,
    );
  } catch (error) {
    console.error(
      '[ChildPersonality] Edge Function 오류:',
      error,
    );

    return errorResponse(
      req,
      error instanceof Error
        ? error.message
        : '서버 오류가 발생했습니다.',
      500,
    );
  }
});