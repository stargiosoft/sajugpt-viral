import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────
interface RequestBody {
  birthday: string;
  gender: 'female' | 'male';
  birthTimeUnknown?: boolean;
  calendarType?: 'solar' | 'lunar';
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

type GisaengType = 'haeeohwa' | 'hongryeon' | 'mukran' | 'chunhyang' | 'wolha' | 'hwangjini';

interface GisaengStats {
  speech: number;
  allure: number;
  intellect: number;
  pushpull: number;
  intuition: number;
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

const ELEMENT_MAP: Record<string, string> = {
  '갑': 'wood', '을': 'wood',
  '병': 'fire', '정': 'fire',
  '무': 'earth', '기': 'earth',
  '경': 'metal', '신': 'metal',
  '임': 'water', '계': 'water',
};

const TYPE_NAMES: Record<GisaengType, { typeName: string; typeSubtitle: string; hanja: string }> = {
  haeeohwa: { typeName: '해어화', typeSubtitle: '말로 꽃을 피우는 여인', hanja: '解語花' },
  hongryeon: { typeName: '홍련', typeSubtitle: '눈빛 하나로 방을 지배하는 여인', hanja: '紅蓮' },
  mukran: { typeName: '묵란', typeSubtitle: '그림 한 폭으로 선비를 매혹하는 여인', hanja: '墨蘭' },
  chunhyang: { typeName: '춘향', typeSubtitle: '거절이 무기인 여인', hanja: '春香' },
  wolha: { typeName: '월하', typeSubtitle: '달빛 아래 흔적을 지우는 여인', hanja: '月下' },
  hwangjini: { typeName: '황진이', typeSubtitle: '올라운더 전설의 명기', hanja: '黃眞伊' },
};

const FALLBACK_NARRATIVES: Record<GisaengType, string> = {
  haeeohwa: '네가 기방에 들어서면 선비들이 조용해진다. 네가 입을 열면 그제야 웃는다. 한양 최고 문장가가 네 곁에서 시를 읊다가 한 구절을 잊었다. 네가 대신 이어 읊자, 그는 붓을 꺾었다. 너의 도화살은 혀끝에 있다.',
  hongryeon: '네가 술잔을 들면 방 안의 공기가 바뀐다. 아무 말 하지 않았는데 선비의 손이 떨린다. 한양 제일의 무관이 네 앞에서 갑옷을 벗었다. 사주에 홍염살이 앉았다. 이건 노력이 아니라 타고난 기운이다.',
  mukran: '네가 먹을 갈면 선비들이 숨을 죽인다. 네 손끝에서 난초가 피어나면, 방 안에 봄이 온다. 대제학이 네 그림을 보고 신윤복보다 낫다고 했다. 사주에 화개살이 있다. 네 매력은 얼굴이 아니라 손끝에서 나온다.',
  chunhyang: '기방의 모든 기생이 선비에게 다가갈 때, 너만 자리에 앉아 있었다. 좌의정이 수청을 요구했다. 너는 싫습니다라고 했다. 그날 이후 좌의정은 매일 기방에 왔다. 도화살이 공망에 걸려 있다. 잡히지 않는 매력이다.',
  wolha: '다른 기생은 선비가 떠나면 운다. 너는 웃으며 다음 선비에게 술을 따른다. 세 양반이 같은 밤에 기방에 왔는데 아무도 서로의 존재를 몰랐다. 편인과 역마가 만나면 흔적을 지우는 재주가 생긴다.',
  hwangjini: '기방이 아니라 역사가 너를 기억한다. 서경덕은 네 앞에서 학문을 잊었고, 벽계수는 네 이름에 무릎을 꿇었다. 도화살, 홍염살, 역마살이 한 사주에 모였다. 천 년에 한 번 나오는 배치다.',
};

// ─── 십성 카운트 ─────────────────────────────────────────
function countSipsung(sipsung: string[][], target: string): number {
  return sipsung.flat().filter(s => s === target).length;
}

// ─── 능력치 산출 (PRD 1-3 공식) ─────────────────────────
function calculateGisaengStats(sajuData: Record<string, unknown>): {
  stats: GisaengStats;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  hasMokYok: boolean;
  hasHwaGaeSal: boolean;
  hasYeokMaSal: boolean;
  hasGongMang: boolean;
} {
  const sinsal12 = String(sajuData['12신살'] || '');
  const gitaSinsal = String(sajuData['기타신살'] || '');
  const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
  const baldal = (sajuData['발달십성'] as Record<string, number> | undefined) ?? {};

  const doHwaSal = sinsal12.includes('도화');
  const hongYeomSal = gitaSinsal.includes('홍염');
  const hasMokYok = sinsal12.includes('목욕');
  const hasHwaGaeSal = gitaSinsal.includes('화개');
  const hasYeokMaSal = sinsal12.includes('역마');
  const hasGongMang = sinsal12.includes('공망');

  const sikSinCount = countSipsung(sipsung, '식신');
  const sangGwanCount = countSipsung(sipsung, '상관');
  const jeongInCount = countSipsung(sipsung, '정인');
  const pyeonInCount = countSipsung(sipsung, '편인');
  const jeongGwanCount = countSipsung(sipsung, '정관');
  const pyeonGwanCount = countSipsung(sipsung, '편관');
  const pyeonJaeCount = countSipsung(sipsung, '편재');
  const geobJaeCount = countSipsung(sipsung, '겁재');

  const gwansung = baldal['관성'] ?? 0;

  // 12운성에서 관대/건록 확인
  const sipYiUnseong = (sajuData['십이운성'] as string[][] | undefined) ?? [];
  const hasGwanDae = sipYiUnseong.flat().includes('관대');
  const hasGeonRok = sipYiUnseong.flat().includes('건록');

  // 화술: 식신/상관 기반
  let speech = 20;
  if (sikSinCount >= 1) speech += 30;
  if (sangGwanCount >= 1) speech += 25;
  if (sikSinCount >= 1 && sangGwanCount >= 1) speech += 15;

  // 요염: 홍염살/목욕/도화살/편재
  let allure = 25;
  if (hongYeomSal) allure += 35;
  if (hasMokYok) allure += 20;
  if (doHwaSal) allure += 15;
  if (pyeonJaeCount >= 1) allure += 10;

  // 지성: 인성/화개살
  let intellect = 15;
  if (jeongInCount >= 1) intellect += 30;
  if (pyeonInCount >= 1) intellect += 25;
  if (hasHwaGaeSal) intellect += 20;

  // 밀당: 정관/편관/공망
  let pushpull = 20;
  if (jeongGwanCount >= 1) pushpull += 30;
  if (pyeonGwanCount >= 1) pushpull += 20;
  if (hasGongMang && gwansung >= 10) pushpull += 25;

  // 눈치: 편인/역마살/일지 관대·건록/겁재
  let intuition = 25;
  if (pyeonInCount >= 1) intuition += 25;
  if (hasYeokMaSal) intuition += 20;
  if (hasGwanDae || hasGeonRok) intuition += 15;
  if (geobJaeCount >= 1) intuition += 10;

  // 0~100 클램프
  const clamp = (v: number) => Math.min(100, Math.max(0, v));

  return {
    stats: {
      speech: clamp(speech),
      allure: clamp(allure),
      intellect: clamp(intellect),
      pushpull: clamp(pushpull),
      intuition: clamp(intuition),
    },
    doHwaSal,
    hongYeomSal,
    hasMokYok,
    hasHwaGaeSal,
    hasYeokMaSal,
    hasGongMang,
  };
}

// ─── 기생 유형 배정 (PRD 1-4) ───────────────────────────
function assignGisaengType(stats: GisaengStats): GisaengType {
  const entries: [string, number][] = [
    ['speech', stats.speech],
    ['allure', stats.allure],
    ['intellect', stats.intellect],
    ['pushpull', stats.pushpull],
    ['intuition', stats.intuition],
  ];

  // 황진이: 3개 이상 80+ 동률
  const above80 = entries.filter(([, v]) => v >= 80);
  if (above80.length >= 3) return 'hwangjini';

  // 최고 능력치 기반
  entries.sort((a, b) => b[1] - a[1]);
  const topStat = entries[0][0];

  const mapping: Record<string, GisaengType> = {
    speech: 'haeeohwa',
    allure: 'hongryeon',
    intellect: 'mukran',
    pushpull: 'chunhyang',
    intuition: 'wolha',
  };

  return mapping[topStat] ?? 'haeeohwa';
}

// ─── 선비 초기 게이지 (사주 상성 반영) ────────────────────
function calculateSeonbiGauges(iljuElement: string) {
  const seonbi = {
    kwonryeok: { name: '김도윤', type: 'kwonryeok' as const, loyalty: 60, suspicion: 30, alive: true },
    romantic: { name: '박서진', type: 'romantic' as const, loyalty: 70, suspicion: 10, alive: true },
    jealousy: { name: '이준혁', type: 'jealousy' as const, loyalty: 65, suspicion: 20, alive: true },
  };

  // 오행 상성 보너스
  switch (iljuElement) {
    case 'water':
      seonbi.romantic.loyalty += 10;
      break;
    case 'fire':
      seonbi.jealousy.loyalty += 10;
      break;
    case 'metal':
      seonbi.kwonryeok.loyalty += 10;
      break;
    case 'wood':
      seonbi.kwonryeok.suspicion = Math.max(0, seonbi.kwonryeok.suspicion - 5);
      seonbi.romantic.suspicion = Math.max(0, seonbi.romantic.suspicion - 5);
      seonbi.jealousy.suspicion = Math.max(0, seonbi.jealousy.suspicion - 5);
      break;
    case 'earth':
      seonbi.kwonryeok.loyalty += 5;
      seonbi.romantic.loyalty += 5;
      seonbi.jealousy.loyalty += 5;
      break;
  }

  return seonbi;
}

// ─── 기생 초기 티어 예상 ────────────────────────────────
function estimateInitialTier(totalCharm: number, type: GisaengType): string {
  if (type === 'hwangjini') return 'S (전설)';
  if (totalCharm >= 350) return 'A (잠재 S)';
  if (totalCharm >= 280) return 'B (잠재 A)';
  if (totalCharm >= 200) return 'C (잠재 B)';
  return 'D (위험)';
}

// ─── 일주에서 오행 추출 ─────────────────────────────────
function extractIljuElement(sajuData: Record<string, unknown>): { ilju: string; iljuElement: string } {
  const cheonGan = (sajuData['천간'] as string[] | undefined) ?? [];
  const ilGan = cheonGan[2] ?? ''; // 일간 (3번째)
  const iljuElement = ELEMENT_MAP[ilGan] ?? 'earth';
  const jiJi = (sajuData['지지'] as string[] | undefined) ?? [];
  const ilju = `${ilGan}${jiJi[2] ?? ''}`;
  return { ilju, iljuElement };
}

// ─── Gemini 서사 생성 ───────────────────────────────────
async function generateNarrative(
  type: GisaengType,
  stats: GisaengStats,
  doHwaSal: boolean,
  hongYeomSal: boolean,
  topSipsung: string,
): Promise<{ gisaengName: string; narrative: string; assessment: string }> {
  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) {
    return {
      gisaengName: getDefaultName(type),
      narrative: FALLBACK_NARRATIVES[type],
      assessment: getDefaultAssessment(stats),
    };
  }

  const typeInfo = TYPE_NAMES[type];
  const statEntries = Object.entries(stats) as [string, number][];
  statEntries.sort((a, b) => b[1] - a[1]);
  const topStat = statEntries[0][0];
  const bottomStat = statEntries[statEntries.length - 1][0];

  const STAT_KR: Record<string, string> = {
    speech: '화술', allure: '요염', intellect: '지성', pushpull: '밀당', intuition: '눈치',
  };

  const prompt = `당신은 조선시대 기방을 배경으로 한 사주 기반 캐릭터 서사 작가입니다.

## 유저 사주 데이터
- 기생 유형: ${typeInfo.typeName} (${typeInfo.typeSubtitle})
- 능력치: 화술 ${stats.speech}, 요염 ${stats.allure}, 지성 ${stats.intellect}, 밀당 ${stats.pushpull}, 눈치 ${stats.intuition}
- 도화살: ${doHwaSal ? '보유' : '없음'}
- 홍염살: ${hongYeomSal ? '보유' : '없음'}
- 최고 능력치: ${STAT_KR[topStat]}
- 최약 능력치: ${STAT_KR[bottomStat]}
- 사주 특징: ${topSipsung || '특이사항 없음'}

## 생성할 것 (JSON으로 출력)
{
  "gisaengName": "2글자 한글 이름 + 한자 (예: 월향 (月香))",
  "narrative": "3~4문장 서사",
  "assessment": "1문장 한 줄 평가 (강점+약점 조합)"
}

## 규칙
- "~다" 체 사용 (서술체). 반말/존댓말 둘 다 금지.
- 사주 용어(도화살, 홍염살, 편관 등) 최소 1회 포함
- 조선시대 기방 세계관 유지
- 현대어/이모지/마크다운 사용 금지
- 서사는 반드시 유저를 "너"로 지칭
- 마지막 문장은 사주 근거로 마무리
- JSON만 출력. 설명/따옴표 감싸기 금지.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.8, thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return {
        gisaengName: getDefaultName(type),
        narrative: FALLBACK_NARRATIVES[type],
        assessment: getDefaultAssessment(stats),
      };
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    // JSON 블록 추출
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        gisaengName: parsed.gisaengName || getDefaultName(type),
        narrative: cleanText(parsed.narrative) || FALLBACK_NARRATIVES[type],
        assessment: cleanText(parsed.assessment) || getDefaultAssessment(stats),
      };
    }
  } catch (err) {
    console.error('Gemini 호출 실패:', err);
  }

  return {
    gisaengName: getDefaultName(type),
    narrative: FALLBACK_NARRATIVES[type],
    assessment: getDefaultAssessment(stats),
  };
}

function cleanText(text: string): string {
  if (!text) return '';
  return text.replace(/[*#_`]/g, '').replace(/\n{2,}/g, ' ').trim();
}

function getDefaultName(type: GisaengType): string {
  const names: Record<GisaengType, string> = {
    haeeohwa: '월향 (月香)',
    hongryeon: '채연 (彩煙)',
    mukran: '설란 (雪蘭)',
    chunhyang: '소연 (素蓮)',
    wolha: '명월 (明月)',
    hwangjini: '진이 (眞伊)',
  };
  return names[type];
}

function getDefaultAssessment(stats: GisaengStats): string {
  const entries = Object.entries(stats) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const STAT_KR: Record<string, string> = {
    speech: '화술', allure: '요염', intellect: '지성', pushpull: '밀당', intuition: '눈치',
  };
  const top = STAT_KR[entries[0][0]];
  const bottom = STAT_KR[entries[entries.length - 1][0]];
  return `${top}이 높아 선비의 약점을 간파하는 데 탁월하나, ${bottom}이 부족해 위기에서 밀릴 수 있다.`;
}

// ─── MAIN HANDLER ────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, gender, birthTimeUnknown, calendarType, utmSource, utmMedium, utmCampaign } = body;

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
    const isLunar = calendarType === 'lunar';
    const sajuApiUrl = `https://service.stargio.co.kr:8400/StargioSaju?birthday=${apiBirthday}&lunar=${isLunar}&gender=${apiGender}&apiKey=${sajuApiKey}`;

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

    // ─── 3. 능력치 산출 ─────────────────────────────────
    const analysis = calculateGisaengStats(sajuData);
    const { stats, doHwaSal, hongYeomSal } = analysis;
    const totalCharm = stats.speech + stats.allure + stats.intellect + stats.pushpull + stats.intuition;

    // ─── 4. 기생 유형 배정 ───────────────────────────────
    const gisaengType = assignGisaengType(stats);
    const typeInfo = TYPE_NAMES[gisaengType];

    // ─── 5. 일주 오행 & 선비 게이지 ──────────────────────
    const { ilju, iljuElement } = extractIljuElement(sajuData);
    const seonbi = calculateSeonbiGauges(iljuElement);

    // ─── 6. 사주 하이라이트 ──────────────────────────────
    const sipsung = (sajuData['십성'] as string[][] | undefined) ?? [];
    const sangGwanCount = countSipsung(sipsung, '상관');
    const pyeonGwanCount = countSipsung(sipsung, '편관');
    const sikSinCount = countSipsung(sipsung, '식신');

    let topSipsung = '';
    const counts = [
      { name: '상관', count: sangGwanCount },
      { name: '편관', count: pyeonGwanCount },
      { name: '식신', count: sikSinCount },
    ];
    counts.sort((a, b) => b.count - a.count);
    if (counts[0].count > 0) topSipsung = counts[0].name;

    // ─── 7. Gemini 서사 생성 ─────────────────────────────
    const { gisaengName, narrative, assessment } = await generateNarrative(
      gisaengType, stats, doHwaSal, hongYeomSal, topSipsung,
    );

    const tierInitial = estimateInitialTier(totalCharm, gisaengType);

    // ─── 8. DB 저장 ──────────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const gisaengCardResult = {
      gisaengName,
      type: gisaengType,
      typeName: typeInfo.typeName,
      typeSubtitle: typeInfo.typeSubtitle,
      tier: tierInitial,
      stats,
      totalCharm,
      doHwaSal,
      hongYeomSal,
      narrative,
      assessment,
    };

    const sajuHighlights = {
      doHwaSal,
      hongYeomSal,
      topSipsung,
      ilju,
      iljuElement,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('gisaeng_results')
      .insert({
        birthday,
        birth_time: birthTimeUnknown ? null : apiBirthday.slice(8),
        gender,
        calendar_type: calendarType ?? 'solar',
        gisaeng_name: gisaengName,
        gisaeng_type: gisaengType,
        tier_initial: tierInitial,
        stats,
        total_charm: totalCharm,
        do_hwa_sal: doHwaSal,
        hong_yeom_sal: hongYeomSal,
        gisaeng_card_result: gisaengCardResult,
        saju_highlights: sajuHighlights,
        utm_source: utmSource ?? null,
        utm_medium: utmMedium ?? null,
        utm_campaign: utmCampaign ?? null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('DB 저장 실패:', insertError);
    }

    // ─── 9. 응답 ──────────────────────────────────────
    return jsonResponse(req, {
      resultId: inserted?.id ?? crypto.randomUUID(),
      gisaengCard: gisaengCardResult,
      seonbi,
      sajuHighlights,
    });

  } catch (err) {
    console.error('analyze-gisaeng 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
