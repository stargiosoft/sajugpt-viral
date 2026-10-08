import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── CORS ───────────────────────────────────────────────
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

function handleCorsPreflightRequest(_req: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function jsonResponse(_req: Request, data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(_req: Request, message: string, status = 400): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ─── 타입 ───────────────────────────────────────────────
export type MoneyTypeCode =
  | 'stable'
  | 'talent'
  | 'business'
  | 'investment'
  | 'opportunity'
  | 'network';

export type MoneyScores = Record<MoneyTypeCode, number>;

export type MoneyTypeResult = {
  code: MoneyTypeCode;
  scores: MoneyScores;
  reason: string[];
};

type SajuData = Record<string, any>;
type TenGodGroup = '비겁' | '식상' | '재성' | '관성' | '인성';
type Weight = [MoneyTypeCode, number];

// ─── 상수 ───────────────────────────────────────────────
const TYPE_LABEL: Record<MoneyTypeCode, string> = {
  stable: '안정수입형',
  talent: '재능수익형',
  business: '사업개척형',
  investment: '자산증식형',
  opportunity: '기회포착형',
  network: '인맥재물형',
};

// 동점일 때 우선순위
const TIE_PRIORITY: MoneyTypeCode[] = [
  'talent',
  'business',
  'opportunity',
  'investment',
  'network',
  'stable',
];

const GROUPS: TenGodGroup[] = ['비겁', '식상', '재성', '관성', '인성'];

// 십성 하나가 각 유형에 주는 점수 (배치 / 월령 / 대운에 공통 사용)
const TENGOD_WEIGHTS: Record<string, Weight[]> = {
  비견: [['business', 1.5], ['network', 1]],
  겁재: [['business', 1.5], ['network', 0.5]],
  식신: [['talent', 1.5]],
  상관: [['talent', 1.5], ['opportunity', 0.5]],
  정재: [['investment', 1.5], ['network', 0.5]],
  편재: [['opportunity', 1.5], ['investment', 0.5], ['network', 0.5]],
  정관: [['stable', 1.5]],
  편관: [['stable', 1], ['business', 0.5]],
  정인: [['stable', 1.5]],
  편인: [['stable', 1], ['talent', 0.5]],
};

// 십성 그룹(용신/희신/기신 판정용)이 각 유형에 주는 점수
const GROUP_WEIGHTS: Record<TenGodGroup, Weight[]> = {
  비겁: [['business', 1], ['network', 0.5]],
  식상: [['talent', 1], ['opportunity', 0.5]],
  재성: [['investment', 1], ['opportunity', 0.5]],
  관성: [['stable', 1]],
  인성: [['stable', 1]],
};

// Stargio `사주`/`십성` 배열 순서는 [시주, 일주, 월주, 연주]
const HOUR_PILLAR = 0;
const DAY_PILLAR = 1;
const MONTH_PILLAR = 2;

const AVG_SHARE = 20; // 발달십성 5그룹 합이 100 → 평균 20
const MONTH_EXTRA = 3; // 월지는 배치에서 1회 + 추가 3회 = 총 4배 반영

// ─── 유틸 ───────────────────────────────────────────────
function numberValue(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^\d.-]/g, ''));
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function flatten(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap((item) => flatten(item));
  if (typeof value === 'string') return [value];
  return [];
}

function parseRecord(source: unknown): Record<string, number> {
  const result: Record<string, number> = {};
  if (!source) return result;

  if (typeof source === 'object' && !Array.isArray(source)) {
    for (const [key, val] of Object.entries(source as Record<string, unknown>)) {
      result[key] = numberValue(val);
    }
  } else if (Array.isArray(source)) {
    for (const item of source) {
      if (Array.isArray(item) && typeof item[0] === 'string') {
        result[item[0]] = numberValue(item[1]);
      }
    }
  }
  return result;
}

function toGroups(value: unknown): TenGodGroup[] {
  return flatten(value).filter((v): v is TenGodGroup => GROUPS.includes(v as TenGodGroup));
}

// ─── 사주 데이터 추출 ────────────────────────────────────
function getStrengthScore(data: SajuData): number {
  const value = String(data['사주강약'] ?? '');
  if (value.includes('극신강') || value.includes('태강')) return 90;
  if (value.includes('극신약') || value.includes('태약')) return 20;
  if (value.includes('신강')) return 75;
  if (value.includes('신약')) return 35;
  if (value.includes('중화')) return 55;
  return 50;
}

type UsefulGods = { main: TenGodGroup[]; helper: TenGodGroup[]; avoid: TenGodGroup[] };

// 용신: { 용신: ['비겁'], 희신: ['인성','식상'], 기신: ['재성','관성'] }
function getUsefulGods(data: SajuData): UsefulGods {
  const src = data['용신'];
  let result: UsefulGods = { main: [], helper: [], avoid: [] };

  if (src && typeof src === 'object' && !Array.isArray(src)) {
    result = {
      main: toGroups(src['용신']),
      helper: toGroups(src['희신']),
      avoid: toGroups(src['기신']),
    };
  }

  const isEmpty = !result.main.length && !result.helper.length && !result.avoid.length;
  const alt = data['격용신']; // [[용신],[희신],[기신]]
  if (isEmpty && Array.isArray(alt)) {
    result = { main: toGroups(alt[0]), helper: toGroups(alt[1]), avoid: toGroups(alt[2]) };
  }
  return result;
}

// 일간(자기 자신)은 제외하고, 시간을 모르면 시주도 제외
function collectGods(data: SajuData, hourUnknown: boolean) {
  const gods: string[] = [];
  const stems: string[] = [];
  let monthGod = '';

  const src = data['십성'];
  if (!Array.isArray(src)) return { gods, stems, monthGod };

  src.forEach((pillar: unknown, index: number) => {
    if (!Array.isArray(pillar)) return;
    if (index === HOUR_PILLAR && hourUnknown) return;

    const stem = pillar[0];
    const branch = pillar[1];

    if (index !== DAY_PILLAR && typeof stem === 'string' && stem in TENGOD_WEIGHTS) {
      gods.push(stem);
      stems.push(stem);
    }
    if (typeof branch === 'string' && branch in TENGOD_WEIGHTS) {
      gods.push(branch);
      if (index === MONTH_PILLAR) monthGod = branch;
    }
  });

  return { gods, stems, monthGod };
}

// 현재 대운 십성: 대운.현재.간지를 대운순서에서 찾아 같은 인덱스의 십성을 사용
function getCurrentLuckGods(data: SajuData): { stem: string; branch: string } | null {
  const current = data['대운']?.['현재']?.['간지'];
  const order = data['대운순서'];
  const gods = data['대운순서십성'];
  if (typeof current !== 'string' || !Array.isArray(order) || !Array.isArray(gods)) return null;

  const index = order.indexOf(current);
  if (index < 0) return null;

  const pair = gods[index];
  if (!Array.isArray(pair)) return null;
  return { stem: String(pair[0] ?? ''), branch: String(pair[1] ?? '') };
}

// 격국 → 유형 가산점. 종격/화격은 신강약 판정이 뒤집히므로 special로 표시
function parseStructure(raw: string): { special: boolean; boosts: Weight[] } {
  const s = raw.replace(/\s/g, '');
  if (!s) return { special: false, boosts: [] };

  if (/종재/.test(s)) return { special: true, boosts: [['investment', 6]] };
  if (/종아|종식|종상/.test(s)) return { special: true, boosts: [['talent', 6]] };
  if (/종관|종살/.test(s)) return { special: true, boosts: [['stable', 6]] };
  if (/종강|종왕|전왕|종비|종겁/.test(s)) return { special: true, boosts: [['business', 6]] };
  if (/종|화격/.test(s)) return { special: true, boosts: [] };

  if (/식신|상관|식상/.test(s)) return { special: false, boosts: [['talent', 6]] };
  if (/편재/.test(s)) return { special: false, boosts: [['opportunity', 6]] };
  if (/정재|재격/.test(s)) return { special: false, boosts: [['investment', 6]] };
  if (/정관|편관|칠살|관격/.test(s)) return { special: false, boosts: [['stable', 6]] };
  if (/정인|편인|인수|인격/.test(s)) return { special: false, boosts: [['stable', 5]] };
  if (/건록|양인|비겁/.test(s)) return { special: false, boosts: [['business', 5]] };

  return { special: false, boosts: [] };
}

// ─── 분석 이유 ───────────────────────────────────────────
type ReasonContext = {
  val: (group: TenGodGroup) => number;
  gods: string[];
  monthGod: string;
  luck: { stem: string; branch: string } | null;
  useful: UsefulGods;
  special: boolean;
  isStrong: boolean;
  isWeak: boolean;
  siksangSaengJae: boolean;
  tonggwan: boolean;
};

function buildReasons(code: MoneyTypeCode, c: ReasonContext): string[] {
  const r: string[] = [];
  const has = (...names: string[]) => c.gods.some((g) => names.includes(g));
  const monthIs = (...names: string[]) => names.includes(c.monthGod);
  const luckHas = (...names: string[]) =>
    !!c.luck && (names.includes(c.luck.stem) || names.includes(c.luck.branch));
  const favors = (group: TenGodGroup) =>
    c.useful.main.includes(group) || c.useful.helper.includes(group);

  switch (code) {
    case 'stable':
      if (c.val('관성') >= 25) r.push('관성이 발달해 조직·규칙 안에서 힘을 받는 편');
      if (c.val('인성') >= 25) r.push('인성이 발달해 전문성·자격을 바탕으로 쌓아가는 편');
      if (monthIs('정관', '편관', '정인', '편인')) r.push('월령에 관성·인성이 자리해 안정적인 기반이 됨');
      if (c.isWeak && !c.special) r.push('신약한 구조라 무리한 확장보다 꾸준한 수입이 잘 맞음');
      if (favors('관성') || favors('인성')) r.push('용신·희신이 관성·인성 쪽으로 향함');
      break;

    case 'talent':
      if (c.val('식상') >= 25) r.push('식상이 발달한 편');
      if (c.val('식상') >= 30) r.push('표현·창작 성향이 강한 편');
      if (monthIs('식신', '상관')) r.push('월령에 식신·상관이 자리함');
      if (has('식신', '상관')) r.push('식신·상관 성향이 나타남');
      if (luckHas('식신', '상관')) r.push('현재 대운에 식상이 들어와 재능을 수익으로 잇기 좋은 시기');
      if (favors('식상')) r.push('식상이 용신·희신에 해당함');
      break;

    case 'business':
      if (c.val('비겁') >= 25) r.push('비겁이 발달한 편');
      if (c.val('식상') >= 25) r.push('실행과 결과물을 나타내는 식상이 발달한 편');
      if (has('비견', '겁재')) r.push('자기주도적인 비겁 성향이 나타남');
      if (c.isStrong && !c.special) r.push('신강해 스스로 판을 이끄는 힘이 있음');
      if (c.useful.main.includes('비겁')) r.push('비겁이 용신이라 독립적으로 움직일 때 힘이 실림');
      break;

    case 'investment':
      if (c.val('재성') >= 25) r.push('재성이 발달한 편');
      if (monthIs('정재', '편재')) r.push('월령에 재성이 자리함');
      if (has('정재', '편재')) r.push('정재·편재 성향이 나타남');
      if (c.isStrong && c.val('재성') >= 20 && !c.special) r.push('신강해 재성을 감당할 힘이 있음');
      if (favors('재성')) r.push('재성이 용신·희신에 해당함');
      break;

    case 'opportunity':
      if (has('편재')) r.push('편재 성향이 나타남');
      if (c.siksangSaengJae) r.push('식상과 재성이 함께 발달한 식상생재 구조');
      if (c.val('식상') >= 30) r.push('변화에 대응하는 실행력이 강한 편');
      if (luckHas('편재', '상관')) r.push('현재 대운에 재물 기회를 키우는 십성이 들어옴');
      break;

    case 'network':
      if (c.tonggwan) r.push('비겁이 식상을 거쳐 재성으로 이어지는 흐름이 있음');
      if (has('비견', '겁재')) r.push('사람과 함께 움직이는 성향이 나타남');
      if (has('정재', '편재')) r.push('사람과 재물이 연결되는 구조가 나타남');
      break;
  }

  return r.slice(0, 4);
}

// ─── 메인 분석 ───────────────────────────────────────────
function analyzeMoneyType(
  data: SajuData,
  options: { birthTimeUnknown?: boolean } = {},
): MoneyTypeResult {
  const scores: MoneyScores = {
    stable: 50,
    talent: 50,
    business: 50,
    investment: 50,
    opportunity: 50,
    network: 50,
  };

  const add = (type: MoneyTypeCode, amount: number) => {
    scores[type] += amount;
  };
  const addWeights = (weights: Weight[] | undefined, factor = 1) => {
    (weights ?? []).forEach(([type, w]) => add(type, w * factor));
  };

  const developed = parseRecord(data['발달십성']);
  const val = (group: TenGodGroup) => developed[group] ?? AVG_SHARE;
  const dev = (group: TenGodGroup) => val(group) - AVG_SHARE;

  // 1. 발달십성: 평균(20) 대비 얼마나 치우쳤는지로 계산 (고정 임계값 대신)
  add('stable', dev('관성') * 0.6 + dev('인성') * 0.4);
  add('talent', dev('식상') * 0.8);
  add('business', dev('비겁') * 0.5 + dev('식상') * 0.3);
  add('investment', dev('재성') * 0.8);
  add('opportunity', dev('재성') * 0.4 + dev('식상') * 0.4);
  add('network', dev('비겁') * 0.3 + dev('재성') * 0.3);

  // 2. 십성 배치 (일간 제외, 시간 모르면 시주 제외) + 월령 가중
  const { gods, stems, monthGod } = collectGods(data, !!options.birthTimeUnknown);
  gods.forEach((god) => addWeights(TENGOD_WEIGHTS[god]));
  if (monthGod) addWeights(TENGOD_WEIGHTS[monthGod], MONTH_EXTRA);
  if (stems.includes('편재')) add('opportunity', 3); // 편재가 천간에 드러남

  // 3. 격국
  const structure = parseStructure(String(data['격구분'] ?? ''));
  addWeights(structure.boosts);

  // 4. 용신 / 희신 / 기신
  const useful = getUsefulGods(data);
  useful.main.forEach((g) => addWeights(GROUP_WEIGHTS[g], 5));
  useful.helper.forEach((g) => addWeights(GROUP_WEIGHTS[g], 2.5));
  useful.avoid.forEach((g) => addWeights(GROUP_WEIGHTS[g], -3));

  // 5. 신강/신약 (강약 가산은 여기서 한 번만, 종격·화격은 제외)
  const strengthScore = getStrengthScore(data);
  const isStrong = strengthScore >= 75;
  const isWeak = strengthScore <= 35;

  if (!structure.special) {
    if (isStrong) {
      add('business', 6);
      add('network', 2);
      if (val('재성') >= 20) add('investment', 4); 
    }
    if (isWeak) {
      add('stable', 4);
      add('business', -4);

      // 재다신약: 재물이 많아도 내 것으로 만들기 어려움
      const excess = val('재성') - AVG_SHARE;
      if (excess > 0) {
        const penalty = Math.min(12, excess * 0.8);
        add('investment', -penalty);
        add('opportunity', -penalty * 0.4);
        add('stable', 3);
      }
    }

    // 군겁쟁재: 비겁은 많고 재성은 약하며 식상 통관도 없음
    if (val('비겁') >= 30 && val('재성') <= 10 && val('식상') < 15) {
      add('investment', -5);
      add('network', -6);
    }
  }

  // 6. 흐름: 식상생재 / 비겁→식상→재성 통관
  const siksangSaengJae = val('식상') >= 25 && val('재성') >= 15;
  const tonggwan = val('비겁') >= 22 && val('식상') >= 20 && val('재성') >= 15;
  if (siksangSaengJae) {
    add('opportunity', 4);
    add('investment', 3);
  }
  if (tonggwan) add('network', 8);

  // 7. 현재 대운 (영향은 작게)
  const luck = getCurrentLuckGods(data);
  if (luck) {
    addWeights(TENGOD_WEIGHTS[luck.stem], 2);
    addWeights(TENGOD_WEIGHTS[luck.branch], 1.5);
  }

  // 8. 정규화 및 결정
  const normalized: MoneyScores = {
    stable: clamp(scores.stable),
    talent: clamp(scores.talent),
    business: clamp(scores.business),
    investment: clamp(scores.investment),
    opportunity: clamp(scores.opportunity),
    network: clamp(scores.network),
  };

  const sorted = (Object.entries(normalized) as [MoneyTypeCode, number][]).sort((a, b) => {
    const diff = b[1] - a[1];
    if (diff !== 0) return diff;
    return TIE_PRIORITY.indexOf(a[0]) - TIE_PRIORITY.indexOf(b[0]);
  });

  const code = sorted[0][0];

  const reasons = buildReasons(code, {
    val,
    gods,
    monthGod,
    luck,
    useful,
    special: structure.special,
    isStrong,
    isWeak,
    siksangSaengJae,
    tonggwan,
  });

  if (sorted[0][1] - sorted[1][1] <= 5) {
    reasons.push(`${TYPE_LABEL[sorted[1][0]]} 성향도 비슷하게 나타나는 복합형`);
  }
  if (reasons.length === 0) {
    reasons.push('사주의 전체적인 구조를 기준으로 분석');
  }

  return { code, scores: normalized, reason: reasons.slice(0, 5) };
}

// ─── API 요청 처리 ───────────────────────────────────────
interface RequestBody {
  birthday: string;
  birthTime?: string;
  gender: 'female' | 'male';
  calendarType?: 'solar' | 'lunar';
  birthTimeUnknown?: boolean;
}

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
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

function getSajuSource(data: any): any {
  if (data && typeof data === 'object') {
    if (data.data && typeof data.data === 'object') return data.data;
    if (data.result && typeof data.result === 'object') return data.result;
  }
  return data;
}

function convertBirthTime(birthTime?: string): string {
  if (!birthTime) return '';
  const value = birthTime.trim();
  if (!value || value === '모름' || value === 'unknown') return '';

  const amPmMatch = value.match(/(오전|오후)\s*(\d{1,2}):?(\d{2})/);
  if (amPmMatch) {
    let hour = parseInt(amPmMatch[2], 10);
    const minute = amPmMatch[3];
    if (amPmMatch[1] === '오후' && hour < 12) hour += 12;
    if (amPmMatch[1] === '오전' && hour === 12) hour = 0;
    return String(hour).padStart(2, '0') + minute;
  }

  const timeMatch = value.match(/^(\d{1,2}):?(\d{2})$/);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2];
    if (hour >= 0 && hour <= 23) {
      return String(hour).padStart(2, '0') + minute;
    }
  }
  return '';
}

async function requestStargio(input: RequestBody) {
  const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
  if (!sajuApiKey) throw new Error('SAJU_API_KEY 환경변수가 설정되어 있지 않습니다.');

  const cleanBirthday = input.birthday.replace(/[^0-9]/g, '');
  if (cleanBirthday.length !== 8) throw new Error('생년월일 형식이 올바르지 않습니다.');

  const convertedTime = input.birthTimeUnknown ? '' : convertBirthTime(input.birthTime);
  const apiBirthday = cleanBirthday + (convertedTime || '1200');

  const isLunar = input.calendarType === 'lunar';
  const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${encodeURIComponent(
    apiBirthday,
  )}&lunar=${isLunar}&gender=${encodeURIComponent(input.gender)}&apiKey=${encodeURIComponent(sajuApiKey)}`;

  let sajuData: any = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(sajuApiUrl, { method: 'GET', headers: BROWSER_HEADERS });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const parsed = await response.json();
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        sajuData = parsed;
        break;
      }
      throw new Error('Stargio API 응답이 비어 있습니다.');
    } catch (error) {
      console.error(`Stargio API 시도 ${attempt}/3 실패:`, error instanceof Error ? error.message : error);
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  if (!sajuData) throw new Error('Stargio API에서 사주 정보를 가져오지 못했습니다.');
  return sajuData;
}

async function saveMoneyTypeResult(input: {
  resultId: string;
  typeCode: MoneyTypeCode;
  scores: MoneyScores;
  reason: string[];
  gender: string;
  birthday: string;
  birthTime: string;
  calendarType: string;
  sajuData: unknown;
}) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseServiceKey) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { error } = await supabase.from('money_type_results').insert({
    result_id: input.resultId,
    type_code: input.typeCode,
    scores: input.scores,
    reason: input.reason,
    gender: input.gender,
    birth_date: input.birthday,
    birth_time: input.birthTime,
    calendar_type: input.calendarType,
    saju_data: input.sajuData,
  });

  if (error) throw new Error(`돈 버는 방식 결과 저장 실패: ${error.message}`);
}

async function fetchTypeInfo(code: MoneyTypeCode) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, key);
  const { data } = await supabase
    .from('money_types')
    .select('code, title, emoji, keyword, description, money_formula, strengths, caution')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();
  return data ?? null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    if (req.method !== 'POST') {
      return errorResponse(req, 'POST 요청만 사용할 수 있습니다.', 405);
    }

    const body: RequestBody = await req.json();
    const { birthday, birthTime, gender, calendarType = 'solar', birthTimeUnknown } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수 입력 사항입니다.', 400);
    }

    const cleanBirthday = birthday.replace(/[^0-9]/g, '');
    if (cleanBirthday.length !== 8) {
      return errorResponse(req, '생년월일은 YYYYMMDD 형식으로 입력해주세요.', 400);
    }

    const convertedBirthTime = birthTimeUnknown ? '' : convertBirthTime(birthTime);
    const hourUnknown = !convertedBirthTime;

    const sajuData = await requestStargio({
      birthday: cleanBirthday,
      birthTime: birthTime ?? '',
      gender,
      calendarType,
      birthTimeUnknown,
    });

    const analysisSource = getSajuSource(sajuData);
    const analysis = analyzeMoneyType(analysisSource, { birthTimeUnknown: hourUnknown });
    const resultId = crypto.randomUUID();

    await saveMoneyTypeResult({
      resultId,
      typeCode: analysis.code,
      scores: analysis.scores,
      reason: analysis.reason,
      gender,
      birthday: cleanBirthday,
      birthTime: convertedBirthTime,
      calendarType,
      sajuData,
    });

    const typeInfo = await fetchTypeInfo(analysis.code);

    return jsonResponse(req, {
      success: true,
      resultId,
      data: {
        code: analysis.code,
        scores: analysis.scores,
        reason: analysis.reason,
        typeInfo,
      },
    });
  } catch (err) {
    console.error('💰 돈 버는 방식 분석 API 처리 에러:', err);
    return errorResponse(req, err instanceof Error ? err.message : '서버 오류가 발생했습니다.', 500);
  }
});