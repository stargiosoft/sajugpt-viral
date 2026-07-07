// deno-lint-ignore-file no-sloppy-imports
import type {
  CrewMemberId,
  FairValueGrade,
  InvestmentOpinion,
  PriceGrade,
  RelationshipFrame,
  RelationshipStatus,
} from '@/types/stock';

// ─── 주가 조작단 캐릭터 ──────────────────────────────

export interface CrewMemberInfo {
  id: CrewMemberId;
  name: string;
  position: string;
  faction: string;
  philosophy: string;
  tone: string;
  emoji: string;
  color: string;
  image: string;
}

export const CREW_MEMBERS: Record<CrewMemberId, CrewMemberInfo> = {
  kang: {
    id: 'kang',
    name: '윤태산',
    position: '작전 본부장',
    faction: '공격파',
    philosophy: '비상장이 문제. 일단 판에 깔아야 돈이 찬다.',
    tone: '반말, 직설, 급함',
    emoji: '⚡',
    color: '#DC2626',
    image: '/characters/yoon-taesan.webp',
  },
  yoon: {
    id: 'yoon',
    name: '서휘윤',
    position: '펀더멘털 분석가',
    faction: '가치파',
    philosophy: '스스로 가치를 모르면 시장가는 언제나 바닥.',
    tone: '존댓말, 차분, 날카로움',
    emoji: '📊',
    color: '#2563EB',
    image: '/characters/seo-hwiyoon.webp',
  },
  cha: {
    id: 'cha',
    name: '최설계',
    position: '차트 전략가',
    faction: '타이밍파',
    philosophy: '타이밍이 전부. 성급하면 1년 내내 물린다.',
    tone: '반존대, 계산적, 긴급함',
    emoji: '📈',
    color: '#059669',
    image: '/characters/choi-seolgye.webp',
  },
};

export const CREW_ORDER: CrewMemberId[] = ['kang', 'yoon', 'cha'];

// ─── 연애 상태 ───────────────────────────────────────

export interface RelationshipStatusInfo {
  id: RelationshipStatus;
  label: string;
  frame: RelationshipFrame;
  frameLabel: string;
  priceBonus: number;
}

export const RELATIONSHIP_STATUSES: RelationshipStatusInfo[] = [
  { id: 'single', label: '싱글', frame: 'unlisted', frameLabel: '비상장 종목', priceBonus: 0 },
  { id: 'some', label: '썸', frame: 'ipo', frameLabel: 'IPO 준비 중', priceBonus: 500 },
  { id: 'dating', label: '연애중', frame: 'listed', frameLabel: '상장 종목 — 저평가 구간', priceBonus: 1000 },
];

// ─── 투자의견 ────────────────────────────────────────

export interface InvestmentOpinionInfo {
  id: InvestmentOpinion;
  label: string;
  color: string;
  bgColor: string;
  fallbackComment: string;
}

export const INVESTMENT_OPINIONS: Record<InvestmentOpinion, InvestmentOpinionInfo> = {
  strong_buy: {
    id: 'strong_buy',
    label: '강력 매수',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    fallbackComment: '역대급 저평가 꿀매물. 세력 매집 시급.',
  },
  buy: {
    id: 'buy',
    label: '매수',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    fallbackComment: '안정적 상승 추세 진입. 중장기 보유 추천.',
  },
  hold: {
    id: 'hold',
    label: '보유(존버)',
    color: '#CA8A04',
    bgColor: '#FEFCE8',
    fallbackComment: '여기서 손절하면 평생 후회함. 존버가 답.',
  },
  reduce: {
    id: 'reduce',
    label: '비중 축소',
    color: '#059669',
    bgColor: '#ECFDF5',
    fallbackComment: '단기 고점 도달. 이제 슬슬 익절할 타이밍.',
  },
  warning: {
    id: 'warning',
    label: '관리종목',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    fallbackComment: '잠정적 거래 정지. 멘탈 잡으면 반등 옴.',
  },
};

// ─── 투자의견 카드 문구 (리포트 카드 "현재 투자 의견" / 손절 경고 박스용) ───
// **텍스트**는 손절 경고 박스에서 강조색으로 렌더링된다.

export interface InvestmentOpinionDetail {
  quote: string;
  warningTitle: string;
  warningBody: string;
}

export const INVESTMENT_OPINION_DETAILS: Record<InvestmentOpinion, InvestmentOpinionDetail> = {
  strong_buy: {
    quote: '지금 안 잡으면 평생 후회할 주식이에요.',
    warningTitle: '지금 **망설이면**, 나중에 **땅을 치고** 후회합니다.',
    warningBody: '이 정도 저평가는 오래가지 않아요.',
  },
  buy: {
    quote: '지금이 매수하기 딱 좋은 타이밍이에요.',
    warningTitle: '**무릎에서** 사야 **어깨에서** 웃습니다.',
    warningBody: '망설이는 사이 기회가 지나갈 수 있어요.',
  },
  hold: {
    quote: '지금 팔기엔 아까운 주식이에요.',
    warningTitle: '지금 **손절**하면, 나중에 **땅을 칠** 상입니다.',
    warningBody: '아직 시장이 당신의 가치를 모를 뿐이에요.',
  },
  reduce: {
    quote: '지금은 차익 실현을 고민할 때예요.',
    warningTitle: '너무 오래 들고 있으면 **물릴** 상입니다.',
    warningBody: '오른 만큼 내려올 수도 있어요.',
  },
  warning: {
    quote: '지금은 잠시 숨 고르기가 필요해요.',
    warningTitle: '여기서 **포기하기엔** 아직 이릅니다.',
    warningBody: '관리종목도 반등할 때가 있어요.',
  },
};

// ─── 가격 등급 ───────────────────────────────────────

export interface PriceGradeInfo {
  id: PriceGrade;
  label: string;
  badgeLabel: string;
  borderColor: string;
  minPrice: number;
  maxPrice: number;
}

export const PRICE_GRADES: PriceGradeInfo[] = [
  { id: 'premium', label: '우량주', badgeLabel: '프리미엄 종목', borderColor: '#CA8A04', minPrice: 8000, maxPrice: Infinity },
  { id: 'mid', label: '중형주', badgeLabel: '', borderColor: '#9CA3AF', minPrice: 5000, maxPrice: 7999 },
  { id: 'small', label: '소형주', badgeLabel: '저평가 발굴', borderColor: '#7A38D8', minPrice: 2000, maxPrice: 4999 },
  { id: 'penny', label: '동전주', badgeLabel: '역대 저점', borderColor: '#DC2626', minPrice: 800, maxPrice: 1999 },
  { id: 'warning', label: '관리종목', badgeLabel: '관리종목 지정', borderColor: '#6B7280', minPrice: 0, maxPrice: 799 },
];

export function getPriceGrade(price: number): PriceGradeInfo {
  return PRICE_GRADES.find(g => price >= g.minPrice && price <= g.maxPrice) ?? PRICE_GRADES[4];
}

// ─── 적정가 등급 ─────────────────────────────────────

export interface FairValueGradeInfo {
  id: FairValueGrade;
  label: string;
  badgeLabel: string;
  color: string;
}

export const FAIR_VALUE_GRADES: Record<FairValueGrade, FairValueGradeInfo> = {
  bluechip: { id: 'bluechip', label: '블루칩', badgeLabel: '블루칩 종목', color: '#CA8A04' },
  quality: { id: 'quality', label: '우량주', badgeLabel: '우량주', color: '#9CA3AF' },
  growth: { id: 'growth', label: '성장주', badgeLabel: '성장 잠재력', color: '#7A38D8' },
};

export function getFairValueGrade(fairValue: number): FairValueGrade {
  if (fairValue >= 25000) return 'bluechip';
  if (fairValue >= 18000) return 'quality';
  return 'growth';
}

// ─── 로딩 메시지 ─────────────────────────────────────

export const ANALYZING_MESSAGES = [
  '종목 데이터 수집 중...',
  '원국 밸류에이션 산정 중...',
  '도화살 모멘텀 분석 중...',
  '주가 조작단 소집 중...',
];
