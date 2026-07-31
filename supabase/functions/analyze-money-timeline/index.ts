import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 정의 ──────────────────────────────────────────

interface RequestBody {
  birthday: string;
  birthTime?: string;
  gender: 'female' | 'male';
  calendarType?: 'solar' | 'lunar';
  birthTimeUnknown?: boolean;
}

type SipsungCategory = '비겁' | '식상' | '재성' | '관성' | '인성';

interface DaeunPeriod {
  ageStart: number;
  ageEnd: number;
  score: number;
  status: string;
  categories: [SipsungCategory, SipsungCategory];
  daeunGanji: string;
  unsung: string;
}

interface DaeunAnchor {
  간지?: string;
  대운기간나이?: [number, number];
}

// ─── STARGIO API 설정 ──────────────────────────────────

const BROWSER_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en-US;q=0.7',
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

// ─── 십성 → 카테고리 매핑 ────────────────────────────────

const SIPSUNG_TO_CATEGORY: Record<string, SipsungCategory> = {
  '비견': '비겁', '겁재': '비겁',
  '식신': '식상', '상관': '식상',
  '편재': '재성', '정재': '재성',
  '편관': '관성', '정관': '관성',
  '편인': '인성', '정인': '인성',
};

function categoryOf(sipsung: string): SipsungCategory {
  return SIPSUNG_TO_CATEGORY[sipsung] ?? '비겁';
}

const CATEGORY_BASE_WEIGHT: Record<SipsungCategory, number> = {
  재성: 22,
  식상: 18,
  관성: 13,
  비겁: 7,
  인성: 7,
};

function yongsinBonus(
  category: SipsungCategory,
  yongsin: Set<string>,
  huisin: Set<string>,
  gisin: Set<string>,
): number {
 if(yongsin.has(category)) return 15;
 if(huisin.has(category)) return 8;
 if(gisin.has(category)) return -5;
  return 0;
}

const TWELVE_STAGE_BONUS: Record<string, number> = {
  '건록': 12, '제왕': 12,
  '관대': 8, '장생': 8,
  '목욕': 4, '양': 4,
  '태': 2,
  '쇠': 0,
  '병': -3,
  '사': -5, '묘': -5, '절': -5,
};

function normalizeStage(stage: string): string {
  return stage
    .replace('長生', '장생').replace('沐浴', '목욕').replace('冠帶', '관대')
    .replace('建祿', '건록').replace('帝旺', '제왕').replace('帝王', '제왕')
    .replace('衰', '쇠').replace('病', '병').replace('死', '사')
    .replace('墓', '묘').replace('絶', '절').replace('胎', '태').replace('養', '양');
}

function twelveStageBonus(stage: string | undefined): number {
  if (!stage) return 0;
  return TWELVE_STAGE_BONUS[normalizeStage(stage)] ?? 0;
}

function comboAdjustment(
  catCheon: SipsungCategory,
  catJi: SipsungCategory,
): number {
  const has = (c: SipsungCategory) =>
    catCheon === c || catJi === c;
  const hasBoth = (a: SipsungCategory, b: SipsungCategory) =>
    (catCheon === a && catJi === b) ||
    (catCheon === b && catJi === a);
  // ─── 재물 극대화 조합 ─────────────────────
  // 식상생재 / 상관생재
  if (hasBoth('식상', '재성'))
    return 20;
  // 재물 + 권한 / 사업 확장
  if (hasBoth('재성', '관성'))
    return 18;
  // 재성 자체 강화
  if (catCheon === '재성' && catJi === '재성')
    return 20;
  // ─── 성장/성과 조합 ─────────────────────
  // 관인상생 (직업·전문성)
  if (hasBoth('관성', '인성'))
    return 12;
  // 식상+관성 (능력 → 사회적 성과)
  if (hasBoth('식상', '관성'))
    return 10;
  // 식상 발현
  if (catCheon === '식상' && catJi === '식상')
    return 12;
  // 관성 안정 성장
  if (catCheon === '관성' && catJi === '관성')
    return 10;
  // ─── 전문성/지식 활용 ───────────────────
  // 인성 → 식상 (배움 활용)
  if (hasBoth('인성', '식상'))
    return 9;
  // 인성 → 재성 (지식 자산화)
  if (hasBoth('인성', '재성'))
    return 8;
  // ─── 경쟁/확장 조합 ─────────────────────
  // 비겁 + 재성 (경쟁 속 돈)
  if (hasBoth('비겁', '재성'))
    return 8;
  // 비겁 + 식상 (활동력)
  if (hasBoth('비겁', '식상'))
    return 7;
  // 비겁 + 관성 (경쟁력)
  if (hasBoth('비겁', '관성'))
    return 5;
  // 비겁 + 인성 (인맥/정보)
  if (hasBoth('비겁', '인성'))
    return 5;
  // ─── 단일 성향 ─────────────────────────
  // 비겁 과다: 독립성은 있으나 재물 변동성
  if (catCheon === '비겁' && catJi === '비겁')
    return 3;
  // 인성 과다: 준비/축적형
  if (catCheon === '인성' && catJi === '인성')
    return 4;
  return 0;
}

function resolveDaeunAgeStarts(
  daeunSunseo: string[],
  daeunCurrent: DaeunAnchor | undefined,
  fallbackStartAge: number,
): number[] {
  return daeunSunseo.map((_, i) => fallbackStartAge + i * 10);
}

const SAJU_GANGYAK_BONUS: Record<string, number> = {
  '극신약': -10, '신약': -5, '중화': 0, '신강': 5, '극신강': 10,
};

function gangyakBonus(sajuGangyak: string | undefined): number {
  if (!sajuGangyak) return 0;
  return SAJU_GANGYAK_BONUS[sajuGangyak] ?? 0;
}

const SPECIAL_GYEOK_KEYWORDS = ['화격', '종격', '종왕격', '종강격', '종아격', '종재격', '종살격', '종세격'];

function gyeokBonus(gyeokgubun: string | undefined): number {
  if (!gyeokgubun) return 0;
  return SPECIAL_GYEOK_KEYWORDS.some((k) => gyeokgubun.includes(k)) ? 6 : 0;
}

const WEALTH_SINSAL_KEYWORDS = ['재고귀인'];

function hasWealthSinsal(gitaSinsal: unknown): boolean {
  if (!Array.isArray(gitaSinsal)) return false;
  return gitaSinsal.some(
    (pillarList) => Array.isArray(pillarList) && pillarList.some((s) => WEALTH_SINSAL_KEYWORDS.includes(s)),
  );
}

function wealthSinsalBonus(hasJaegoGwiin: boolean): number {
  return hasJaegoGwiin ? 8 : 0;
}

function wealthCapacityBonus(developedSipsung: Record<SipsungCategory, number>): number {
  const capacity = (developedSipsung['재성'] ?? 0) + (developedSipsung['식상'] ?? 0);
  return Math.round((capacity - 35) * 0.9);
}

function computeDaeunPeriods(
  daeunSunseo: string[],
  daeunSunseoSipsung: [string, string][],
  daeunSunseoSipUnseong: string[],
  daeunAgeStarts: number[],
  yongsin: Set<string>,
  huisin: Set<string>,
  gisin: Set<string>,
): DaeunPeriod[] {
  return daeunSunseoSipsung.map(([cheonS, jiS], i) => {
    const catCheon = categoryOf(cheonS);
    const catJi = categoryOf(jiS);
    const stage = daeunSunseoSipUnseong[i];

    const base = (CATEGORY_BASE_WEIGHT[catCheon] + yongsinBonus(catCheon, yongsin, huisin, gisin)) * 0.6
      + (CATEGORY_BASE_WEIGHT[catJi] + yongsinBonus(catJi, yongsin, huisin, gisin)) * 0.4
      + twelveStageBonus(stage)
      + comboAdjustment(catCheon, catJi);

    const score = Math.round(Math.max(5, Math.min(100, 50 + base)));

    let status = '➡️ 평탄/유지기';
    if (score >= 78) status = '🔥 대박/골든타임';
    else if (score >= 62) status = '📈 상승/성장기';
    else if (score >= 48) status = '🌱 준비/기반구축기';
    else if (score < 35) status = '⚠️ 신중/리스크 관리기';

    return {
      ageStart: daeunAgeStarts[i],
      ageEnd: daeunAgeStarts[i] + 9,
      score,
      status,
      categories: [catCheon, catJi] as [SipsungCategory, SipsungCategory],
      daeunGanji: daeunSunseo[i] ?? '',
      unsung: stage,
    };
  });
}

function rescaleToPersonalRange(
  daeunPeriods: DaeunPeriod[],
  targetMin = 32,
  targetMax = 92,
): DaeunPeriod[] {
  const scores = daeunPeriods.map((p) => p.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  if (max === min) {
    const mid = Math.round((targetMin + targetMax) / 2);
    return daeunPeriods.map((p) => ({ ...p, score: mid }));
  }

  return daeunPeriods.map((p) => ({
    ...p,
    score: Math.round(targetMin + ((p.score - min) / (max - min)) * (targetMax - targetMin)),
  }));
}

function resolveDisplayDecades(currentAge: number): number[] {
  const startDecade = Math.max(20, Math.floor(currentAge / 10) * 10);
  if (startDecade >= 80) return [80];
  const decades: number[] = [];
  for (let d = startDecade; d <= 80; d += 10) decades.push(d);
  return decades;
}

function classifyStatus(score: number): string {
  if (score >= 78) return '🔥 대박/골든타임';
  if (score >= 62) return '📈 상승/성장기';
  if (score >= 48) return '🌱 준비/기반구축기';
  return '⚠️ 신중/리스크 관리기';
}

function rescaleScoreWithTierBoost(rawScore:number){
  if(rawScore >= 80)
    return Math.min(95, rawScore + 5);
  if(rawScore >= 60)
    return Math.min(90, rawScore + 8);
  if(rawScore >= 40)
    return rawScore + 10;
  return rawScore + 5;
}

function buildDisplayPeriods(daeunPeriods: DaeunPeriod[], decades: number[]) {
  return decades.map((decade) => {
    const repAge = decade + 5;
    const matched = daeunPeriods.find((p) => repAge >= p.ageStart && repAge <= p.ageEnd)
      ?? daeunPeriods.reduce((prev, curr) =>
        Math.abs(curr.ageStart + 5 - repAge) < Math.abs(prev.ageStart + 5 - repAge) ? curr : prev,
      );

    const boostedScore = Math.min(95, rescaleScoreWithTierBoost(matched.score));

    return {
      ageLabel: `${decade}대`,
      ageStart: decade,
      ageEnd: decade + 9,
      score: boostedScore, 
      status: classifyStatus(boostedScore),
      daeunGanji: matched.daeunGanji,
      unsung: matched.unsung,
      categories: matched.categories,
    };
  });
}

const FEATURE_BULLETS: Record<SipsungCategory, string[]> = {
  재성: ['직접 자산을 늘리기 좋은 시기입니다.', '투자보다 실질적인 수익 활동에 집중하면 유리합니다.', '가장 큰 자산을 만들 가능성이 높은 구간입니다.'],
  식상: ['새로운 시도와 활동이 곧바로 수익으로 이어지는 시기입니다.', '부업이나 사업 확장을 고려해볼 만합니다.', '아이디어와 실행력이 재물운을 끌어올립니다.'],
  관성: ['커리어와 수입이 함께 성장하는 시기입니다.', '새로운 투자보다 기존 기반을 확장하면 유리합니다.', '직위나 신용을 통한 안정적 수입이 기대됩니다.'],
  비겁: ['협업과 인맥을 통해 기회가 생기는 시기입니다.', '동업이나 큰 지출은 신중하게 결정해야 합니다.', '경쟁 속에서도 실속을 챙기는 지혜가 필요합니다.'],
  인성: ['전문성과 자격이 자산으로 연결되는 시기입니다.', '서두르기보다 차근차근 쌓아가면 결실을 맺습니다.', '학습과 준비가 이후 재물운의 기반이 됩니다.'],
};

function buildBestPeriod(
  daeunPeriods: DaeunPeriod[],
  yongsin: Set<string>,
  hasJaegoGwiin: boolean,
  ageWindow: { start: number; end: number },
  forcedBestDecade?: number,
) {
  let best: DaeunPeriod;
  if (typeof forcedBestDecade === 'number') {
    const repAge = forcedBestDecade + 5;
    best = daeunPeriods.find((p) => repAge >= p.ageStart && repAge <= p.ageEnd)
      ?? daeunPeriods.reduce((a, b) => (b.score > a.score ? b : a));
  } else {
    const candidates = daeunPeriods.filter((p) => p.ageEnd >= ageWindow.start && p.ageStart <= ageWindow.end);
    const pool = candidates.length > 0 ? candidates : daeunPeriods;
    best = pool.reduce((a, b) => (b.score > a.score ? b : a));
  }

  const decadeBase = Math.floor(best.ageStart / 10) * 10;
  const [catCheon, catJi] = best.categories;
  const features = [...new Set([...FEATURE_BULLETS[catCheon], ...FEATURE_BULLETS[catJi]])];
  
  if (yongsin.has(catCheon) || yongsin.has(catJi)) {
    features.push('타고난 용신과 맞아떨어지는 구간이라 흐름이 더 강하게 작용합니다.');
  }
  if (hasJaegoGwiin) {
    features.unshift('재고귀인의 영향으로 이 시기에 모은 재물을 오래 지키는 힘이 있습니다.');
  }

  const boostedBestScore = Math.min(98, rescaleScoreWithTierBoost(best.score));

  return {
    ageLabel: `${decadeBase}대 후반`,
    ageStart: best.ageStart,
    ageEnd: best.ageEnd,
    score: boostedBestScore,
    status: classifyStatus(boostedBestScore),
    features: features.slice(0, 3),
    daeunGanji: best.daeunGanji,
    unsung: best.unsung,
  };
}

const MONEY_STYLE_TEXT: Record<SipsungCategory, { title: string; description: string }> = {
  재성: { title: '실전 자산가형', description: '눈에 보이는 성과와 실질적인 수익에 강한 스타일이에요. 직접 자산을 굴리고 관리하는 데 능숙해요.' },
  식상: { title: '아이디어 창출형', description: '새로운 아이디어와 활동력으로 돈을 만들어내는 스타일이에요. 부업, 콘텐츠, 사업 확장에서 기회를 잘 잡아요.' },
  관성: { title: '안정 관리형', description: '직위나 시스템을 통해 안정적으로 수입을 쌓는 스타일이에요. 큰 리스크보다 꾸준한 축적을 선호해요.' },
  비겁: { title: '관계 활용형', description: '인맥과 협업을 통해 기회를 만드는 스타일이에요. 다만 동업이나 지출 관리에는 주의가 필요해요.' },
  인성: { title: '전문성 기반형', description: '자격, 지식, 전문성을 자산으로 바꾸는 스타일이에요. 서두르기보다 꾸준히 쌓아올린 뒤 결실을 맺어요.' },
};

function buildMoneyStyle(
  developedSipsung: Record<SipsungCategory, number>,
  yongsin: Set<string>,
  huisin: Set<string>,
  gisin: Set<string>,
) {
  const dominant = (Object.keys(developedSipsung) as SipsungCategory[]).reduce((a, b) =>
    developedSipsung[b] > developedSipsung[a] ? b : a,
  );
  const style = MONEY_STYLE_TEXT[dominant];

  let yongsinNote: string;
  if (gisin.has(dominant)) {
    yongsinNote = '다만 기신과 겹치는 성향이라 스스로 절제하는 태도가 도움이 돼요.';
  } else if (yongsin.has(dominant)) {
    yongsinNote = '타고난 용신과 맞아떨어지는 스타일이라 자연스럽게 발휘돼요.';
  } else if (huisin.has(dominant)) {
    yongsinNote = '희신과 연결된 스타일이라 꾸준히 다듬으면 더 좋아져요.';
  } else {
    yongsinNote = '자신만의 리듬대로 차근차근 키워가는 스타일이에요.';
  }

  return { category: dominant, title: style.title, description: style.description, yongsinNote };
}

function buildSummaryLine(bestAgeLabel: string): string {
  return `${bestAgeLabel}이 인생의 자산 성장 골든타임입니다.`;
}

// ─── MAIN HANDLER ────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return errorResponse(req, '잘못된 요청 형식입니다. JSON 본문을 확인해주세요.', 400);
    }

    const { birthday, birthTime, gender, calendarType = 'solar', birthTimeUnknown } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수 입력 사항입니다.', 400);
    }

    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) {
      return errorResponse(req, '서버 설정 오류: API 키 누락', 500);
    }

    const cleanBirthday = birthday.replace(/[^0-9]/g, '');
    let apiBirthday = cleanBirthday;

    if (!birthTimeUnknown && birthTime && birthTime !== '모름') {
      const match = birthTime.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
      if (match) {
        let hour = parseInt(match[2], 10);
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
    let lastApiError = '';

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const sajuResponse = await fetch(sajuApiUrl, { method: 'GET', headers: BROWSER_HEADERS });
        if (!sajuResponse.ok) {
          lastApiError = `Stargio API HTTP ${sajuResponse.status}`;
          throw new Error(lastApiError);
        }
        const rawText = await sajuResponse.text();
        const parsed = JSON.parse(rawText);
        if (parsed && Object.keys(parsed).length > 0) {
          sajuData = parsed;
          break;
        }
      } catch (err) {
        lastApiError = err instanceof Error ? err.message : String(err);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }

    if (!sajuData) {
      return errorResponse(req, `사주 데이터를 가져오지 못했습니다. (${lastApiError})`, 502);
    }

    const daeunSunseo = sajuData['대운순서'] as string[] | undefined;
    const daeunSunseoSipsung = sajuData['대운순서십성'] as [string, string][] | undefined;
    const daeunSunseoSipUnseong = sajuData['대운순서십이운성'] as string[] | undefined;
    const daeunStartAge = sajuData['대운시작나이'] as number | undefined;
    const daeunInfo = sajuData['대운'] as { 현재?: DaeunAnchor; 다음?: DaeunAnchor } | undefined;
    const yongsinData = sajuData['용신'] as { 용신?: string[]; 희신?: string[]; 기신?: string[] } | undefined;
    const developedSipsung = sajuData['발달십성'] as Record<SipsungCategory, number> | undefined;
    const sajuGangyak = sajuData['사주강약'] as string | undefined;
    const gyeokgubun = sajuData['격구분'] as string | undefined;
    const gitaSinsal = sajuData['기타신살'];

    if (!daeunSunseo || !Array.isArray(daeunSunseo) || daeunSunseo.length === 0 || typeof daeunStartAge !== 'number') {
      return errorResponse(req, '대운 데이터를 분석할 수 없습니다. (대운순서 또는 시작나이 누락)', 502);
    }
    if (!daeunSunseoSipsung || !Array.isArray(daeunSunseoSipsung) || daeunSunseoSipsung.length !== daeunSunseo.length) {
      return errorResponse(req, '대운 십성 데이터를 분석할 수 없습니다.', 502);
    }
    if (!daeunSunseoSipUnseong || !Array.isArray(daeunSunseoSipUnseong) || daeunSunseoSipUnseong.length !== daeunSunseo.length) {
      return errorResponse(req, '대운 십이운성 데이터를 분석할 수 없습니다.', 502);
    }
    if (!developedSipsung || (Object.keys(developedSipsung) as SipsungCategory[]).length === 0) {
      return errorResponse(req, '발달십성 데이터를 분석할 수 없습니다.', 502);
    }

    const yongsin = new Set(yongsinData?.용신 ?? []);
    const huisin = new Set(yongsinData?.희신 ?? []);
    const gisin = new Set(yongsinData?.기신 ?? []);
    const hasJaegoGwiin = hasWealthSinsal(gitaSinsal);

    const daeunAgeStarts = resolveDaeunAgeStarts(daeunSunseo, daeunInfo?.현재, daeunStartAge);

    const daeunPeriods = computeDaeunPeriods(
      daeunSunseo, daeunSunseoSipsung, daeunSunseoSipUnseong, daeunAgeStarts, yongsin, huisin, gisin,
    );

    const currentAge = (sajuData['만나이'] as number | undefined) ?? (sajuData['나이'] as number | undefined) ?? 30;
    const displayDecades = resolveDisplayDecades(currentAge);
    const ageWindow = { start: displayDecades[0], end: displayDecades[displayDecades.length - 1] + 9 };

    const workingAgeCandidates = daeunPeriods.filter((p) => p.ageEnd >= ageWindow.start && p.ageStart <= ageWindow.end);
    const personalPeriods = rescaleToPersonalRange(
      workingAgeCandidates.length > 0 ? workingAgeCandidates : daeunPeriods,
    );

    const periods = buildDisplayPeriods(daeunPeriods, displayDecades);

    // 1) 골든타임 찾기
    const bestPeriod = buildBestPeriod(personalPeriods, yongsin, hasJaegoGwiin, ageWindow);
    const bestDecadeBase = Math.floor(bestPeriod.ageStart / 10) * 10;

    // 2) 해당 연령대 점수를 최상단으로 부스트 (100점)
    periods.forEach((p) => {
      if (p.ageStart === bestDecadeBase) {
        p.score = 100;
        p.status = classifyStatus(p.score);
      } else {
        p.score = Math.min(p.score, 100);
      }
    });

    // 3) overallScore 재계산
    const overallScore = Math.round(periods.reduce((sum, p) => sum + p.score, 0) / periods.length);

    const moneyStyle = buildMoneyStyle(developedSipsung, yongsin, huisin, gisin);
    const summaryLine = buildSummaryLine(bestPeriod.ageLabel);

    const bestDecadeIndex = periods.findIndex((p) => p.ageStart === bestDecadeBase);
    if (bestDecadeIndex !== -1) {
      bestPeriod.score = periods[bestDecadeIndex].score;
      bestPeriod.status = periods[bestDecadeIndex].status;
    }


    const profile = {
      overallScore,
      summaryLine,
      periods,
      bestPeriod,
      moneyStyle,
      meta: {
        ilganStrength: sajuGangyak ?? null,
        gyeokgubun: gyeokgubun ?? null,
        yongsin: Array.from(yongsin),
        huisin: Array.from(huisin),
        gisin: Array.from(gisin),
        hasJaegoGwiin,
        daeunCount: daeunPeriods.length,
        currentAge,
        displayDecades,
      },
    };

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    let resultId = crypto.randomUUID();

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data: inserted, error: insertError } = await supabase
          .from('money_timeline_results')
          .insert({
            gender,
            birth_date: birthday,
            birth_time: birthTimeUnknown ? null : (apiBirthday.length >= 12 ? apiBirthday.slice(8) : null),
            calendar_type: calendarType,
            overall_score: overallScore,
            best_period_label: bestPeriod.ageLabel,
            money_style_title: moneyStyle.title,
            result: profile,
            stargio_raw: sajuData,
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('내 돈복 그래프 결과 저장 실패:', insertError);
        } else if (inserted?.id) {
          resultId = inserted.id;
        }
      } catch (dbErr) {
        console.error('Supabase DB 처리 예외:', dbErr);
      }
    }

    return jsonResponse(req, { success: true, resultId, profile, stargioRaw: sajuData });

  } catch (err) {
    console.error('analyze-money-timeline 에러 상세:', err instanceof Error ? err.stack : err);
    return errorResponse(req, '서버 처리 중 오류가 발생했습니다.', 500);
  }
});
