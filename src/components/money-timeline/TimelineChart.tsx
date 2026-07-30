'use client';

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, useXAxisScale, useYAxisScale, ZIndexLayer, DefaultZIndexes,
} from 'recharts';
import type { WealthPeriod, BestPeriodInfo, StargioRaw } from '@/types/money-timeline';
import { MONEY_COLORS as C, BODY_TEXT_STYLE } from '@/constants/moneyTimelineTheme';
import { BulletRow } from './MoneyStyleCard';

// 백엔드 응답 필드(appliedCombos) 및 기존 필드(features) 타입을 안전하게 확장
type ExtendedBestPeriodInfo = BestPeriodInfo & {
  appliedCombos?: string[];
  features?: string[];
};

interface Props {
  periods: WealthPeriod[];
  stargioRaw: StargioRaw;
}

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: WealthPeriod;
}

function makeDot(bestAgeStart: number) {
  return function ChartDot({ cx, cy, payload }: DotProps) {
    if (cx == null || cy == null || payload?.ageStart === bestAgeStart) return null;
    return <circle cx={cx} cy={cy} r={3.5} fill={C.panelBg} stroke={C.gold} strokeWidth={2} />;
  };
}

interface BestMarkerProps {
  best: WealthPeriod;
  minAge: number;
  maxAge: number;
}

function BestMarker({ best, minAge, maxAge }: BestMarkerProps) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  if (!xScale || !yScale) return null;

  const cx = xScale(best.ageLabel);
  const cy = yScale(best.score);
  if (cx == null || cy == null) return null;

  const size = 34;
  let x = cx - size / 2;
  if (best.ageStart === minAge) x += 10;
  else if (best.ageStart === maxAge) x -= 10;
  const y = cy - size / 2;
  return (
    <ZIndexLayer zIndex={DefaultZIndexes.label}>
      <image href="/money-timeline/money-bag.png" x={x} y={y} width={size} height={size} />
    </ZIndexLayer>
  );
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: WealthPeriod }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div
      style={{
        backgroundColor: C.cardBg,
        border: `1px solid ${C.goldBorder}`,
        borderRadius: '10px',
        padding: '8px 12px',
      }}
    >
      <p style={{ fontSize: '12px', color: C.textTertiary, marginBottom: '2px' }}>{p.ageLabel}</p>
      <p style={{ fontSize: '15px', fontWeight: 700, color: C.gold }}>{p.score}점</p>
    </div>
  );
}

export default function TimelineChart({ periods, stargioRaw }: Props) {
  const best = periods.reduce((b, p) => (p.score > b.score ? p : b), periods[0]);

  return (
    <div style={{ padding: '20px 0 16px' }}>
      <div className="flex items-center justify-center" style={{ marginBottom: '32px', padding: '4px 4px 0' }}>
        <p style={{ fontSize: '18.5px', fontWeight: 400, color: C.text, letterSpacing: '-0.8px', WebkitTextStroke: `0.5px ${C.text}` }}>
          평생 재물 흐름
        </p>
      </div>

      <div style={{ width: '100%', height: '200px', minHeight: '200px', minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={periods} margin={{ top: 34, right: 12, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="moneyTimelineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.gold} stopOpacity={0.32} />
                <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="ageLabel"
              tick={{ fontSize: 11, fill: 'rgba(35,21,33,0.60)' }}
              axisLine={{ stroke: '#E0E0E0', strokeWidth: 1 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 11, fill: 'rgba(35,21,33,0.60)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.goldBorder, strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="score"
              stroke={C.gold}
              strokeWidth={3}
              fill="url(#moneyTimelineGradient)"
              dot={makeDot(best.ageStart)}
              activeDot={false}
            />
            <BestMarker best={best} minAge={periods[0]?.ageStart} maxAge={periods[periods.length - 1]?.ageStart} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function splitAgeLabel(label: string) {
  const match = label.match(/^(\d+)(.*)$/);
  if (!match) return { number: label, suffix: '' };
  const [, number, suffix] = match;
  return { number, suffix };
}

export function GoldenEraCard({ bestPeriod, stargioRaw }: { bestPeriod: ExtendedBestPeriodInfo; stargioRaw: StargioRaw; }) {
  const { number, suffix } = splitAgeLabel(bestPeriod.ageLabel);

  // 백엔드 전달 값(appliedCombos)을 우선 참조하고, 없으면 features 또는 빈 배열 사용
  const featureList: string[] =
    bestPeriod?.appliedCombos || bestPeriod?.features || [];

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="flex flex-col items-center" style={{ marginBottom: '2px' }}>
        <p style={{ fontSize: '18.5px', fontWeight: 400, color: C.text, marginBottom: '3px', letterSpacing: '-0.8px', WebkitTextStroke: `0.5px ${C.text}` }}>
          인생 자산 황금기
        </p>
        <p style={{ fontSize: '56px', fontWeight: 800, color: '#735EF2', letterSpacing: '-1.1px' }}>
          {number}
          <span style={{ fontSize: '18px', fontWeight: 700, marginLeft: '9px' }}>{suffix}</span>
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: '8px' }}>
        {featureList.map((feature: string, i: number) => (
          <div
            key={i}
            style={{ borderRadius: '14px', backgroundColor: 'rgb(246,245,255)', padding: '16px 18px' }}
          >
            <BulletRow text={feature} />
          </div>
        ))}
      </div>
    </div>
  );
}