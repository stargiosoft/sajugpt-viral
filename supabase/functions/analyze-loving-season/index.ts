// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';
import * as cheerio from 'npm:cheerio@1.0.0-rc.12';

interface RequestBody {
  name?: string;
  birthday: string;
  birthTime: string;
  gender: 'female' | 'male';
  calendarType?: 'solar' | 'lunar';
}

const basicAuthToken = btoa('stargio:stargio_key_1507');

const BROWSER_HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Authorization': `Basic ${basicAuthToken}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

/**
 * 생년월일시 파라미터 생성 (YYYYMMDDHHMM 12자리 규격)
 */
function formatApiBirthday(birthday: string, birthTime?: string): string {
  const clean = birthday.replace(/[^0-9]/g, ''); // 숫자만 추출 (YYYYMMDD)
  let hourStr = '00';
  let minStr = '00';

  if (birthTime && birthTime !== '모름' && birthTime !== 'null' && birthTime !== 'undefined') {
    const ampmMatch = birthTime.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
    const timeMatch = birthTime.match(/(\d{1,2}):(\d{2})/);

    if (ampmMatch) {
      let h = Number(ampmMatch[2]);
      const m = ampmMatch[3];
      
      // Stargio 웹사이트 방식 추종
      if (ampmMatch[1] === '오후') {
        if (h < 12) h += 12; // 오후 1시~11시 -> 13시~23시
        // 오후 12시는 그대로 12시
      } else if (ampmMatch[1] === '오전') {
        if (h === 12) h = 12; // 오전 12시 -> 낮 12시 (스크린샷 결과 맞춤)
      }
      
      hourStr = String(h).padStart(2, '0');
      minStr = m;
    } else if (timeMatch) {
      hourStr = String(timeMatch[1]).padStart(2, '0');
      minStr = timeMatch[2];
    }
  }

  const fullSaju = `${clean}${hourStr}${minStr}`;
  return fullSaju.padEnd(12, '0').slice(0, 12);
}

/**
 * HTML 내 테이블 중 '연인이 들어오는 시기' 테이블만 지정해서 연월 정밀 추출
 */
function extractSeasonsFromHtml($: cheerio.CheerioAPI): string[] {
  const seasons: string[] = [];

  // 1. '연인이 들어오는 시기' 문구가 들어있는 전용 <table> 찾기
  let targetTable: cheerio.Cheerio<any> | null = null;

  $('table').each((_, tableEl) => {
    const tableText = $(tableEl).text();
    if (tableText.includes('연인이 들어오는 시기')) {
      targetTable = $(tableEl);
    }
  });

  // 해당 테이블 내부 'td'들만 순회
  const scope = targetTable ? targetTable.find('tr td') : $('table tr td');

  scope.each((_: number, el: any) => {
    // 줄바꿈, 다중 공백 완벽 제거
    const rawText = $(el).text().replace(/\s+/g, ' ').trim();

    if (!rawText || rawText.includes('연인이 들어오는 시기')) return;

    // ex) "2026년 11월", "2027년 3월" 형태 추출
    const match = rawText.match(/(20\d{2}|\d{2})\s*년\s*(\d{1,2})\s*월/);

    if (match) {
      let year = match[1];
      let month = match[2].padStart(2, '0');
      if (year.length === 2) year = `20${year}`;

      const formatted = `${year}.${month}`;

      if (!seasons.includes(formatted)) {
        seasons.push(formatted);
      }
    }
  });

  return seasons;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, birthTime, gender } = body;
    const requestId = crypto.randomUUID().slice(0, 8);

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수 입력값입니다.', 400);
    }

    // 12자리 숫자 규격(YYYYMMDDHHMM) 사주 입력값 생성
    const apiBirthday = formatApiBirthday(birthday, birthTime);
    const url = `https://fortune.stargio.co.kr:28082/lovingSeason/woonse?gender=${gender}&saju=${apiBirthday}`;

    console.log(`\n=================== [${requestId}] analyze-loving-season 요청 ===================`);
    console.log(`1. 입력 파라미터:`, { birthday, birthTime, gender });
    console.log(`2. 변환된 사주 파라미터 (saju): ${apiBirthday}`);
    console.log(`3. Target URL (woonYear 제거됨): ${url}`);

    const res = await fetch(url, { headers: BROWSER_HEADERS });
    const html = await res.text();

    if (!res.ok || !html) {
      console.error(`❌ [${requestId}] Stargio 서버 응답 실패 (Status: ${res.status})`);
      return errorResponse(req, '타깃 운세 서비스 응답을 받아오지 못했습니다.', 502);
    }

    const $ = cheerio.load(html);
    $('script, style, noscript').remove();

    // 데이터 추출 및 상세 로그
    const allSeasons = extractSeasonsFromHtml($);
    const firstSeason = allSeasons[0] || '';

    console.log(`=== [${requestId}] 최종 추출 결과 ===`, {
      firstSeason,
      allSeasons,
      totalCount: allSeasons.length,
    });
    console.log(`=================== [${requestId}] 요청 종료 ===================\n`);

    return jsonResponse(req, {
      success: true,
      firstSeason,
      allSeasons,
      requestId,
    });

  } catch (err: any) {
    console.error(`❌ [${requestId}] analyze-loving-season 처리 예외:`, err);
    return errorResponse(req, err?.message ?? '내부 분석 서버 오류가 발생했습니다.', 500);
  }
});