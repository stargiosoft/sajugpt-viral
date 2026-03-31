import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  birthday: string;       // YYYYMMDDHHMM
  gender: 'female' | 'male';
  birthTimeUnknown?: boolean;
}

interface CourtSajuHighlights {
  pyeonInCount: number;
  jeongInCount: number;
  sangGwanCount: number;
  sikSinCount: number;
  biGyeonCount: number;
  geobJaeCount: number;
  pyeonGwanCount: number;
  jeongGwanCount: number;
  jeongJaeCount: number;
  pyeonJaeCount: number;
  insung: number;
  gwansung: number;
  siksang: number;
  bigyeob: number;
  jasung: number;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  doHwaChung: boolean;
  yeonaeSeongHyang: string;
  ilJuKey: string;
}

type CrimeId =
  | 'unrequited_3years'
  | 'never_confessed'
  | 'solo_breakup'
  | 'self_deprecation'
  | 'pretend_ok_after_ghosted'
  | 'always_friendzoned'
  | 'mirror_sigh'
  | 'comparison_envy'
  | 'drunk_confession_deleted'
  | 'phone_checking';

interface CrimeMapping {
  id: CrimeId;
  label: string;
  prosecutorLine: string;
  defenderLine: string;
  releaseCondition: string;
  check: (h: CourtSajuHighlights) => number;
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

// ─── 십성 카운트 ─────────────────────────────────────────
function countSipsung(sipsung: string[][], target: string): number {
  return sipsung.flat().filter(s => s === target).length;
}

// ─── 사주 하이라이트 추출 ─────────────────────────────────
function extractHighlights(sajuData: Record<string, unknown>): CourtSajuHighlights {
  const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
  const baldal = (sajuData['발달십성'] as Record<string, number> | undefined) ?? {};
  const sinsal12 = String(sajuData['12신살'] || '');
  const gitaSinsal = String(sajuData['기타신살'] || '');
  const ilJuRon = sajuData['일주론'] as Record<string, string> | undefined;
  const cheongan = (sajuData['천간'] as string[] | undefined) ?? [];
  const jiji = (sajuData['지지'] as string[] | undefined) ?? [];

  const doHwaSal = sinsal12.includes('도화');
  // 도화 충 판별: 12신살에 도화와 충이 동시 존재
  const doHwaChung = doHwaSal && (sinsal12.includes('충') || gitaSinsal.includes('충'));

  return {
    pyeonInCount: countSipsung(sipsung, '편인'),
    jeongInCount: countSipsung(sipsung, '정인'),
    sangGwanCount: countSipsung(sipsung, '상관'),
    sikSinCount: countSipsung(sipsung, '식신'),
    biGyeonCount: countSipsung(sipsung, '비견'),
    geobJaeCount: countSipsung(sipsung, '겁재'),
    pyeonGwanCount: countSipsung(sipsung, '편관'),
    jeongGwanCount: countSipsung(sipsung, '정관'),
    jeongJaeCount: countSipsung(sipsung, '정재'),
    pyeonJaeCount: countSipsung(sipsung, '편재'),
    insung: baldal['인성'] ?? 0,
    gwansung: baldal['관성'] ?? 0,
    siksang: baldal['식상'] ?? 0,
    bigyeob: baldal['비겁'] ?? 0,
    jasung: baldal['재성'] ?? 0,
    doHwaSal,
    hongYeomSal: gitaSinsal.includes('홍염'),
    doHwaChung,
    yeonaeSeongHyang: ilJuRon?.['연애성향'] ?? '',
    ilJuKey: (cheongan[2] ?? '') + (jiji[2] ?? ''),
  };
}

// ─── 죄목 배정 ───────────────────────────────────────────
const CRIME_MAPPINGS: CrimeMapping[] = [
  {
    id: 'unrequited_3years',
    label: '짝사랑만 3년 죄',
    prosecutorLine: '3년이면 사랑이 아니라 습관입니다.',
    defenderLine: '3년을 버틴 건 습관이 아니라 진심입니다.',
    releaseCondition: '"나 같은 게"라고 하지 말 것. 이를 어길 시 추가 기소.',
    check: (h) => {
      let s = 0;
      if (h.pyeonInCount >= 2) s += 3; else if (h.pyeonInCount >= 1) s += 1;
      if (h.insung >= 25) s += 1;
      if (h.jeongGwanCount === 0 && h.gwansung < 15) s += 1;
      return s;
    },
  },
  {
    id: 'never_confessed',
    label: '좋아한다는 말 못 한 죄',
    prosecutorLine: '고백 안 한 건 배려가 아니라 도망입니다.',
    defenderLine: '도망이 아닙니다. 그 사람의 일상을 지키고 싶었던 겁니다.',
    releaseCondition: '다음 기회에는 3초 안에 말할 것. 또 도망치면 가중처벌.',
    check: (h) => {
      let s = 0;
      if (h.pyeonInCount >= 1) s += 2;
      if (h.biGyeonCount >= 2) s += 2; else if (h.biGyeonCount >= 1) s += 1;
      if (h.bigyeob >= 25) s += 1;
      return s;
    },
  },
  {
    id: 'solo_breakup',
    label: '혼자 이별한 죄',
    prosecutorLine: '시작도 전에 끝내놓고 상처받지 마세요.',
    defenderLine: '시작 전에 끝낸 건 상대를 아꼈기 때문입니다.',
    releaseCondition: '시작하기 전에 끝내지 말 것. 시작은 상대방도 할 권리가 있음.',
    check: (h) => {
      let s = 0;
      if (h.sangGwanCount >= 2) s += 3; else if (h.sangGwanCount >= 1) s += 1;
      if (h.siksang >= 25) s += 1;
      if (h.jeongGwanCount === 0) s += 1;
      return s;
    },
  },
  {
    id: 'self_deprecation',
    label: '"나 같은 게 뭐" 죄',
    prosecutorLine: '못생겨서 못 만나는 거 아닙니다. 못생겼다고 믿어서 못 만나는 겁니다.',
    defenderLine: '그 믿음을 만든 건 피고인이 아닙니다. 세상이 심어놓은 겁니다.',
    releaseCondition: '거울 대신 사주를 볼 것. 거울은 겉만 보여주지만 사주는 전부를 봄.',
    check: (h) => {
      let s = 0;
      if (h.pyeonInCount >= 1 && h.sangGwanCount >= 1) s += 3;
      if (h.pyeonInCount >= 2) s += 1;
      if (h.sangGwanCount >= 2) s += 1;
      return s;
    },
  },
  {
    id: 'pretend_ok_after_ghosted',
    label: '읽씹당하고 괜찮은 척한 죄',
    prosecutorLine: '괜찮은 척이 제일 안 괜찮은 겁니다.',
    defenderLine: '괜찮은 척이라도 해야 버틸 수 있었던 겁니다.',
    releaseCondition: '괜찮지 않으면 괜찮지 않다고 말할 것. 침묵은 동의가 아님.',
    check: (h) => {
      let s = 0;
      if (h.biGyeonCount >= 2) s += 2; else if (h.biGyeonCount >= 1) s += 1;
      if (h.bigyeob >= 25) s += 1;
      if (h.jeongJaeCount === 0 && h.jasung < 15) s += 2;
      return s;
    },
  },
  {
    id: 'always_friendzoned',
    label: '맨날 친구로만 남은 죄',
    prosecutorLine: '좋은 사람 연기만 해서 친구가 된 겁니다.',
    defenderLine: '좋은 사람이 아니라 진짜 좋은 사람이었던 겁니다.',
    releaseCondition: '좋은 사람 그만하고 좋아하는 사람이 될 것. 착함은 전략이 아님.',
    check: (h) => {
      let s = 0;
      if (h.sikSinCount >= 2) s += 3; else if (h.sikSinCount >= 1) s += 1;
      if (h.siksang >= 25) s += 1;
      if (h.pyeonGwanCount === 0 && h.gwansung < 15) s += 1;
      return s;
    },
  },
  {
    id: 'mirror_sigh',
    label: '거울 보고 한숨 쉰 죄',
    prosecutorLine: '당신보다 못생긴 사람도 지금 연애하고 있습니다.',
    defenderLine: '거울이 보여주지 못하는 매력이 사주에는 있습니다.',
    releaseCondition: '한숨 대신 사주를 볼 것. 당신의 매력은 거울 밖에 있음.',
    check: (h) => {
      let s = 0;
      if (h.sangGwanCount >= 2) s += 2; else if (h.sangGwanCount >= 1) s += 1;
      if (h.siksang >= 30) s += 1;
      if (h.doHwaSal && h.doHwaChung) s += 2; else if (h.doHwaSal) s += 1;
      return s;
    },
  },
  {
    id: 'comparison_envy',
    label: '"쟤는 원래 이쁘니까" 죄',
    prosecutorLine: '그 사람도 거울 앞에서 한숨 쉽니다.',
    defenderLine: '비교한 건 눈이지, 마음이 아닙니다.',
    releaseCondition: '비교를 멈출 것. 당신의 사주에는 당신만의 매력이 있음.',
    check: (h) => {
      let s = 0;
      if (h.geobJaeCount >= 2) s += 2; else if (h.geobJaeCount >= 1) s += 1;
      if (h.bigyeob >= 25) s += 1;
      if (h.pyeonInCount >= 1) s += 2;
      return s;
    },
  },
  {
    id: 'drunk_confession_deleted',
    label: '취중고백 후 기억 삭제한 죄',
    prosecutorLine: '술이 한 말도 진심이었습니다.',
    defenderLine: '진심을 말하려면 술이 필요했던 거, 그게 용기입니다.',
    releaseCondition: '다음엔 맨정신에 말할 것. 술 없이도 용기는 나옴.',
    check: (h) => {
      let s = 0;
      if (h.sikSinCount >= 1) s += 1;
      if (h.doHwaSal) s += 2;
      if (h.pyeonJaeCount >= 1) s += 2;
      return s;
    },
  },
  {
    id: 'phone_checking',
    label: '연락 올까봐 폰만 본 죄',
    prosecutorLine: '그 사람도 지금 폰 보고 있을 수도 있습니다.',
    defenderLine: '기다린다는 건, 아직 포기 안 했다는 뜻입니다.',
    releaseCondition: '기다리지 말고 먼저 보낼 것. 상대방도 기다리고 있을 수 있음.',
    check: (h) => {
      let s = 0;
      if (h.jeongInCount >= 2) s += 3; else if (h.jeongInCount >= 1) s += 1;
      if (h.insung >= 25) s += 1;
      if (h.pyeonGwanCount >= 1 && h.gwansung < 20) s += 1;
      return s;
    },
  },
];

function determineCrime(h: CourtSajuHighlights): CrimeMapping {
  let best = CRIME_MAPPINGS[3]; // fallback: 나같은게뭐
  let bestScore = -1;

  for (const crime of CRIME_MAPPINGS) {
    const score = crime.check(h);
    if (score > bestScore) {
      bestScore = score;
      best = crime;
    }
  }

  return best;
}

// ─── 매력 점수 ───────────────────────────────────────────
function calculateCharmScore(h: CourtSajuHighlights): number {
  let score = 0;

  // 도화살 + 홍염살
  if (h.doHwaSal && h.hongYeomSal) score += 3;
  else if (h.doHwaSal || h.hongYeomSal) score += 2;

  // 정관/정인 동주 — 진심 낭비
  if (h.jeongGwanCount >= 1 && h.jeongInCount >= 1) score += 2;

  // 식신 보유 — 감성 낭비
  if (h.sikSinCount >= 1) score += 1;

  // 편관격 — 카리스마 낭비
  if (h.pyeonGwanCount >= 1 && h.gwansung >= 20) score += 1;

  return score; // 0~7
}

// ─── 형량 (기간 제외 — 기본형 + 매력가중만) ──────────────
function calculateBaseSentence(charmScore: number): number {
  const BASE = 1;
  let charmBonus = 0;
  if (charmScore >= 6) charmBonus = 5;
  else if (charmScore >= 4) charmBonus = 3;
  else if (charmScore >= 2) charmBonus = 2;
  else if (charmScore >= 1) charmBonus = 1;

  return BASE + charmBonus;
}

// ─── 석방 예정일 ─────────────────────────────────────────
function calculateReleaseDate(
  sentence: number,
  charmScore: number,
): { year: number; month: number } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const baseMonths = Math.ceil(sentence * 3);
  const charmReduction = Math.min(charmScore * 2, 12);
  let totalMonths = Math.max(baseMonths - charmReduction, 2);

  let releaseMonth = currentMonth + totalMonths;
  let releaseYear = currentYear + Math.floor((releaseMonth - 1) / 12);
  releaseMonth = ((releaseMonth - 1) % 12) + 1;

  return { year: releaseYear, month: releaseMonth };
}

// ─── Gemini 호출 ─────────────────────────────────────────
async function callGemini(prompt: string, fallback: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) {
    console.error('GOOGLE_API_KEY not set');
    return fallback;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return fallback;
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    // JSON 파싱 시도
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // JSON이 아니면 텍스트 그대로
      }
    }

    // 후처리
    text = text.replace(/^["'"]+|["'"]+$/g, '');
    text = text.replace(/[*#_`]/g, '');
    text = text.replace(/\n{2,}/g, ' ');
    text = text.trim();

    if (text.length < 10) return fallback;
    return text;
  } catch (err) {
    console.error('Gemini 호출 실패:', err);
    return fallback;
  }
}

// ─── Gemini: 검사 기소 발언 (1턴) ────────────────────────
async function generateProsecutorOpening(
  crimeLabel: string,
  h: CourtSajuHighlights,
): Promise<string> {
  const prompt = `당신은 사주 법정의 검사 윤태산입니다.
톤: 반말. 도발적이면서 유머러스. 피고인을 찌르되 상처가 아닌 뜨끔함을 줍니다.

[데이터]
죄목: ${crimeLabel}
도화살: ${h.doHwaSal ? '있음' : '없음'} / 홍염살: ${h.hongYeomSal ? '있음' : '없음'}
편인: ${h.pyeonInCount}개 / 상관: ${h.sangGwanCount}개 / 비견: ${h.biGyeonCount}개

[규칙 — 반드시 지킬 것]
1. 반드시 4줄 이내. 전체 150자 이내. 이 제한을 절대 초과하지 마세요.
2. "피고인"이라는 호칭 사용.
3. 사주 근거 1가지만 짧게 지적.
4. 마지막 줄은 반드시 "피고인, 좋아하는 사람 있죠?"로 끝낼 것.
5. 텍스트만 출력. 따옴표, 마크다운, JSON 금지.

[예시]
피고인, 질문하겠습니다.
사주에 편인이 ${h.pyeonInCount}개. 감정을 속으로만 삭이는 구조입니다.
좋아하면 말을 해야지, 혼자 끙끙대는 게 배려입니까.
피고인, 좋아하는 사람 있죠?`;

  const fallback = `피고인, 질문하겠습니다.\n사주 원국을 보니 감정을 밖으로 못 꺼내는 구조더군요.\n좋아하면 말을 해야지, 속으로만 삭이는 건 배려가 아니라 회피입니다.\n피고인, 좋아하는 사람 있죠?`;

  return callGemini(prompt, fallback);
}

// ─── Gemini: 변호사 최후변론 (4턴) ───────────────────────
async function generateDefenderClosing(
  crimeLabel: string,
  h: CourtSajuHighlights,
): Promise<string> {
  const prompt = `당신은 사주 법정의 변호사 서휘윤입니다.
톤: 존댓말. 따뜻하고 공감적. 사주 근거로 뒤집습니다.

[데이터]
죄목: ${crimeLabel}
도화살: ${h.doHwaSal ? '있음' : '없음'} / 홍염살: ${h.hongYeomSal ? '있음' : '없음'}
편인: ${h.pyeonInCount}개 / 정인: ${h.jeongInCount}개 / 정관: ${h.jeongGwanCount}개

[규칙 — 반드시 지킬 것]
1. 반드시 4줄 이내. 전체 150자 이내. 이 제한을 절대 초과하지 마세요.
2. 사주 근거 1가지로 "피고인의 잘못이 아니라 사주 구조의 문제"를 짧게 논증.
3. 마지막에 "정상참작을 호소합니다" 톤으로 마무리.
4. 텍스트만 출력. 따옴표, 마크다운, JSON 금지.

[예시]
판사님, 피고인의 사주를 보십시오.
일지에 정관이 정인과 동주합니다. 한번 마음 주면 전부 주는 구조예요.
연애를 못 한 건 사주가 감정을 억누르고 있었기 때문입니다.
정상참작을 호소합니다.`;

  const fallback = `판사님, 피고인의 사주를 보십시오.\n이 사주는 한번 마음을 주면 전부를 주는 구조입니다.\n연애를 못 한 건 피고인의 잘못이 아니라, 사주 구조가 감정을 억누르고 있었기 때문입니다.\n피고인에게 정상참작을 호소합니다.`;

  return callGemini(prompt, fallback);
}

// ─── Gemini: 석방 근거 ───────────────────────────────────
async function generateReleaseRationale(
  crimeLabel: string,
  h: CourtSajuHighlights,
): Promise<string> {
  const prompt = `당신은 사주 전문 변호사입니다. 1~2문장으로 "왜 지금 억압되어 있고, 언제 풀리는지" 설명하세요.

죄목: ${crimeLabel}
일주: ${h.ilJuKey}
편인: ${h.pyeonInCount}개 / 도화살: ${h.doHwaSal ? '있음' : '없음'}

사주 용어는 반드시 "한글(한자)" 형식으로 표기 — 한자만 단독 사용 절대 금지. 텍스트만 출력.

예: 편인(偏印)이 도화(桃花)를 누르고 있어 매력이 발현되지 못하는 구조입니다.`;

  const fallback = '사주 원국에서 감정을 억누르는 구조가 풀리는 시점이 다가오고 있습니다.';

  return callGemini(prompt, fallback);
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, gender, birthTimeUnknown } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수입니다.', 400);
    }

    // ─── 1. Stargio API 호출 ──────────────────────────
    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) {
      return errorResponse(req, '서버 설정 오류: API 키 누락', 500);
    }

    const apiGender = gender === 'male' ? 'male' : 'female';
    const apiBirthday = birthday.length >= 12 ? birthday : birthday + '0000';
    const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=false&gender=${apiGender}&apiKey=${sajuApiKey}`;

    let sajuData: Record<string, unknown> | null = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const sajuResponse = await fetch(sajuApiUrl, { method: 'GET', headers: BROWSER_HEADERS });
        if (!sajuResponse.ok) throw new Error(`HTTP ${sajuResponse.status}`);
        const rawText = await sajuResponse.text();
        const parsed = JSON.parse(rawText);
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

    // ─── 2. excludeKeys 경량화 ─────────────────────────
    for (const key of EXCLUDE_KEYS) {
      delete sajuData[key];
    }

    // ─── 3. 사주 하이라이트 추출 ───────────────────────
    const highlights = extractHighlights(sajuData);

    // ─── 4. 죄목 배정 ─────────────────────────────────
    const crime = determineCrime(highlights);

    // ─── 5. 매력 점수 + 기본 형량 ─────────────────────
    const charmScore = calculateCharmScore(highlights);
    const baseSentence = calculateBaseSentence(charmScore);

    // ─── 6. 석방 예정일 ───────────────────────────────
    const releaseDate = calculateReleaseDate(baseSentence, charmScore);

    // ─── 7. Gemini AI 텍스트 생성 (병렬) ──────────────
    const [prosecutorOpening, defenderClosing, releaseRationale] = await Promise.all([
      generateProsecutorOpening(crime.label, highlights),
      generateDefenderClosing(crime.label, highlights),
      generateReleaseRationale(crime.label, highlights),
    ]);

    // ─── 8. 판사 코멘트 (등급별 고정) ─────────────────
    let verdictComment: string;
    if (baseSentence >= 6) verdictComment = '사주가 이렇게 아까운데 이게 말이 됩니까.';
    else if (baseSentence >= 4) verdictComment = '반성의 기미가 보이지 않습니다.';
    else verdictComment = '초범이니 봐드립니다.';

    // ─── 9. DB 저장 ──────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const resultPayload = {
      crimeId: crime.id,
      crimeLabel: crime.label,
      charmScore,
      baseSentence,
      prosecutorLine: crime.prosecutorLine,
      defenderLine: crime.defenderLine,
      sajuHighlights: highlights,
      prosecutorOpening,
      defenderClosing,
      verdictComment,
      releaseRationale,
      releaseDate,
      releaseCondition: crime.releaseCondition,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('saju_courts')
      .insert({
        birthday,
        birth_time: birthTimeUnknown ? null : apiBirthday.slice(8),
        gender,
        crime_id: crime.id,
        crime_label: crime.label,
        charm_score: charmScore,
        base_sentence: baseSentence,
        release_year: releaseDate.year,
        release_month: releaseDate.month,
        release_condition: crime.releaseCondition,
        prosecutor_line: crime.prosecutorLine,
        defender_line: crime.defenderLine,
        prosecutor_opening: typeof prosecutorOpening === 'string' ? prosecutorOpening : JSON.stringify(prosecutorOpening),
        defender_closing: typeof defenderClosing === 'string' ? defenderClosing : JSON.stringify(defenderClosing),
        verdict_comment: verdictComment,
        release_rationale: typeof releaseRationale === 'string' ? releaseRationale : JSON.stringify(releaseRationale),
        result: resultPayload,
      })
      .select()
      .single();

    if (insertError) {
      console.error('법정 저장 실패:', insertError);
    }

    // ─── 10. 응답 ────────────────────────────────────
    return jsonResponse(req, {
      courtId: inserted?.id ?? crypto.randomUUID(),
      ...resultPayload,
      createdAt: inserted?.created_at ?? new Date().toISOString(),
    });

  } catch (err) {
    console.error('analyze-saju-court 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
