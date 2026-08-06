import type { Gender } from '@/types/battle';

// Edge Function 응답의 오행 키 (WhySolo API 원본 키)
export type OhengKey = 'BI' | 'SIK' | 'JAE' | 'GWAN' | 'IN';

export interface OhengScoreDetail {
  score: number;
  wshs: number;
}

export type OhengScores = Record<OhengKey, OhengScoreDetail>;

export interface SoloGuideFormState {
  gender: Gender | null;
  birthday: string;        // "YYYY-MM-DD"
  birthTime: string;       // "오전 HH:MM" | "오후 HH:MM"
  birthTimeUnknown: boolean;
}

// solo_guide_results 테이블 콘텐츠
export interface SoloGuideContent {
  title: string;
  reasonSolo: string;
  charmPoint: string;
  compatibility: string;
  tip: string;
}

export interface TopElementItem {
  key: OhengKey;
  score: number;
  wshs: number;
}

export interface SoloGuideResult {
  resultId: string;
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
  scores: OhengScores;
  topElements: [TopElementItem, TopElementItem];
  section: string; // '3-1' | '3-2' | '3-3'
  contentKey: string;
  content: SoloGuideContent;
  createdAt: string;
}