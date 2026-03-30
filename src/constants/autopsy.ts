import type {
  CauseOfDeath,
  CauseOfDeathInput,
  CoronerId,
  DiscernmentGrade,
  RelationshipDuration,
} from '@/types/autopsy';

// ─── 사인(死因) 선택지 ─────────────────────────────────
export interface CauseOfDeathInputInfo {
  id: CauseOfDeathInput;
  label: string;
  emoji: string;
  description: string;
}

export const CAUSE_OF_DEATH_INPUTS: CauseOfDeathInputInfo[] = [
  { id: 'ghosting', label: '갑자기 연락 두절', emoji: '👻', description: '어느 날 갑자기 사라졌다' },
  { id: 'prettier', label: '더 예쁜 여자 생김', emoji: '💔', description: '겉만 보는 놈이었다' },
  { id: 'always_busy', label: '만나자고 하면 항상 바쁨', emoji: '⏰', description: '나만 매달리고 있었다' },
  { id: 'physical_only', label: '잠자리만 찾음', emoji: '🔥', description: '진심은 없었다' },
  { id: 'faded', label: '이유 없이 식어버림', emoji: '🧊', description: '아무 이유도 없이 끝났다' },
];

// ─── 사귄 기간 ──────────────────────────────────────
export interface RelationshipDurationInfo {
  id: RelationshipDuration;
  label: string;
}

export const RELATIONSHIP_DURATIONS: RelationshipDurationInfo[] = [
  { id: 'brief', label: '잠깐 만남' },
  { id: 'months', label: '몇 달' },
  { id: 'over_year', label: '1년 이상' },
  { id: 'long_term', label: '오래 만남' },
];

// ─── 검시관 ─────────────────────────────────────────
export interface CoronerInfo {
  id: CoronerId;
  name: string;
  tone: string;
  thumbnail: string;
  emoji: string;
  description: string;
}

export const CORONERS: CoronerInfo[] = [
  {
    id: 'yoon-taesan',
    name: '윤태산',
    tone: '분노형',
    thumbnail: '/characters/yoon-taesan.webp',
    emoji: '🔥',
    description: '"이런 놈 때문에 울었다고? 화난다 진짜"',
  },
  {
    id: 'seo-hwiyoon',
    name: '서휘윤',
    tone: '치유형',
    thumbnail: '/characters/seo-hwiyoon.webp',
    emoji: '🌙',
    description: '"당신 탓이 아니에요. 이 분이 부족했던 거예요"',
  },
];

// ─── 사망 원인 10종 ──────────────────────────────────
export interface CauseOfDeathInfo {
  id: CauseOfDeath;
  label: string;
  emoji: string;
  fallbackYoonTaesan: string;
  fallbackSeoHwiyoon: string;
}

export const CAUSES_OF_DEATH: Record<CauseOfDeath, CauseOfDeathInfo> = {
  blind_eye: {
    id: 'blind_eye',
    label: '안목 사망',
    emoji: '👁️',
    fallbackYoonTaesan: '이런 놈 때문에 울었다고? 화난다 진짜.',
    fallbackSeoHwiyoon: '이 분의 사주는 본질을 읽는 눈이 부족한 구조예요.',
  },
  emotional_numb: {
    id: 'emotional_numb',
    label: '감정 불감증',
    emoji: '🧊',
    fallbackYoonTaesan: '감정 처리 기능이 사주에서부터 고장난 놈이야.',
    fallbackSeoHwiyoon: '이 분은 감정을 받아들이는 통로가 막혀있는 사주예요.',
  },
  depth_phobia: {
    id: 'depth_phobia',
    label: '깊이 공포증',
    emoji: '🕳️',
    fallbackYoonTaesan: '깊어지는 게 무서운 사주야. 넌 진심으로 갔는데 이 놈은 겁먹고 도망간 거지.',
    fallbackSeoHwiyoon: '이 분의 사주는 깊은 감정을 감당하는 그릇이 작아요.',
  },
  responsibility_dodge: {
    id: 'responsibility_dodge',
    label: '책임 회피 증후군',
    emoji: '🏃',
    fallbackYoonTaesan: '책임은 못 지면서 좋아한다? 그건 좋아하는 게 아니라 갖고 노는 거야.',
    fallbackSeoHwiyoon: '이 분은 감정의 무게를 견디는 구조가 아니에요.',
  },
  self_centered: {
    id: 'self_centered',
    label: '자기중심 과잉',
    emoji: '🪞',
    fallbackYoonTaesan: '이 사주는 세상의 중심이 자기야. 네가 옆에 있든 없든 똑같은 놈이었어.',
    fallbackSeoHwiyoon: '이 분의 세계에는 자기밖에 없는 구조예요.',
  },
  possessive: {
    id: 'possessive',
    label: '소유욕 과다',
    emoji: '🔒',
    fallbackYoonTaesan: '가지려고만 하고 지키려고는 안 하는 사주.',
    fallbackSeoHwiyoon: '소유와 사랑을 구분 못 하는 구조예요.',
  },
  charm_delusion: {
    id: 'charm_delusion',
    label: '매력 착각 증후군',
    emoji: '🎭',
    fallbackYoonTaesan: '본인이 잘난 줄 아는데 실제론 별거 없는 사주야.',
    fallbackSeoHwiyoon: '자기 매력에 대한 착각이 있는 사주예요.',
  },
  focus_deficit: {
    id: 'focus_deficit',
    label: '집중력 결핍',
    emoji: '🦋',
    fallbackYoonTaesan: '새 거 나오면 바로 넘어가는 사주. 원래 이런 놈이야.',
    fallbackSeoHwiyoon: '하나에 오래 집중하는 게 구조적으로 어려운 사주예요.',
  },
  emotional_fugitive: {
    id: 'emotional_fugitive',
    label: '감정 도주범',
    emoji: '💨',
    fallbackYoonTaesan: '감정이 복잡해지면 도망가는 사주. 비겁한 거야.',
    fallbackSeoHwiyoon: '감정을 마주하는 게 무서운 구조예요.',
  },
  face_obsession: {
    id: 'face_obsession',
    label: '체면 과잉 증후군',
    emoji: '🎩',
    fallbackYoonTaesan: '주변 눈치만 보는 사주. 널 사랑한 게 아니라 사랑하는 척한 거야.',
    fallbackSeoHwiyoon: '타인의 시선이 자기 감정보다 큰 사주예요.',
  },
};

// ─── 매력 감별 능력 등급 ──────────────────────────────
export interface DiscernmentGradeInfo {
  grade: DiscernmentGrade;
  label: string;
  color: string;
  comment: string;
}

export const DISCERNMENT_GRADES: Record<DiscernmentGrade, DiscernmentGradeInfo> = {
  F: { grade: 'F', label: '안목 완전 부재', color: '#DC2626', comment: '완전한 안목 부재. 다이아몬드 앞에서 유리구슬 고른 격' },
  D: { grade: 'D', label: '감은 있는데 읽을 줄 모름', color: '#EA580C', comment: '감은 있었는데 읽을 줄 몰랐음. 거의 문맹 수준' },
  C: { grade: 'C', label: '알면서 안 한 거', color: '#CA8A04', comment: '알면서 안 한 거면 더 나쁨. 고의범' },
  B: { grade: 'B', label: '알아봤는데 지킬 줄 몰랐음', color: '#2563EB', comment: '알아봤는데 지킬 줄 몰랐음. 과실치사' },
  A: { grade: 'A', label: '볼 줄은 아는 사람', color: '#7A38D8', comment: '볼 줄은 아는 사람이었음. 타이밍의 문제' },
};

// ─── 다음 연애 예후 ──────────────────────────────────
export const PROGNOSES: Record<CauseOfDeath, string[]> = {
  blind_eye: ['비슷한 실수 반복 예정', '겉만 보다가 또 놓칠 확률 높음'],
  emotional_numb: ['감정 결핍 만성화 예상', '혼자 늙어갈 위험 높음'],
  depth_phobia: ['얕은 연애만 반복할 구조', '깊어지면 또 도망갈 것'],
  responsibility_dodge: ['책임 없는 연애 패턴 고착', '같은 이유로 또 차일 것'],
  self_centered: ['자기 세계에 갇혀 외로워질 예정', '후회할 때쯤 이미 늦음'],
  possessive: ['소유만 하다 진짜 사랑 놓칠 것', '패턴 반복 확률 극히 높음'],
  charm_delusion: ['착각이 깨지는 순간이 올 것', '그때 당신이 떠오를 것'],
  focus_deficit: ['새 자극 중독으로 안정 불가', '어디서든 같은 패턴 반복'],
  emotional_fugitive: ['도망 패턴 반복. 고립 예상', '본인도 모르게 후회 중'],
  face_obsession: ['체면 유지하다 진심을 잃을 것', '겉은 멀쩡해도 속은 텅 빌 예정'],
};

// ─── 로딩 메시지 ─────────────────────────────────────
export const ANALYZING_MESSAGES = [
  '사건 접수 중...',
  '검시관 현장 도착...',
  '사인 확인 중...',
  '사주 원국 해부 준비 중...',
  '부검 진행 중...',
];
