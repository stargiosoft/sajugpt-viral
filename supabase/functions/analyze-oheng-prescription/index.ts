import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  name: string;
  birthday: string;       // YYYY-MM-DD
  birthTime: string;      // "오전 HH:MM" | "오후 HH:MM" | "모름"
  gender: 'female' | 'male';
  calendarType: 'solar' | 'lunar';
}

type ElementKey = '木' | '火' | '土' | '金' | '水';

interface ElementPrescription {
  key: ElementKey;
  name: string;
  animal: string;
  taste: string;
  food: string;
  color: string;
  colorHex: string;
  narration: string;
}

// ─── 상수 ───────────────────────────────────────────────
const EXCLUDE_KEYS = new Set([
  '월운보기', '본사주', '대운', '대운순서',
  '대운시작나이', '대운순서십이운성', '대운순서십성', '용신설명',
]);

const BROWSER_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Host': 'service.stargio.co.kr:8400',
  'Origin': 'https://nadaunse.com',
  'Referer': 'https://nadaunse.com/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

const PRESCRIPTIONS: Record<ElementKey, ElementPrescription> = {
  '木': {
    key: '木', name: '목(木)', animal: '토끼', taste: '신맛', food: '레몬·초록 채소',
    color: '초록', colorHex: '#4C8C4A',
    narration: '뻗어나가는 나무의 기운이 부족한 사주로다. 신맛과 푸른빛으로 지친 마음에 새싹을 틔우시게.',
  },
  '火': {
    key: '火', name: '화(火)', animal: '여우', taste: '쓴맛', food: '커피·매운 음식',
    color: '빨강', colorHex: '#C4432B',
    narration: '타오르는 불의 기운이 부족한 사주로다. 쌉싸름한 맛과 붉은빛으로 식어버린 열정에 다시 불을 지피시게.',
  },
  '土': {
    key: '土', name: '토(土)', animal: '곰', taste: '단맛', food: '고구마·호박',
    color: '노랑', colorHex: '#C9992E',
    narration: '든든한 흙의 기운이 부족한 사주로다. 달콤한 맛과 노란빛으로 흔들리는 마음에 중심을 잡으시게.',
  },
  '金': {
    key: '金', name: '금(金)', animal: '호랑이', taste: '매운맛', food: '견과류·양파',
    color: '금빛', colorHex: '#B8860B',
    narration: '단단한 쇠의 기운이 부족한 사주로다. 매콤한 맛과 반짝이는 금빛으로 무뎌진 결단력을 벼리시게.',
  },
  '水': {
    key: '水', name: '수(水)', animal: '거북이', taste: '짠맛', food: '해조류·검은콩',
    color: '검푸른색', colorHex: '#2B3A67',
    narration: '깊은 물의 기운이 부족한 사주로다. 짭짤한 맛과 검푸른빛으로 메마른 마음을 적시시게.',
  },
};

const ELEMENT_ORDER: ElementKey[] = ['木', '火', '土', '金', '水'];

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { name, birthday, birthTime, gender, calendarType } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수입니다.', 400);
    }

    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) {
      return errorResponse(req, '서버 설정 오류: API 키 누락', 500);
    }

    // birthday "YYYY-MM-DD" → "YYYYMMDD" + 시간(HHMM)
    const cleanBirthday = birthday.replace(/-/g, '');
    let apiBirthday = cleanBirthday;
    if (birthTime && birthTime !== '모름') {
      const match = birthTime.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
      if (match) {
        let hour = parseInt(match[2]);
        if (match[1] === '오후' && hour < 12) hour += 12;
        if (match[1] === '오전' && hour === 12) hour = 0;
        apiBirthday = cleanBirthday + String(hour).padStart(2, '0') + match[3];
      }
    }
    if (apiBirthday.length < 12) {
      apiBirthday = apiBirthday.padEnd(12, '0');
    }

    const isLunar = calendarType === 'lunar';
    const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=${isLunar}&gender=${gender}&apiKey=${sajuApiKey}`;

    let sajuData: Record<string, unknown> | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const sajuResponse = await fetch(sajuApiUrl, { method: 'GET', headers: BROWSER_HEADERS });
        if (!sajuResponse.ok) throw new Error(`HTTP ${sajuResponse.status}`);
        const parsed = await sajuResponse.json();
        if (parsed && Object.keys(parsed).length > 0) {
          sajuData = parsed;
          break;
        }
      } catch (err) {
        console.error(`사주 API 시도 ${attempt}/3 실패:`, err instanceof Error ? err.message : err);
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }

    if (!sajuData) {
      return errorResponse(req, '사주 데이터를 가져올 수 없습니다.', 502);
    }

    for (const key of EXCLUDE_KEYS) {
      delete sajuData[key];
    }

    // ─── 발달오행에서 가장 약한 원소 찾기 ─────────────────
    const ohaeng = (sajuData['발달오행'] as Record<string, number> | undefined) ?? {};
    let weakest: ElementKey = ELEMENT_ORDER[0];
    let weakestValue = Infinity;
    for (const key of ELEMENT_ORDER) {
      const value = ohaeng[key] ?? 0;
      if (value < weakestValue) {
        weakestValue = value;
        weakest = key;
      }
    }

    const prescription = PRESCRIPTIONS[weakest];
    const distribution = ELEMENT_ORDER.reduce((acc, key) => {
      acc[key] = ohaeng[key] ?? 0;
      return acc;
    }, {} as Record<ElementKey, number>);

    return jsonResponse(req, {
      success: true,
      name: name || '당신',
      element: prescription.name,
      elementRatio: weakestValue,
      animal: prescription.animal,
      taste: prescription.taste,
      food: prescription.food,
      color: prescription.color,
      colorHex: prescription.colorHex,
      narration: prescription.narration,
      distribution,
    });
  } catch (err) {
    console.error('analyze-oheng-prescription 오류:', err);
    return errorResponse(req, '분석 중 오류가 발생했습니다.', 500);
  }
});
