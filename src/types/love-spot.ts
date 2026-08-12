import type { Gender } from '@/types/battle';

export type OhengKey = 'BI' | 'SIK' | 'JAE' | 'GWAN' | 'IN';

export interface OhengScoreDetail {
  score: number;
  wshs: number;
}

export type OhengScores = Record<OhengKey, OhengScoreDetail>;

export interface TopElementItem {
  key: OhengKey;
  score: number;
  wshs: number;
}

export interface LoveSpotFormState {
  gender: Gender | null;
  birthday: string;   // "YYYY-MM-DD"
  birthTime: string;  // "오전 HH:MM" | "오후 HH:MM"
  birthTimeUnknown: boolean;
}

export interface LoveSpotContent {
  contentKey: string;   // '재인' | '하드인비' | '비겁' 등 25종
  places: string;      
  placeDesc: string;  
  tip: string;        
  imageSlug: string;  
}

export interface LoveSpotResult {
  resultId: string;
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
  scores: OhengScores;
  topElements: [TopElementItem, TopElementItem];
  section: string; // '3-1' | '3-2' | '3-3'
  content: LoveSpotContent;
  createdAt: string;
}