import type { SajuIndicators, PercentileBadgeInfo } from '@/types/dating';

// ── 캐릭터 데이팅 프로필 ──

export interface DatingCharacterProfile {
  id: string;
  name: string;
  archetype: string;
  thumbnail: string;
  speechPattern: string;
  likes: string;
  dislikes: string;
  defaultSuccessThreshold: number;
  scoreWeights: {
    charm: number;
    conversation: number;
    sense: number;
    addiction: number;
  };
  personalityPrompt: string;
  defaultFirstImpression: string;
  conditionalFirstImpressions: Array<{
    condition: (s: SajuIndicators) => boolean;
    line: string;
  }>;
}

export const DATING_CHARACTERS: DatingCharacterProfile[] = [
  {
    id: 'yoon-taesan',
    name: '윤태산',
    archetype: '야수형 짐승남',
    thumbnail: '/characters/yoon-taesan.webp',
    speechPattern: '반말, 도발적, 짧은 문장 ("...흥", "재밌네", "...해봐")',
    likes: '대담한 직진, 당당함, 눈 마주침, 거침없는 태도',
    dislikes: '눈치 보기, 빈말, 과도한 칭찬, 소극적 태도',
    defaultSuccessThreshold: 70,
    scoreWeights: { charm: 0.35, conversation: 0.15, sense: 0.20, addiction: 0.30 },
    personalityPrompt: '도발적이고 야수적인 매력의 남자. 관심 없는 척하지만 마음에 드는 상대에게는 은근히 관심을 보인다. 직진하는 상대에게 약하고, 눈치 보는 상대는 지루해한다.',
    defaultFirstImpression: '흥. 재미있는 사주네. 나한테 도전하겠다고?',
    conditionalFirstImpressions: [
      { condition: (s) => s.doHwaSal, line: '네 사주에서 도화살 냄새가 나는데? ...조금 기대해볼게.' },
      { condition: (s) => s.hongYeomSal, line: '홍염살이라... 대담한 건 마음에 들어.' },
      { condition: (s) => s.fireRatio >= 30, line: '화기가 센 사주군. 불꽃놀이가 되려나.' },
    ],
  },
  {
    id: 'do-haegyeol',
    name: '도해결',
    archetype: '지적 엘리트 심리분석가',
    thumbnail: '/characters/do-haegyeol.webp',
    speechPattern: '존댓말 베이스, 논리적, 분석적 ("데이터상으로는...", "흥미롭군요", "논리적이시네요")',
    likes: '논리적 대화, 독립적 태도, 지적 유머, 자기주관',
    dislikes: '감정적 호소, 의존적 태도, 무지, 논리 없는 주장',
    defaultSuccessThreshold: 65,
    scoreWeights: { charm: 0.15, conversation: 0.35, sense: 0.30, addiction: 0.20 },
    personalityPrompt: '냉철한 지적 엘리트. 모든 것을 분석하고 데이터로 판단한다. 논리적으로 대화하는 상대에게 호감을 느끼고, 감정에만 호소하는 상대는 피곤해한다.',
    defaultFirstImpression: '데이터를 보면 당신의 성공 확률은... 글쎄요.',
    conditionalFirstImpressions: [
      { condition: (s) => s.insung >= 25, line: '인성이 강하군요. 대화가 통할 수도 있겠어요.' },
      { condition: (s) => s.gwansung >= 25, line: '관성이 발달했네요. 제 기준에 부합할지 봅시다.' },
    ],
  },
  {
    id: 'seo-hwiyoon',
    name: '서휘윤',
    archetype: '치유형 연하남',
    thumbnail: '/characters/seo-hwiyoon.webp',
    speechPattern: '존댓말, 따뜻함, 밝은 톤 ("~요!", "진짜요?!", "좋아요!", "헤헤")',
    likes: '솔직함, 배려, 일상적 관심, 자연스러운 대화',
    dislikes: '건방짐, 무관심, 냉소, 거만한 태도',
    defaultSuccessThreshold: 55,
    scoreWeights: { charm: 0.25, conversation: 0.30, sense: 0.25, addiction: 0.20 },
    personalityPrompt: '따뜻하고 밝은 연하남. 상대의 이야기에 진심으로 관심을 가지고 공감한다. 솔직하고 편안한 대화를 좋아하고, 가식이나 냉소적 태도에 상처받는다.',
    defaultFirstImpression: '안녕하세요! 사주 보니까 되게 따뜻한 사람일 것 같아요.',
    conditionalFirstImpressions: [
      { condition: (s) => s.sikSin >= 2, line: '식신이 강하시네요! 맛집 얘기 좋아하시죠? 저도요!' },
      { condition: (s) => s.jasung >= 25, line: '재성이 좋으시네요. 뭔가 든든한 느낌이 들어요.' },
    ],
  },
  {
    id: 'gi-jimun',
    name: '기지문',
    archetype: '무뚝뚝 경호원형',
    thumbnail: '/characters/gi-jimun.webp',
    speechPattern: '최소한의 단어, 무뚝뚝 ("...그래", "됐어", "...알겠어", "...")',
    likes: '행동으로 보여주는 성의, 묵묵한 태도, 진정성, 가식 없음',
    dislikes: '말만 많은 태도, 가식, 과장, 허세',
    defaultSuccessThreshold: 65,
    scoreWeights: { charm: 0.30, conversation: 0.20, sense: 0.15, addiction: 0.35 },
    personalityPrompt: '과묵하고 듬직한 경호원 타입. 말보다 행동을 중시하고, 진정성 있는 사람에게만 마음을 연다. 말이 많거나 가식적인 사람은 무시한다.',
    defaultFirstImpression: '...말은 적게 하겠습니다. 행동으로 보여주세요.',
    conditionalFirstImpressions: [
      { condition: (s) => s.bigyeon >= 30, line: '비겁이 강하군. 고집이 세겠지만... 싫지 않아.' },
      { condition: (s) => s.doHwaSal, line: '도화살... 위험한 기운이야. 내가 지켜야 하나.' },
    ],
  },
  {
    id: 'choi-seolgye',
    name: '최설계',
    archetype: '도시형 전략가',
    thumbnail: '/characters/choi-seolgye.webp',
    speechPattern: '비즈니스 톤, 은유적 ("투자 대비 수익률이...", "포트폴리오를 보면", "전략적으로 접근하면")',
    likes: '전략적 사고, 야망, 위트 있는 말장난, 자신감',
    dislikes: '무계획, 수동적 태도, 진부함, 노력 없는 기대',
    defaultSuccessThreshold: 70,
    scoreWeights: { charm: 0.20, conversation: 0.25, sense: 0.35, addiction: 0.20 },
    personalityPrompt: '모든 것을 전략과 투자의 관점에서 바라보는 도시형 남자. 연애도 포트폴리오처럼 분석한다. 위트 있고 야심찬 상대에게 끌리며, 무계획적이거나 수동적인 사람은 가치를 못 느낀다.',
    defaultFirstImpression: '당신의 사주를 분석해봤는데, 꽤 흥미로운 포트폴리오군요.',
    conditionalFirstImpressions: [
      { condition: (s) => s.jasung >= 30, line: '재성이 이 정도면... 투자 가치가 있어 보이네요.' },
      { condition: (s) => s.sangGwan >= 2, line: '상관이 강하군요. 예측 불가능한 타입... 제 취향이에요.' },
    ],
  },
];

// ── 궁합 점수 산출 ──

interface CompatibilityRule {
  condition: (s: SajuIndicators) => boolean;
  bonus: number;
}

const COMPATIBILITY_RULES: Record<string, { base: number; rules: CompatibilityRule[] }> = {
  'yoon-taesan': {
    base: 30,
    rules: [
      { condition: (s) => s.doHwaSal, bonus: 25 },
      { condition: (s) => s.hongYeomSal, bonus: 15 },
      { condition: (s) => s.siksang >= 25, bonus: 15 },
      { condition: (s) => s.fireRatio >= 30, bonus: 15 },
    ],
  },
  'do-haegyeol': {
    base: 35,
    rules: [
      { condition: (s) => s.insung >= 25, bonus: 20 },
      { condition: (s) => s.gwansung >= 25, bonus: 20 },
      { condition: (s) => s.pyeonGwan >= 2, bonus: 15 },
      { condition: (s) => s.bigyeon <= 20, bonus: 10 },
    ],
  },
  'seo-hwiyoon': {
    base: 40,
    rules: [
      { condition: (s) => s.jasung >= 25, bonus: 20 },
      { condition: (s) => s.sikSin >= 2, bonus: 15 },
      { condition: (s) => s.sangGwan >= 1, bonus: 15 },
      { condition: (s) => s.fireRatio <= 20, bonus: 10 },
    ],
  },
  'gi-jimun': {
    base: 35,
    rules: [
      { condition: (s) => s.bigyeon >= 30, bonus: 20 },
      { condition: (s) => s.gwansung >= 20, bonus: 15 },
      { condition: (s) => s.doHwaSal, bonus: 15 },
      { condition: (s) => s.insung <= 15, bonus: 15 },
    ],
  },
  'choi-seolgye': {
    base: 30,
    rules: [
      { condition: (s) => s.jasung >= 30, bonus: 25 },
      { condition: (s) => s.insung >= 20, bonus: 15 },
      { condition: (s) => s.sangGwan >= 2, bonus: 15 },
      { condition: (s) => s.fireRatio >= 25, bonus: 15 },
    ],
  },
};

export function calculateCompatibility(characterId: string, saju: SajuIndicators): number {
  const config = COMPATIBILITY_RULES[characterId];
  if (!config) return 0;

  let score = config.base;
  for (const rule of config.rules) {
    if (rule.condition(saju)) score += rule.bonus;
  }
  return Math.min(100, score);
}

export function getFirstImpression(characterId: string, saju: SajuIndicators): string {
  const char = DATING_CHARACTERS.find((c) => c.id === characterId);
  if (!char) return '';

  for (const ci of char.conditionalFirstImpressions) {
    if (ci.condition(saju)) return ci.line;
  }
  return char.defaultFirstImpression;
}

export function getSuccessThreshold(characterId: string, compatibility: number): number {
  const char = DATING_CHARACTERS.find((c) => c.id === characterId);
  if (!char) return 70;

  if (compatibility >= 80) return Math.max(50, char.defaultSuccessThreshold - 15);
  if (compatibility >= 60) return Math.max(55, char.defaultSuccessThreshold - 5);
  if (compatibility >= 40) return char.defaultSuccessThreshold;
  return Math.min(85, char.defaultSuccessThreshold + 10);
}

// ── 일간(日干) 프로필 ──

export interface IlganProfile {
  name: string;
  description: string;
  datingStyle: string;
}

export const ILGAN_PROFILES: Record<string, IlganProfile> = {
  '갑목': {
    name: '갑목일간',
    description: '곧고 강한 나무처럼 리더십이 강하고 자존심이 높음',
    datingStyle: '직진형. 관심 있으면 드러내지만, 자존심 때문에 먼저 고백은 어려움',
  },
  '을목': {
    name: '을목일간',
    description: '덩굴처럼 유연하고 적응력이 뛰어나지만 돌려 말하는 경향',
    datingStyle: '은근 어필형. 돌려 말해서 상대가 모를 수 있음. 눈치 게임 선호',
  },
  '병화': {
    name: '병화일간',
    description: '태양처럼 밝고 열정적이며 사교적',
    datingStyle: '불꽃 직진형. 관심 있으면 모두가 알 정도로 티가 남. 식을 때도 빠름',
  },
  '정화': {
    name: '정화일간',
    description: '촛불처럼 따뜻하지만 섬세하고 내면이 깊음',
    datingStyle: '은밀한 로맨티스트. 겉으론 담담하지만 속으론 불타오르는 타입',
  },
  '무토': {
    name: '무토일간',
    description: '산처럼 듬직하고 포용력이 넓지만 느린 편',
    datingStyle: '슬로우 스타터. 친해지는 데 시간이 걸리지만 한번 빠지면 깊음',
  },
  '기토': {
    name: '기토일간',
    description: '정원처럼 섬세하고 잘 가꾸지만 걱정이 많음',
    datingStyle: '완벽 준비형. 고백 전 시뮬레이션 100번 돌려보는 타입',
  },
  '경금': {
    name: '경금일간',
    description: '바위처럼 단단하고 결단력이 있지만 융통성이 부족',
    datingStyle: '원칙주의자. "좋으면 좋고 싫으면 싫다" 확실한 편',
  },
  '신금': {
    name: '신금일간',
    description: '보석처럼 예민하고 완벽주의적이며 날카로운 감각',
    datingStyle: '감각파. 분위기, 패션, 말투 하나하나 채점하며 높은 기준을 가짐',
  },
  '임수': {
    name: '임수일간',
    description: '바다처럼 깊고 넓으며 자유로운 영혼',
    datingStyle: '자유연애파. 깊은 대화를 좋아하지만 구속은 질색',
  },
  '계수': {
    name: '계수일간',
    description: '비처럼 조용하고 직관적이며 감성이 풍부',
    datingStyle: '감성 폭발형. 분위기에 취하면 올인, 현실감각은 나중',
  },
};

// ── 점수 산출 ──

const SCORE_LABEL_MAP: Record<string, string> = {
  charm: '매력도',
  conversation: '대화력',
  sense: '센스',
  addiction: '중독성',
};

export function getScoreLabel(key: string): string {
  return SCORE_LABEL_MAP[key] ?? key;
}

// ── 퍼센타일 뱃지 ──

export function getPercentileBadge(percentile: number): PercentileBadgeInfo {
  if (percentile <= 1) return { label: '전설의 작업남/녀', color: '#FFD700' };
  if (percentile <= 5) return { label: '타고난 연애 천재', color: '#FF4444' };
  if (percentile <= 10) return { label: '희귀한 재능', color: '#7A38D8' };
  if (percentile <= 30) return { label: '평균 이상', color: '#4488FF' };
  if (percentile <= 50) return { label: '노력형', color: '#44BB44' };
  if (percentile >= 90) return { label: '읽씹 전문가', color: '#FF4444' };
  return { label: '수련이 필요합니다', color: '#888888' };
}

// ── 조기 종료 ──

export const EARLY_EXIT_THRESHOLD = 10;
