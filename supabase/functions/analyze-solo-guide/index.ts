import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';
import * as cheerio from 'npm:cheerio@1.0.0-rc.12';

// TYPES

interface RequestBody {
  name?: string;
  birthday: string;
  birthTime: string;
  gender: 'female' | 'male';
  calendarType: 'solar' | 'lunar';
  /** 운세를 알고 싶은 연도. 프론트에서 안 보내면 서버 현재 연도로 기본 처리 */
  year?: number;
}

export type OhengKey = 'BI' | 'SIK' | 'JAE' | 'GWAN' | 'IN';

/**
 * 오행 하나에 대한 상세 점수
 * - score: 오왕 점수 (오성 점수 + 왕상휴수사 점수) → 순위 결정에 사용
 * - wshs : 왕상휴수사 점수 → 동점자 타이브레이크에 사용
 */
export interface OhengScoreDetail {
  score: number;
  wshs: number;
}

export type OhengFullScores = Record<OhengKey, OhengScoreDetail>;

export interface SelectedLoveType {
  section: string;
  contentKey: string;
  topElements: Array<{ key: OhengKey; score: number; wshs: number }>;
}

// MAPS
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

const OHENG_NAME_MAP: Record<string, OhengKey> = {
  비겁: 'BI',
  식상: 'SIK',
  재성: 'JAE',
  관성: 'GWAN',
  인성: 'IN',
  비견: 'BI',
  겁재: 'BI',
  식신: 'SIK',
  상관: 'SIK',
  편재: 'JAE',
  정재: 'JAE',
  편관: 'GWAN',
  정관: 'GWAN',
  편인: 'IN',
  정인: 'IN'
};

const KOREAN_OHENG_SORT_ORDER = ['관', '비', '식', '인', '재'];

// STARGIO HEADER

const basicAuthToken = btoa('stargio:stargio_key_1507');

const BROWSER_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Host': 'service.stargio.co.kr:8400',
  'Origin': 'https://nadaunse.com',
  'Referer': 'https://nadaunse.com/',
  'Authorization': `Basic ${basicAuthToken}`,
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

// HELPER FUNCTIONS

function emptyFullScores(): OhengFullScores {
  return {
    BI: { score: 0, wshs: 0 },
    SIK: { score: 0, wshs: 0 },
    JAE: { score: 0, wshs: 0 },
    GWAN: { score: 0, wshs: 0 },
    IN: { score: 0, wshs: 0 }
  };
}

/**
 * "오성(오행) / 오성 점수 / 왕상휴수사 점수 / 오왕 점수" 4열 테이블인지 판별
 */
function isOhengSummaryTable($: cheerio.CheerioAPI, table: any): boolean {
  const text = $(table).text().replace(/\s+/g, '');
  return (
    text.includes('오성(오행)') &&
    text.includes('왕상휴수사') &&
    text.includes('오왕점수')
  );
}

/**
 * 오성 요약 테이블 하나에서 오행별 (오왕점수, 왕상휴수사점수)를 추출
 */
function extractTableFullScores(
  $: cheerio.CheerioAPI,
  tableElement: any
): OhengFullScores {
  const result = emptyFullScores();

  $(tableElement)
    .find('tr')
    .each((_, row) => {
      const cols = $(row)
        .find('td, th')
        .map((_, el) => $(el).text().trim())
        .get();

      if (cols.length < 4) return;

      const title = cols[0].replace(/\s+/g, '');

      // 헤더 행 스킵
      if (title.includes('오성(오행)')) return;

      const wshsText = cols[2];           // 왕상휴수사 점수
      const finalScoreText = cols[cols.length - 1]; // 오왕 점수

      const wshsValue = Number(wshsText);
      const finalScore = Number(finalScoreText);

      if (Number.isNaN(finalScore)) return;

      for (const [name, key] of Object.entries(OHENG_NAME_MAP)) {
        if (title.includes(name)) {
          result[key] = {
            score: finalScore,
            wshs: Number.isNaN(wshsValue) ? 0 : wshsValue
          };
          break;
        }
      }
    });

  return result;
}

/**
 * HTML 전체에서 오성 요약 테이블(버전1, 버전2 등 여러 개 가능)을 모두 파싱
 */
function parseAllOhengTables($: cheerio.CheerioAPI): OhengFullScores[] {
  const tableScoresList: OhengFullScores[] = [];

  $('table').each((_, table) => {
    if (isOhengSummaryTable($, table)) {
      tableScoresList.push(extractTableFullScores($, table));
    }
  });

  return tableScoresList;
}

/**
 * 여러 테이블(버전1, 버전2)을 모두 사용해서 오행별로
 * 가장 높은 오왕 점수를 채택 (그 점수와 함께 기록된 왕상휴수사 점수도 같이 유지)
 */
function mergeFullScores(tableScoresList: OhengFullScores[]): OhengFullScores {
  const keys: OhengKey[] = ['BI', 'SIK', 'JAE', 'GWAN', 'IN'];
  const merged = emptyFullScores();

  keys.forEach(key => {
    let best: OhengScoreDetail = { score: -Infinity, wshs: 0 };

    for (const table of tableScoresList) {
      const entry = table[key];
      if (entry && entry.score > best.score) {
        best = entry;
      }
    }

    merged[key] = best.score === -Infinity ? { score: 0, wshs: 0 } : best;
  });

  return merged;
}

export function selectLoveType(scores: OhengFullScores): SelectedLoveType {
  const keys = (Object.keys(scores) as OhengKey[]).sort((a, b) => {
    const diff = scores[b].score - scores[a].score;
    if (diff !== 0) return diff;
    // 동점일 경우 왕상휴수사 점수가 더 높은(더 왕성한) 쪽 우선
    return scores[b].wshs - scores[a].wshs;
  });

  const firstKey = keys[0];
  const secondKey = keys[1];
  const scoreA = scores[firstKey].score;
  const scoreB = scores[secondKey].score;
  const wshsA = scores[firstKey].wshs;
  const wshsB = scores[secondKey].wshs;

  const getMappedCombinationKey = (k1: OhengKey, k2: OhengKey, prefix: string = '') => {
    const sortedKor = [k1, k2]
      .sort((x, y) => {
        const nameX = OHENG_KOREAN_MAP[x];
        const nameY = OHENG_KOREAN_MAP[y];
        return KOREAN_OHENG_SORT_ORDER.indexOf(nameX) - KOREAN_OHENG_SORT_ORDER.indexOf(nameY);
      })
      .map(k => OHENG_KOREAN_MAP[k])
      .join('');

    return `${prefix}${sortedKor}`;
  };

  const topElements = [
    { key: firstKey, score: scoreA, wshs: wshsA },
    { key: secondKey, score: scoreB, wshs: wshsB }
  ];

  // 2-1. A >= 45 & B >= 45 → 하드 콤보 (3-2)
  if (scoreA >= 45 && scoreB >= 45) {
    return {
      section: '3-2',
      contentKey: getMappedCombinationKey(firstKey, secondKey, '하드'),
      topElements
    };
  }

  // 2-2. 둘 중 하나만 45 이상 → 단일 지배 (3-3)
  if (scoreA >= 45 || scoreB >= 45) {
    const strongKey = scoreA >= 45 ? firstKey : secondKey;
    return {
      section: '3-3',
      contentKey: OHENG_SINGLE_KOREAN_MAP[strongKey],
      topElements
    };
  }

  // 2-3. 그 외 → 표준 조합 (3-1)
  return {
    section: '3-1',
    contentKey: getMappedCombinationKey(firstKey, secondKey),
    topElements
  };
}

function formatApiBirthday(birthday: string, birthTime?: string): string {
  const clean = birthday.replace(/-/g, '');
  let time = '0000';

  if (birthTime && birthTime !== '모름') {
    const match = birthTime.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);

    if (match) {
      let hour = Number(match[2]);
      const minute = match[3];

      if (match[1] === '오후' && hour < 12) {
        hour += 12;
      }
      if (match[1] === '오전' && hour === 12) {
        hour = 0;
      }

      time = String(hour).padStart(2, '0') + minute;
    }
  }

  return (clean + time).slice(0, 12).padEnd(12, '0');
}

export async function lookupContentFromDB(
  supabase: any,
  contentKey?: string,
  section?: string
) {
  if (!contentKey || !section) {
    return null;
  }

  const { data, error } = await supabase
    .from("solo_guide_results")
    .select("*")
    .eq("section", section)
    .eq("content_key", contentKey)
    .maybeSingle();

  if (error) {
    console.error("DB 조회 오류:", error);
    return null;
  }

  return data;
}

// MAIN HANDLER

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return handleCorsPreflightRequest(req);
    }

    const body: RequestBody = await req.json();
    const { name, birthday, birthTime, gender, calendarType, year } = body;

    const requestId = crypto.randomUUID().slice(0, 8);

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수입니다.', 400);
    }

    const apiKey = Deno.env.get('SAJU_API_KEY')?.trim();

    if (!apiKey) {
      return errorResponse(req, 'API KEY 없음', 500);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const apiBirthday = formatApiBirthday(birthday, birthTime);
    const requestedYear = year ?? new Date().getFullYear();

    const url = `https://fortune.stargio.co.kr:28082/whySolo/woonse?gender=${gender}&saju=${apiBirthday}&woonYear=${requestedYear}`;


    console.log(`=== [${requestId}] 요청 입력값 ===`, JSON.stringify({
      name, birthday, birthTime, gender, calendarType, apiBirthday, requestedYear, requestUrl: url
    }));

    const res = await fetch(url, {
      headers: BROWSER_HEADERS
    });

    const html = await res.text();

    if (!res.ok || html.length === 0) {
      return errorResponse(req, 'Stargio 응답 없음', 502);
    }

    const $ = cheerio.load(html);
    $('script, style, noscript').remove();

    // 버전1, 버전2 (또는 그 이상) 오성 요약 테이블을 모두 파싱
    const tableScoresList = parseAllOhengTables($);

    console.log(`=== [${requestId}] HTML 진단 ===`, JSON.stringify({
      htmlLength: html.length,
      totalTableCount: $('table').length,
      ohengSummaryTableCount: tableScoresList.length
    }));

    if (tableScoresList.length === 0) {
      console.error(`[${requestId}] 오성 요약 테이블을 찾지 못했습니다. HTML 구조가 변경되었을 수 있습니다.`);
      return errorResponse(req, '오성 데이터 테이블을 찾을 수 없습니다.', 502);
    }

    console.log(`=== [${requestId}] 테이블별 원본 점수 ===`, JSON.stringify(tableScoresList));

    // 여러 테이블을 모두 사용해서 오행별 최고 오왕점수로 병합
    const mergedScores = mergeFullScores(tableScoresList);
    // 병합된 점수로 상위 2개 오행 선정 + 3-1/3-2/3-3 분기 결정
    const selected = selectLoveType(mergedScores);
    // 결정된 section + contentKey로 실제 콘텐츠 조회
    const content = await lookupContentFromDB(
      supabase,
      selected.contentKey,
      selected.section
    );

    console.log(`=== [${requestId}] 오행 점수 병합 결과 ===`, JSON.stringify(mergedScores));
    console.log(`=== [${requestId}] 선택된 러브타입 ===`, JSON.stringify(selected));

    return jsonResponse(req, {
      success: true,
      scores: mergedScores,
      selectedType: selected,
      dbContent: content,
      requestId,
      debugTableScoresList: tableScoresList
    });

  } catch (err) {
    console.error('analyze-solo-guide 오류', err);
    return errorResponse(req, '분석 중 오류', 500);
  }
});