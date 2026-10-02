export type ChildGender = 'female' | 'male';

export interface ChildPersonalityResult {
  title: string;

  subtitle: string;

  personality: {
    description: string;
    keywords: string[];
  };

  study: {
    title: string;
    description: string;
  };

  praise: {
    quote: string;
    description: string;
  };

  stress: {
    description: string;
    parentTip: string;
  };

  activities: string[];

  parentMessage: string;

  meta: {
    dominantElement?: string;
    dominantTenStar?: string;
    strength?: string;
    traits?: string[];
    sourceKeywords?: string[];
  };
}

export interface ChildSajuResponse {
  success: boolean;
  sajuData: Record<string, unknown>;
}

export interface ChildAnalyzeResponse {
  success: boolean;
  resultId: string;
  profile: ChildPersonalityResult;
}