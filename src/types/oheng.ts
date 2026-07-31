export type Gender = 'female' | 'male';

export type ElementKey = '木' | '火' | '土' | '金' | '水';

export interface OhengFormState {
  gender: Gender | null;
  birthday: string;       // "YYYY-MM-DD"
  birthTime: string;      // "오전 HH:MM" | "오후 HH:MM" | "모름"
  birthTimeUnknown: boolean;
}

export interface OhengPrescription {
  success: boolean;
  resultId: string;
  name: string;
  distribution: Record<ElementKey, number>;
  dominantElement: ElementKey;
  dominantElementName: string;
  dominantRatio: number;
  weakElement: ElementKey;
  weakElementName: string;
  weakRatio: number;
  animal: string;
  diagnosisTitle: string;
  diagnosisDescription: string;
  routine: string;
  luckyItem: string;
}
