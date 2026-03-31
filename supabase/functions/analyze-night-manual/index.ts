import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  birthday: string;       // YYYYMMDDHHMM
  gender: 'female' | 'male';
  birthTimeUnknown?: boolean;
  calendarType?: 'solar' | 'lunar';
}

interface NightStats {
  sensitivity: number;
  dominance: number;
  addiction: number;
  awareness: number;
  endurance: number;
}

type ConstitutionType = 'simhwa' | 'noejeon' | 'myohyang' | 'seu' | 'janggang' | 'yonghwa';

interface ConstitutionInfo {
  type: ConstitutionType;
  name: string;
  concept: string;
  grade: string;
}

// ─── 상수 ───────────────────────────────────────────────
const EXCLUDE_KEYS = new Set([
  '월운보기', '대운', '대운순서',
  '대운시작나이', '대운순서십이운성', '대운순서십성', '용신설명',
  '오주', '오주오행', '오주십성', '격용신', '용신',
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

const CONSTITUTION_MAP: Record<ConstitutionType, { name: string; concept: string; narrative: string }> = {
  simhwa: {
    name: '심화(心火)',
    concept: '불꽃형 — 한 번 붙으면 재가 될 때까지',
    narrative: '네 몸에 불이 붙는 데는 시간이 걸린다. 하지만 한 번 불이 붙으면 상대가 먼저 타버린다. 시종이 세 명이어도 부족할 수 있다. 네 사주에 앉은 도화살은 천천히 피어나는 종류다 — 그래서 더 위험하다.',
  },
  noejeon: {
    name: '뇌전(雷電)',
    concept: '천둥형 — 내가 치면 상대가 울린다',
    narrative: '네가 원하는 건 부드러운 손길이 아니다. 네가 방 안에 들어서면 시종이 긴장한다. 무릎을 꿇는 것은 시종이지만, 진짜 무릎 꿇게 만드는 건 네 눈빛이다. 사주에 편관과 양인이 함께 있다. 지배하도록 태어난 체질.',
  },
  myohyang: {
    name: '묘향(妙香)',
    concept: '향기형 — 떠나도 잊지 못하게 만든다',
    narrative: '네가 방을 나가면 향이 남는다. 시종이 빈 방에 들어와 네가 앉았던 자리 냄새를 맡는다. 한 번 네 곁에 있었던 사람은 평생 네 이름을 중얼거린다. 홍염살이 이것이다 — 떠나도 잊지 못하게 만드는 저주.',
  },
  seu: {
    name: '세우(細雨)',
    concept: '이슬비형 — 가볍게 적시지만 속까지 젖는다',
    narrative: '센 비는 피할 수 있지만, 이슬비는 피할 수 없다. 네 손끝이 스치기만 해도 시종의 숨이 멈춘다. 강하게 조이지 않는데 풀려나지 못한다. 화개살이 감각을 예민하게 만들었다 — 상대의 몸이 원하는 것을 네가 먼저 안다.',
  },
  janggang: {
    name: '장강(長江)',
    concept: '강물형 — 끝이 보이지 않는 밤',
    narrative: '첫 번째 시종이 지쳐 물러났다. 두 번째 시종이 교대했다. 네 눈에는 아직 잠이 없다. 비견과 겁재가 체력을 두 배로 만들었다. 밤이 깊어져도 네 기운은 줄지 않는다. 아침이 와야 끝나는 게 아니라, 네가 끝내야 끝난다.',
  },
  yonghwa: {
    name: '용화(龍火)',
    concept: '용의 불꽃 — 모든 것을 삼키는 전설',
    narrative: '시종 세 명이 서로 눈치를 본다. 네 사주를 펼친 순간 기가 질렸다. 도화살, 홍염살, 양인이 한 사주에 모였다. 어디를 건드려도 반응하고, 한 번 맛보면 중독되고, 주도권은 절대 넘기지 않는다. 시종 셋이 달려들어도 네가 끝날 때까지 끝나지 않는다.',
  },
};

// ─── Phase 2 개입 반응 (하드코딩) ────────────────────────
const PHASE2_REACTIONS = {
  listen: '강해: 야, 이놈아! 네가 지난번에 마마 앞에서 발이 떨리던 거 잊었냐?\n\n윤서: 강해, 네 주먹보다 내 혀가 마마를 더 잘 모신다. 너도 알잖아.\n\n도겸: 두 분... 마마께서 듣고 계실 수도 있습니다만... 아, 아닙니다. 저도 할 말은 있습니다.',
  cough: '강해: ...! 마, 마마?! 아닙니다, 저희는 그냥... 업무 회의를...\n\n윤서: (책을 뒤집어 들며) 시, 시를 읽고 있었습니다...\n\n도겸: (즉시 무릎) 마마, 얼마나 들으셨습니까... 모든 것은 마마를 위한 것이었습니다.',
  interrupt: '강해: (즉시 무릎) 명하십시오, 마마. 목숨을 걸겠습니다.\n\n윤서: (붓을 놓으며) 마마의 한 마디가 저의 만 마디보다 무겁습니다.\n\n도겸: (이마가 바닥에 닿을 때까지) 불찰을 용서하십시오. 무엇이든 분부하십시오.',
};

// ─── 탈락 반응 (하드코딩) ────────────────────────────────
const REJECTION_LINES = {
  beast: '...알겠습니다. 하지만 마마, 그놈이 지치면 저를 부르십시오. 저는 밖에서 기다리겠습니다.',
  poet: '오늘 밤은 양보하겠습니다. 하지만 내일 밤, 마마의 베개 밑에 시 한 편을 놓아두겠습니다.',
  butler: '마마의 뜻이라면... (무릎 꿇으며) 대신 차와 과일은 제가 준비해놓겠습니다. 밤이 길 것 같으니.',
};

// ─── 사주 데이터 판별 유틸 ──────────────────────────────
function hasSipsung(sipsung: string[][], name: string): boolean {
  return sipsung.some(pair => pair.some(s => s === name));
}

function countSipsung(sipsung: string[][], name: string): number {
  return sipsung.flat().filter(s => s === name).length;
}

function has12Sinsal(sinsal12: unknown, name: string): boolean {
  if (!Array.isArray(sinsal12)) return false;
  return sinsal12.some((arr: unknown) =>
    Array.isArray(arr) && arr.some((s: unknown) => typeof s === 'string' && s.includes(name))
  );
}

function hasGitaSinsal(gitaSinsal: unknown, name: string): boolean {
  if (!Array.isArray(gitaSinsal)) return false;
  return gitaSinsal.some((arr: unknown) =>
    Array.isArray(arr) && arr.some((s: unknown) => typeof s === 'string' && s.includes(name))
  );
}

function has12Unseong(unseong: unknown, name: string): boolean {
  if (!Array.isArray(unseong)) return false;
  return unseong.some((u: unknown) => typeof u === 'string' && u === name);
}

function hasBonjuSal(bonju: Record<string, unknown> | undefined, key: string): boolean {
  if (!bonju) return false;
  const val = bonju[key];
  return typeof val === 'string' && val !== '';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

// ─── 능력치 산정 ────────────────────────────────────────
function calculateNightStats(sajuData: Record<string, unknown>): {
  stats: NightStats;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  sajuStrength: string;
} {
  const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
  const baldal = (sajuData['발달십성'] as Record<string, number> | undefined) ?? {};
  const sinsal12 = sajuData['12신살'];
  const gitaSinsal = sajuData['기타신살'];
  const unseong = (sajuData['십이운성'] as string[] | undefined) ?? [];
  const bonju = sajuData['본사주'] as Record<string, unknown> | undefined;
  const sajuStrength = String(sajuData['사주강약'] ?? '');

  const doHwaSal = has12Sinsal(sinsal12, '도화');
  const hongYeomSal = hasGitaSinsal(gitaSinsal, '홍염');
  const hasEumyokSal = hasGitaSinsal(gitaSinsal, '음욕');

  // ── 감도 (Sensitivity) ──
  let sensitivity = Math.max(15, (baldal['인성'] ?? 0) * 1.2);
  if (hasSipsung(sipsung, '정인')) sensitivity += 12;
  if (hasSipsung(sipsung, '편인')) sensitivity += 10;
  if (countSipsung(sipsung, '정인') >= 2) sensitivity += 5;
  if (doHwaSal) sensitivity += 15;
  if (hasEumyokSal) sensitivity += 12;
  if (has12Unseong(unseong, '목욕')) sensitivity += 10;

  // ── 지배력 (Dominance) ──
  let dominance = Math.max(12, (baldal['관성'] ?? 0) * 1.2);
  if (hasSipsung(sipsung, '편관')) dominance += 12;
  if (hasSipsung(sipsung, '정관')) dominance += 8;
  if (hasSipsung(sipsung, '겁재')) dominance += 8;
  if (countSipsung(sipsung, '편관') >= 2) dominance += 5;
  if (hasBonjuSal(bonju, '양인살')) dominance += 15;
  if (hasBonjuSal(bonju, '괴강살')) dominance += 12;
  if (has12Unseong(unseong, '제왕')) dominance += 10;

  // ── 중독성 (Addiction) ──
  let addiction = Math.max(15, ((baldal['식상'] ?? 0) * 0.6) + ((baldal['재성'] ?? 0) * 0.6));
  if (hasSipsung(sipsung, '상관')) addiction += 10;
  if (hasSipsung(sipsung, '편재')) addiction += 8;
  if (countSipsung(sipsung, '상관') >= 2) addiction += 5;
  if (hongYeomSal) addiction += 18;
  if (doHwaSal) addiction += 10;
  if (hasEumyokSal) addiction += 8;

  // ── 민감도 (Awareness) ──
  let awareness = Math.max(15, (baldal['식상'] ?? 0) * 1.2);
  if (hasSipsung(sipsung, '식신')) awareness += 12;
  if (hasSipsung(sipsung, '정인')) awareness += 8;
  if (hasSipsung(sipsung, '식신') && hasSipsung(sipsung, '정인')) awareness += 8;
  if (has12Sinsal(sinsal12, '화개')) awareness += 15;
  if (hasEumyokSal) awareness += 8;
  if (has12Unseong(unseong, '태')) awareness += 6;

  // ── 지구력 (Endurance) ──
  let endurance = Math.max(18, (baldal['비겁'] ?? 0) * 1.2);
  if (hasSipsung(sipsung, '비견')) endurance += 10;
  if (hasSipsung(sipsung, '겁재')) endurance += 10;
  if (countSipsung(sipsung, '비견') >= 2) endurance += 5;
  if (hasSipsung(sipsung, '편관')) endurance += 6;
  if (has12Unseong(unseong, '건록')) endurance += 15;
  if (has12Unseong(unseong, '관대')) endurance += 10;
  if (has12Unseong(unseong, '제왕')) endurance += 8;
  if (sajuStrength === '극신강') endurance += 10;
  else if (sajuStrength === '신강') endurance += 5;

  return {
    stats: {
      sensitivity: clamp(sensitivity, 10, 100),
      dominance: clamp(dominance, 10, 100),
      addiction: clamp(addiction, 10, 100),
      awareness: clamp(awareness, 10, 100),
      endurance: clamp(endurance, 10, 100),
    },
    doHwaSal,
    hongYeomSal,
    sajuStrength,
  };
}

// ─── 체질 배정 ──────────────────────────────────────────
function assignConstitution(stats: NightStats, totalCharm: number): ConstitutionInfo {
  const entries = Object.entries(stats) as [keyof NightStats, number][];
  entries.sort((a, b) => b[1] - a[1]);

  // 용화 조건: 3개 이상 80+
  const over80 = entries.filter(([, v]) => v >= 80);
  if (over80.length >= 3) {
    const meta = CONSTITUTION_MAP['yonghwa'];
    return { type: 'yonghwa', name: meta.name, concept: meta.concept, grade: getGrade(totalCharm) };
  }

  const topKey = entries[0][0];
  const map: Record<keyof NightStats, ConstitutionType> = {
    sensitivity: 'simhwa',
    dominance: 'noejeon',
    addiction: 'myohyang',
    awareness: 'seu',
    endurance: 'janggang',
  };
  const type = map[topKey];
  const meta = CONSTITUTION_MAP[type];
  return { type, name: meta.name, concept: meta.concept, grade: getGrade(totalCharm) };
}

function getGrade(totalCharm: number): string {
  if (totalCharm >= 350) return 'S';
  if (totalCharm >= 250) return 'A';
  if (totalCharm >= 150) return 'B';
  return 'C';
}

function getTopStat(stats: NightStats): { name: string; value: number } {
  const labels: Record<keyof NightStats, string> = {
    sensitivity: '감도', dominance: '지배력', addiction: '중독성',
    awareness: '민감도', endurance: '지구력',
  };
  const entries = Object.entries(stats) as [keyof NightStats, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return { name: labels[entries[0][0]], value: entries[0][1] };
}

function getLowestStat(stats: NightStats): { name: string; value: number } {
  const labels: Record<keyof NightStats, string> = {
    sensitivity: '감도', dominance: '지배력', addiction: '중독성',
    awareness: '민감도', endurance: '지구력',
  };
  const entries = Object.entries(stats) as [keyof NightStats, number][];
  entries.sort((a, b) => a[1] - b[1]);
  return { name: labels[entries[0][0]], value: entries[0][1] };
}

// ─── Gemini 대사 생성 (Phase 1 + Phase 3 동시) ──────────
interface GeminiResult {
  phase1: string;
  phase3_beast: string;
  phase3_poet: string;
  phase3_butler: string;
}

const FALLBACK_RESULT: GeminiResult = {
  phase1: `강해: 이 평가표... 제가 아니면 감당 못 합니다. 윤서, 네 시 따위로 마마를 어찌하겠다는 거냐.\n\n윤서: 무식한 놈. 마마는 세밀하게 다뤄야 해. 네 식으로 덤벼들면 마마가 재미없어서 하품하실 거다.\n\n도겸: 두 분 다 틀렸습니다. 천천히, 정성껏, 한 겹씩 벗겨드려야 합니다. 기다림이 최고의 시중입니다.\n\n강해: 마마는 기다림 따위 원하시지 않아. 밤새 버틸 수 있는 건 나뿐이다.\n\n윤서: ...솔직히 그건 나도 좀 무섭다.\n\n도겸: 저는 마마께서 원하시면 무릎이 닳도록이라도...`,
  phase3_beast: '마마. 말은 됐고, 제가 직접 보여드리겠습니다. 제가 마마의 체력이 닳을 때까지 놓지 않겠습니다. 아침에 일어나면 제 이름밖에 생각나지 않을 것입니다.',
  phase3_poet: '마마. 오늘 밤 저는 마마의 손끝에서 시작하여 새벽녘에 마마의 입술에 도착하겠습니다. 그 사이의 모든 곳에 제 시를 새기겠습니다.',
  phase3_butler: '마마의 편안함이 최우선입니다. 마마께서 "그만"이라 하실 때까지, 마마께서 "그만"이라 하셔도, 한 번 더 여쭙겠습니다 — "정말이십니까?"',
};

async function generateServantDialogue(
  constitution: ConstitutionInfo,
  stats: NightStats,
  doHwaSal: boolean,
  hongYeomSal: boolean,
): Promise<GeminiResult> {
  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) {
    console.error('GOOGLE_API_KEY not set');
    return FALLBACK_RESULT;
  }

  const topStat = getTopStat(stats);
  const lowestStat = getLowestStat(stats);

  const prompt = `너는 조선시대 궁중 시종들의 대화를 작성하는 작가다.
유저의 사주 기반 체질 평가표를 보고, 시종 3명이 "오늘 밤 마마를 어떻게 모실 것인가"를 놓고 벌이는 난상토론 대사를 생성한다.

[시종 캐릭터]
강해(야수형): 직설적, 거침없음, 본능적. "말이 필요합니까?"가 입버릇. 다른 시종을 무시하고 자신이 최적이라고 주장.
윤서(시인형): 감성적, 비유와 은유 사용, 느리지만 깊음. 강해를 "무식하다"고 깔봄. 서사적 시중이 최고라 주장.
도겸(집사형): 절제된 매너, 존댓말, 헌신과 순종. "마마의 편안함이 최우선"이 신념. 다른 둘의 싸움을 중재하다가 자기 어필.

[유저 체질 데이터]
체질: ${constitution.name} (${constitution.concept})
감도: ${stats.sensitivity} | 지배력: ${stats.dominance} | 중독성: ${stats.addiction} | 민감도: ${stats.awareness} | 지구력: ${stats.endurance}
도화살: ${doHwaSal ? '보유' : '미보유'} | 홍염살: ${hongYeomSal ? '보유' : '미보유'}
최고 능력치: ${topStat.name} (${topStat.value})
최저 능력치: ${lowestStat.name} (${lowestStat.value})

[생성 규칙]
1. 반드시 아래 JSON 형식으로만 출력. 마크다운, 설명, 코드블록 감싸기 금지:
{"phase1":"강해: \\"대사\\"\\n\\n윤서: \\"대사\\"\\n\\n도겸: \\"대사\\"\\n\\n강해: \\"대사\\"\\n\\n윤서: \\"대사\\"\\n\\n도겸: \\"대사\\"","phase3_beast":"강해의 최종 제안 3~4문장","phase3_poet":"윤서의 최종 제안 3~4문장","phase3_butler":"도겸의 최종 제안 3~4문장"}

2. Phase 1 (엿듣기 토론):
   - 6턴 (강해→윤서→도겸→강해→윤서→도겸 순환)
   - **각 대사는 반드시 2~4줄(50~120자) 이내.** 길면 재미 없다. 짧고 임팩트 있게.
   - 유저의 구체적 능력치 숫자를 반드시 대사에 포함: "${topStat.name} ${topStat.value}이면..."
   - 시종들이 능력치를 보고 서로 견제하는 대사
   - 최소 1개 "맥락 없이 캡처해도 웃긴 한 줄" 포함
   - 최고 능력치(${topStat.name})에 대해 시종들이 특히 반응
   - 최저 능력치(${lowestStat.name} ${lowestStat.value})에 대해 약점으로 언급하되 유머러스하게

3. Phase 3 (최종 제안):
   - 각 시종이 유저의 최고 능력치(${topStat.name})에 맞춘 밤 시중 제안
   - 각 시종의 성격이 극명하게 드러나는 톤
   - 각 제안 마지막 문장이 캡처 밈이 될 수 있는 임팩트 있는 한 줄
   - **2~3문장씩. 길면 안 읽는다.**

4. 성인 코드 수위: "야하지 않지만 발칙하고 솔직한" 스윗 스팟. 직접적 성행위 묘사 금지, 은유와 비유로.
5. 조선 세계관 어투 유지하되, 숫자 언급 시에만 현대적 톤 허용.
6. 출력은 순수 JSON만. 코드블록(\`\`\`), 마크다운, 설명 일절 금지.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1500, temperature: 0.8, thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return FALLBACK_RESULT;
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    // JSON 추출: 코드블록이 감싸져 있을 수 있음
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini JSON 추출 실패:', text.slice(0, 200));
      return FALLBACK_RESULT;
    }
    text = jsonMatch[0];

    const parsed = JSON.parse(text) as Partial<GeminiResult>;
    if (!parsed.phase1 || !parsed.phase3_beast || !parsed.phase3_poet || !parsed.phase3_butler) {
      console.error('Gemini JSON 필드 누락:', Object.keys(parsed));
      return FALLBACK_RESULT;
    }

    return parsed as GeminiResult;
  } catch (err) {
    console.error('Gemini 호출 실패:', err);
    return FALLBACK_RESULT;
  }
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, gender, birthTimeUnknown, calendarType } = body;

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
    const lunar = calendarType === 'lunar' ? 'true' : 'false';
    const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=${lunar}&gender=${apiGender}&apiKey=${sajuApiKey}`;

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

    // ─── 3. 능력치 산정 ───────────────────────────────
    const { stats, doHwaSal, hongYeomSal, sajuStrength } = calculateNightStats(sajuData);
    const totalCharm = stats.sensitivity + stats.dominance + stats.addiction + stats.awareness + stats.endurance;

    // ─── 4. 체질 배정 ─────────────────────────────────
    const constitution = assignConstitution(stats, totalCharm);
    const constitutionNarrative = CONSTITUTION_MAP[constitution.type].narrative;

    // ─── 5. Gemini 대사 생성 ──────────────────────────
    const dialogue = await generateServantDialogue(constitution, stats, doHwaSal, hongYeomSal);

    // ─── 6. 사주 하이라이트 ───────────────────────────
    const topStat = getTopStat(stats);
    const sajuHighlights = {
      topStat: topStat.name,
      topStatValue: topStat.value,
      doHwaSal,
      hongYeomSal,
      sajuStrength,
    };

    // ─── 7. 응답 조립 ─────────────────────────────────
    const resultPayload = {
      constitution,
      stats,
      totalCharm,
      doHwaSal,
      hongYeomSal,
      constitutionNarrative,
      phase1Script: dialogue.phase1,
      phase2Reactions: PHASE2_REACTIONS,
      phase3Proposals: {
        beast: dialogue.phase3_beast,
        poet: dialogue.phase3_poet,
        butler: dialogue.phase3_butler,
      },
      rejectionLines: REJECTION_LINES,
      sajuHighlights,
    };

    // ─── 8. DB 저장 ────────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: inserted, error: insertError } = await supabase
      .from('night_manuals')
      .insert({
        birthday,
        birth_time: birthTimeUnknown ? null : apiBirthday.slice(8, 12),
        gender,
        constitution_type: constitution.type,
        stats,
        total_charm: totalCharm,
        do_hwa_sal: doHwaSal,
        hong_yeom_sal: hongYeomSal,
        result: resultPayload,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('DB 저장 실패:', insertError);
    }

    // ─── 9. 응답 ──────────────────────────────────────
    return jsonResponse(req, {
      nightManualId: inserted?.id ?? crypto.randomUUID(),
      ...resultPayload,
    });

  } catch (err) {
    console.error('analyze-night-manual 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
