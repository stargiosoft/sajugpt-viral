import type { GisaengType, GisaengTier, SeonbiType, RoundScenario, RoundChoice } from '@/types/gisaeng';

// ─── 기생 유형 정보 ──────────────────────────────────────
export interface GisaengTypeInfo {
  type: GisaengType;
  typeName: string;
  typeSubtitle: string;
  hanja: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
}

export const GISAENG_TYPES: Record<GisaengType, GisaengTypeInfo> = {
  haeeohwa: {
    type: 'haeeohwa',
    typeName: '해어화',
    typeSubtitle: '말로 꽃을 피우는 여인',
    hanja: '解語花',
    emoji: '🌸',
    gradientFrom: '#FF6B9D',
    gradientTo: '#C44569',
  },
  hongryeon: {
    type: 'hongryeon',
    typeName: '홍련',
    typeSubtitle: '눈빛 하나로 방을 지배하는 여인',
    hanja: '紅蓮',
    emoji: '🔥',
    gradientFrom: '#FF4757',
    gradientTo: '#C0392B',
  },
  mukran: {
    type: 'mukran',
    typeName: '묵란',
    typeSubtitle: '그림 한 폭으로 선비를 매혹하는 여인',
    hanja: '墨蘭',
    emoji: '🎨',
    gradientFrom: '#6C5CE7',
    gradientTo: '#341F97',
  },
  chunhyang: {
    type: 'chunhyang',
    typeName: '춘향',
    typeSubtitle: '거절이 무기인 여인',
    hanja: '春香',
    emoji: '🌙',
    gradientFrom: '#A29BFE',
    gradientTo: '#6C5CE7',
  },
  wolha: {
    type: 'wolha',
    typeName: '월하',
    typeSubtitle: '달빛 아래 흔적을 지우는 여인',
    hanja: '月下',
    emoji: '🌊',
    gradientFrom: '#74B9FF',
    gradientTo: '#0984E3',
  },
  hwangjini: {
    type: 'hwangjini',
    typeName: '황진이',
    typeSubtitle: '올라운더 전설의 명기',
    hanja: '黃眞伊',
    emoji: '👑',
    gradientFrom: '#FFD700',
    gradientTo: '#F39C12',
  },
};

// ─── 능력치 한글명 ───────────────────────────────────────
export const STAT_LABELS: Record<string, string> = {
  speech: '화술',
  allure: '요염',
  intellect: '지성',
  pushpull: '밀당',
  intuition: '눈치',
};

// ─── 선비 정보 ──────────────────────────────────────────
export interface SeonbiInfo {
  type: SeonbiType;
  name: string;
  title: string;
  emoji: string;
  thumbnail: string;
  personality: string;
  danger: string;
  baseLoyalty: number;
  baseSuspicion: number;
  salaryMultiplier: number;
}

export const SEONBI_INFO: Record<SeonbiType, SeonbiInfo> = {
  kwonryeok: {
    type: 'kwonryeok',
    name: '김도윤',
    title: '권력형',
    emoji: '🫅',
    thumbnail: '/characters/yoon-taesan.webp',
    personality: '돈 넘치지만 의심 많음',
    danger: '의심 게이지 빠름',
    baseLoyalty: 60,
    baseSuspicion: 30,
    salaryMultiplier: 2.5,
  },
  romantic: {
    type: 'romantic',
    name: '박서진',
    title: '로맨틱형',
    emoji: '🎭',
    thumbnail: '/characters/seo-hwiyoon.webp',
    personality: '순정파. 진심만 원함',
    danger: '거짓 감지 시 즉시 이탈',
    baseLoyalty: 70,
    baseSuspicion: 10,
    salaryMultiplier: 1.5,
  },
  jealousy: {
    type: 'jealousy',
    name: '이준혁',
    title: '질투형',
    emoji: '⚔️',
    thumbnail: '/characters/do-haegyeol.webp',
    personality: '독점욕 강하고 행동파',
    danger: '폭발형 — 흔적 발견 시 난장',
    baseLoyalty: 65,
    baseSuspicion: 20,
    salaryMultiplier: 2.0,
  },
};

// ─── 티어 정보 ──────────────────────────────────────────
export interface TierInfo {
  tier: GisaengTier;
  label: string;
  color: string;
  bonusMultiplier: number;
}

export const TIER_INFO: Record<GisaengTier, TierInfo> = {
  S: { tier: 'S', label: '전설의 명기', color: '#FFD700', bonusMultiplier: 1.5 },
  A: { tier: 'A', label: '위태로운 해어화', color: '#FF4757', bonusMultiplier: 1.2 },
  B: { tier: 'B', label: '쏠쏠한 기생', color: '#7A38D8', bonusMultiplier: 1.0 },
  C: { tier: 'C', label: '외길 춘향', color: '#4488FF', bonusMultiplier: 0.8 },
  D: { tier: 'D', label: '기방에서 쫓겨남', color: '#888888', bonusMultiplier: 0 },
};

// ─── 폴백 서사 ──────────────────────────────────────────
export const FALLBACK_NARRATIVES: Record<GisaengType, string> = {
  haeeohwa: '네가 기방에 들어서면 선비들이 조용해진다. 네가 입을 열면 그제야 웃는다. 한양 최고 문장가가 네 곁에서 시를 읊다가 한 구절을 잊었다. 네가 대신 이어 읊자, 그는 붓을 꺾었다. 너의 도화살은 혀끝에 있다.',
  hongryeon: '네가 술잔을 들면 방 안의 공기가 바뀐다. 아무 말 하지 않았는데 선비의 손이 떨린다. 한양 제일의 무관이 네 앞에서 갑옷을 벗었다. 전쟁터에서 한 번도 지지 않은 남자가, 네 앞에서는 항복했다. 사주에 홍염살이 앉았다. 이건 노력이 아니라 타고난 기운이다.',
  mukran: '네가 먹을 갈면 선비들이 숨을 죽인다. 네 손끝에서 난초가 피어나면, 방 안에 봄이 온다. 대제학이 네 그림을 보고 신윤복보다 낫다고 했다. 사주에 화개살이 있다. 네 매력은 얼굴이 아니라 손끝에서 나온다.',
  chunhyang: '기방의 모든 기생이 선비에게 다가갈 때, 너만 자리에 앉아 있었다. 좌의정이 수청을 요구했다. 너는 싫습니다라고 했다. 그날 이후 좌의정은 매일 기방에 왔다. 도화살이 공망에 걸려 있다. 잡히지 않는 매력이다. 한양에서 가장 비싼 기생은 가장 적게 허락하는 기생이었다.',
  wolha: '다른 기생은 선비가 떠나면 운다. 너는 웃으며 다음 선비에게 술을 따른다. 세 양반이 같은 밤에 기방에 왔는데 아무도 서로의 존재를 몰랐다. 편인과 역마가 만나면 흔적을 지우는 재주가 생긴다. 기방 주인도 네가 몇 명을 만나는지 모른다.',
  hwangjini: '기방이 아니라 역사가 너를 기억한다. 서경덕은 네 앞에서 학문을 잊었고, 벽계수는 네 이름에 무릎을 꿇었다. 도화살, 홍염살, 역마살이 한 사주에 모였다. 천 년에 한 번 나오는 배치다.',
};

export const FALLBACK_TIER_NARRATIVES: Record<GisaengTier, string> = {
  S: '세 남자를 동시에 돌리면서 한 명도 잃지 않은 전설. 조선이 기억할 이름이다.',
  A: '위태롭게 줄타기했지만 결국 살아남았다. 한양 기방가에 네 이름이 오르내린다.',
  B: '한 명을 놓쳤지만, 남은 둘이면 충분하다. 기방에서 중간은 가는 기생.',
  C: '한 명만 남겼다. 순정인지 무능인지는 역사가 판단할 것이다.',
  D: '세 명 다 떠났다. 기방 주인이 네 짐을 싸놨다. 내일부터 출근하지 마라.',
};

export const FALLBACK_SEONBI_COMMENTS: Record<SeonbiType, { alive: string; dead: string }> = {
  kwonryeok: {
    alive: '월향 없이는 못 산다.',
    dead: '기방 문턱도 밟지 않겠다고 선언했다.',
  },
  romantic: {
    alive: '시 100편을 바쳤으나 부족하다 느꼈다.',
    dead: '붓을 꺾고 한양을 떠났다.',
  },
  jealousy: {
    alive: '담을 넘다 허리를 다쳤다.',
    dead: '칼을 뽑았다가 그냥 갔다.',
  },
};

// ─── 분석 중 메시지 ─────────────────────────────────────
export const ANALYZING_MESSAGES = [
  { text: '사주 원국 펼치는 중...', delay: 0 },
  { text: '도화살 검사 중... 🔥', delay: 800 },
  { text: '기생 등급 산정 중...', delay: 1600 },
  { text: '선비 3명 배정 중...', delay: 2400 },
];

export const CALCULATING_MESSAGES = [
  { text: '선비별 충성도 집계 중...', delay: 0 },
  { text: '월 급여 결산 중... 💰', delay: 800 },
  { text: '현대 환산가 계산 중...', delay: 1600 },
];

// ─── 라운드 시나리오 ─────────────────────────────────────
export const ROUND1_SCENARIO: RoundScenario = {
  round: 1,
  title: '오늘 밤, 셋 다 왔다',
  narration: '연회장에 세 선비가 모두 왔다. 각각 네가 자기만 만나는 줄 안다. 세 명의 시선이 동시에 너를 향한다.',
  choices: [
    {
      id: 'A',
      label: '권력형에게 먼저 인사 → 나머지는 몰래 눈짓으로 안심시킴',
      requiredStat: 'intuition',
      threshold: 70,
      successEffects: [],
      failEffects: [
        { target: 'romantic', loyaltyDelta: 0, suspicionDelta: 20 },
      ],
    },
    {
      id: 'B',
      label: '로맨틱형에게 즉석에서 시를 읊어줌 → "오늘은 그대만 보여요"',
      requiredStat: 'speech',
      threshold: 75,
      successEffects: [
        { target: 'romantic', loyaltyDelta: 15, suspicionDelta: 0 },
        { target: 'kwonryeok', loyaltyDelta: 0, suspicionDelta: 10 },
        { target: 'jealousy', loyaltyDelta: 0, suspicionDelta: 10 },
      ],
      failEffects: [
        { target: 'romantic', loyaltyDelta: 0, suspicionDelta: 25 },
      ],
    },
    {
      id: 'C',
      label: '질투형 옆에 자연스럽게 앉아 술을 따름 → 물리적 안심',
      requiredStat: 'allure',
      threshold: 65,
      successEffects: [
        { target: 'jealousy', loyaltyDelta: 15, suspicionDelta: 0 },
        { target: 'kwonryeok', loyaltyDelta: 0, suspicionDelta: 10 },
      ],
      failEffects: [
        { target: 'kwonryeok', loyaltyDelta: 0, suspicionDelta: 15 },
        { target: 'romantic', loyaltyDelta: 0, suspicionDelta: 15 },
      ],
    },
  ],
};

// 라운드 2: 의심이 가장 높은 선비에 따라 동적 분기
export const ROUND2_SCENARIOS: Record<SeonbiType, RoundScenario> = {
  kwonryeok: {
    round: 2,
    title: '의심의 밤 — 권력형',
    narration: '김도윤이 네 방에서 박서진의 시 한 편을 발견했다. "이게 뭐냐?"',
    choices: [
      {
        id: 'A',
        label: '"기방의 다른 기생 것이옵니다" (거짓말)',
        requiredStat: 'intuition',
        threshold: 80,
        successEffects: [
          { target: 'kwonryeok', loyaltyDelta: 0, suspicionDelta: -30 },
        ],
        failEffects: [
          { target: 'kwonryeok', loyaltyDelta: 0, suspicionDelta: 30 },
        ],
      },
      {
        id: 'B',
        label: '"제가 시를 배우고 있사옵니다" (반쯤 진실)',
        requiredStat: 'intellect',
        threshold: 75,
        successEffects: [
          { target: 'kwonryeok', loyaltyDelta: 5, suspicionDelta: -15 },
        ],
        failEffects: [
          { target: 'kwonryeok', loyaltyDelta: 0, suspicionDelta: 15 },
        ],
      },
      {
        id: 'C',
        label: '말없이 술을 따르며 어깨에 기대기 (감각 회피)',
        requiredStat: 'allure',
        threshold: 85,
        successEffects: [
          { target: 'kwonryeok', loyaltyDelta: 0, suspicionDelta: -20 },
        ],
        failEffects: [
          { target: 'kwonryeok', loyaltyDelta: 0, suspicionDelta: 25 },
        ],
      },
    ],
  },
  romantic: {
    round: 2,
    title: '의심의 밤 — 로맨틱형',
    narration: '박서진이 네게 보낸 시에 답장이 없었다. "혹시... 다른 분이 계신 건 아니지요?"',
    choices: [
      {
        id: 'A',
        label: '"그대 시를 읽고 감동받아 붓을 들 수 없었사옵니다"',
        requiredStat: 'speech',
        threshold: 80,
        successEffects: [
          { target: 'romantic', loyaltyDelta: 20, suspicionDelta: -10 },
        ],
        failEffects: [
          { target: 'romantic', loyaltyDelta: -20, suspicionDelta: 20 },
        ],
      },
      {
        id: 'B',
        label: '"저도 시 한 수 지었사옵니다" (대응시 작성)',
        requiredStat: 'intellect',
        threshold: 85,
        successEffects: [
          { target: 'romantic', loyaltyDelta: 25, suspicionDelta: -10 },
        ],
        failEffects: [
          { target: 'romantic', loyaltyDelta: 0, suspicionDelta: 20 },
        ],
      },
      {
        id: 'C',
        label: '눈물을 글썽이며 "미안해요, 바빴어요"',
        requiredStat: 'pushpull',
        threshold: 70,
        successEffects: [
          { target: 'romantic', loyaltyDelta: 10, suspicionDelta: -10 },
        ],
        failEffects: [
          { target: 'romantic', loyaltyDelta: -10, suspicionDelta: 15 },
        ],
      },
    ],
  },
  jealousy: {
    round: 2,
    title: '의심의 밤 — 질투형',
    narration: '이준혁이 기방 주인에게 "월향이 나 말고 다른 선비도 만나냐?"고 직접 물었다.',
    choices: [
      {
        id: 'A',
        label: '기방 주인을 미리 매수해놓기',
        requiredStat: 'intuition',
        threshold: 85,
        successEffects: [
          { target: 'jealousy', loyaltyDelta: 0, suspicionDelta: -20 },
        ],
        failEffects: [
          { target: 'jealousy', loyaltyDelta: 0, suspicionDelta: 30 },
        ],
      },
      {
        id: 'B',
        label: '이준혁을 찾아가 "내가 그대만 보는 줄도 모르시오?" (역공)',
        requiredStat: 'pushpull',
        threshold: 80,
        successEffects: [
          { target: 'jealousy', loyaltyDelta: 20, suspicionDelta: -10 },
        ],
        failEffects: [
          { target: 'jealousy', loyaltyDelta: 0, suspicionDelta: 20 },
        ],
      },
      {
        id: 'C',
        label: '그날 밤 이준혁만 만나며 독점 시간 제공',
        requiredStat: 'allure',
        threshold: 75,
        successEffects: [
          { target: 'jealousy', loyaltyDelta: 15, suspicionDelta: -15 },
          { target: 'kwonryeok', loyaltyDelta: -10, suspicionDelta: 0 },
          { target: 'romantic', loyaltyDelta: -10, suspicionDelta: 0 },
        ],
        failEffects: [
          { target: 'kwonryeok', loyaltyDelta: -10, suspicionDelta: 0 },
          { target: 'romantic', loyaltyDelta: -10, suspicionDelta: 0 },
        ],
      },
    ],
  },
};

export const ROUND3_SCENARIO: RoundScenario = {
  round: 3,
  title: '최후의 밤',
  narration: '자시(밤 11시). 김도윤이 정문으로, 박서진이 후원으로, 이준혁이 담을 넘어 온다. 30분 안에 셋 다 처리해야 한다.',
  choices: [
    {
      id: 'A',
      label: '시간차 공략 — 각각 다른 방에서 10분씩 순서대로 만남',
      requiredStat: 'intuition',
      threshold: 85,
      secondaryStat: 'pushpull',
      secondaryThreshold: 75,
      successEffects: [],
      failEffects: [
        { target: 'all', loyaltyDelta: 0, suspicionDelta: 40 },
      ],
    },
    {
      id: 'B',
      label: '몸종을 보내 2명에게 "오늘 몸이 안 좋다" 전하고 1명만 만남',
      requiredStat: 'intellect',
      threshold: 80,
      successEffects: [
        { target: 'kwonryeok', loyaltyDelta: -15, suspicionDelta: 0 },
        { target: 'romantic', loyaltyDelta: -15, suspicionDelta: 0 },
      ],
      failEffects: [
        { target: 'all', loyaltyDelta: 0, suspicionDelta: 25 },
      ],
    },
    {
      id: 'C',
      label: '연회를 핑계로 3명을 같은 자리에 모으되, 각각에게 다른 눈짓',
      requiredStat: 'speech',
      threshold: 90,
      secondaryStat: 'allure',
      secondaryThreshold: 80,
      successEffects: [
        { target: 'all', loyaltyDelta: 10, suspicionDelta: -10 },
      ],
      failEffects: [
        { target: 'all', loyaltyDelta: -25, suspicionDelta: 30 },
      ],
    },
  ],
};

// ─── 오행 매핑 (일주 → 원소) ─────────────────────────────
export const ELEMENT_MAP: Record<string, 'wood' | 'fire' | 'earth' | 'metal' | 'water'> = {
  '갑': 'wood', '을': 'wood',
  '병': 'fire', '정': 'fire',
  '무': 'earth', '기': 'earth',
  '경': 'metal', '신': 'metal',
  '임': 'water', '계': 'water',
};

// 사주 상성 보너스
export const ELEMENT_BONUSES: Record<string, { type: SeonbiType | 'all'; loyaltyDelta: number; suspicionDelta: number }[]> = {
  water: [{ type: 'romantic', loyaltyDelta: 10, suspicionDelta: 0 }],
  fire: [{ type: 'jealousy', loyaltyDelta: 10, suspicionDelta: 0 }],
  metal: [{ type: 'kwonryeok', loyaltyDelta: 10, suspicionDelta: 0 }],
  wood: [{ type: 'all', loyaltyDelta: 0, suspicionDelta: -5 }],
  earth: [{ type: 'all', loyaltyDelta: 5, suspicionDelta: 0 }],
};
