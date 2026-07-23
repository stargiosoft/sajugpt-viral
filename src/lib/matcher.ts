import { CHARACTERS } from '@/data/characters';
import { MATCH_RULES } from '@/data/matchRules';
import type { Answers, ChoiceKey, MatchResult } from '@/types/love-chat';

function toChoiceKeys(answers: Answers): Set<ChoiceKey> {
  const keys = new Set<ChoiceKey>();
  (Object.entries(answers) as [keyof Answers, Answers[keyof Answers]][]).forEach(([q, choice]) => {
    if (choice) keys.add(`${q}-${choice}` as ChoiceKey);
  });
  return keys;
}

// 8.4 매칭 프로세스: 필수 선택지 확인 → 필수 조건 만족 캐릭터 추출 → 보조 선택지 일치 개수 계산 → 최고 우선순위 캐릭터 선정
export function matchCharacter(answers: Answers): MatchResult {
  const given = toChoiceKeys(answers);

  const candidates = MATCH_RULES.map(rule => {
    const essentialMet = given.has(rule.essential);
    const matchedOptionalCount = rule.optional.filter(key => given.has(key)).length;
    return { rule, essentialMet, matchedOptionalCount };
  });

  const essentialMatched = candidates.filter(c => c.essentialMet);

  if (essentialMatched.length > 0) {
    essentialMatched.sort((a, b) => b.matchedOptionalCount - a.matchedOptionalCount);
    const best = essentialMatched[0];
    const character = CHARACTERS.find(c => c.id === best.rule.characterId)!;
    const priority = best.matchedOptionalCount >= 2 ? 1 : best.matchedOptionalCount === 1 ? 2 : 3;
    return { character, priority, matchedOptionalCount: best.matchedOptionalCount };
  }

  // Fallback: 필수 선택지를 만족하는 캐릭터가 없을 때, 필수+보조 전체 중 가장 많이 겹치는 캐릭터로 매칭
  const scored = candidates.map(c => {
    const totalOverlap = (given.has(c.rule.essential) ? 1 : 0) + c.matchedOptionalCount;
    return { ...c, totalOverlap };
  });
  scored.sort((a, b) => b.totalOverlap - a.totalOverlap);
  const fallback = scored[0];
  const character = CHARACTERS.find(c => c.id === fallback.rule.characterId)!;
  return { character, priority: 0, matchedOptionalCount: fallback.matchedOptionalCount };
}
