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
    philosophy: '비상장이 문제. 시장에 나가야 주가가 움직인다',
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
    philosophy: '적정가가 높아도 본인이 자기 값어치를 모르면 시장가는 바닥',
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
    philosophy: '타이밍이 전부. 준비 안 끝나면 1년 더 기다려야',
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
    fallbackComment: '펀더멘털 대비 극심한 저평가. 시장이 이 종목을 모르고 있다.',
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
    fallbackComment: '현재 구간에서 손절은 최악의 선택. 존버가 답.',
  },
  reduce: {
    id: 'reduce',
    label: '비중 축소',
    color: '#059669',
    bgColor: '#ECFDF5',
    fallbackComment: '고점 근접. 차익 실현 권고.',
  },
  warning: {
    id: 'warning',
    label: '관리종목',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    fallbackComment: '일시적 거래 정지 구간. 반등은 옵니다.',
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
