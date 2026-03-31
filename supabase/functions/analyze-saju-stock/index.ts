import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../server/cors.ts';

// ─── 타입 ───────────────────────────────────────────────

type RelationshipStatus = 'single' | 'some' | 'dating';
type InvestmentOpinion = 'strong_buy' | 'buy' | 'hold' | 'reduce' | 'warning';
type PriceGrade = 'premium' | 'mid' | 'small' | 'penny' | 'warning';
type FairValueGrade = 'bluechip' | 'quality' | 'growth';
type RelationshipFrame = 'unlisted' | 'ipo' | 'listed';
type UserChoice = 'A' | 'B' | 'C';

interface RequestBody {
  birthday: string;
  gender: 'female' | 'male';
  birthTimeUnknown?: boolean;
  relationshipStatus: RelationshipStatus;
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
  doHwaSalCount: number;
  hongYeomSal: boolean;
  yeonaeSeongHyang: string;
  ilJuKey: string;
  gongMang: boolean;
}

interface TurnDialog {
  characterId: string;
  characterName: string;
  position: string;
  lines: string;
}

interface TurnChoice {
  id: UserChoice;
  characterId: string;
  label: string;
}

interface TurnData {
  title: string;
  dialogs: TurnDialog[];
  question: string;
  choices: TurnChoice[];
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

const RELATIONSHIP_BONUS: Record<RelationshipStatus, number> = {
  single: 0,
  some: 500,
  dating: 1000,
};

const RELATIONSHIP_FRAMES: Record<RelationshipStatus, { frame: RelationshipFrame; label: string }> = {
  single: { frame: 'unlisted', label: '비상장 종목' },
  some: { frame: 'ipo', label: 'IPO 준비 중' },
  dating: { frame: 'listed', label: '상장 종목 — 저평가 구간' },
};

const OPINION_LABELS: Record<InvestmentOpinion, string> = {
  strong_buy: '강력 매수',
  buy: '매수',
  hold: '보유(존버)',
  reduce: '비중 축소',
  warning: '관리종목',
};

const FALLBACK_COMMENTS: Record<InvestmentOpinion, string> = {
  strong_buy: '펀더멘털 대비 극심한 저평가. 시장이 이 종목을 모르고 있다.',
  buy: '안정적 상승 추세 진입. 중장기 보유 추천.',
  hold: '현재 구간에서 손절은 최악의 선택. 존버가 답.',
  reduce: '고점 근접. 차익 실현 권고.',
  warning: '일시적 거래 정지 구간. 반등은 옵니다.',
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
  const gongMangStr = String(sajuData['공망'] || '');

  // 도화살 개수 (12신살에서 '도화' 출현 수)
  const doHwaSalMatches = sinsal12.match(/도화/g);
  const doHwaSalCount = doHwaSalMatches ? doHwaSalMatches.length : 0;

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
    doHwaSal: doHwaSalCount > 0,
    doHwaSalCount,
    hongYeomSal: gitaSinsal.includes('홍염'),
    yeonaeSeongHyang: ilJuRon?.['연애성향'] ?? '',
    ilJuKey: `${cheonGan[2] ?? ''}${jiJi[2] ?? ''}`,
    gongMang: gongMangStr.length > 0 && gongMangStr !== '없음',
  };
}

// ─── 현재가 산정 ─────────────────────────────────────────

function calculateCurrentPrice(h: SajuHighlights, status: RelationshipStatus): number {
  let price = 5000 + RELATIONSHIP_BONUS[status];

  // 억압 감소분
  if (h.pyeonInCount >= 2 || h.insung >= 35) price -= 1500;
  else if (h.pyeonInCount >= 1 && h.insung >= 25) price -= 800;

  if (h.doHwaSal && h.gongMang) price -= 1200;  // 도화살 합거 (공망과 겹침)
  if (h.jeongGwanCount === 0 && h.gwansung < 10) price -= 1000;
  if (h.gongMang) price -= 800;
  if (h.sangGwanCount >= 2 || h.siksang >= 30) price -= 600;

  // 모멘텀 가산분 (대운 정보 없이 원국 기반 간접 추정)
  if (h.doHwaSalCount >= 2) price += 1500;
  else if (h.doHwaSal) price += 800;
  if (h.jeongGwanCount >= 1 && h.gwansung >= 20) price += 800;
  if (h.sikSinCount >= 1) price += 300;

  return Math.max(300, Math.min(12000, price));
}

// ─── 적정가 산정 ─────────────────────────────────────────

function calculateFairValue(h: SajuHighlights): number {
  let value = 10000;

  // 매력 가산
  if (h.doHwaSalCount >= 2) value += 7000;
  else if (h.doHwaSal) value += 3000;
  if (h.hongYeomSal) value += 2000;
  if (h.pyeonJaeCount >= 1 || h.jasung >= 20) value += 1500;

  // 내면 가산
  if (h.jeongInCount >= 1 && h.sikSinCount >= 1) value += 3000;
  if (h.biGyeonCount >= 1 && h.biGyeonCount <= 2 && h.bigyeob < 30) value += 1500;
  if (h.jeongGwanCount >= 1 && h.jeongInCount >= 1) value += 4000;

  // 역량 가산
  if (h.jeongGwanCount >= 2 || h.gwansung >= 30) value += 3000;
  else if (h.pyeonGwanCount >= 2 || h.gwansung >= 25) value += 2500;
  if (h.pyeonInCount >= 1 && h.jeongGwanCount >= 1) value += 2000;

  return Math.max(12000, Math.min(35000, value));
}

// ─── 투자의견 결정 ───────────────────────────────────────

function determineInvestmentOpinion(h: SajuHighlights, currentPrice: number, fairValue: number): InvestmentOpinion {
  const ratio = currentPrice / fairValue;

  if (h.gongMang && h.pyeonInCount >= 2 && h.doHwaSal && ratio < 0.1) return 'warning';
  if (h.doHwaSalCount >= 2 && h.pyeonInCount >= 1 && ratio < 0.2) return 'strong_buy';
  if (ratio >= 0.6) return 'reduce';
  if (ratio >= 0.4) return 'hold';
  if (h.doHwaSal && ratio < 0.4) return 'buy';
  if (ratio < 0.2) return 'strong_buy';
  return 'hold';
}

// ─── 목표가 + 급등 시점 ──────────────────────────────────

function calculateTargetPrice(fairValue: number): number {
  const ratio = 0.8 + Math.random() * 0.2; // 80~100%
  return Math.round(fairValue * ratio / 100) * 100;
}

function determineSurgeMonth(): { surgeMonth: string; surgeMonthLabel: string } {
  const now = new Date();
  const offset = 3 + Math.floor(Math.random() * 5); // 3~7개월 후
  const surge = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const y = surge.getFullYear();
  const m = String(surge.getMonth() + 1).padStart(2, '0');
  return {
    surgeMonth: `${y}-${m}`,
    surgeMonthLabel: `${surge.getMonth() + 1}월`,
  };
}

// ─── 가격 등급 ───────────────────────────────────────────

function getPriceGrade(price: number): PriceGrade {
  if (price >= 8000) return 'premium';
  if (price >= 5000) return 'mid';
  if (price >= 2000) return 'small';
  if (price >= 800) return 'penny';
  return 'warning';
}

function getFairValueGrade(fairValue: number): FairValueGrade {
  if (fairValue >= 25000) return 'bluechip';
  if (fairValue >= 18000) return 'quality';
  return 'growth';
}

// ─── 섹터 결정 ───────────────────────────────────────────

function determineSector(h: SajuHighlights): string {
  if (h.doHwaSalCount >= 2) return '도화살 대장주';
  if (h.doHwaSal) return '도화살 관련주';
  if (h.jeongGwanCount >= 2) return '정관 안정주';
  if (h.pyeonGwanCount >= 2) return '편관 테마주';
  if (h.sikSinCount >= 2) return '식신 성장주';
  if (h.pyeonJaeCount >= 2) return '편재 순환주';
  return '일반 종목';
}

// ─── 차트 데이터 생성 ────────────────────────────────────

function generateChartData(currentPrice: number, targetPrice: number, surgeMonthOffset: number): number[] {
  const data: number[] = [];
  const total = 12;

  for (let i = 0; i < total; i++) {
    if (i < 3) {
      // 과거: 현재가 근처 소폭 등락
      const jitter = (Math.random() - 0.5) * currentPrice * 0.3;
      data.push(Math.round(Math.max(200, currentPrice + jitter)));
    } else if (i === 3) {
      // 현재
      data.push(currentPrice);
    } else if (i < surgeMonthOffset + 3) {
      // 현재 → 급등 전: 완만 상승
      const progress = (i - 3) / Math.max(1, surgeMonthOffset);
      const interp = currentPrice + (targetPrice * 0.5 - currentPrice) * progress;
      const jitter = (Math.random() - 0.3) * currentPrice * 0.15;
      data.push(Math.round(Math.max(currentPrice * 0.8, interp + jitter)));
    } else if (i === surgeMonthOffset + 3) {
      // 급등 시점
      data.push(Math.round(targetPrice * (0.7 + Math.random() * 0.3)));
    } else {
      // 급등 이후: 목표가 근처 유지
      const jitter = (Math.random() - 0.5) * targetPrice * 0.1;
      data.push(Math.round(targetPrice + jitter));
    }
  }

  return data;
}

// ─── Gemini 턴제 토론 생성 ────────────────────────────────

async function generateDiscussion(
  h: SajuHighlights,
  currentPrice: number,
  fairValue: number,
  targetPrice: number,
  opinion: InvestmentOpinion,
  surgeMonthLabel: string,
  status: RelationshipStatus,
): Promise<{
  analystComment: string;
  turn1: TurnData;
  turn2_A: TurnData;
  turn2_B: TurnData;
  turn2_C: TurnData;
  turn3: TurnData;
  crewComment: string;
} | null> {

  const geminiApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!geminiApiKey) {
    console.error('GOOGLE_API_KEY not set');
    return null;
  }

  const frameLabel = RELATIONSHIP_FRAMES[status].label;
  const undervalueRate = Math.round((1 - currentPrice / fairValue) * 100);

  const systemPrompt = `당신은 "사주증권 리서치센터"의 수석 스크립트 작가입니다.
사주 원국 데이터를 기반으로 주가 조작단 3명의 토론 대사를 작성합니다.

## 캐릭터 톤
- 강도현 (kang): 반말, 직설적, "~해", "~거야", 급하고 결단력 있음. 행동을 강조. 작전 본부장 (공격파).
- 윤서율 (yoon): 존댓말, "~입니다", "~세요", 차분하지만 날카로움. 내면/자존감을 분석. 펀더멘털 분석가 (가치파).
- 차민혁 (cha): 반존대, "~요", "~겠습니다", 계산적이고 데이터 중심. 타이밍을 강조. 차트 전략가 (타이밍파).

## 규칙
1. 각 캐릭터의 대사는 반드시 2~3문장, 80자 이내. 짧고 임팩트 있게. 이 제한을 절대 초과하지 마세요.
2. 사주 용어는 "한글(한자)" 형식 — 예: 편인(偏印), 도화살(桃花殺). 한자만 단독 사용 금지.
3. 캐릭터끼리 의견 충돌 필수. 동의 금지.
4. 턴3에서 3명이 같은 핵심 원인으로 수렴 — 찔리지만 위로가 되는 톤.
5. 핵심 원인은 사주 데이터에서 도출.
6. 유저를 직접 공격하지 마세요 — 캐릭터끼리 싸우되 유저는 "심판".
7. 연애 상태: ${frameLabel}.
8. analystComment는 15~25자. crewComment도 동일.
9. 총 3턴만 생성. turn4는 없음.`;

  const userPrompt = `## 분석 대상
- 일주: ${h.ilJuKey}
- 주요 십성: 정인 ${h.jeongInCount}, 편인 ${h.pyeonInCount}, 식신 ${h.sikSinCount}, 정관 ${h.jeongGwanCount}, 편관 ${h.pyeonGwanCount}, 상관 ${h.sangGwanCount}, 편재 ${h.pyeonJaeCount}, 비견 ${h.biGyeonCount}, 겁재 ${h.geobJaeCount}
- 발달십성: 인성 ${h.insung}%, 관성 ${h.gwansung}%, 식상 ${h.siksang}%, 비겁 ${h.bigyeob}%, 재성 ${h.jasung}%
- 도화살: ${h.doHwaSalCount}개 / 홍염살: ${h.hongYeomSal ? '있음' : '없음'} / 공망: ${h.gongMang ? '있음' : '없음'}
- 연애성향: ${h.yeonaeSeongHyang || '정보 없음'}
- 현재가: ${currentPrice.toLocaleString()}원 / 적정가: ${fairValue.toLocaleString()}원 (저평가 ${undervalueRate}%)
- 투자의견: ${OPINION_LABELS[opinion]}
- 급등 시점: ${surgeMonthLabel}

## 출력 형식 (JSON만, 다른 텍스트 없이)
{
  "analystComment": "종목 리포트 한줄 코멘트",
  "turn1": {
    "title": "1턴: 현황 진단",
    "dialogs": [
      {"characterId":"kang","characterName":"강도현","position":"작전 본부장 (공격파)","lines":"대사"},
      {"characterId":"yoon","characterName":"윤서율","position":"펀더멘털 분석가 (가치파)","lines":"대사"},
      {"characterId":"cha","characterName":"차민혁","position":"차트 전략가 (타이밍파)","lines":"대사"}
    ],
    "question": "누구 말이 맞다고 생각하세요?",
    "choices": [
      {"id":"A","characterId":"kang","label":"선택지A"},
      {"id":"B","characterId":"yoon","label":"선택지B"},
      {"id":"C","characterId":"cha","label":"선택지C"}
    ]
  },
  "turn2_A": { "title":"2턴: 작전 충돌", "dialogs":[...3명], "question":"...", "choices":[...3개] },
  "turn2_B": { "title":"2턴: 작전 충돌", "dialogs":[...3명], "question":"...", "choices":[...3개] },
  "turn2_C": { "title":"2턴: 작전 충돌", "dialogs":[...3명], "question":"...", "choices":[...3개] },
  "turn3": { "title":"3턴: 핵심 찌르기", "dialogs":[...3명], "question":"주가가 올랐을 때, 어떤 모습이길 원하세요?", "choices":[...3개] },
  "crewComment": "작전 계획서 한줄 코멘트"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] },
          ],
          generationConfig: {
            maxOutputTokens: 3000,
            temperature: 0.85,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) return null;

    return JSON.parse(text);
  } catch (err) {
    console.error('Gemini 호출 실패:', err);
    return null;
  }
}

// ─── 폴백 토론 데이터 ────────────────────────────────────

function generateFallbackDiscussion(
  h: SajuHighlights,
  currentPrice: number,
  fairValue: number,
  opinion: InvestmentOpinion,
  surgeMonthLabel: string,
): {
  analystComment: string;
  turn1: TurnData;
  turn2: Record<UserChoice, TurnData>;
  turn3: TurnData;
  crewComment: string;
} {
  const comment = FALLBACK_COMMENTS[opinion];
  const undervalueRate = Math.round((1 - currentPrice / fairValue) * 100);

  const makeTurn = (title: string, kangLines: string, yoonLines: string, chaLines: string, question: string, choiceA: string, choiceB: string, choiceC: string): TurnData => ({
    title,
    dialogs: [
      { characterId: 'kang', characterName: '강도현', position: '작전 본부장 (공격파)', lines: kangLines },
      { characterId: 'yoon', characterName: '윤서율', position: '펀더멘털 분석가 (가치파)', lines: yoonLines },
      { characterId: 'cha', characterName: '차민혁', position: '차트 전략가 (타이밍파)', lines: chaLines },
    ],
    question,
    choices: [
      { id: 'A', characterId: 'kang', label: choiceA },
      { id: 'B', characterId: 'yoon', label: choiceB },
      { id: 'C', characterId: 'cha', label: choiceC },
    ],
  });

  const turn1 = makeTurn(
    '1턴: 현황 진단',
    `야, 도화살(桃花殺) ${h.doHwaSalCount}개인데 비상장이야. 매력 있는데 시장에 안 나가니 누가 알아.`,
    `적정가 ${fairValue.toLocaleString()}원인데 시장가 ${currentPrice.toLocaleString()}원. 편인(偏印)이 자기 평가를 바닥으로 끌어내린 겁니다.`,
    `둘 다 틀렸어요. ${surgeMonthLabel}에 모멘텀 들어옵니다. 지금은 타이밍이 아닌 거예요.`,
    '누구 말이 맞다고 생각하세요?',
    '맞아, 나가봐야 알지',
    '자신감이 문제인 건 맞아...',
    '타이밍이 안 맞았던 건가',
  );

  const turn2Base = makeTurn(
    '2턴: 작전 충돌',
    `적정가 높으면 뭐해? 시장에서 반응 받아봐야 아는 거야. 실전이 답이지.`,
    `${currentPrice.toLocaleString()}원짜리가 시장 나가면요? "역시 안 돼"가 시장가를 더 끌어내립니다.`,
    `절충안 내겠습니다. 가치 인식 → 시장 노출 → ${surgeMonthLabel} 풀베팅. 시간표 없으면 도박이에요.`,
    '당신의 작전은?',
    '바로 시장에 나간다',
    '내 값어치부터 알아야지',
    '시간표대로 단계별로',
  );

  const turn3 = makeTurn(
    '3턴: 핵심 찌르기',
    `좋아하는 사람한테 먼저 연락한 적 있어? ...그게 비상장이라는 거야.`,
    `못 한 게 아니라 안 한 거죠. 편인(偏印)이 브레이크 거는 겁니다. 매력을 꺼놓은 거예요.`,
    `이 구조는 마음 주면 전부 주는 사람인데, 막고 있으니 시장에선 관심 없는 사람으로 보이는 거예요.`,
    '주가가 올랐을 때, 어떤 모습이길 원하세요?',
    '좋아하는 사람에게 먼저 말 거는 사람',
    '내 가치를 아는 사람이 찾아오는 것',
    '연애든 뭐든 자신감 있는 사람',
  );

  return {
    analystComment: comment,
    turn1,
    turn2: { A: turn2Base, B: turn2Base, C: turn2Base },
    turn3,
    crewComment: `적정가 ${fairValue.toLocaleString()}원짜리가 ${currentPrice.toLocaleString()}원. 시장의 실수다.`,
  };
}

// ─── MAIN HANDLER ────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest(req);
  }

  try {
    const body: RequestBody = await req.json();
    const { birthday, gender, birthTimeUnknown, relationshipStatus } = body;

    if (!birthday || !gender || !relationshipStatus) {
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

    // ─── 4. 가격 계산 (deterministic) ───────────────────
    const currentPrice = calculateCurrentPrice(highlights, relationshipStatus);
    const fairValue = calculateFairValue(highlights);
    const targetPrice = calculateTargetPrice(fairValue);
    const undervalueRate = Math.round((1 - currentPrice / fairValue) * 100);
    const opinion = determineInvestmentOpinion(highlights, currentPrice, fairValue);
    const { surgeMonth, surgeMonthLabel } = determineSurgeMonth();
    const priceGrade = getPriceGrade(currentPrice);
    const fairValueGrade = getFairValueGrade(fairValue);
    const sector = determineSector(highlights);
    const relationshipFrame = RELATIONSHIP_FRAMES[relationshipStatus].frame;
    const surgeMonthOffset = 3 + Math.floor(Math.random() * 5);
    const chartData = generateChartData(currentPrice, targetPrice, surgeMonthOffset);

    // ─── 5. Gemini 턴제 토론 생성 ────────────────────────
    const geminiResult = await generateDiscussion(
      highlights, currentPrice, fairValue, targetPrice,
      opinion, surgeMonthLabel, relationshipStatus,
    );

    let analystComment: string;
    let discussionData: { turn1: TurnData; turn2: Record<UserChoice, TurnData>; turn3: TurnData };
    let crewComment: string;

    if (geminiResult) {
      analystComment = geminiResult.analystComment;
      discussionData = {
        turn1: geminiResult.turn1,
        turn2: {
          A: geminiResult.turn2_A,
          B: geminiResult.turn2_B,
          C: geminiResult.turn2_C,
        },
        turn3: geminiResult.turn3,
      };
      crewComment = geminiResult.crewComment;
    } else {
      const fallback = generateFallbackDiscussion(highlights, currentPrice, fairValue, opinion, surgeMonthLabel);
      analystComment = fallback.analystComment;
      discussionData = {
        turn1: fallback.turn1,
        turn2: fallback.turn2,
        turn3: fallback.turn3,
      };
      crewComment = fallback.crewComment;
    }

    // ─── 6. 작전 계획서 구성 ─────────────────────────────
    const growthRate = Math.round((targetPrice / currentPrice - 1) * 100);
    const now = new Date();
    const phase1Month = `${now.getMonth() + 2}월`;
    const phase2Month = `${now.getMonth() + 3}월`;

    const operationPlan = {
      currentToTarget: `${currentPrice.toLocaleString()}원 → ${targetPrice.toLocaleString()}원`,
      growthRate: `↑${growthRate.toLocaleString()}%`,
      phase1: { month: phase1Month, title: '자기 가치 인식', summary: '적정가 인식 + 내면 밸류에이션 회복' },
      phase2: { month: phase2Month, title: '모멘텀 확보', summary: '시장 노출 시작 + 타이밍 세팅' },
      phase3: { month: surgeMonthLabel, title: '급등 트리거', locked: true as const, teaser: '3단계 작전은 1:1로만 공개됩니다' },
      crewComment,
    };

    // ─── 7. DB 저장 ──────────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const resultPayload = {
      id: '',
      stockReport: {
        currentPrice,
        fairValue,
        targetPrice,
        undervalueRate,
        investmentOpinion: opinion,
        surgeMonth,
        surgeMonthLabel,
        sector,
        priceGrade,
        fairValueGrade,
        analystComment,
        chartData,
        relationshipFrame,
      },
      discussion: {
        briefing: {
          headline: `현재가 ${currentPrice.toLocaleString()}원까지 하락`,
          subtext: `적정가 ${fairValue.toLocaleString()}원 대비 저평가율 ▼${undervalueRate}%`,
        },
        ...discussionData,
      },
      operationPlan,
      sajuSummary: {
        dayMaster: highlights.ilJuKey,
        dominantElements: [
          highlights.insung >= 25 ? '인성' : '',
          highlights.gwansung >= 25 ? '관성' : '',
          highlights.siksang >= 25 ? '식상' : '',
          highlights.bigyeob >= 25 ? '비겁' : '',
          highlights.jasung >= 25 ? '재성' : '',
        ].filter(Boolean),
        keyTraits: [
          highlights.doHwaSal ? `도화살 ${highlights.doHwaSalCount}개` : '',
          highlights.hongYeomSal ? '홍염살' : '',
          highlights.gongMang ? '공망' : '',
        ].filter(Boolean),
      },
    };

    const { data: inserted, error: insertError } = await supabase
      .from('saju_stocks')
      .insert({
        gender,
        birth_date: birthday,
        birth_time: birthTimeUnknown ? null : (apiBirthday.length >= 12 ? apiBirthday.slice(8) : null),
        calendar_type: 'solar',
        relationship_status: relationshipStatus,
        current_price: currentPrice,
        fair_value: fairValue,
        target_price: targetPrice,
        undervalue_rate: undervalueRate,
        investment_opinion: opinion,
        surge_month: surgeMonth,
        sector,
        price_grade: priceGrade,
        fair_value_grade: fairValueGrade,
        analyst_comment: analystComment,
        result: resultPayload,
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('주가 조작단 결과 저장 실패:', insertError);
    }

    resultPayload.id = inserted?.id ?? crypto.randomUUID();

    // ─── 8. 응답 ────────────────────────────────────
    return jsonResponse(req, resultPayload);

  } catch (err) {
    console.error('analyze-saju-stock 에러:', err);
    return errorResponse(req, '서버 오류가 발생했습니다.', 500);
  }
});
