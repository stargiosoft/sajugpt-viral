import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  name: string;
  birthday: string;       // YYYY-MM-DD
  birthTime: string;      // "오전 HH:MM" | "오후 HH:MM" | "모름"
  gender: 'female' | 'male';
  calendarType: 'solar' | 'lunar';
}

type ElementKey = '木' | '火' | '土' | '金' | '水';
type Band = 'high' | 'mid' | 'low';

interface Diagnosis {
  title: string;
  description: string;
}

interface Boost {
  routine: string;
  luckyItem: string;
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

const ELEMENT_ORDER: ElementKey[] = ['木', '火', '土', '金', '水'];

const ELEMENT_NAME: Record<ElementKey, string> = {
  木: '목(木)', 火: '화(火)', 土: '토(土)', 金: '금(金)', 水: '수(水)',
};

// 대표 오행의 수호동물 (히어로 일러스트에 사용)
const ELEMENT_ANIMAL: Record<ElementKey, string> = {
  木: '토끼', 火: '여우', 土: '곰', 金: '호랑이', 水: '거북이',
};

// 대표 오행 진단: 오행 × 비중 구간(강함 45%+ / 우세 30~44% / 보통 <30%)
const DIAGNOSIS: Record<ElementKey, Record<Band, Diagnosis>> = {
  木: {
    high: { title: '확장 본능 폭주 리더', description: '새로운 걸 벌이는 데 거침이 없지만, 속도가 너무 빨라 주변이 못 따라올 때가 많습니다.' },
    mid: { title: '성장형 크리에이터', description: '아이디어와 실행력을 동시에 갖춘 타입. 한번 꽂히면 끝까지 밀어붙이는 편입니다.' },
    low: { title: '잔잔한 새싹 마인드', description: '느리지만 꾸준하게 자라는 편. 무리한 확장보다 안정적인 성장을 선호합니다.' },
  },
  火: {
    high: { title: '열정 과다 도파민 리더', description: '추진력과 리더십이 뛰어나지만, 마음이 앞서 가끔 번아웃에 빠지기 쉽습니다.' },
    mid: { title: '뜨거운 실행력 파이터', description: '결정한 건 바로 행동으로 옮기는 타입. 넘치는 에너지가 주변까지 덩달아 뜨겁게 만듭니다.' },
    low: { title: '은은하게 타오르는 감성러', description: '화려하진 않아도 꾸준히 표현하는 편. 필요한 순간엔 확실하게 열정을 드러냅니다.' },
  },
  土: {
    high: { title: '책임감 과부하 살림꾼', description: '모든 걸 떠안고 챙기는 타입이라 주변이 많이 의지하지만, 정작 본인은 쉴 틈이 없습니다.' },
    mid: { title: '믿음직한 안정형 리더', description: '약속과 신뢰를 최우선으로 여기는 편. 흔들리는 상황에서 중심을 잡아주는 존재입니다.' },
    low: { title: '은근한 중재자', description: '튀지 않아도 묵묵히 균형을 맞추는 편. 갈등 상황에서 조용히 중재자 역할을 합니다.' },
  },
  金: {
    high: { title: '완벽주의 스틸 메탈', description: '기준이 확실하고 맺고 끊는 게 분명하지만, 스스로에게도 남에게도 엄격해 쉽게 지칠 때가 있습니다.' },
    mid: { title: '칼같은 원칙주의자', description: '규칙과 논리를 중시하는 타입. 결단력이 필요한 순간에 가장 빛을 발합니다.' },
    low: { title: '차분한 판단러', description: '감정에 휘둘리지 않고 담담하게 상황을 정리하는 편입니다.' },
  },
  水: {
    high: { title: '고요한 심층 몰입러', description: '생각이 깊고 신중하지만, 너무 많은 걸 혼자 고민하다 타이밍을 놓치기도 합니다.' },
    mid: { title: '유연한 공감형 전략가', description: '상황에 맞춰 유연하게 움직이는 타입. 상대의 마음을 잘 읽어 관계를 부드럽게 풀어갑니다.' },
    low: { title: '잔잔한 관찰자', description: '나서지 않아도 흐름을 놓치지 않는 편. 필요할 때 정확한 한마디를 던집니다.' },
  },
};

// 부족한 오행 기준 맞춤 처방 (기운 보완)
const BOOST: Record<ElementKey, Boost> = {
  木: { routine: '가벼운 산책과 화분 가꾸기', luckyItem: '그린 톤 소품' },
  火: { routine: '매콤한 음식과 활동적인 취미', luckyItem: '레드 톤 아이템' },
  土: { routine: '규칙적인 식사와 낮잠', luckyItem: '옐로우 톤 소품' },
  金: { routine: '책상 정리와 명상', luckyItem: '화이트·실버 액세서리' },
  水: { routine: '반신욕과 따뜻한 차 마시기', luckyItem: '네이비 톤 옷' },
};

function getBand(ratio: number): Band {
  if (ratio >= 45) return 'high';
  if (ratio >= 30) return 'mid';
  return 'low';
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

    // ─── 발달오행에서 대표(최댓값)/부족(최솟값) 오행 찾기 ─────
    const ohaeng = (sajuData['발달오행'] as Record<string, number> | undefined) ?? {};
    let dominant: ElementKey = ELEMENT_ORDER[0];
    let dominantRatio = -Infinity;
    let weak: ElementKey = ELEMENT_ORDER[0];
    let weakRatio = Infinity;
    for (const key of ELEMENT_ORDER) {
      const value = ohaeng[key] ?? 0;
      if (value > dominantRatio) {
        dominantRatio = value;
        dominant = key;
      }
      if (value < weakRatio) {
        weakRatio = value;
        weak = key;
      }
    }

    const distribution = ELEMENT_ORDER.reduce((acc, key) => {
      acc[key] = ohaeng[key] ?? 0;
      return acc;
    }, {} as Record<ElementKey, number>);

    const band = getBand(dominantRatio);
    const diagnosis = DIAGNOSIS[dominant][band];
    const boost = BOOST[weak];

    const resultPayload = {
      name: name || '당신',
      distribution,
      dominantElement: dominant,
      dominantElementName: ELEMENT_NAME[dominant],
      dominantRatio,
      weakElement: weak,
      weakElementName: ELEMENT_NAME[weak],
      weakRatio,
      animal: ELEMENT_ANIMAL[dominant],
      diagnosisTitle: diagnosis.title,
      diagnosisDescription: diagnosis.description,
      routine: boost.routine,
      luckyItem: boost.luckyItem,
    };

    // ─── 결과 저장 (공유 링크용) ─────────────────────────
    let resultId = crypto.randomUUID();
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: resultInsert } = await supabase
        .from('oheng_results')
        .insert({
          name: name || '당신',
          distribution,
          dominant_element: dominant,
          dominant_ratio: dominantRatio,
          weak_element: weak,
          weak_ratio: weakRatio,
          prescription: resultPayload,
        })
        .select('id')
        .maybeSingle();
      resultId = resultInsert?.id ?? resultId;
    } catch (err) {
      console.error('oheng_results 저장 실패 (공유 링크 없이 진행):', err);
    }

    return jsonResponse(req, {
      success: true,
      resultId,
      ...resultPayload,
    });
  } catch (err) {
    console.error('analyze-oheng-prescription 오류:', err);
    return errorResponse(req, '분석 중 오류가 발생했습니다.', 500);
  }
});
