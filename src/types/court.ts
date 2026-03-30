export type { Gender } from './battle';

// ──── 죄목 ────
export type CrimeId =
  | 'unrequited_3years'
  | 'never_confessed'
  | 'solo_breakup'
  | 'self_deprecation'
  | 'pretend_ok_after_ghosted'
  | 'always_friendzoned'
  | 'mirror_sigh'
  | 'comparison_envy'
  | 'drunk_confession_deleted'
  | 'phone_checking';

// ──── 기간 ────
export type PeriodInput = 'under_6m' | '6m_1y' | '1y_3y' | '3y_5y' | 'over_5y';

// ──── 형량 등급 ────
export type SentenceGradeId = 'minor' | 'serious' | 'felony' | 'extreme';

export interface SentenceGrade {
  grade: SentenceGradeId;
  label: string;
  borderColor: string;
}

// ──── 공범 죄목 ────
export type AccompliceCrimeId =
  | 'no_blind_date'
  | 'just_watched'
  | 'why_no_bf'
  | 'solo_advisor'
  | 'custom';

// ──── 사주 하이라이트 (법정용) ────
export interface CourtSajuHighlights {
  pyeonInCount: number;
  jeongInCount: number;
  sangGwanCount: number;
  sikSinCount: number;
  biGyeonCount: number;
  geobJaeCount: number;
  pyeonGwanCount: number;
  jeongGwanCount: number;
  jeongJaeCount: number;
  pyeonJaeCount: number;
  insung: number;
  gwansung: number;
  siksang: number;
  bigyeob: number;
  jasung: number;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  doHwaChung: boolean;
  yeonaeSeongHyang: string;
  ilJuKey: string;
}

// ──── Edge Function 응답 ────
export interface CourtResult {
  courtId: string;
  crimeId: CrimeId;
  crimeLabel: string;
  charmScore: number;
  baseSentence: number;
  prosecutorLine: string;
  defenderLine: string;
  sajuHighlights: CourtSajuHighlights;
  prosecutorOpening: string;
  defenderClosing: string;
  verdictComment: string;
  releaseRationale: string;
  releaseDate: { year: number; month: number };
  releaseCondition: string;
  createdAt: string;
}

// ──── 상태 머신 ────
export type CourtStep =
  | 'landing'
  | 'input'
  | 'analyzing'
  | 'indictment'
  | 'trial_1'
  | 'trial_2'
  | 'trial_3'
  | 'trial_4'
  | 'verdict'
  | 'accomplice'
  | 'conversion';

// ──── 재판 선택지 ────
export interface TrialChoice {
  id: number;
  text: string;
}
