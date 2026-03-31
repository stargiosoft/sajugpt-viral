import type {
  GisaengStats,
  GisaengTier,
  SeonbiType,
  SeonbiState,
  RoundChoice,
  RoundResult,
  GaugeEffect,
} from '@/types/gisaeng';
import { TIER_INFO, SEONBI_INFO } from '@/constants/gisaeng';

// ─── 선택지 판정 ─────────────────────────────────────────
export function judgeChoice(
  choice: RoundChoice,
  stats: GisaengStats,
): boolean {
  const primaryPass = stats[choice.requiredStat] >= choice.threshold;
  if (!primaryPass) return false;
  if (choice.secondaryStat && choice.secondaryThreshold) {
    return stats[choice.secondaryStat] >= choice.secondaryThreshold;
  }
  return true;
}

// ─── 라운드 내 최소 1개 성공 보장 (threshold 동적 하향) ────
export function getAdjustedChoices(
  choices: RoundChoice[],
  stats: GisaengStats,
): RoundChoice[] {
  const anyPass = choices.some(c => judgeChoice(c, stats));
  if (anyPass) return choices;

  // 전부 실패하면 → 총 gap(1차+2차)이 가장 작은 선택지 1개의 threshold를 낮춰서 성공 보장
  const sorted = [...choices].sort((a, b) => {
    const gapA = Math.max(0, a.threshold - stats[a.requiredStat])
      + (a.secondaryStat && a.secondaryThreshold
        ? Math.max(0, a.secondaryThreshold - stats[a.secondaryStat])
        : 0);
    const gapB = Math.max(0, b.threshold - stats[b.requiredStat])
      + (b.secondaryStat && b.secondaryThreshold
        ? Math.max(0, b.secondaryThreshold - stats[b.secondaryStat])
        : 0);
    return gapA - gapB;
  });

  return choices.map(c =>
    c.id === sorted[0].id
      ? {
          ...c,
          threshold: stats[c.requiredStat], // 1차 스탯 맞춤
          ...(c.secondaryStat && c.secondaryThreshold
            ? { secondaryThreshold: stats[c.secondaryStat] } // 2차 스탯도 맞춤
            : {}),
        }
      : c
  );
}

// ─── 게이지 적용 ─────────────────────────────────────────
export function applyEffects(
  seonbi: Record<SeonbiType, SeonbiState>,
  effects: GaugeEffect[],
): Record<SeonbiType, SeonbiState> {
  const next = structuredClone(seonbi);

  for (const effect of effects) {
    const targets: SeonbiType[] = effect.target === 'all'
      ? (['kwonryeok', 'romantic', 'jealousy'] as SeonbiType[])
      : [effect.target];

    for (const t of targets) {
      if (!next[t].alive) continue;
      next[t].loyalty = clamp(next[t].loyalty + effect.loyaltyDelta, 0, 100);
      next[t].suspicion = clamp(next[t].suspicion + effect.suspicionDelta, 0, 100);
    }
  }

  // 이탈 판정: ♥ ≤ 50 또는 의심 ≥ 90 → 이탈
  for (const key of ['kwonryeok', 'romantic', 'jealousy'] as SeonbiType[]) {
    if (next[key].alive && (next[key].loyalty <= 50 || next[key].suspicion >= 90)) {
      next[key].alive = false;
    }
  }

  return next;
}

// ─── 라운드 2 의심 선비 결정 ────────────────────────────
export function getMostSuspiciousSeonbi(
  seonbi: Record<SeonbiType, SeonbiState>,
): SeonbiType | null {
  const alive = (['jealousy', 'kwonryeok', 'romantic'] as SeonbiType[])
    .filter(t => seonbi[t].alive)
    .sort((a, b) => seonbi[b].suspicion - seonbi[a].suspicion);

  if (alive.length === 0) return null;
  return alive[0];
}

// ─── 전원 이탈 체크 ─────────────────────────────────────
export function isAllDead(seonbi: Record<SeonbiType, SeonbiState>): boolean {
  return !seonbi.kwonryeok.alive && !seonbi.romantic.alive && !seonbi.jealousy.alive;
}

export function aliveCount(seonbi: Record<SeonbiType, SeonbiState>): number {
  return [seonbi.kwonryeok, seonbi.romantic, seonbi.jealousy].filter(s => s.alive).length;
}

// ─── 안정적으로 관리 중인 선비 수 (의심 < 70) ─────────────
export function stableCount(seonbi: Record<SeonbiType, SeonbiState>): number {
  return (['kwonryeok', 'romantic', 'jealousy'] as SeonbiType[])
    .filter(t => seonbi[t].alive && seonbi[t].suspicion < 70).length;
}

// ─── 티어 판정 (PRD 4-1) ─────────────────────────────────
export function judgeTier(seonbi: Record<SeonbiType, SeonbiState>): GisaengTier {
  const alive = aliveCount(seonbi);
  const stable = stableCount(seonbi);

  if (alive === 3) {
    const allHigh = (['kwonryeok', 'romantic', 'jealousy'] as SeonbiType[]).every(
      t => seonbi[t].loyalty >= 80 && seonbi[t].suspicion <= 30
    );
    if (allHigh) return 'S';
    // 의심 ≥ 70인 선비가 있으면 안정적 관리 수 기준으로 하향
    if (stable < 3) return stable === 2 ? 'B' : stable === 1 ? 'C' : 'D';
    return 'A';
  }
  if (alive === 2) return stable >= 2 ? 'B' : 'C';
  if (alive === 1) return 'C';
  return 'D';
}

// ─── 월 급여 산정 (PRD 4-2) ──────────────────────────────
export function calculateSalary(
  totalCharm: number,
  seonbi: Record<SeonbiType, SeonbiState>,
  tier: GisaengTier,
  successCount?: number,
): { monthlySalary: number; modernValue: number } {
  if (tier === 'D') return { monthlySalary: 0, modernValue: 0 };

  const baseSalary = totalCharm * 0.5;

  let seonbiSalary = 0;
  for (const key of ['kwonryeok', 'romantic', 'jealousy'] as SeonbiType[]) {
    if (seonbi[key].alive) {
      // 의심 높은 선비는 급여 기여 감소
      const suspicionPenalty = seonbi[key].suspicion >= 70 ? 0.3 : seonbi[key].suspicion >= 50 ? 0.7 : 1;
      seonbiSalary += seonbi[key].loyalty * SEONBI_INFO[key].salaryMultiplier * suspicionPenalty;
    }
  }

  // 라운드 성공 횟수 보너스 (0성공: 0.5x, 1성공: 0.7x, 2성공: 0.9x, 3성공: 1.0x)
  const roundBonus = successCount !== undefined
    ? [0.5, 0.7, 0.9, 1.0][Math.min(successCount, 3)]
    : 1.0;

  const bonus = TIER_INFO[tier].bonusMultiplier;
  const monthlySalary = Math.round((baseSalary + seonbiSalary) * bonus * roundBonus);
  const modernValue = monthlySalary * 50000;

  return { monthlySalary, modernValue };
}

// ─── 유틸 ───────────────────────────────────────────────
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
