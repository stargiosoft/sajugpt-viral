import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────

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
  categories: [SipsungCategory, SipsungCategory];
}

// ─── STARGIO API ────────────────────────────────────────

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

// 재물 관점 기본 가중치 (재성이 직접 재물, 식상이 재물을 만드는 힘)
const CATEGORY_BASE_WEIGHT: Record<SipsungCategory, number> = {
  재성: 20,
  식상: 12,
  관성: 4,
  비겁: -10,
  인성: -6,
};

// ─── 재물 점수 계산 (Step 3) ─────────────────────────────

function yongsinBonus(
  category: SipsungCategory,
  yongsin: Set<string>,
  huisin: Set<string>,
  gisin: Set<string>,
): number {
  if (gisin.has(category)) return -12;
  if (yongsin.has(category)) return 14;
  if (huisin.has(category)) return 7;
  return 0;
}

function computeDaeunPeriods(
  daeunSunseoSipsung: [string, string][],
  daeunStartAge: number,
  yongsin: Set<string>,
  huisin: Set<string>,
  gisin: Set<string>,
): DaeunPeriod[] {
  const raws = daeunSunseoSipsung.map(([cheongan, jiji]) => {
    const catCheon = categoryOf(cheongan);
    const catJi = categoryOf(jiji);
    const base = (CATEGORY_BASE_WEIGHT[catCheon] + yongsinBonus(catCheon, yongsin, huisin, gisin)) * 0.6
      + (CATEGORY_BASE_WEIGHT[catJi] + yongsinBonus(catJi, yongsin, huisin, gisin)) * 0.4;
    const raw = Math.max(5, Math.min(95, 50 + base));
    return { raw, categories: [catCheon, catJi] as [SipsungCategory, SipsungCategory] };
  });

  const min = Math.min(...raws.map(r => r.raw));
  const max = Math.max(...raws.map(r => r.raw));

  return raws.map((r, i) => {
    const score = max === min ? 60 : Math.round(22 + ((r.raw - min) / (max - min)) * 76);
    return {
      ageStart: daeunStartAge + i * 10,
      ageEnd: daeunStartAge + i * 10 + 9,
      score,
      categories: r.categories,
    };
  });
}

// ─── 연령대(20~70대) 버킷 매핑 (Step 4) ──────────────────

const DECADES = [20, 30, 40, 50, 60, 70];

function buildDisplayPeriods(daeunPeriods: DaeunPeriod[]) {
  return DECADES.map(decade => {
    const repAge = decade + 5;
    const matched = daeunPeriods.find(p => repAge >= p.ageStart && repAge <= p.ageEnd)
      ?? (repAge < daeunPeriods[0].ageStart ? daeunPeriods[0] : daeunPeriods[daeunPeriods.length - 1]);
    return {
      ageLabel: `${decade}대`,
      ageStart: decade,
      ageEnd: decade + 9,
      score: matched.score,
    };
  });
}

// ─── 최고의 재물 시기 (Step 5) ────────────────────────────

const FEATURE_BULLETS: Record<SipsungCategory, string[]> = {
  재성: ['직접 자산을 늘리기 좋은 시기입니다.', '투자보다 실질적인 수익 활동에 집중하면 유리합니다.', '가장 큰 자산을 만들 가능성이 높은 구간입니다.'],
  식상: ['새로운 시도와 활동이 곧바로 수익으로 이어지는 시기입니다.', '부업이나 사업 확장을 고려해볼 만합니다.', '아이디어와 실행력이 재물운을 끌어올립니다.'],
  관성: ['커리어와 수입이 함께 성장하는 시기입니다.', '새로운 투자보다 기존 기반을 확장하면 유리합니다.', '직위나 신용을 통한 안정적 수입이 기대됩니다.'],
  비겁: ['협업과 인맥을 통해 기회가 생기는 시기입니다.', '동업이나 큰 지출은 신중하게 결정해야 합니다.', '경쟁 속에서도 실속을 챙기는 지혜가 필요합니다.'],
  인성: ['전문성과 자격이 자산으로 연결되는 시기입니다.', '서두르기보다 차근차근 쌓아가면 결실을 맺습니다.', '학습과 준비가 이후 재물운의 기반이 됩니다.'],
};

function buildBestPeriod(daeunPeriods: DaeunPeriod[], yongsin: Set<string>) {
  const candidates = daeunPeriods.filter(p => p.ageEnd >= 20 && p.ageStart <= 79);
  const pool = candidates.length > 0 ? candidates : daeunPeriods;
  const best = pool.reduce((a, b) => (b.score > a.score ? b : a));

  const decadeBase = Math.floor(best.ageStart / 10) * 10;
  const tens = best.ageStart - decadeBase;
  const part = tens <= 3 ? '초반' : tens <= 6 ? '중반' : '후반';
  const ageLabel = `${decadeBase}대 ${part}`;

  const [catCheon, catJi] = best.categories;
  const features = [...new Set([...FEATURE_BULLETS[catCheon], ...FEATURE_BULLETS[catJi]])].slice(0, 3);
  if ((yongsin.has(catCheon) || yongsin.has(catJi)) && features.length < 3) {
    features.push('타고난 용신과 맞아떨어지는 구간이라 흐름이 더 강하게 작용합니다.');
  }

  return {
    ageLabel,
    ageStart: best.ageStart,
    ageEnd: best.ageEnd,
    score: best.score,
    features: features.slice(0, 3),
  };
}

// ─── 돈 버는 스타일 ────────────────────────────────────────

const MONEY_STYLE_TEXT: Record<SipsungCategory, { title: string; description: string }> = {
  재성: { title: '실전 자산가형', description: '눈에 보이는 성과와 실질적인 수익에 강한 스타일이에요. 직접 자산을 굴리고 관리하는 데 능숙해요.' },
  식상: { title: '아이디어 창출형', description: '새로운 아이디어와 활동력으로 돈을 만들어내는 스타일이에요. 부업, 콘텐츠, 사업 확장에서 기회를 잘 잡아요.' },
  관성: { title: '안정 관리형', description: '직위나 시스템을 통해 안정적으로 수입을 쌓는 스타일이에요. 큰 리스크보다 꾸준한 축적을 선호해요.' },
  비겁: { title: '관계 활용형', description: '인맥과 협업을 통해 기회를 만드는 스타일이에요. 다만 동업이나 지출 관리에는 주의가 필요해요.' },
  인성: { title: '전문성 기반형', description: '자격, 지식, 전문성을 자산으로 바꾸는 스타일이에요. 서두르기보다 꾸준히 쌓아올린 뒤 결실을 맺어요.' },
};

function buildMoneyStyle(
  daeunSunseoSipsung: [string, string][],
  yongsin: Set<string>,
  huisin: Set<string>,
  gisin: Set<string>,
) {
  const counts: Record<SipsungCategory, number> = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  for (const [cheongan, jiji] of daeunSunseoSipsung) {
    counts[categoryOf(cheongan)] += 1;
    counts[categoryOf(jiji)] += 1;
  }

  const dominant = (Object.keys(counts) as SipsungCategory[]).reduce((a, b) => (counts[b] > counts[a] ? b : a));
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

// ─── 종합 요약 (Step 6) ─────────────────────────────────

function buildSummaryLine(overallScore: number, bestAgeLabel: string): string {
  let tierText: string;
  if (overallScore >= 80) tierText = '전반적으로 강한 재물운의 흐름을 타고났어요.';
  else if (overallScore >= 60) tierText = '탄탄한 재물운 위에서 꾸준히 성장하는 흐름이에요.';
  else if (overallScore >= 40) tierText = '굴곡은 있지만 기회를 잘 잡으면 반등할 수 있는 흐름이에요.';
  else tierText = '신중한 관리가 필요하지만 황금기엔 확실한 기회가 와요.';

  return `${bestAgeLabel}이 인생의 자산 성장 골든타임입니다. ${tierText}`;
}

// ─── MAIN HANDLER ────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, birthTime, gender, calendarType = 'solar', birthTimeUnknown } = body;

    if (!birthday || !gender) {
      return errorResponse(req, '생년월일과 성별은 필수 입력 사항입니다.', 400);
    }

    const sajuApiKey = Deno.env.get('SAJU_API_KEY')?.trim();
    if (!sajuApiKey) {
      return errorResponse(req, '서버 설정 오류: API 키 누락', 500);
    }

    // ─── 1. Stargio API 호출 ──────────────────────────
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
        console.error(`Stargio API 시도 ${attempt}/3 실패:`, err instanceof Error ? err.message : err);
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }

    if (!sajuData) {
      return errorResponse(req, '사주 데이터를 가져올 수 없습니다.', 502);
    }

    // ─── 2. 대운/용신 데이터 추출 ─────────────────────────
    const daeunSunseoSipsung = sajuData['대운순서십성'] as [string, string][] | undefined;
    const daeunStartAge = sajuData['대운시작나이'] as number | undefined;
    const yongsinData = sajuData['용신'] as { 용신?: string[]; 희신?: string[]; 기신?: string[] } | undefined;

    if (!daeunSunseoSipsung || !Array.isArray(daeunSunseoSipsung) || daeunSunseoSipsung.length === 0 || typeof daeunStartAge !== 'number') {
      return errorResponse(req, '대운 데이터를 분석할 수 없습니다.', 502);
    }

    const yongsin = new Set(yongsinData?.용신 ?? []);
    const huisin = new Set(yongsinData?.희신 ?? []);
    const gisin = new Set(yongsinData?.기신 ?? []);

    // ─── 3. 재물 점수 계산 (deterministic) ─────────────────
    const daeunPeriods = computeDaeunPeriods(daeunSunseoSipsung, daeunStartAge, yongsin, huisin, gisin);
    const periods = buildDisplayPeriods(daeunPeriods);
    const overallScore = Math.round(periods.reduce((sum, p) => sum + p.score, 0) / periods.length);
    const bestPeriod = buildBestPeriod(daeunPeriods, yongsin);
    const moneyStyle = buildMoneyStyle(daeunSunseoSipsung, yongsin, huisin, gisin);
    const summaryLine = buildSummaryLine(overallScore, bestPeriod.ageLabel);

    const profile = {
      overallScore,
      summaryLine,
      periods,
      bestPeriod,
      moneyStyle,
    };

    // ─── 4. DB 저장 ────────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('내 돈복 그래프 결과 저장 실패:', insertError);
    }

    const resultId = inserted?.id ?? crypto.randomUUID();

    // ─── 5. 응답 ────────────────────────────────────
    return jsonResponse(req, { success: true, resultId, profile });

  } catch (err) {
    console.error('analyze-money-timeline 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
