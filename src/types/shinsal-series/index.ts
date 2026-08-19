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
  crazyScore: number;
  summary: string;
  conditions: ShinsalCondition[];
}