import type { MatchRule } from '@/types/love-chat';

// 8.3 캐릭터별 매칭 규칙 (기획안 원문 기준) — 필수 선택지 1개 + 보조 선택지 1~3개
export const MATCH_RULES: MatchRule[] = [
  { characterId: 'realtime-tracker', essential: 'Q4-A', optional: ['Q1-A', 'Q2-B', 'Q5-A'] },
  { characterId: 'emoji-lover', essential: 'Q3-A', optional: ['Q1-A', 'Q6-A'] },
  { characterId: 'instant-reply-king', essential: 'Q1-A', optional: ['Q5-A', 'Q6-A'] },
  { characterId: 'call-first', essential: 'Q5-A', optional: ['Q7-A', 'Q1-A'] },
  { characterId: 'ghosting-hermit', essential: 'Q1-D', optional: ['Q2-D', 'Q6-D'] },
  { characterId: 'reaction-master', essential: 'Q6-C', optional: ['Q3-C', 'Q7-C'] },
  { characterId: 'ai-short-reply', essential: 'Q3-C', optional: ['Q4-C', 'Q7-B'] },
  { characterId: 'call-phobia', essential: 'Q5-D', optional: ['Q7-C'] },
  { characterId: 'delay-tactician', essential: 'Q1-B', optional: ['Q3-D', 'Q6-B'] },
  { characterId: 'mirror-tone', essential: 'Q3-D', optional: ['Q6-B'] },
  { characterId: 'heartbreak-novelist', essential: 'Q2-A', optional: ['Q1-B', 'Q7-C'] },
  { characterId: 'daily-briefer', essential: 'Q4-D', optional: ['Q1-C', 'Q6-B'] },
  { characterId: 'clean-summarizer', essential: 'Q4-B', optional: ['Q1-C', 'Q6-B'] },
  { characterId: 'long-essayist', essential: 'Q7-B', optional: ['Q3-B'] },
  { characterId: 'quick-apologizer', essential: 'Q7-D', optional: ['Q3-B'] },
  { characterId: 'voice-addict', essential: 'Q5-A', optional: ['Q3-B'] },
];
