import type { Gender } from '@/types/battle';

export type MoneyTimelineStep = 'landing' | 'input' | 'analyzing' | 'result';

export type SipsungCategory = '비겁' | '식상' | '재성' | '관성' | '인성';

export interface WealthPeriod {
  ageLabel: string;
  ageStart: number;
  ageEnd: number;
  score: number;
}

export interface BestPeriodInfo {
  ageLabel: string;
  ageStart: number;
  ageEnd: number;
  score: number;
  features: string[];
}

export interface MoneyStyleInfo {
  category: SipsungCategory;
  title: string;
  description: string;
  yongsinNote: string;
}

export interface MoneyTimelineProfile {
  overallScore: number;
  summaryLine: string;
  periods: WealthPeriod[];
  bestPeriod: BestPeriodInfo;
  moneyStyle: MoneyStyleInfo;
}

export interface MoneyTimelineResult {
  resultId: string;
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
  profile: MoneyTimelineProfile;
  createdAt: string;
}
