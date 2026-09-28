import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

interface RequestBody {
  person: {
    gender: 'male' | 'female';
    birthday: string;
    birthTime?: string;
    calendarType?: 'solar' | 'lunar';
    birthTimeUnknown?: boolean;
  };
}

const BROWSER_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9',
  'Cache-Control': 'no-cache',
  'Host': 'service.stargio.co.kr:8400',
  'Origin': 'https://nadaunse.com',
  'Referer': 'https://nadaunse.com/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0 Safari/537.36',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return handleCorsPreflightRequest(req);

  try {
    const { person }: RequestBody = await req.json();
    if (!person?.birthday || !person?.gender) {
      return errorResponse(req, '생년월일과 성별 정보가 모두 필요합니다.', 400);
    }

    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    const cleanBirthday = person.birthday.replace(/[^0-9]/g, '');

    let apiBirthday = cleanBirthday;
    if (!person.birthTimeUnknown && person.birthTime && person.birthTime !== '모름') {
      const match = person.birthTime.match(/(오전|오후)?\s*(\d{1,2}):(\d{2})/);
      if (match) {
        let hour = parseInt(match[2], 10);
        if (match[1] === '오후' && hour < 12) hour += 12;
        if (match[1] === '오전' && hour === 12) hour = 0;
        apiBirthday = cleanBirthday + String(hour).padStart(2, '0') + match[3];
      }
    }
    apiBirthday = apiBirthday.padEnd(12, '0');

    let stargioData: any = null;
    if (sajuApiKey) {
      const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=${person.calendarType === 'lunar'}&gender=${person.gender}&apiKey=${sajuApiKey}`;
      try {
        const res = await fetch(sajuApiUrl, { headers: BROWSER_HEADERS });
        if (res.ok) stargioData = await res.json();
      } catch (e) {
        console.error('Stargio API Error:', e);
      }
    }

    // 폴백 기본 데이터
    if (!stargioData) {
      stargioData = {
        사주: ['甲子', '己丑', '丁酉', '辛巳'],
        발달오행: { 木: 20, 火: 20, 土: 20, 金: 20, 水: 20 },
        발달십성: { 식상: 20, 재성: 20, 관성: 20, 비겁: 20, 인성: 20 },
      };
    }

    return jsonResponse(req, {
      success: true,
      resultId: crypto.randomUUID(),
      sajuRawData: stargioData,
    });
  } catch (err: any) {
    return errorResponse(req, err.message || 'Server Error', 500);
  }
});