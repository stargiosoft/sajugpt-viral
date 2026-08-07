export interface ChemiStat {
  label: string;
  score: number;
  description: string;
}


export interface CouplePerson {
  name?: string;
  birthDate: string;
  birthTime?: string;
  gender: '남자' | '여자';
  calendarType: 'solar' | 'lunar';
  birthTimeUnknown?: boolean;
}

export interface CoupleAnalysis {
  elementCompatibility: number;
  relationshipCompatibility: number;
  emotionCompatibility: number;
  lifestyleCompatibility: number;
  futureCompatibility: number;
}

export interface CoupleResult {
  totalScore: number;
  grade: string;
  relationshipTitle: string;
  relationshipDescription: string;
  stats: ChemiStat[];
  summary: string;
  strengths: string[];
  cautions: string[];
  analysis?: CoupleAnalysis;
  personA?: CouplePerson;
  personB?: CouplePerson;
}
