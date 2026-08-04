import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';
import { lookupContentFromDB, type OhengScores, type WangSangHyuSuSaOrder } from '../_shared/love-type-results.ts';
import * as cheerio from 'npm:cheerio@1.0.0-rc.12';

// ─── 타입 정의 ───────────────────────────────────────────
interface RequestBody {
  name?: string;          // 사용자 이름 (선택)
  birthday: string;       // "YYYY-MM-DD"
  birthTime: string;      // "오전 HH:MM" | "오후 HH:MM" | "모름"
  gender: 'female' | 'male';
  calendarType: 'solar' | 'lunar';
}

type OhengKey = 'BI' | 'SIK' | 'JAE' | 'GWAN' | 'IN';

// Basic Auth 토큰 생성 
const basicAuthToken = btoa('stargio:stargio_key_1507');

const BROWSER_HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Authorization': `Basic ${basicAuthToken}`,
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Host': 'fortune.stargio.co.kr:28084',
  'Origin': 'https://nadaunse.com',
  'Referer': 'https://nadaunse.com/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

// ─── HTML에서 점수 및 왕상휴수사 추출 ───────────
function parseSajuScoresFromHtml($: cheerio.CheerioAPI): { scores: OhengScores; wshsOrder: WangSangHyuSuSaOrder } {
  const scores: OhengScores = { BI: 0, SIK: 0, JAE: 0, GWAN: 0, IN: 0 };
  const wshsOrder: OhengKey[] = ['BI', 'SIK', 'JAE', 'GWAN', 'IN'];

  // HTML 전체 텍스트 수집 및 정규화
  const fullText = $('body').text().replace(/\s+/g, ' ');

  // 1. 오성 점수 추출 (비겁, 식상, 재성, 관성, 인성 순서)
  const ohengMatch = fullText.match(/오성\s*점수[^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+)/) ||
                     fullText.match(/오성[^\d]*(\d+)\s*(\d+)\s*(\d+)\s*(\d+)\s*(\d+)/);

  if (ohengMatch) {
    scores.BI = parseInt(ohengMatch[1], 10) || 0;
    scores.SIK = parseInt(ohengMatch[2], 10) || 0;
    scores.JAE = parseInt(ohengMatch[3], 10) || 0;
    scores.GWAN = parseInt(ohengMatch[4], 10) || 0;
    scores.IN = parseInt(ohengMatch[5], 10) || 0;
  }

  // 2. 왕상휴수사 점수 추출 (동점 발생 시 우선순위 결정용)
  const wshsScores: Record<OhengKey, number> = { BI: 0, SIK: 0, JAE: 0, GWAN: 0, IN: 0 };
  const wshsMatch = fullText.match(/왕상휴수사\s*점수[^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+)[^\d]*(\d+)/);

  if (wshsMatch) {
    wshsScores.BI = parseInt(wshsMatch[1], 10) || 0;
    wshsScores.SIK = parseInt(wshsMatch[2], 10) || 0;
    wshsScores.JAE = parseInt(wshsMatch[3], 10) || 0;
    wshsScores.GWAN = parseInt(wshsMatch[4], 10) || 0;
    wshsScores.IN = parseInt(wshsMatch[5], 10) || 0;

    const sortedWshsKeys = (Object.keys(wshsScores) as OhengKey[]).sort(
      (a, b) => wshsScores[b] - wshsScores[a]
    );
    wshsOrder.length = 0;
    wshsOrder.push(...sortedWshsKeys);
  }

  return { scores, wshsOrder };
}

// ─── 분기 조건에 따른 오행 카테고리 결정 ───
function determineOhengCategory(scores: OhengScores, wshsOrder: WangSangHyuSuSaOrder) {
  const keys = Object.keys(scores) as OhengKey[];

  // 1. 점수 내림차순, 동점 시 wshsOrder 순위가 높은 쪽 우선 정렬
  keys.sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;

    const idxA = wshsOrder.indexOf(a);
    const idxB = wshsOrder.indexOf(b);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });

  const firstKey = keys[0];  // 상위 1위 오행 (A)
  const secondKey = keys[1]; // 상위 2위 오행 (B)

  const scoreA = scores[firstKey];
  const scoreB = scores[secondKey];

  console.log(`[분기 정렬] 1위: ${firstKey}(${scoreA}점), 2위: ${secondKey}(${scoreB}점)`);

  // [조건 2-1] 둘 다 45 이상 -> 3-2 하드 오성 조합
  if (scoreA >= 45 && scoreB >= 45) {
    return {
      conditionGroup: '2-1_HARD_COMBINATION',
      mappingKey: [firstKey, secondKey].sort().join('_'),
      primary: firstKey,
      secondary: secondKey,
      scoreA,
      scoreB,
    };
  }

  // [조건 2-2] 둘 중 하나만 45 이상 -> 3-3 단독 오성 데이터
  if (scoreA >= 45 || scoreB >= 45) {
    const singleKey = scoreA >= 45 ? firstKey : secondKey;
    return {
      conditionGroup: '2-2_SINGLE_OHENG',
      mappingKey: singleKey,
      primary: singleKey,
      scoreA,
      scoreB,
    };
  }

  // [조건 2-3] 둘 다 45 미만 -> 3-1 일반 오행 조합
  return {
    conditionGroup: '2-3_GENERAL_COMBINATION',
    mappingKey: [firstKey, secondKey].sort().join('_'),
    primary: firstKey,
    secondary: secondKey,
    scoreA,
    scoreB,
  };
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { name, birthday, birthTime, gender, calendarType } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수 입력값입니다.', 400);
    }

    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) {
      return errorResponse(req, '서버 설정 오류: API 키 누락', 500);
    }

    // Supabase 클라이언트 초기화
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. 생년월일시 -> 12자리(YYYYMMDDHHMM) 포맷팅
    const cleanBirthday = birthday.replace(/-/g, '');
    let timeStr = '0000'; // 기본값 (모름 시 00:00)

    if (birthTime && birthTime !== '모름') {
      const match = birthTime.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
      if (match) {
        let hour = parseInt(match[2], 10);
        const minute = match[3];

        if (match[1] === '오후' && hour < 12) hour += 12;
        if (match[1] === '오전' && hour === 12) hour = 0;

        timeStr = String(hour).padStart(2, '0') + minute;
      }
    }

    const apiBirthday = (cleanBirthday + timeStr).slice(0, 12).padEnd(12, '0');
    const isLunar = calendarType === 'lunar';

    // 2. Stargio WhySolo HTML Scraping 호출
    const encodedApiKey = encodeURIComponent(sajuApiKey);
    const whySoloApiUrl = `https://fortune.stargio.co.kr:28084/whySolo/?birthday=${apiBirthday}&lunar=${isLunar}&gender=${gender}&apiKey=${encodedApiKey}`;
   
    let rawHtml = '';
    console.log('[DEBUG] Scraping target URL:', whySoloApiUrl);
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(whySoloApiUrl, { 
          method: 'GET', 
          headers: BROWSER_HEADERS 
        });

        rawHtml = await response.text();
        console.log(`[DEBUG] Attempt ${attempt} HTTP Status:`, response.status);

        if (response.ok && rawHtml.includes('<!DOCTYPE html>')) {
          break;
        }
      } catch (err) {
        console.error(`WhySolo Scraping 시도 ${attempt}/3 실패:`, err instanceof Error ? err.message : err);
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }

    if (!rawHtml) {
      return errorResponse(req, 'Stargio 연동 실패: HTML 수신 실패', 502);
    }

    // 3. Cheerio를 이용한 HTML 파싱
    const $ = cheerio.load(rawHtml);
    $('script, style, noscript').remove();

    // 오성 점수 및 왕상휴수사 파싱
    const { scores, wshsOrder } = parseSajuScoresFromHtml($);

    // 4. 분기 조건 계산 실행
    const ohengCalculation = determineOhengCategory(scores, wshsOrder);

    // DB 조회를 위한 section 및 targetKey 지정
    const targetKey = ohengCalculation.mappingKey;
    const section = ohengCalculation.conditionGroup.startsWith('2-1') ? '3-2' : 
                    ohengCalculation.conditionGroup.startsWith('2-2') ? '3-3' : '3-1';

    console.log(`[DEBUG] DB 조회 대상 targetKey: ${targetKey}, section: ${section}`);

    // DB에서 콘텐츠 안전하게 조회 (section 정보 전달)
    let contentFromDb = null;
    try {
      if (targetKey) {
        contentFromDb = await lookupContentFromDB(supabase, targetKey, section);
      }
    } catch (dbErr) {
      console.warn('DB 콘텐츠 조회 실패:', dbErr);
    }

    // 5. Payload 구성
    const resultPayload = {
      name: name || '당신',
      scores,
      wshsOrder,
      calculation: ohengCalculation,
      selectedType: {
        section,
        contentKey: targetKey,
        topElements: [
          { key: ohengCalculation.primary, score: ohengCalculation.scoreA },
          { key: ohengCalculation.secondary, score: ohengCalculation.scoreB }
        ]
      },
      dbContent: contentFromDb,
    };

    // 6. React 프론트엔드로 JSON 반환
    return jsonResponse(req, {
      success: true,
      ...resultPayload,
    });

  } catch (err) {
    console.error('analyze-solo-guide 치명적 오류:', err);
    return errorResponse(req, '솔로 원인 분석 중 내부 오류가 발생했습니다.', 500);
  }
});