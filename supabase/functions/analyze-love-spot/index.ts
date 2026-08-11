// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';
import * as cheerio from 'npm:cheerio@1.0.0-rc.12';


interface RequestBody {
  name?: string;
  birthday: string;
  birthTime: string;
  gender: 'female' | 'male';
  calendarType: 'solar' | 'lunar';
  year?: number;
}

export type OhengKey = 'BI' | 'SIK' | 'JAE' | 'GWAN' | 'IN';

export interface OhengScoreDetail {
  score: number;
  wshs: number;
}

export type OhengFullScores = Record<OhengKey, OhengScoreDetail>;
export type WangSangHyuSuSaOrder = OhengKey[];

export interface SelectedLoveType {
  section: string;
  contentKey: string;
  topElements: Array<{ key: OhengKey; score: number; wshs: number }>;
}

// MAPS

const OHENG_KOREAN_MAP: Record<OhengKey, string> = { BI: '비', SIK: '식', JAE: '재', GWAN: '관', IN: '인' };
const OHENG_SINGLE_KOREAN_MAP: Record<OhengKey, string> = { BI: '비겁', SIK: '식상', JAE: '재성', GWAN: '관성', IN: '인성' };
const OHENG_NAME_MAP: Record<string, OhengKey> = {
  비겁: 'BI', 식상: 'SIK', 재성: 'JAE', 관성: 'GWAN', 인성: 'IN',
  비견: 'BI', 겁재: 'BI', 식신: 'SIK', 상관: 'SIK', 편재: 'JAE', 정재: 'JAE',
  편관: 'GWAN', 정관: 'GWAN', 편인: 'IN', 정인: 'IN',
};
const CYCLE_INDEX: Record<OhengKey, number> = { BI: 0, SIK: 1, JAE: 2, GWAN: 3, IN: 4 };

function getCanonicalPairOrder(k1: OhengKey, k2: OhengKey): [OhengKey, OhengKey] {
  const i1 = CYCLE_INDEX[k1];
  const i2 = CYCLE_INDEX[k2];
  const forward = (i2 - i1 + 5) % 5;
  const backward = (i1 - i2 + 5) % 5;
  return forward <= backward ? [k1, k2] : [k2, k1];
}

function getMappedCombinationKey(k1: OhengKey, k2: OhengKey, prefix: string = ''): string {
  const [start, end] = getCanonicalPairOrder(k1, k2);
  return `${prefix}${OHENG_KOREAN_MAP[start]}${OHENG_KOREAN_MAP[end]}`;
}

// STARGIO HEADER

const basicAuthToken = btoa('stargio:stargio_key_1507');

const BROWSER_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en-US;q=0.7',
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

// HELPERS

function emptyFullScores(): OhengFullScores {
  return {
    BI: { score: 0, wshs: 0 }, SIK: { score: 0, wshs: 0 }, JAE: { score: 0, wshs: 0 },
    GWAN: { score: 0, wshs: 0 }, IN: { score: 0, wshs: 0 },
  };
}

function isOhengSummaryTable($: cheerio.CheerioAPI, table: any): boolean {
  const text = $(table).text().replace(/\s+/g, '');
  return text.includes('오성(오행)') && text.includes('왕상휴수사') && text.includes('오왕점수');
}

function extractTableFullScores($: cheerio.CheerioAPI, tableElement: any): OhengFullScores {
  const result = emptyFullScores();

  $(tableElement).find('tr').each((_: number, row: any) => {
    const cols = $(row).find('td, th').map((_: number, el: any) => $(el).text().trim()).get();
    if (cols.length < 4) return;

    const title = cols[0].replace(/\s+/g, '');
    if (title.includes('오성(오행)')) return;

    const wshsText = cols[2];
    const finalScoreText = cols[cols.length - 1];
    const wshsValue = Number(wshsText);
    const finalScore = Number(finalScoreText);
    if (Number.isNaN(finalScore)) return;

    for (const [name, key] of Object.entries(OHENG_NAME_MAP)) {
      if (title.includes(name)) {
        result[key] = { score: finalScore, wshs: Number.isNaN(wshsValue) ? 0 : wshsValue };
        break;
      }
    }
  });

  return result;
}

function parseAllOhengTables($: cheerio.CheerioAPI): OhengFullScores[] {
  const tableScoresList: OhengFullScores[] = [];
  $('table').each((_: number, table: any) => {
    if (isOhengSummaryTable($, table)) {
      tableScoresList.push(extractTableFullScores($, table));
    }
  });
  return tableScoresList;
}

export function selectLoveType(
  scores: OhengFullScores,
  wshsOrder: WangSangHyuSuSaOrder = ['BI', 'SIK', 'JAE', 'GWAN', 'IN']
): SelectedLoveType {
  const keys = (Object.keys(scores) as OhengKey[]).sort((a, b) => {
    const scoreDiff = (scores[b]?.score || 0) - (scores[a]?.score || 0);
    if (scoreDiff !== 0) return scoreDiff;
    const wshsDiff = (scores[b]?.wshs || 0) - (scores[a]?.wshs || 0);
    if (wshsDiff !== 0) return wshsDiff;
    const idxA = wshsOrder.indexOf(a);
    const idxB = wshsOrder.indexOf(b);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });

  const firstKey = keys[0] || 'BI';
  const secondKey = keys[1] || 'SIK';
  const scoreA = scores[firstKey]?.score || 0;
  const scoreB = scores[secondKey]?.score || 0;
  const wshsA = scores[firstKey]?.wshs || 0;
  const wshsB = scores[secondKey]?.wshs || 0;

  if (scoreA >= 45 && scoreB >= 45) {
    return {
      section: '3-2',
      contentKey: getMappedCombinationKey(firstKey, secondKey, '하드'),
      topElements: [{ key: firstKey, score: scoreA, wshs: wshsA }, { key: secondKey, score: scoreB, wshs: wshsB }],
    };
  }

  if (scoreA >= 45 && scoreB < 15) {
    return {
      section: '3-3',
      contentKey: OHENG_SINGLE_KOREAN_MAP[firstKey],
      topElements: [{ key: firstKey, score: scoreA, wshs: wshsA }, { key: secondKey, score: scoreB, wshs: wshsB }],
    };
  }

  return {
    section: '3-1',
    contentKey: getMappedCombinationKey(firstKey, secondKey),
    topElements: [{ key: firstKey, score: scoreA, wshs: wshsA }, { key: secondKey, score: scoreB, wshs: wshsB }],
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
      if (match[1] === '오후' && hour < 12) hour += 12;
      if (match[1] === '오전' && hour === 12) hour = 0;
      time = String(hour).padStart(2, '0') + minute;
    }
  }

  return (clean + time).slice(0, 12).padEnd(12, '0');
}

export async function lookupLoveSpotContent(supabase: any, contentKey?: string, section?: string) {
  if (!contentKey || !section) return null;

  const { data, error } = await supabase
    .from('love_spot_results')
    .select('*')
    .eq('section', section)
    .eq('content_key', contentKey)
    .maybeSingle();

  if (error) {
    console.error('DB 조회 오류:', error);
    return null;
  }

  return data;
}

// MAIN HANDLER

Deno.serve(async (req: Request) => {
  // 1. CORS OPTIONS 사전 요청(Preflight) 처리
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { name, birthday, birthTime, gender, calendarType, year } = body;
    const requestId = crypto.randomUUID().slice(0, 8);

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수입니다.', 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error(`[${requestId}] Supabase 환경 변수가 설정되지 않았습니다.`);
      return errorResponse(req, '서버 환경 변수 설정 오류가 발생했습니다.', 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const apiBirthday = formatApiBirthday(birthday, birthTime);
    const requestedYear = year ?? new Date().getFullYear();
    const url = `https://fortune.stargio.co.kr:28082/whySolo/woonse?gender=${gender}&saju=${apiBirthday}&woonYear=${requestedYear}`;

    console.log(`=== [${requestId}] 요청 입력값 ===`, JSON.stringify({ name, birthday, birthTime, gender, calendarType, apiBirthday, requestedYear, requestUrl: url }));

    const res = await fetch(url, { headers: BROWSER_HEADERS });
    const html = await res.text();

    if (!res.ok || html.length === 0) {
      return errorResponse(req, 'Stargio 응답을 받아오지 못했습니다.', 502);
    }

    const $ = cheerio.load(html);
    $('script, style, noscript').remove();

    const tableScoresList = parseAllOhengTables($);

    if (tableScoresList.length === 0) {
      console.error(`[${requestId}] 오성 요약 테이블을 찾지 못했습니다.`);
      return errorResponse(req, '오성 데이터 테이블을 찾을 수 없습니다.', 502);
    }

    const mergedScores = tableScoresList[tableScoresList.length - 1];
    const selected = selectLoveType(mergedScores);
    const content = await lookupLoveSpotContent(supabase, selected.contentKey, selected.section);

    console.log(`=== [${requestId}] 오행 점수 병합 결과 ===`, JSON.stringify(mergedScores));
    console.log(`=== [${requestId}] 선택된 인연 스팟 유형 ===`, JSON.stringify(selected));

    return jsonResponse(req, {
      success: true,
      scores: mergedScores,
      selectedType: selected,
      dbContent: content,
      requestId,
    });

  } catch (err: any) {
    console.error('analyze-love-spot 오류 발생:', err);
    return errorResponse(req, err?.message ?? '분석 처리 중 내부 오류가 발생했습니다.', 500);
  }
});