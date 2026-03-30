import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  birthday: string;
  birthTime: string;
  gender: 'female' | 'male';
  calendarType: 'solar' | 'lunar';
  utmSource?: string;
  utmMedium?: string;
}

interface SajuIndicators {
  ilgan: string;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  pyeonGwan: number;
  sangGwan: number;
  sikSin: number;
  fireRatio: number;
  gwansung: number;
  siksang: number;
  bigyeon: number;
  insung: number;
  jasung: number;
}

interface CharacterRecommendation {
  characterId: string;
  characterName: string;
  archetype: string;
  compatibility: number;
  firstImpression: string;
  successRate: number;
  imagePath: string;
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

// ─── 캐릭터 데이팅 프로필 ─────────────────────────────────
interface DatingCharacter {
  id: string;
  name: string;
  archetype: string;
  thumbnail: string;
  compatibilityBase: number;
  compatibilityRules: Array<{ condition: (s: SajuIndicators) => boolean; bonus: number }>;
  defaultFirstImpression: string;
  conditionalFirstImpressions: Array<{ condition: (s: SajuIndicators) => boolean; line: string }>;
}

const DATING_CHARACTERS: DatingCharacter[] = [
  {
    id: 'yoon-taesan',
    name: '윤태산',
    archetype: '야수형 짐승남',
    thumbnail: '/characters/yoon-taesan.webp',
    compatibilityBase: 30,
    compatibilityRules: [
      { condition: (s) => s.doHwaSal, bonus: 25 },
      { condition: (s) => s.hongYeomSal, bonus: 15 },
      { condition: (s) => s.siksang >= 25, bonus: 15 },
      { condition: (s) => s.fireRatio >= 30, bonus: 15 },
    ],
    defaultFirstImpression: '흥. 재미있는 사주네. 나한테 도전하겠다고?',
    conditionalFirstImpressions: [
      { condition: (s) => s.doHwaSal, line: '네 사주에서 도화살 냄새가 나는데? ...조금 기대해볼게.' },
      { condition: (s) => s.hongYeomSal, line: '홍염살이라... 대담한 건 마음에 들어.' },
      { condition: (s) => s.fireRatio >= 30, line: '화기가 센 사주군. 불꽃놀이가 되려나.' },
    ],
  },
  {
    id: 'do-haegyeol',
    name: '도해결',
    archetype: '지적 엘리트 심리분석가',
    thumbnail: '/characters/do-haegyeol.webp',
    compatibilityBase: 35,
    compatibilityRules: [
      { condition: (s) => s.insung >= 25, bonus: 20 },
      { condition: (s) => s.gwansung >= 25, bonus: 20 },
      { condition: (s) => s.pyeonGwan >= 2, bonus: 15 },
      { condition: (s) => s.bigyeon <= 20, bonus: 10 },
    ],
    defaultFirstImpression: '데이터를 보면 당신의 성공 확률은... 글쎄요.',
    conditionalFirstImpressions: [
      { condition: (s) => s.insung >= 25, line: '인성이 강하군요. 대화가 통할 수도 있겠어요.' },
      { condition: (s) => s.gwansung >= 25, line: '관성이 발달했네요. 제 기준에 부합할지 봅시다.' },
    ],
  },
  {
    id: 'seo-hwiyoon',
    name: '서휘윤',
    archetype: '치유형 연하남',
    thumbnail: '/characters/seo-hwiyoon.webp',
    compatibilityBase: 40,
    compatibilityRules: [
      { condition: (s) => s.jasung >= 25, bonus: 20 },
      { condition: (s) => s.sikSin >= 2, bonus: 15 },
      { condition: (s) => s.sangGwan >= 1, bonus: 15 },
      { condition: (s) => s.fireRatio <= 20, bonus: 10 },
    ],
    defaultFirstImpression: '안녕하세요! 사주 보니까 되게 따뜻한 사람일 것 같아요.',
    conditionalFirstImpressions: [
      { condition: (s) => s.sikSin >= 2, line: '식신이 강하시네요! 맛집 얘기 좋아하시죠? 저도요!' },
      { condition: (s) => s.jasung >= 25, line: '재성이 좋으시네요. 뭔가 든든한 느낌이 들어요.' },
    ],
  },
  {
    id: 'gi-jimun',
    name: '기지문',
    archetype: '무뚝뚝 경호원형',
    thumbnail: '/characters/gi-jimun.webp',
    compatibilityBase: 35,
    compatibilityRules: [
      { condition: (s) => s.bigyeon >= 30, bonus: 20 },
      { condition: (s) => s.gwansung >= 20, bonus: 15 },
      { condition: (s) => s.doHwaSal, bonus: 15 },
      { condition: (s) => s.insung <= 15, bonus: 15 },
    ],
    defaultFirstImpression: '...말은 적게 하겠습니다. 행동으로 보여주세요.',
    conditionalFirstImpressions: [
      { condition: (s) => s.bigyeon >= 30, line: '비겁이 강하군. 고집이 세겠지만... 싫지 않아.' },
      { condition: (s) => s.doHwaSal, line: '도화살... 위험한 기운이야. 내가 지켜야 하나.' },
    ],
  },
  {
    id: 'choi-seolgye',
    name: '최설계',
    archetype: '도시형 전략가',
    thumbnail: '/characters/choi-seolgye.webp',
    compatibilityBase: 30,
    compatibilityRules: [
      { condition: (s) => s.jasung >= 30, bonus: 25 },
      { condition: (s) => s.insung >= 20, bonus: 15 },
      { condition: (s) => s.sangGwan >= 2, bonus: 15 },
      { condition: (s) => s.fireRatio >= 25, bonus: 15 },
    ],
    defaultFirstImpression: '당신의 사주를 분석해봤는데, 꽤 흥미로운 포트폴리오군요.',
    conditionalFirstImpressions: [
      { condition: (s) => s.jasung >= 30, line: '재성이 이 정도면... 투자 가치가 있어 보이네요.' },
      { condition: (s) => s.sangGwan >= 2, line: '상관이 강하군요. 예측 불가능한 타입... 제 취향이에요.' },
    ],
  },
];

// ─── 일간 매핑 ───────────────────────────────────────────
const ILGAN_MAP: Record<string, { name: string; description: string }> = {
  '甲': { name: '갑목', description: '갑목일간 — 곧고 강한 리더십, 자존심이 높고 직진형' },
  '乙': { name: '을목', description: '을목일간 — 유연하고 적응력이 뛰어나지만 돌려 말하는 경향' },
  '丙': { name: '병화', description: '병화일간 — 태양처럼 밝고 열정적, 직진형 어필' },
  '丁': { name: '정화', description: '정화일간 — 촛불처럼 따뜻하고 섬세, 은밀한 로맨티스트' },
  '戊': { name: '무토', description: '무토일간 — 산처럼 듬직하고 포용력 넓지만 슬로우 스타터' },
  '己': { name: '기토', description: '기토일간 — 정원처럼 섬세하고 잘 가꾸지만 걱정이 많음' },
  '庚': { name: '경금', description: '경금일간 — 바위처럼 단단하고 결단력, 원칙주의자' },
  '辛': { name: '신금', description: '신금일간 — 보석처럼 예민하고 완벽주의, 감각파' },
  '壬': { name: '임수', description: '임수일간 — 바다처럼 깊고 넓으며 자유로운 영혼' },
  '癸': { name: '계수', description: '계수일간 — 비처럼 조용하고 직관적, 감성 폭발형' },
};

// ─── 유틸 함수 ───────────────────────────────────────────
function countSipsung(sipsung: string[][], target: string): number {
  return sipsung.flat().filter(s => s === target).length;
}

function extractSajuIndicators(sajuData: Record<string, unknown>): SajuIndicators {
  const sinsal12 = String(sajuData['12신살'] || '');
  const gitaSinsal = String(sajuData['기타신살'] || '');
  const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
  const baldal = (sajuData['발달십성'] as Record<string, number> | undefined) ?? {};
  const ohaeng = (sajuData['발달오행'] as Record<string, number> | undefined) ?? {};

  // 일간 추출
  const cheongan = sajuData['천간'] as string[] | undefined;
  const ilganChar = cheongan?.[2] ?? ''; // 일주 천간

  return {
    ilgan: ILGAN_MAP[ilganChar]?.name ?? '갑목',
    doHwaSal: sinsal12.includes('도화'),
    hongYeomSal: gitaSinsal.includes('홍염'),
    pyeonGwan: countSipsung(sipsung, '편관'),
    sangGwan: countSipsung(sipsung, '상관'),
    sikSin: countSipsung(sipsung, '식신'),
    fireRatio: ohaeng['火'] ?? 0,
    gwansung: baldal['관성'] ?? 0,
    siksang: baldal['식상'] ?? 0,
    bigyeon: baldal['비겁'] ?? 0,
    insung: baldal['인성'] ?? 0,
    jasung: baldal['재성'] ?? 0,
  };
}

function calculateCompatibility(char: DatingCharacter, saju: SajuIndicators): number {
  let score = char.compatibilityBase;
  for (const rule of char.compatibilityRules) {
    if (rule.condition(saju)) score += rule.bonus;
  }
  return Math.min(100, score);
}

function getFirstImpression(char: DatingCharacter, saju: SajuIndicators): string {
  for (const ci of char.conditionalFirstImpressions) {
    if (ci.condition(saju)) return ci.line;
  }
  return char.defaultFirstImpression;
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, birthTime, gender, calendarType, utmSource, utmMedium } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수입니다.', 400);
    }

    // ─── 1. Stargio API 호출 ──────────────────────────
    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) {
      return errorResponse(req, '서버 설정 오류: API 키 누락', 500);
    }

    // birthday를 API 형식으로 변환: "YYYY-MM-DD" → "YYYYMMDD" + 시간
    const cleanBirthday = birthday.replace(/-/g, '');
    let apiBirthday = cleanBirthday;

    // birthTime 파싱: "오전 HH:MM" | "오후 HH:MM" | "모름"
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

    // excludeKeys 경량화
    for (const key of EXCLUDE_KEYS) {
      delete sajuData[key];
    }

    // ─── 2. 사주 지표 추출 ────────────────────────────
    const indicators = extractSajuIndicators(sajuData);
    const ilganInfo = ILGAN_MAP[
      ((sajuData['천간'] as string[]) ?? [])[2] ?? ''
    ] ?? { name: '갑목', description: '갑목일간 — 곧고 강한 리더십' };

    // ─── 3. 궁합 점수 계산 + 상위 3명 추천 ─────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 캐릭터별 성공률 조회
    const { data: successRates } = await supabase
      .from('dating_results')
      .select('character_id')
      .eq('status', 'completed');

    const rateMap: Record<string, { total: number; success: number }> = {};
    if (successRates) {
      // 전체 completed 결과를 가져와서 성공률 계산 (집계)
      const { data: allResults } = await supabase
        .from('dating_results')
        .select('character_id, success')
        .eq('status', 'completed');

      if (allResults) {
        for (const r of allResults) {
          const cid = r.character_id as string;
          if (!rateMap[cid]) rateMap[cid] = { total: 0, success: 0 };
          rateMap[cid].total++;
          if (r.success) rateMap[cid].success++;
        }
      }
    }

    // 기본 성공률 (데이터 없을 때)
    const DEFAULT_SUCCESS_RATES: Record<string, number> = {
      'yoon-taesan': 12,
      'do-haegyeol': 18,
      'seo-hwiyoon': 28,
      'gi-jimun': 20,
      'choi-seolgye': 15,
    };

    const recommendations: CharacterRecommendation[] = DATING_CHARACTERS
      .map(char => {
        const compatibility = calculateCompatibility(char, indicators);
        const rate = rateMap[char.id];
        const successRate = rate && rate.total >= 10
          ? Math.round((rate.success / rate.total) * 100)
          : DEFAULT_SUCCESS_RATES[char.id] ?? 15;

        return {
          characterId: char.id,
          characterName: char.name,
          archetype: char.archetype,
          compatibility,
          firstImpression: getFirstImpression(char, indicators),
          successRate,
          imagePath: char.thumbnail,
        };
      })
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 3);

    // ─── 4. DB 레코드 생성 ────────────────────────────
    const { data: record, error: insertError } = await supabase
      .from('dating_results')
      .insert({
        birthday,
        birth_time: birthTime,
        gender,
        calendar_type: calendarType,
        ilgan: indicators.ilgan,
        saju_indicators: indicators,
        recommendations,
        status: 'analyzing',
        utm_source: utmSource ?? null,
        utm_medium: utmMedium ?? null,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('DB 저장 실패:', insertError);
      return errorResponse(req, 'DB 저장 실패', 500);
    }

    // ─── 5. 응답 ──────────────────────────────────────
    return jsonResponse(req, {
      resultId: record.id,
      sajuIndicators: indicators,
      ilgan: indicators.ilgan,
      ilganDescription: ilganInfo.description,
      recommendations,
    });

  } catch (err) {
    console.error('analyze-dating-sim 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
