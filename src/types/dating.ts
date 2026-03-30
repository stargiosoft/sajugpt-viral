export type Gender = 'female' | 'male';

// ── 사주 지표 ──
export interface SajuIndicators {
  ilgan: string;
  doHwaSal: boolean;
  hongYeomSal: boolean;
  pyeonGwan: number;
  sangGwan: number;
  sikSin: number;
  fireRatio: number;
  gwansung: number;
  siksang: number;
  bigyeon: number;
  insung: number;
  jasung: number;
}

// ── 대화 시스템 ──
export interface DatingChoice {
  id: string;
  text: string;
  type: 'bold' | 'witty' | 'safe';
  affectionDelta: number;
  scoreImpact: {
    charm: number;
    conversation: number;
    sense: number;
    addiction: number;
  };
}

export interface DatingTurn {
  turnNumber: number;
  situation: string;
  characterLine: string;
  choices: DatingChoice[];
  characterReactions: Record<string, string>;
}

export interface ConversationTree {
  turns: DatingTurn[];
  successThreshold: number;
}

export interface SelectedChoice {
  turnNumber: number;
  choiceId: string;
  choiceType: 'bold' | 'witty' | 'safe';
  choice: DatingChoice;
}

// ── 점수 시스템 ──
export interface ScoreTable {
  charm: number;
  conversation: number;
  sense: number;
  addiction: number;
  total: number;
  lowestKey: 'charm' | 'conversation' | 'sense' | 'addiction';
}

export interface VerdictResponse {
  oneLineVerdict: string;
  sajuAnalysis: string;
  patterns: string[];
  rankComment: string;
}

// ── 퍼센타일 뱃지 ──
export interface PercentileBadgeInfo {
  label: string;
  color: string;
}

// ── 캐릭터 추천 ──
export interface CharacterRecommendation {
  characterId: string;
  characterName: string;
  archetype: string;
  compatibility: number;
  firstImpression: string;
  successRate: number;
  imagePath: string;
}

// ── Edge Function Request/Response ──
export interface AnalyzeDatingSimRequest {
  birthday: string;
  birthTime: string;
  gender: Gender;
  calendarType: 'solar' | 'lunar';
  utmSource?: string;
  utmMedium?: string;
}

export interface AnalyzeDatingSimResponse {
  resultId: string;
  sajuIndicators: SajuIndicators;
  ilgan: string;
  ilganDescription: string;
  recommendations: CharacterRecommendation[];
}

export interface GenerateConversationRequest {
  resultId: string;
  characterId: string;
  sajuIndicators: SajuIndicators;
  ilganDescription: string;
  compatibility: number;
  gender: Gender;
}

export interface GenerateConversationResponse {
  conversationTree: ConversationTree;
}

export interface FinalizeDatingResultRequest {
  resultId: string;
  characterId: string;
  selectedChoices: Array<{
    turnNumber: number;
    choiceId: string;
    choiceType: 'bold' | 'witty' | 'safe';
  }>;
  finalAffection: number;
  scoreTable: ScoreTable;
  success: boolean;
  earlyExitTurn?: number;
}

export interface FinalizeDatingResultResponse {
  userRank: number;
  totalCount: number;
  percentile: number;
  badgeType: string;
  sameIlganAvg: number;
  sameIlganCount: number;
  verdict: VerdictResponse;
  shareUrl: string;
}

// ── 랭킹 ──
export interface LeaderboardEntry {
  birthYear: string;
  gender: Gender;
  characterId: string;
  totalScore?: number;
  earlyExitTurn?: number;
  successCount?: number;
}

export interface Leaderboard {
  shortestFails: LeaderboardEntry[];
  legendSuccesses: LeaderboardEntry[];
  characterSuccessRates: Record<string, number>;
}

// ── 상태머신 ──
export type DatingStep =
  | 'landing'
  | 'input'
  | 'analyzing'
  | 'recommendation'
  | 'preparing'
  | 'conversation'
  | 'calculating'
  | 'result';
