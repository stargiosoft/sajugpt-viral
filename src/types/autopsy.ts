export type Gender = 'female' | 'male';

export type CauseOfDeathInput = 'ghosting' | 'prettier' | 'always_busy' | 'physical_only' | 'faded';

export type RelationshipDuration = 'brief' | 'months' | 'over_year' | 'long_term';

export type CoronerId = 'yoon-taesan' | 'seo-hwiyoon';

export type CauseOfDeath =
  | 'blind_eye'
  | 'emotional_numb'
  | 'depth_phobia'
  | 'responsibility_dodge'
  | 'self_centered'
  | 'possessive'
  | 'charm_delusion'
  | 'focus_deficit'
  | 'emotional_fugitive'
  | 'face_obsession';

export type DiscernmentGrade = 'F' | 'D' | 'C' | 'B' | 'A';

export interface SajuHighlights {
  jeongInCount: number;
  pyeonInCount: number;
  sikSinCount: number;
  jeongGwanCount: number;
  pyeonGwanCount: number;
  sangGwanCount: number;
  pyeonJaeCount: number;
  biGyeonCount: number;
  geobJaeCount: number;
  insung: number;
  gwansung: number;
  siksang: number;
  bigyeob: number;
  jasung: number;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  yeonaeSeongHyang: string;
  ilJuKey: string;
}

export interface AutopsyResult {
  autopsyId: string;
  causeOfDeathInput: CauseOfDeathInput;
  relationshipDuration: RelationshipDuration;
  coronerId: CoronerId;
  causeOfDeath: CauseOfDeath;
  causeOfDeathLabel: string;
  discernmentGrade: DiscernmentGrade;
  regretProbability: number;
  prognosis: string;
  card1Text: string;
  card2Text: string;
  card3Verdict: string;
  sajuHighlights: SajuHighlights;
  targetSajuType: string;
}

export type AutopsyStep =
  | 'landing'
  | 'input'
  | 'analyzing'
  | 'card1'
  | 'card2'
  | 'card3'
  | 'result'
  | 'morgue';

export interface MorgueStats {
  targetSajuType: string;
  victimCount: number;
  topCauses: { cause: string; count: number }[];
}

export interface MorgueAutopsy {
  id: string;
  causeOfDeathLabel: string;
  discernmentGrade: DiscernmentGrade;
  regretProbability: number;
  coronerId: CoronerId;
  createdAt: string;
}
