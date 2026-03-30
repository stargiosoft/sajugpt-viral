import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
type CauseOfDeathInput = 'ghosting' | 'prettier' | 'always_busy' | 'physical_only' | 'faded';
type RelationshipDuration = 'brief' | 'months' | 'over_year' | 'long_term';
type CoronerId = 'yoon-taesan' | 'seo-hwiyoon';
type CauseOfDeath = 'blind_eye' | 'emotional_numb' | 'depth_phobia' | 'responsibility_dodge' | 'self_centered' | 'possessive' | 'charm_delusion' | 'focus_deficit' | 'emotional_fugitive' | 'face_obsession';
type DiscernmentGrade = 'F' | 'D' | 'C' | 'B' | 'A';

interface RequestBody {
  birthday: string;
  gender: 'female' | 'male';
  birthTimeUnknown?: boolean;
  causeOfDeathInput: CauseOfDeathInput;
  relationshipDuration: RelationshipDuration;
  coronerId: CoronerId;
}

interface SajuHighlights {
  jeongInCount: number;
  pyeonInCount: number;
  sikSinCount: number;
  jeongGwanCount: number;
  pyeonGwanCount: number;
  sangGwanCount: number;
  pyeonJaeCount: number;
  biGyeonCount: number;
  geobJaeCount: number;
  insung: number;
  gwansung: number;
  siksang: number;
  bigyeob: number;
  jasung: number;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  yeonaeSeongHyang: string;
  ilJuKey: string;
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

const CAUSE_INPUT_LABELS: Record<CauseOfDeathInput, string> = {
  ghosting: '갑자기 연락 두절',
  prettier: '더 예쁜 여자 생김',
  always_busy: '만나자고 하면 항상 바쁨',
  physical_only: '잠자리만 찾음',
  faded: '이유 없이 식어버림',
};

const CAUSE_LABELS: Record<CauseOfDeath, string> = {
  blind_eye: '안목 사망',
  emotional_numb: '감정 불감증',
  depth_phobia: '깊이 공포증',
  responsibility_dodge: '책임 회피 증후군',
  self_centered: '자기중심 과잉',
  possessive: '소유욕 과다',
  charm_delusion: '매력 착각 증후군',
  focus_deficit: '집중력 결핍',
  emotional_fugitive: '감정 도주범',
  face_obsession: '체면 과잉 증후군',
};

const FALLBACK_VERDICTS: Record<CauseOfDeath, Record<CoronerId, string>> = {
  blind_eye: {
    'yoon-taesan': '이런 놈 때문에 울었다고? 화난다 진짜.',
    'seo-hwiyoon': '이 분의 사주는 본질을 읽는 눈이 부족한 구조예요.',
  },
  emotional_numb: {
    'yoon-taesan': '감정 처리 기능이 사주에서부터 고장난 놈이야.',
    'seo-hwiyoon': '이 분은 감정을 받아들이는 통로가 막혀있는 사주예요.',
  },
  depth_phobia: {
    'yoon-taesan': '깊어지는 게 무서운 사주야. 넌 진심으로 갔는데 이 놈은 겁먹고 도망간 거지.',
    'seo-hwiyoon': '이 분의 사주는 깊은 감정을 감당하는 그릇이 작아요.',
  },
  responsibility_dodge: {
    'yoon-taesan': '책임은 못 지면서 좋아한다? 그건 좋아하는 게 아니라 갖고 노는 거야.',
    'seo-hwiyoon': '이 분은 감정의 무게를 견디는 구조가 아니에요.',
  },
  self_centered: {
    'yoon-taesan': '이 사주는 세상의 중심이 자기야. 네가 옆에 있든 없든 똑같은 놈이었어.',
    'seo-hwiyoon': '이 분의 세계에는 자기밖에 없는 구조예요.',
  },
  possessive: {
    'yoon-taesan': '가지려고만 하고 지키려고는 안 하는 사주.',
    'seo-hwiyoon': '소유와 사랑을 구분 못 하는 구조예요.',
  },
  charm_delusion: {
    'yoon-taesan': '본인이 잘난 줄 아는데 실제론 별거 없는 사주야.',
    'seo-hwiyoon': '자기 매력에 대한 착각이 있는 사주예요.',
  },
  focus_deficit: {
    'yoon-taesan': '새 거 나오면 바로 넘어가는 사주. 원래 이런 놈이야.',
    'seo-hwiyoon': '하나에 오래 집중하는 게 구조적으로 어려운 사주예요.',
  },
  emotional_fugitive: {
    'yoon-taesan': '감정이 복잡해지면 도망가는 사주. 비겁한 거야.',
    'seo-hwiyoon': '감정을 마주하는 게 무서운 구조예요.',
  },
  face_obsession: {
    'yoon-taesan': '주변 눈치만 보는 사주. 널 사랑한 게 아니라 사랑하는 척한 거야.',
    'seo-hwiyoon': '타인의 시선이 자기 감정보다 큰 사주예요.',
  },
};

const PROGNOSES: Record<CauseOfDeath, string[]> = {
  blind_eye: ['비슷한 실수 반복 예정', '겉만 보다가 또 놓칠 확률 높음'],
  emotional_numb: ['감정 결핍 만성화 예상', '혼자 늙어갈 위험 높음'],
  depth_phobia: ['얕은 연애만 반복할 구조', '깊어지면 또 도망갈 것'],
  responsibility_dodge: ['책임 없는 연애 패턴 고착', '같은 이유로 또 차일 것'],
  self_centered: ['자기 세계에 갇혀 외로워질 예정', '후회할 때쯤 이미 늦음'],
  possessive: ['소유만 하다 진짜 사랑 놓칠 것', '패턴 반복 확률 극히 높음'],
  charm_delusion: ['착각이 깨지는 순간이 올 것', '그때 당신이 떠오를 것'],
  focus_deficit: ['새 자극 중독으로 안정 불가', '어디서든 같은 패턴 반복'],
  emotional_fugitive: ['도망 패턴 반복. 고립 예상', '본인도 모르게 후회 중'],
  face_obsession: ['체면 유지하다 진심을 잃을 것', '겉은 멀쩡해도 속은 텅 빌 예정'],
};

// ─── 십성 카운트 ─────────────────────────────────────────
function countSipsung(sipsung: string[][], target: string): number {
  return sipsung.flat().filter(s => s === target).length;
}

// ─── 사주 하이라이트 추출 ─────────────────────────────────
function extractSajuHighlights(sajuData: Record<string, unknown>): SajuHighlights {
  const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
  const baldal = (sajuData['발달십성'] as Record<string, number> | undefined) ?? {};
  const sinsal12 = String(sajuData['12신살'] || '');
  const gitaSinsal = String(sajuData['기타신살'] || '');
  const ilJuRon = sajuData['일주론'] as Record<string, string> | undefined;
  const cheonGan = (sajuData['천간'] as string[] | undefined) ?? [];
  const jiJi = (sajuData['지지'] as string[] | undefined) ?? [];

  return {
    jeongInCount: countSipsung(sipsung, '정인'),
    pyeonInCount: countSipsung(sipsung, '편인'),
    sikSinCount: countSipsung(sipsung, '식신'),
    jeongGwanCount: countSipsung(sipsung, '정관'),
    pyeonGwanCount: countSipsung(sipsung, '편관'),
    sangGwanCount: countSipsung(sipsung, '상관'),
    pyeonJaeCount: countSipsung(sipsung, '편재'),
    biGyeonCount: countSipsung(sipsung, '비견'),
    geobJaeCount: countSipsung(sipsung, '겁재'),
    insung: baldal['인성'] ?? 0,
    gwansung: baldal['관성'] ?? 0,
    siksang: baldal['식상'] ?? 0,
    bigyeob: baldal['비겁'] ?? 0,
    jasung: baldal['재성'] ?? 0,
    doHwaSal: sinsal12.includes('도화'),
    hongYeomSal: gitaSinsal.includes('홍염'),
    yeonaeSeongHyang: ilJuRon?.['연애성향'] ?? '',
    ilJuKey: `${cheonGan[2] ?? ''}${jiJi[2] ?? ''}`,
  };
}

// ─── 사망 원인 결정 ──────────────────────────────────────
interface CauseMapping {
  cause: CauseOfDeath;
  check: (h: SajuHighlights) => number;
  linkedInputs: CauseOfDeathInput[];
}

const CAUSE_MAPPINGS: CauseMapping[] = [
  {
    cause: 'blind_eye',
    check: (h) => (h.siksang >= 25 ? 3 : h.sangGwanCount >= 1 ? 1 : 0) + (h.insung < 15 ? 2 : 0),
    linkedInputs: ['prettier'],
  },
  {
    cause: 'emotional_numb',
    check: (h) => (h.pyeonInCount >= 2 ? 3 : h.pyeonInCount >= 1 ? 1 : 0) + (h.gwansung >= 20 ? 1 : 0),
    linkedInputs: ['ghosting'],
  },
  {
    cause: 'depth_phobia',
    check: (h) => (h.pyeonJaeCount >= 2 ? 3 : h.jasung >= 25 ? 2 : 0) + (h.insung < 15 ? 1 : 0),
    linkedInputs: ['faded'],
  },
  {
    cause: 'responsibility_dodge',
    check: (h) => (h.sangGwanCount >= 2 ? 3 : h.siksang >= 25 ? 2 : 0) + (h.gwansung < 15 ? 1 : 0),
    linkedInputs: ['always_busy'],
  },
  {
    cause: 'self_centered',
    check: (h) => (h.biGyeonCount + h.geobJaeCount >= 3 ? 3 : h.bigyeob >= 30 ? 2 : 0),
    linkedInputs: ['always_busy'],
  },
  {
    cause: 'possessive',
    check: (h) => (h.pyeonGwanCount >= 2 ? 3 : h.gwansung >= 25 ? 2 : 0) + (h.insung < 15 ? 1 : 0),
    linkedInputs: ['physical_only'],
  },
  {
    cause: 'charm_delusion',
    check: (h) => (h.doHwaSal ? 2 : 0) + (h.sangGwanCount >= 1 ? 2 : 0),
    linkedInputs: ['prettier'],
  },
  {
    cause: 'focus_deficit',
    check: (h) => (h.pyeonJaeCount >= 2 ? 3 : h.jasung >= 30 ? 2 : 0) + (h.gwansung < 15 ? 1 : 0),
    linkedInputs: ['faded'],
  },
  {
    cause: 'emotional_fugitive',
    check: (h) => (h.pyeonInCount >= 1 && h.biGyeonCount >= 1 ? 3 : 0) + (h.pyeonInCount >= 2 ? 1 : 0),
    linkedInputs: ['ghosting'],
  },
  {
    cause: 'face_obsession',
    check: (h) => (h.sangGwanCount >= 1 && h.geobJaeCount >= 1 ? 3 : 0) + (h.bigyeob >= 20 ? 1 : 0),
    linkedInputs: ['always_busy'],
  },
];

function determineCauseOfDeath(
  highlights: SajuHighlights,
  causeOfDeathInput: CauseOfDeathInput,
): { cause: CauseOfDeath; label: string } {
  let best = CAUSE_MAPPINGS[0];
  let bestScore = -1;

  for (const mapping of CAUSE_MAPPINGS) {
    let score = mapping.check(highlights);
    if (mapping.linkedInputs.includes(causeOfDeathInput)) {
      score += 10;
    }
    if (score > bestScore) {
      bestScore = score;
      best = mapping;
    }
  }

  return { cause: best.cause, label: CAUSE_LABELS[best.cause] };
}

// ─── 매력 감별 능력 등급 ──────────────────────────────────
function calculateDiscernmentGrade(h: SajuHighlights): DiscernmentGrade {
  const hasJeongIn = h.jeongInCount >= 1 || h.insung >= 20;
  const strongJeongIn = h.jeongInCount >= 2 || h.insung >= 30;
  const hasSikSin = h.sikSinCount >= 1;
  const hasJeongGwan = h.jeongGwanCount >= 1 || h.gwansung >= 20;
  const strongJeongGwan = h.jeongGwanCount >= 2 || h.gwansung >= 30;

  if (strongJeongIn && strongJeongGwan) return 'A';
  if (hasJeongIn && hasJeongGwan) return 'B';
  if (hasJeongIn && !hasJeongGwan) return 'C';
  if (!hasJeongIn && hasSikSin) return 'D';
  return 'F';
}

// ─── 후회 확률 ──────────────────────────────────────────
function calculateRegretProbability(
  h: SajuHighlights,
  duration: RelationshipDuration,
): number {
  let prob = 70.0;

  if (h.jeongInCount >= 1) prob += 8;
  if (h.pyeonInCount >= 2) prob += 5;
  if (duration === 'over_year') prob += 7;
  if (duration === 'long_term') prob += 12;
  if (h.doHwaSal) prob += 5;

  if (h.biGyeonCount >= 2 || h.bigyeob >= 30) prob -= 5;
  if (h.pyeonJaeCount >= 2 || h.jasung >= 30) prob -= 3;

  prob = Math.max(61.3, Math.min(99.8, prob));
  const offset = parseFloat((Math.random() * 0.8 + 0.1).toFixed(1));
  prob = parseFloat((Math.floor(prob) + offset).toFixed(1));

  return Math.max(61.3, Math.min(99.8, prob));
}

// ─── 다음 연애 예후 ─────────────────────────────────────
function generatePrognosis(causeOfDeath: CauseOfDeath): string {
  const options = PROGNOSES[causeOfDeath];
  return options[Math.floor(Math.random() * options.length)];
}

// ─── Gemini 3장 카드 생성 ─────────────────────────────────
async function generateAutopsyCards(
  coronerId: CoronerId,
  causeOfDeathInput: CauseOfDeathInput,
  causeOfDeath: CauseOfDeath,
  causeOfDeathLabel: string,
  discernmentGrade: DiscernmentGrade,
  regretProbability: number,
  highlights: SajuHighlights,
): Promise<{ card1: string; card2: string; card3: string }> {

  const fallback = {
    card1: coronerId === 'yoon-taesan'
      ? '일주가 이러니 첫인상은 괜찮았겠지. 다정한 척은 기가 막히게 하는 사주거든.'
      : '이 분의 일주를 보면, 처음에 좋은 인상을 주는 구조예요. 당신이 끌렸던 건 자연스러운 거예요.',
    card2: coronerId === 'yoon-taesan'
      ? '근데 속을 열어보니까 — 겉만 번지르르하고 속은 텅 비어있는 구조야. 네 깊이 같은 건 관심도 없는 놈이었어.'
      : '안쪽을 보면, 이 분의 사주는 본질을 읽는 눈이 부족한 구조예요. 당신의 깊이를 알아볼 그릇이 안 됐던 거예요.',
    card3: FALLBACK_VERDICTS[causeOfDeath][coronerId],
  };

  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) {
    console.error('GOOGLE_API_KEY not set');
    return fallback;
  }

  const coronerProfile = coronerId === 'yoon-taesan'
    ? `윤태산 — 분노형 검시관. 반말체. 거친 말투로 상대를 까되, 사용자를 감싸주는 톤. "네가 부족한 게 아냐", "화난다 진짜" 같은 분노 대리 톤.`
    : `서휘윤 — 치유형 검시관. 존댓말. 차분하고 따뜻한 톤으로 상대의 사주적 한계를 설명. "당신 탓이 아니에요", "이제 내려놓으세요" 같은 위로 톤.`;

  const prompt = `역할: 당신은 사주 기반 연애 부검 전문 검시관입니다.

캐릭터 프로필:
${coronerProfile}

부검 대상 사주 데이터:
- 일주: ${highlights.ilJuKey}
- 주요 십성: 정인 ${highlights.jeongInCount}개, 편인 ${highlights.pyeonInCount}개, 식신 ${highlights.sikSinCount}개, 정관 ${highlights.jeongGwanCount}개, 편관 ${highlights.pyeonGwanCount}개, 상관 ${highlights.sangGwanCount}개, 편재 ${highlights.pyeonJaeCount}개, 비견 ${highlights.biGyeonCount}개, 겁재 ${highlights.geobJaeCount}개
- 발달십성: 인성 ${highlights.insung}%, 관성 ${highlights.gwansung}%, 식상 ${highlights.siksang}%, 비겁 ${highlights.bigyeob}%, 재성 ${highlights.jasung}%
- 도화살: ${highlights.doHwaSal ? '있음' : '없음'}
- 연애성향: ${highlights.yeonaeSeongHyang || '정보 없음'}

부검 정보:
- 사인(死因): "${CAUSE_INPUT_LABELS[causeOfDeathInput]}"
- 확정 사망 원인: ${causeOfDeathLabel}
- 매력 감별 능력: ${discernmentGrade}등급
- 후회 확률: ${regretProbability}%

아래 3장의 카드 텍스트를 JSON으로 생성하라. 각 카드는 2~3문장.

1. card1 (겉포장 분석): 상대 사주에서 겉으로 보이는 매력 요소. 사용자가 "맞아, 처음엔 진짜 좋았는데…" 공감하는 지점. 사주 용어 1개 이상 자연어 풀이.
2. card2 (해부 소견): 사인(${CAUSE_INPUT_LABELS[causeOfDeathInput]})과 사주를 교차시켜 "왜 이렇게 행동했는지" 해부. 핵심 약점을 정확히 찔되, 사용자 탓이 아님을 강조.
3. card3 (검시관 소견): 사망진단서에 박히는 한마디. 캡처 공유 트리거가 될 만큼 강렬한 1~2문장.

출력 형식 (JSON만, 다른 텍스트 없이):
{"card1":"...","card2":"...","card3":"..."}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.85,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return fallback;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) return fallback;

    const parsed = JSON.parse(text);
    return {
      card1: parsed.card1 || fallback.card1,
      card2: parsed.card2 || fallback.card2,
      card3: parsed.card3 || fallback.card3,
    };
  } catch (err) {
    console.error('Gemini 호출 실패:', err);
    return fallback;
  }
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, gender, birthTimeUnknown, causeOfDeathInput, relationshipDuration, coronerId } = body;

    if (!birthday || !gender || !causeOfDeathInput || !relationshipDuration || !coronerId) {
      return errorResponse(req, '필수 입력값이 누락되었습니다.', 400);
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

    // ─── 3. 사주 하이라이트 추출 ─────────────────────────
    const highlights = extractSajuHighlights(sajuData);

    // ─── 4. 사망 원인 결정 ─────────────────────────────
    const { cause: causeOfDeath, label: causeOfDeathLabel } = determineCauseOfDeath(highlights, causeOfDeathInput);

    // ─── 5. 매력 감별 능력 등급 ──────────────────────────
    const discernmentGrade = calculateDiscernmentGrade(highlights);

    // ─── 6. 후회 확률 ─────────────────────────────────
    const regretProbability = calculateRegretProbability(highlights, relationshipDuration);

    // ─── 7. 다음 연애 예후 ────────────────────────────
    const prognosis = generatePrognosis(causeOfDeath);

    // ─── 8. Gemini 3장 카드 생성 ──────────────────────
    const cards = await generateAutopsyCards(
      coronerId, causeOfDeathInput, causeOfDeath, causeOfDeathLabel,
      discernmentGrade, regretProbability, highlights,
    );

    // ─── 9. DB 저장 ──────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const resultPayload = {
      causeOfDeathInput,
      relationshipDuration,
      coronerId,
      causeOfDeath,
      causeOfDeathLabel,
      discernmentGrade,
      regretProbability,
      prognosis,
      card1Text: cards.card1,
      card2Text: cards.card2,
      card3Verdict: cards.card3,
      sajuHighlights: highlights,
      targetSajuType: highlights.ilJuKey,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('saju_autopsies')
      .insert({
        target_birthday: birthday,
        target_birth_time: birthTimeUnknown ? null : apiBirthday.slice(8),
        target_gender: gender,
        cause_of_death_input: causeOfDeathInput,
        relationship_duration: relationshipDuration,
        coroner_id: coronerId,
        cause_of_death: causeOfDeath,
        cause_of_death_label: causeOfDeathLabel,
        discernment_grade: discernmentGrade,
        regret_probability: regretProbability,
        prognosis,
        card1_text: cards.card1,
        card2_text: cards.card2,
        card3_verdict: cards.card3,
        result: resultPayload,
        target_saju_type: highlights.ilJuKey,
        utm_source: null,
        utm_medium: null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('부검 결과 저장 실패:', insertError);
    }

    // ─── 10. 응답 ────────────────────────────────────
    return jsonResponse(req, {
      autopsyId: inserted?.id ?? crypto.randomUUID(),
      ...resultPayload,
    });

  } catch (err) {
    console.error('analyze-saju-autopsy 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
