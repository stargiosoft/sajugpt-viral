import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const error = (message: string, status = 400) =>
  json({ success: false, error: message }, status);

export type MoneyTypeCode =
  | 'stable'
  | 'talent'
  | 'business'
  | 'investment'
  | 'opportunity'
  | 'network';

export type MoneyScores = Record<MoneyTypeCode, number>;

type SajuData = Record<string, any>;
type TenGodGroup = '비겁' | '식상' | '재성' | '관성' | '인성';
type Weight = [MoneyTypeCode, number];

const TYPE_LABEL: Record<MoneyTypeCode, string> = {
  stable: '안정수입형',
  talent: '재능수익형',
  business: '사업개척형',
  investment: '자산증식형',
  opportunity: '기회포착형',
  network: '인맥재물형',
};

const TIE_PRIORITY: MoneyTypeCode[] = [
  'talent',
  'business',
  'opportunity',
  'investment',
  'network',
  'stable',
];

const GROUPS: TenGodGroup[] = [
  '비겁',
  '식상',
  '재성',
  '관성',
  '인성',
];

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

const GROUP_WEIGHTS: Record<TenGodGroup, Weight[]> = {
  비겁: [['business', 1], ['network', 0.5]],
  식상: [['talent', 1], ['opportunity', 0.5]],
  재성: [['investment', 1], ['opportunity', 0.5]],
  관성: [['stable', 1]],
  인성: [['stable', 1]],
};

const AVG_SHARE = 20;
const MONTH_EXTRA = 3;

function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function flatten(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(flatten);
  return typeof value === 'string' ? [value] : [];
}

function parseRecord(source: unknown): Record<string, number> {
  const result: Record<string, number> = {};
  if (!source) return result;

  if (typeof source === 'object' && !Array.isArray(source)) {
    for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
      result[key] = numberValue(value);
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
  return flatten(value).filter(
    (v): v is TenGodGroup => GROUPS.includes(v as TenGodGroup),
  );
}

function getStrengthScore(data: SajuData) {
  const value = String(data['사주강약'] ?? '');
  if (value.includes('극신강') || value.includes('태강')) return 90;
  if (value.includes('극신약') || value.includes('태약')) return 20;
  if (value.includes('신강')) return 75;
  if (value.includes('신약')) return 35;
  if (value.includes('중화')) return 55;
  return 50;
}

function getUsefulGods(data: SajuData) {
  const src = data['용신'];
  let result = { main: [] as TenGodGroup[], helper: [] as TenGodGroup[], avoid: [] as TenGodGroup[] };

  if (src && typeof src === 'object' && !Array.isArray(src)) {
    result = {
      main: toGroups(src['용신']),
      helper: toGroups(src['희신']),
      avoid: toGroups(src['기신']),
    };
  }

  if (!result.main.length && !result.helper.length && !result.avoid.length) {
    const alt = data['격용신'];
    if (Array.isArray(alt)) {
      result = {
        main: toGroups(alt[0]),
        helper: toGroups(alt[1]),
        avoid: toGroups(alt[2]),
      };
    }
  }

  return result;
}

function collectGods(data: SajuData, hourUnknown: boolean) {
  const gods: string[] = [];
  const stems: string[] = [];
  let monthGod = '';

  if (!Array.isArray(data['십성'])) return { gods, stems, monthGod };

  data['십성'].forEach((pillar: unknown, index: number) => {
    if (!Array.isArray(pillar)) return;
    if (index === 0 && hourUnknown) return;

    const [stem, branch] = pillar;

    if (index !== 1 && typeof stem === 'string' && stem in TENGOD_WEIGHTS) {
      gods.push(stem);
      stems.push(stem);
    }

    if (typeof branch === 'string' && branch in TENGOD_WEIGHTS) {
      gods.push(branch);
      if (index === 2) monthGod = branch;
    }
  });

  return { gods, stems, monthGod };
}

function getCurrentLuckGods(data: SajuData) {
  const current = data['대운']?.['현재']?.['간지'];
  const order = data['대운순서'];
  const gods = data['대운순서십성'];

  if (!current || !Array.isArray(order) || !Array.isArray(gods)) return null;

  const index = order.indexOf(current);
  const pair = index >= 0 ? gods[index] : null;

  return Array.isArray(pair)
    ? { stem: String(pair[0] ?? ''), branch: String(pair[1] ?? '') }
    : null;
}

function parseStructure(raw: string) {
  const s = raw.replace(/\s/g, '');
  if (!s) return { special: false, boosts: [] as Weight[] };

  if (/종재/.test(s)) return { special: true, boosts: [['investment', 6] as Weight] };
  if (/종아|종식|종상/.test(s)) return { special: true, boosts: [['talent', 6] as Weight] };
  if (/종관|종살/.test(s)) return { special: true, boosts: [['stable', 6] as Weight] };
  if (/종강|종왕|전왕|종비|종겁/.test(s)) return { special: true, boosts: [['business', 6] as Weight] };
  if (/종|화격/.test(s)) return { special: true, boosts: [] };

  if (/식신|상관|식상/.test(s)) return { special: false, boosts: [['talent', 6] as Weight] };
  if (/편재/.test(s)) return { special: false, boosts: [['opportunity', 6] as Weight] };
  if (/정재|재격/.test(s)) return { special: false, boosts: [['investment', 6] as Weight] };
  if (/정관|편관|칠살|관격/.test(s)) return { special: false, boosts: [['stable', 6] as Weight] };
  if (/정인|편인|인수|인격/.test(s)) return { special: false, boosts: [['stable', 5] as Weight] };
  if (/건록|양인|비겁/.test(s)) return { special: false, boosts: [['business', 5] as Weight] };

  return { special: false, boosts: [] as Weight[] };
}

function buildReasons(code: MoneyTypeCode, c: any): string[] {
  const r: string[] = [];
  const has = (...names: string[]) => c.gods.some((g: string) => names.includes(g));
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

function analyzeMoneyType(data: SajuData, options: { birthTimeUnknown?: boolean } = {}) {
  const scores: MoneyScores = {
    stable: 50, talent: 50, business: 50,
    investment: 50, opportunity: 50, network: 50,
  };

  const add = (type: MoneyTypeCode, amount: number) => { scores[type] += amount; };
  const addWeights = (weights?: Weight[], factor = 1) =>
    (weights ?? []).forEach(([type, weight]) => add(type, weight * factor));

  const developed = parseRecord(data['발달십성']);
  const val = (group: TenGodGroup) => developed[group] ?? AVG_SHARE;
  const dev = (group: TenGodGroup) => val(group) - AVG_SHARE;

  add('stable', dev('관성') * 0.6 + dev('인성') * 0.4);
  add('talent', dev('식상') * 0.8);
  add('business', dev('비겁') * 0.5 + dev('식상') * 0.3);
  add('investment', dev('재성') * 0.8);
  add('opportunity', dev('재성') * 0.4 + dev('식상') * 0.4);
  add('network', dev('비겁') * 0.3 + dev('재성') * 0.3);

  const { gods, stems, monthGod } = collectGods(data, !!options.birthTimeUnknown);
  gods.forEach((god) => addWeights(TENGOD_WEIGHTS[god]));
  if (monthGod) addWeights(TENGOD_WEIGHTS[monthGod], MONTH_EXTRA);
  if (stems.includes('편재')) add('opportunity', 3);

  const structure = parseStructure(String(data['격구분'] ?? ''));
  addWeights(structure.boosts);

  const useful = getUsefulGods(data);
  useful.main.forEach((g) => addWeights(GROUP_WEIGHTS[g], 5));
  useful.helper.forEach((g) => addWeights(GROUP_WEIGHTS[g], 2.5));
  useful.avoid.forEach((g) => addWeights(GROUP_WEIGHTS[g], -3));

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

      const excess = val('재성') - AVG_SHARE;
      if (excess > 0) {
        const penalty = Math.min(12, excess * 0.8);
        add('investment', -penalty);
        add('opportunity', -penalty * 0.4);
        add('stable', 3);
      }
    }

    if (val('비겁') >= 30 && val('재성') <= 10 && val('식상') < 15) {
      add('investment', -5);
      add('network', -6);
    }
  }

  const siksangSaengJae = val('식상') >= 25 && val('재성') >= 15;
  const tonggwan = val('비겁') >= 22 && val('식상') >= 20 && val('재성') >= 15;

  if (siksangSaengJae) {
    add('opportunity', 4);
    add('investment', 3);
  }

  if (tonggwan) add('network', 8);

  const luck = getCurrentLuckGods(data);
  if (luck) {
    addWeights(TENGOD_WEIGHTS[luck.stem], 2);
    addWeights(TENGOD_WEIGHTS[luck.branch], 1.5);
  }

  const normalized = Object.fromEntries(
    Object.entries(scores).map(([key, value]) => [key, clamp(value)]),
  ) as MoneyScores;

  const sorted = (Object.entries(normalized) as [MoneyTypeCode, number][])
    .sort((a, b) => b[1] - a[1] || TIE_PRIORITY.indexOf(a[0]) - TIE_PRIORITY.indexOf(b[0]));

  const code = sorted[0][0];

  const reasons = buildReasons(code, {
    val, gods, monthGod, luck, useful,
    special: structure.special, isStrong, isWeak,
    siksangSaengJae, tonggwan,
  });

  if (sorted[0][1] - sorted[1][1] <= 5) {
    reasons.push(`${TYPE_LABEL[sorted[1][0]]} 성향도 비슷하게 나타나는 복합형`);
  }

  if (!reasons.length) reasons.push('사주의 전체적인 구조를 기준으로 분석');

  return {
    code,
    scores: normalized,
    reason: reasons.slice(0, 5),
  };
}

type RequestBody = {
  birthday: string;
  birthTime?: string;
  gender: 'female' | 'male';
  calendarType?: 'solar' | 'lunar';
  birthTimeUnknown?: boolean;
};

const BROWSER_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
  Origin: 'https://nadaunse.com',
  Referer: 'https://nadaunse.com/',
  'User-Agent': 'Mozilla/5.0',
};

function getSajuSource(data: any) {
  return data?.data ?? data?.result ?? data;
}

function convertBirthTime(birthTime?: string) {
  if (!birthTime || ['모름', 'unknown'].includes(birthTime.trim())) return '';

  const value = birthTime.trim();
  const ampm = value.match(/(오전|오후)\s*(\d{1,2}):?(\d{2})/);

  if (ampm) {
    let hour = Number(ampm[2]);
    if (ampm[1] === '오후' && hour < 12) hour += 12;
    if (ampm[1] === '오전' && hour === 12) hour = 0;
    return `${String(hour).padStart(2, '0')}${ampm[3]}`;
  }

  const match = value.match(/^(\d{1,2}):?(\d{2})$/);
  if (match && Number(match[1]) <= 23) {
    return `${String(Number(match[1])).padStart(2, '0')}${match[2]}`;
  }

  return '';
}

async function requestStargio(input: RequestBody) {
  const apiKey = Deno.env.get('SAJU_API_KEY')?.trim();
  if (!apiKey) throw new Error('SAJU_API_KEY 환경변수가 설정되어 있지 않습니다.');

  const birthday = input.birthday.replace(/\D/g, '');
  if (birthday.length !== 8) throw new Error('생년월일 형식이 올바르지 않습니다.');

  const time = input.birthTimeUnknown ? '' : convertBirthTime(input.birthTime);
  const url =
    `https://service.stargio.co.kr:8400/StargioSaju?birthday=${birthday}${time || '1200'}` +
    `&lunar=${input.calendarType === 'lunar'}&gender=${input.gender}&apiKey=${apiKey}`;

  for (let i = 1; i <= 3; i++) {
    try {
      const response = await fetch(url, { headers: BROWSER_HEADERS });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data && typeof data === 'object' && Object.keys(data).length) return data;
    } catch (err) {
      console.error(`Stargio API ${i}/3 실패`, err);
      if (i < 3) await new Promise((r) => setTimeout(r, i * 1000));
    }
  }

  throw new Error('Stargio API에서 사주 정보를 가져오지 못했습니다.');
}

function getServiceSupabase() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');
  return createClient(url, key);
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
  const { error: dbError } = await getServiceSupabase()
    .from('money_type_results')
    .insert({
      result_id: input.resultId,
      type_code: input.typeCode,
      scores: input.scores,
      reason: input.reason,
      gender: input.gender,
      birth_date: input.birthday,
      birth_time: input.birthTime,
      calendar_type: input.calendarType,
    });

  if (dbError) throw new Error(`결과 저장 실패: ${dbError.message}`);
}

async function fetchTypeInfo(code: MoneyTypeCode) {
  const { data, error } = await getServiceSupabase()
    .from('money_types')
    .select('code,title,emoji,keyword,description,money_formula,strengths,caution')
    .eq('code', code)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(`유형 정보 조회 실패: ${error.message}`);
  return data ?? null;
}

async function getMoneyTypeResult(req: Request) {
  const resultId = new URL(req.url).searchParams.get('resultId')?.trim();
  if (!resultId) return error('resultId가 필요합니다.');

  const { data: result, error: resultError } = await getServiceSupabase()
    .from('money_type_results')
    .select('id,result_id,type_code,scores,reason,created_at')
    .eq('result_id', resultId)
    .maybeSingle();

  if (resultError) throw new Error(`결과 조회 실패: ${resultError.message}`);
  if (!result) return error('해당 결과를 찾을 수 없습니다.', 404);

  const typeInfo = await fetchTypeInfo(result.type_code as MoneyTypeCode);

  return json({
    success: true,
    resultId: result.result_id,
    data: {
      code: result.type_code,
      scores: result.scores ?? {},
      reason: Array.isArray(result.reason) ? result.reason : [],
      typeInfo,
      created_at: result.created_at,
    },
  });
}

async function createMoneyTypeResult(req: Request) {
  const body: RequestBody = await req.json();
  const { birthday, birthTime, gender, calendarType = 'solar', birthTimeUnknown } = body;

  if (!birthday || !gender) {
    return error('생년월일과 성별은 필수 입력 사항입니다.');
  }

  const cleanBirthday = birthday.replace(/\D/g, '');
  if (cleanBirthday.length !== 8) {
    return error('생년월일은 YYYYMMDD 형식으로 입력해주세요.');
  }

  const convertedBirthTime = birthTimeUnknown ? '' : convertBirthTime(birthTime);

  const sajuData = await requestStargio({
    birthday: cleanBirthday,
    birthTime: birthTime ?? '',
    gender,
    calendarType,
    birthTimeUnknown,
  });

  const analysis = analyzeMoneyType(getSajuSource(sajuData), {
    birthTimeUnknown: !convertedBirthTime,
  });

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

  return json({
    success: true,
    resultId,
    data: {
      code: analysis.code,
      scores: analysis.scores,
      reason: analysis.reason,
      typeInfo: await fetchTypeInfo(analysis.code),
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

  try {
    if (req.method === 'GET') return await getMoneyTypeResult(req);
    if (req.method === 'POST') return await createMoneyTypeResult(req);
    return error('GET, POST 요청만 사용할 수 있습니다.', 405);
  } catch (err) {
    console.error('money-type API error:', err);
    return error(err instanceof Error ? err.message : '서버 오류가 발생했습니다.', 500);
  }
});