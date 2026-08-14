export type ShinsalStep = 'landing' | 'input' | 'analyzing' | 'result';

export interface SajuPillars {
  year: string;
  month: string;
  day: string;
  time: string;
}

export interface ShinsalCondition {
  id: string;
  name: string;
  exists: boolean;
  keyword: string;
  description: string;
}

export interface ShinsalGeniusResult {
  resultId: string;
  saju: SajuPillars;
  crazyScore: number; // 똘끼/천재성 지수 (0~100)
  summary: string;
  conditions: ShinsalCondition[];
}