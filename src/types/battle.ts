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
  battle?: BattleComparison;
}

export interface BattleComparison {
  challenger: { headcount: number; grade: Grade; title: string; score: number };
  acceptor: { headcount: number; grade: Grade; title: string; score: number };
  winner: 'challenger' | 'acceptor' | 'draw';
  winType: '압승' | '신승' | '무승부';
  winnerMessage: string;
}

export interface ChallengerPreview {
  headcount: number;
  grade: Grade;
  title: string;
}

export type Step = 'landing' | 'input' | 'analyzing' | 'result' | 'battleResult';
