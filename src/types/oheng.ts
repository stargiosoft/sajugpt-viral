export type Gender = 'female' | 'male';

export interface OhengFormState {
  gender: Gender | null;
  birthday: string;       // "YYYY-MM-DD"
  birthTime: string;      // "오전 HH:MM" | "오후 HH:MM" | "모름"
  birthTimeUnknown: boolean;
}

export interface OhengPrescription {
  success: boolean;
  name: string;
  element: string;
  elementRatio: number;
  animal: string;
  taste: string;
  food: string;
  color: string;
  colorHex: string;
  narration: string;
  distribution: Record<'木' | '火' | '土' | '金' | '水', number>;
}
