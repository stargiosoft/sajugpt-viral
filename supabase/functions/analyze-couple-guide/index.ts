import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';
import * as cheerio from 'npm:cheerio@1.0.0-rc.12';

interface PersonInput {
  gender: 'male' | 'female';
  birthday: string;   // 'YYYY-MM-DD'
  birthTime: string;  // '오전 11:43' | '모름'
}

interface RequestBody {
  person1: PersonInput;
  person2: PersonInput;
  year?: number;
}

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

function assignGenderSlots(person1: PersonInput, person2: PersonInput) {
  const sameGender = person1.gender === person2.gender;
  if (!sameGender) {
    const maleInput = person1.gender === 'male' ? person1 : person2;
    const femaleInput = person1.gender === 'female' ? person1 : person2;
    return { maleInput, femaleInput, sameGender };
  }
  return { maleInput: person1, femaleInput: person2, sameGender };
}

Deno.serve(async (req: Request) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  const url = new URL(req.url);

  console.log(`=== [analyze-couple-guide] 함수 호출됨 === ${req.method} ${url.href}`);

  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const rawBodyText = await req.text();
    console.log(`=== [analyze-couple-guide] raw body === ${rawBodyText}`);

    let body: RequestBody;
    try {
      body = JSON.parse(rawBodyText);
    } catch {
      return errorResponse(req, '잘못된 JSON 형식입니다.', 400);
    }

    const { person1, person2, year } = body;
    const requestedYear = year ?? new Date().getFullYear();

    if (!person1 || !person2) {
      return errorResponse(req, '두 사람의 정보가 모두 필요합니다.', 400);
    }

    const { maleInput, femaleInput } = assignGenderSlots(person1, person2);
    const maleSaju = formatApiBirthday(maleInput.birthday, maleInput.birthTime);
    const femaleSaju = formatApiBirthday(femaleInput.birthday, femaleInput.birthTime);

    const targetUrl = `https://fortune.stargio.co.kr:28084/gunghap/woonse?male=${maleSaju}&female=${femaleSaju}&woonYear=${requestedYear}`;
    
    console.log(`=== [${requestId}] 커플 궁합 요청 ===`, JSON.stringify({ targetUrl }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let htmlText = '';
    try {
      const apiRes = await fetch(targetUrl, { 
        headers: BROWSER_HEADERS,
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (!apiRes.ok) {
        throw new Error(`External API failed with status ${apiRes.status}`);
      }
      htmlText = await apiRes.text();
    } catch (fetchErr) {
      console.error(`[${requestId}] 외부 API 호출 실패 또는 타임아웃:`, fetchErr);
      htmlText = '<div>겉궁합 점수 80.0점</div>'; // 실패 시 기본 80점 대응 HTML
    }

    const $ = cheerio.load(htmlText);
    const textContent = $.text();

    // 1. '겉궁합 점수' 바로 뒤에 나오는 소수점 포함 점수 추출
    let totalScore = 80;
    const outerScoreMatch = textContent.match(/겉궁합\s*점수\s*([+-]?\d+\.?\d*)/);
    if (outerScoreMatch) {
      const parsed = Math.round(parseFloat(outerScoreMatch[1]));
      if (parsed >= 0 && parsed <= 100) totalScore = parsed;
    } else {
      const fallbackMatch = textContent.match(/(\d+\.?\d*)\s*점/);
      if (fallbackMatch) totalScore = Math.round(parseFloat(fallbackMatch[1]));
    }

    // 2. HTML 내 '[***] 궁합설명' 영역의 텍스트 직접 추출
    let apiDescription = '';
    $('td, div, p').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt.includes('궁합설명')) {
        const nextText = $(el).next().text().trim();
        if (nextText) apiDescription = nextText;
      }
    });

    // 3. Supabase DB에서 사용자의 totalScore가 포함된 구간(min_score ~ max_score)의 템플릿 조회
    let { data: templateData, error: dbError } = await supabase
      .from('couple_guide_results')
      .select('*')
      .lte('min_score', totalScore)
      .gte('max_score', totalScore)
      .maybeSingle();

    // 혹시 범위를 딱 맞추지 못했을 때를 대비한 안전장치 (가장 가까운 점수대 가져오기)
    if (!templateData) {
      const fallback = await supabase
        .from('couple_guide_results')
        .select('*')
        .lte('min_score', totalScore)
        .order('min_score', { ascending: false })
        .limit(1)
        .maybeSingle();
      templateData = fallback.data;
    }

    console.log(`=== [${requestId}] 점수: ${totalScore}, 매칭된 타이틀: ${templateData?.relationship_title}, max_score: ${templateData?.max_score} ===`);

    const title = templateData?.relationship_title || '조화로운 인연';
    // API에서 크롤링한 설명이 있으면 우선 사용, 없으면 DB 템플릿, 그것도 없으면 기본값
    const subtitle = apiDescription || templateData?.relationship_subtitle || '서로를 알아가는 소중한 단계';

    const resultId = crypto.randomUUID();
    const finalResult = {
      success: true,
      resultId,
      result: {
        resultId,
        totalScore, 
        rawScore: `${totalScore}점`,
        description: subtitle, 
        relationshipTitle: title,
        relationshipSubtitle: subtitle,
        maxScore: templateData?.max_score ?? 100,
        hashtags: templateData?.hashtags || ['#천생연분', '#궁합완벽'],
        chemiStats: [
          { label: '텔레파시 지수', value: templateData?.telepathy_score ?? totalScore, caption: '말하지 않아도 마음이 통하는 정도입니다.' },
          { label: '티격태격 지수', value: templateData?.conflict_score ?? 30, caption: '의견 충돌을 통해 서로를 맞춰가는 에너지입니다.' },
        ],
      },
      requestId
    };

    console.log(`=== [${requestId}] 결과 처리 완료 (resultId: ${resultId}, score: ${totalScore}) ===`);
    return jsonResponse(req, finalResult);

  } catch (err) {
    console.error(`[${requestId}] analyze-couple-guide 오류`, err);
    return errorResponse(req, err instanceof Error ? err.message : 'Internal Server Error', 500);
  }
});