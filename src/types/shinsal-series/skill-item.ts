export type SkillStep = 'landing' | 'input' | 'analyzing' | 'result';

export type Gender = 'male' | 'female';

export type Stem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type Branch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export type ShinsalName =
  | '지살' | '년살' | '월살' | '망신살' | '장성살' | '반안살'
  | '역마살' | '육해살' | '화개살' | '겁살' | '재살' | '천살';

export interface SajuPillars {
  year: string;
  month: string;
  day: string;
  time: string;
}

export interface SajuInput {
  gender: Gender;
  birthDate: string;
  birthTime?: string;
  calendarType?: 'solar' | 'lunar';
}

export interface CharacterAvatar {
  id: string;
  name: string;
  animal: string;
  imageUrl: string;
}

export interface SkillItem {
  id: string;
  shinsal: ShinsalName;
  name: string;
  casualInterpretation: string;
  statText: string;
  iconUrl: string;
  description: string;
  isEquipped?: boolean;
}

export interface CombinationResult {
  combinationKey: string;
  title: string;
  description: string;
  tips: {
    good: string;
    caution: string;
    actionTip: string;
  };
}

export interface SkillAnalysisResult {
  resultId: string;
  input: SajuInput;
  saju?: SajuPillars;
  yearBranch?: Branch;
  avatar: CharacterAvatar;
  acquiredShinsals: ShinsalName[];
  acquiredItems: SkillItem[];
  equippedItems: SkillItem[];
  allItems: SkillItem[];
  combination: CombinationResult;
  createdAt: string;
}