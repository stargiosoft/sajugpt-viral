export type Gender = 'female' | 'male';

export type ConstitutionType = 'simhwa' | 'noejeon' | 'myohyang' | 'seu' | 'janggang' | 'yonghwa';

export type ServantType = 'beast' | 'poet' | 'butler';

export type InterventionChoice = 'listen' | 'cough' | 'interrupt';

export type NightManualStep =
  | 'landing'
  | 'input'
  | 'analyzing'
  | 'constitution'
  | 'debate'
  | 'selection'
  | 'result';

export type DebateSubStep = 'eavesdrop' | 'intervene' | 'proposals';

export type CompatibilityGrade = 'S' | 'A' | 'B' | 'C';

export interface NightStats {
  sensitivity: number;   // 감도
  dominance: number;     // 지배력
  addiction: number;     // 중독성
  awareness: number;     // 민감도
  endurance: number;     // 지구력
}

export interface ConstitutionInfo {
  type: ConstitutionType;
  name: string;          // "심화(心火)"
  concept: string;       // "불꽃형 — 한 번 붙으면 재가 될 때까지"
  grade: CompatibilityGrade;
}

export interface NightManualResult {
  nightManualId: string;
  constitution: ConstitutionInfo;
  stats: NightStats;
  totalCharm: number;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  constitutionNarrative: string;
  phase1Script: string;
  phase2Reactions: Record<InterventionChoice, string>;
  phase3Proposals: Record<ServantType, string>;
  rejectionLines: Record<ServantType, string>;
  sajuHighlights: {
    topStat: string;
    topStatValue: number;
    doHwaSal: boolean;
    hongYeomSal: boolean;
    sajuStrength: string;
  };
}
