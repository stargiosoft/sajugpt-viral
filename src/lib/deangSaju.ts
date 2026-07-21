import { DEANG_BREEDS, ELEMENT_GROUPS, STEM_ORDER } from '@/constants/deangDogs';
import type { Gender } from '@/types/battle';
import type { DeangProfileData, DeangResult, DeangStats } from '@/types/deang-saju';

/**
 * 실제 사주 만세력 계산(일간 추출)은 Supabase Edge Function + 만세력 API 연동이 필요합니다.
 * 지금은 디자인/UI 프리뷰용으로 생년월일+시간을 결정적 해시로 변환해 10개 일간 중 하나를 고릅니다.
 * 실서비스 전환 시 이 함수만 실제 만세력 계산 로직(계획서 4.4/4.5)으로 교체하면 됩니다.
 */
function deriveDayStemIndex(birthDate: string, birthTime: string): number {
  const digits = `${birthDate}${birthTime}`.replace(/\D/g, '');
  let hash = 0;
  for (const ch of digits) {
    hash = (hash * 31 + Number(ch)) % 10000;
  }
  return hash % 10;
}

function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function next() {
    h = Math.imul(h ^ (h >>> 16), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function jitterStats(base: DeangStats, rand: () => number): DeangStats {
  const jitter = (v: number) => Math.min(10, Math.max(1, Math.round(v + (rand() - 0.5) * 3)));
  return {
    leadership: jitter(base.leadership),
    affection: jitter(base.affection),
    perceptiveness: jitter(base.perceptiveness),
    independence: jitter(base.independence),
    attachment: jitter(base.attachment),
  };
}

// 오행 상생(내가 생하는 대상, 음양이 다른 쪽) = 찰떡궁합 / 상극(나를 극하는 대상, 음양이 다른 쪽) = 상극궁합
function getRelatedStem(stemIndex: number, elementOffset: 1 | 3) {
  const element = Math.floor(stemIndex / 2);
  const yinYang = stemIndex % 2;
  const targetElement = (element + elementOffset) % 5;
  const otherYinYang = 1 - yinYang;
  return ELEMENT_GROUPS[targetElement][otherYinYang];
}

export function buildDeangProfile(birthDate: string, birthTime: string): DeangProfileData {
  const stemIndex = deriveDayStemIndex(birthDate, birthTime);
  const stemKey = STEM_ORDER[stemIndex];
  const breed = DEANG_BREEDS[stemKey];

  const rand = seededRandom(`${birthDate}${birthTime}${stemKey}`);
  const stats = jitterStats(breed.baseStats, rand);

  const bestMatch = DEANG_BREEDS[getRelatedStem(stemIndex, 1)];
  const worstMatch = DEANG_BREEDS[getRelatedStem(stemIndex, 3)];
  const quip = breed.quips[Math.floor(rand() * breed.quips.length)];

  return { breed, stats, bestMatch, worstMatch, quip };
}

export function generateDeangResult(
  birthDate: string,
  birthTime: string,
  unknownTime: boolean,
  gender: Gender,
): DeangResult {
  const profile = buildDeangProfile(birthDate, unknownTime ? '' : birthTime);
  const idSeed = seededRandom(`${birthDate}${birthTime}${gender}${profile.breed.key}`);
  const resultId = `${birthDate.replace(/-/g, '')}${Math.floor(idSeed() * 1e8).toString(36)}`;

  return {
    resultId,
    birthDate,
    birthTime,
    unknownTime,
    gender,
    profile,
    createdAt: new Date().toISOString(),
  };
}
