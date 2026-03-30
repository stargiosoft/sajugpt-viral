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

  // 이탈 판정: ♥ ≤ 50 → 이탈
  for (const key of ['kwonryeok', 'romantic', 'jealousy'] as SeonbiType[]) {
    if (next[key].alive && next[key].loyalty <= 50) {
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

// ─── 티어 판정 (PRD 4-1) ─────────────────────────────────
export function judgeTier(seonbi: Record<SeonbiType, SeonbiState>): GisaengTier {
  const alive = aliveCount(seonbi);

  if (alive === 3) {
    const allHigh = (['kwonryeok', 'romantic', 'jealousy'] as SeonbiType[]).every(
      t => seonbi[t].loyalty >= 80 && seonbi[t].suspicion <= 30
    );
    return allHigh ? 'S' : 'A';
  }
  if (alive === 2) return 'B';
  if (alive === 1) return 'C';
  return 'D';
}

// ─── 월 급여 산정 (PRD 4-2) ──────────────────────────────
export function calculateSalary(
  totalCharm: number,
  seonbi: Record<SeonbiType, SeonbiState>,
  tier: GisaengTier,
): { monthlySalary: number; modernValue: number } {
  if (tier === 'D') return { monthlySalary: 0, modernValue: 0 };

  const baseSalary = totalCharm * 0.5;

  let seonbiSalary = 0;
  for (const key of ['kwonryeok', 'romantic', 'jealousy'] as SeonbiType[]) {
    if (seonbi[key].alive) {
      seonbiSalary += seonbi[key].loyalty * SEONBI_INFO[key].salaryMultiplier;
    }
  }

  const bonus = TIER_INFO[tier].bonusMultiplier;
  const monthlySalary = Math.round((baseSalary + seonbiSalary) * bonus);
  const modernValue = monthlySalary * 50000;

  return { monthlySalary, modernValue };
}

// ─── 유틸 ───────────────────────────────────────────────
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
