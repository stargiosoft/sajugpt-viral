export type Gender = 'female' | 'male';

export type Grade = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'CUT';

export interface CharacterResult {
  id: string;
  name: string;
  reason: string;
  archetype: string;
}

export interface SajuHighlights {
  doHwaSal: boolean;
  hongYeomSal: boolean;
  topSipsung: string;
  fireRatio: number;
  yeonaeSeongHyang: string;
}

export interface BattleResult {
  battleId: string;
  score: number;
  headcount: number;
  grade: Grade;
  title: string;
  characters: CharacterResult[];
  verdict: string;
  chatScript: string;
  sajuHighlights: SajuHighlights;
}

export type Step = 'landing' | 'input' | 'analyzing' | 'result';
