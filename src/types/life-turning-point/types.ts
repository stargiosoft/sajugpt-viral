export type BirthInputValues = {
  birthDate: string;
  birthTime: string;
  calendar: "solar" | "lunar";
  gender: "male" | "female";
};

export type LifeTurningPointSection = {
  title?: string;
  subtitle?: string;
  description?: string;
  summary?: string;
  period?: string;
  ganji?: string;
  timing?: string;
  detail?: string;
  advice?: string;
  [key: string]: unknown;
};

export type LifeTurningPointResult = {
  resultId?: string;
  summary?: string; 
  current?: LifeTurningPointSection | string;
  helper?: LifeTurningPointSection | string;
  turningPoint?: LifeTurningPointSection | string;
  action?: string | string[] | LifeTurningPointSection;
  meta?: Record<string, unknown>;
  error?: string;
};