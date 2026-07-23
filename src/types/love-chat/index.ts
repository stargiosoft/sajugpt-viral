export type QuestionId = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'Q7';
export type Choice = 'A' | 'B' | 'C' | 'D';
export type ChoiceKey = `${QuestionId}-${Choice}`;

export interface QuestionOption {
  choice: Choice;
  text: string;
}

export interface Question {
  id: QuestionId;
  order: number;
  category: string;
  emoji: string;
  sticker: string;
  title: string;
  situation: string;
  message?: string;
  sender?: string;
  options: QuestionOption[];
}

export type Answers = Partial<Record<QuestionId, Choice>>;

export interface CharacterStat {
  label: string;
  value: number;
}

export interface CharacterMatch {
  characterId: string;
  emoji: string;
  label: string;
}

export interface ChatLine {
  from: 'them' | 'me';
  text: string;
}

export interface LoveChatCharacter {
  id: string;
  no: number;
  name: string;
  emoji: string;
  image?: string;
  oneLiner: string;
  tags: string[];
  quote: string;
  loveStyle: string;
  traits: string[];
  catchphrases: string[];
  stats: CharacterStat[];
  goodMatch: CharacterMatch;
  badMatch: CharacterMatch;
  sampleChat: ChatLine[];
  chatSystemNote: string;
}

export interface MatchRule {
  characterId: string;
  essential: ChoiceKey;
  optional: ChoiceKey[];
}

export interface MatchResult {
  character: LoveChatCharacter;
  priority: 1 | 2 | 3 | 0;
  matchedOptionalCount: number;
}
