export interface SpouseFormInput {
  birthday: string;
  gender: 'male' | 'female';
  birthTime?: string;
  birthTimeUnknown?: boolean;
}

export interface SajuData {
  dayBranch: string;
  dayMaster?: string;
  spouseStar?: string;
  spouseElement?: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  spouseStrength?: string;
  relations?: string[];
  [key: string]: unknown;
}

export interface SpouseResult {
  summary: string;
  personality: string;
  career: string;
  appearance: string;
  relationship: string;
  meeting: string;
}