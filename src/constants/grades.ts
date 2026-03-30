import type { Grade } from '@/types/battle';

export interface GradeInfo {
  grade: Grade;
  title: string;
  color: string;
  tonDescription: string;
}

export const GRADE_MAP: Record<number, GradeInfo> = {
  5: {
    grade: 'SSS',
    title: '만인의 정복자',
    color: '#FFD700',
    tonDescription: '다섯 놈이 서로 죽인다고 난리. 언니 사주 전생에 여우였음?',
  },
  4: {
    grade: 'SS',
    title: '치명적 요부',
    color: '#FF4444',
    tonDescription: '네 놈이 자기가 주인이라고 으르렁대는 중. 수습 불가',
  },
  3: {
    grade: 'S',
    title: '은밀한 사냥꾼',
    color: '#7A38D8',
    tonDescription: '세 놈이 슬금슬금 다가오는 중. 본인은 모르겠지만 이미 포위됨',
  },
  2: {
    grade: 'A',
    title: '늦깎이 매력폭발',
    color: '#4488FF',
    tonDescription: '두 놈이 서로 눈치 보며 기회 엿보는 중. 나잇값 하는 페로몬',
  },
  1: {
    grade: 'B',
    title: '원픽 집착남 보유',
    color: '#44BB44',
    tonDescription: '딱 한 놈인데… 이놈이 좀 집착이 심함. 사주가 부른 운명적 스토커',
  },
  0: {
    grade: 'CUT',
    title: '조선시대 수녀',
    color: '#888888',
    tonDescription: '',
  },
};

export function getGradeInfo(headcount: number): GradeInfo {
  return GRADE_MAP[Math.min(headcount, 5)] ?? GRADE_MAP[0];
}
