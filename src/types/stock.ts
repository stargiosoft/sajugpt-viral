export type Gender = 'female' | 'male';

export type RelationshipStatus = 'single' | 'some' | 'dating';

export type InvestmentOpinion = 'strong_buy' | 'buy' | 'hold' | 'reduce' | 'warning';

export type PriceGrade = 'premium' | 'mid' | 'small' | 'penny' | 'warning';

export type FairValueGrade = 'bluechip' | 'quality' | 'growth';

export type RelationshipFrame = 'unlisted' | 'ipo' | 'listed';

export type CrewMemberId = 'kang' | 'yoon' | 'cha';

export type UserChoice = 'A' | 'B' | 'C';

export type StockStep =
  | 'input'
  | 'analyzing'
  | 'report'
  | 'briefing'
  | 'turn1'
  | 'turn2'
  | 'turn3'
  | 'turn4'
  | 'plan'
  | 'result';

// ─── 턴제 토론 ───────────────────────────────────────

export interface TurnDialog {
  characterId: CrewMemberId;
  characterName: string;
  position: string;
  lines: string;
}

export interface TurnChoice {
  id: UserChoice;
  characterId: CrewMemberId;
  label: string;
}

export interface TurnData {
  title: string;
  dialogs: TurnDialog[];
  question: string;
  choices: TurnChoice[];
}

export interface UserChoices {
  turn1: UserChoice | null;
  turn2: UserChoice | null;
  turn3: UserChoice | null;
  turn4: UserChoice | null;
}

// ─── 종목 리포트 ─────────────────────────────────────

export interface StockReport {
  currentPrice: number;
  fairValue: number;
  targetPrice: number;
  undervalueRate: number;
  investmentOpinion: InvestmentOpinion;
  surgeMonth: string;
  surgeMonthLabel: string;
  sector: string;
  priceGrade: PriceGrade;
  fairValueGrade: FairValueGrade;
  analystComment: string;
  chartData: number[];
  relationshipFrame: RelationshipFrame;
}

// ─── 작전 계획서 ─────────────────────────────────────

export interface OperationPhase {
  month: string;
  title: string;
  summary: string;
}

export interface OperationPlan {
  currentToTarget: string;
  growthRate: string;
  phase1: OperationPhase;
  phase2: OperationPhase;
  phase3: { month: string; title: string; locked: true; teaser: string };
  crewComment: string;
}

// ─── Edge Function 응답 ──────────────────────────────

export interface StockAnalysisResult {
  id: string;
  stockReport: StockReport;
  discussion: {
    briefing: {
      headline: string;
      subtext: string;
    };
    turn1: TurnData;
    turn2: Record<UserChoice, TurnData>;
    turn3: TurnData;
    turn4: TurnData;
  };
  operationPlan: OperationPlan;
  sajuSummary: {
    dayMaster: string;
    dominantElements: string[];
    keyTraits: string[];
  };
}

// ─── SajuHighlights (Edge Function 내부용이지만 프론트 참조) ──

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
  doHwaSalCount: number;
  hongYeomSal: boolean;
  yeonaeSeongHyang: string;
  ilJuKey: string;
  gongMang: boolean;
}
