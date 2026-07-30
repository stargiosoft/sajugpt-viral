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

export interface StargioRaw {
  성별: string;
  나이: number;
  만나이: number;
  양력: unknown;
  음력: unknown;
  발달십성: Record<string, number>;
  발달오행: Record<string, number>;
  용신: any;
  용신오행: any;
  대운: any;
  대운순서: any;
  월운보기: any;
  세운: any;
  오늘의재물운?: any;
  [key: string]: any;
}

export interface MoneyTimelineResult {
  resultId: string;
  birthDate: string;
  birthTime: string;
  unknownTime: boolean;
  gender: Gender;
  profile: MoneyTimelineProfile;
  stargioRaw: StargioRaw;
  createdAt: string;
}
