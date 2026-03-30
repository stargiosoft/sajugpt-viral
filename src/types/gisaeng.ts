export type GisaengType = 'haeeohwa' | 'hongryeon' | 'mukran' | 'chunhyang' | 'wolha' | 'hwangjini';
export type GisaengTier = 'S' | 'A' | 'B' | 'C' | 'D';
export type SeonbiType = 'kwonryeok' | 'romantic' | 'jealousy';
export type GisaengStep =
  | 'landing'
  | 'input'
  | 'analyzing'
  | 'gisaeng-card'
  | 'round1'
  | 'round2'
  | 'round3'
  | 'calculating'
  | 'result';

export interface GisaengStats {
  speech: number;
  allure: number;
  intellect: number;
  pushpull: number;
  intuition: number;
}

export interface GisaengCard {
  gisaengName: string;
  type: GisaengType;
  typeName: string;
  typeSubtitle: string;
  tier: string;
  stats: GisaengStats;
  totalCharm: number;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  narrative: string;
  assessment: string;
}

export interface SeonbiState {
  name: string;
  type: SeonbiType;
  loyalty: number;
  suspicion: number;
  alive: boolean;
}

export interface RoundChoice {
  id: 'A' | 'B' | 'C';
  label: string;
  requiredStat: keyof GisaengStats;
  threshold: number;
  secondaryStat?: keyof GisaengStats;
  secondaryThreshold?: number;
  successEffects: GaugeEffect[];
  failEffects: GaugeEffect[];
}

export interface GaugeEffect {
  target: SeonbiType | 'all';
  loyaltyDelta: number;
  suspicionDelta: number;
}

export interface RoundScenario {
  round: 1 | 2 | 3;
  title: string;
  narration: string;
  choices: RoundChoice[];
}

export interface RoundResult {
  round: 1 | 2 | 3;
  choiceId: 'A' | 'B' | 'C';
  success: boolean;
  seonbiAfter: Record<SeonbiType, { loyalty: number; suspicion: number; alive: boolean }>;
}

export interface SimulationResult {
  rounds: RoundResult[];
  finalSeonbi: Record<SeonbiType, SeonbiState>;
  tier: GisaengTier;
  tierLabel: string;
  monthlySalary: number;
  modernValue: number;
  totalCharmAfter: number;
  finalNarrative: string;
  seonbiComments: Record<SeonbiType, string>;
}

export interface SajuHighlightsGisaeng {
  doHwaSal: boolean;
  hongYeomSal: boolean;
  topSipsung: string;
  ilju: string;
  iljuElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
}

export interface GisaengAnalyzeResponse {
  resultId: string;
  gisaengCard: GisaengCard;
  seonbi: Record<SeonbiType, SeonbiState>;
  sajuHighlights: SajuHighlightsGisaeng;
}

export interface GisaengSaveResponse {
  success: boolean;
  finalNarrative: string;
  seonbiComments: Record<SeonbiType, string>;
}
