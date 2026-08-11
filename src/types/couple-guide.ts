import type { Gender } from '@/types/battle';

export interface PersonBirthInfo {
  gender: Gender;
  birthday: string;          // 'YYYY-MM-DD'
  birthTime: string;         // TimeSelectSheet가 만든 표시용 문자열
  birthTimeUnknown: boolean; // '모름' 선택 여부
}

export interface CoupleGuideFormState {
  person1: PersonBirthInfo;
  person2: PersonBirthInfo;
  calendarType: 'solar' | 'lunar';
}

/** 텔레파시 지수, 티격태격 지수 등 게이지 바 하나에 대응하는 데이터 */
export interface ChemiStat {
  label: string;
  value: number;
  color?: string;
  caption?: string;
}

export interface CoupleGuideResult {
  score: number;
  rawScore: string;
  description: string;
  relationshipTitle: string;
  relationshipSubtitle: string;
  hashtags: string[];
  chemiStats: ChemiStat[];
}