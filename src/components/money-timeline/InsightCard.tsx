'use client';

import { useMemo } from 'react';
import type { BestPeriodInfo } from '@/types/money-timeline';
import { MONEY_COLORS as C, BODY_TEXT_STYLE } from '@/constants/moneyTimelineTheme';

type ExtendedBestPeriodInfo = BestPeriodInfo & {
  appliedCombos?: string[];
  features?: string[];
};

interface Props {
  overallScore: number;
  bestPeriod: ExtendedBestPeriodInfo;
}

function getSubjectMarker(text: string): string {
  if (!text) return '이';
  const lastChar = text.charAt(text.length - 1);
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return '가';
  return (code - 0xac00) % 28 > 0 ? '이' : '가';
}

function buildSummaryLine(overallScore: number, bestAgeLabel?: string): string {
  const label = bestAgeLabel || '전성기';
  const marker = getSubjectMarker(label);

  let tierText = '';
  if (overallScore >= 80) {
    tierText = '전반적으로 강한 재물운의 흐름을 타고났어요.';
  } else if (overallScore >= 60) {
    tierText = '탄탄한 재물운 위에서 꾸준히 성장하는 흐름이에요.';
  } else if (overallScore >= 40) {
    tierText = '굴곡은 있지만 기회를 잘 잡으면 반등할 수 있는 흐름이에요.';
  } else {
    tierText = '신중한 관리가 필요하지만 황금기엔 확실한 기회가 와요.';
  }

  return `${label}${marker} 인생의 자산 성장 골든타임입니다. ${tierText}`;
}

function highlightTerms(text: string, terms: string[]) {
  let segments: { text: string; highlight: boolean }[] = [{ text, highlight: false }];

  for (const term of terms) {
    if (!term) continue;
    segments = segments.flatMap((seg) => {
      if (seg.highlight) return [seg];

      const pieces = seg.text.split(term);
      const result: typeof segments = [];

      pieces.forEach((piece, i) => {
        if (piece) result.push({ text: piece, highlight: false });
        if (i < pieces.length - 1) {
          result.push({ text: term, highlight: true });
        }
      });

      return result;
    });
  }

  return segments;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M21.7,11l-3.1,4l0.1,5.1c0,0.5-0.2,0.9-0.6,1.2c-0.3,0.2-0.6,0.3-0.9,0.3c-0.2,0-0.3,0-0.5-0.1L12,19.8l-4.8,1.7c-0.5,0.2-1,0.1-1.4-0.2c-0.4-0.3-0.6-0.7-0.6-1.2L5.4,15l-3.1-4C2,10.6,1.9,10.1,2.1,9.6c0.2-0.5,0.5-0.8,1-0.9l4.9-1.4L10.8,3c0.6-0.8,1.9-0.8,2.4,0l2.9,4.2L21,8.7c0.5,0.1,0.8,0.5,1,0.9C22.1,10.1,22,10.6,21.7,11z"
        fill={filled ? '#FFC52E' : '#E5E5E5'}
      />
    </svg>
  );
}

function StarRow({ score }: { score: number }) {
  const filledCount = Math.max(1, Math.min(5, Math.round(score / 20)));

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '-6px', marginBottom: '6px' }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < filledCount} />
      ))}
    </div>
  );
}

export default function InsightCard({ overallScore, bestPeriod }: Props) {
  const ageLabel = bestPeriod?.ageLabel || '';

  const summarySegments = useMemo(() => {
    const summaryText = buildSummaryLine(overallScore, ageLabel);
    return highlightTerms(summaryText, [ageLabel, '골든타임']);
  }, [overallScore, ageLabel]);

  return (
    <div
      style={{ padding: '20px 0 24px',textAlign: 'center' }}
    >
      <p
        style={{fontSize: '18.5px', fontWeight: 400, color: C.text, marginTop: '4px', marginBottom: '4px', letterSpacing: '-0.8px', WebkitTextStroke: `0.5px ${C.text}`}}
      >
        재물운 평균 점수
      </p>

      <p
        style={{fontSize: '56px', fontWeight: 800, color: '#735EF2', letterSpacing: '-1.1px', paddingLeft: '4px' }}
      >
        <span
          style={{paddingLeft: '4px', letterSpacing: '0.4px' }}
        >
          {overallScore}
        </span>
        <span
          style={{fontSize: '20px', fontWeight: 700, marginLeft: '7px', paddingBottom: '2px' }}
        >
          점
        </span>
      </p>

      <StarRow score={overallScore} />

      <div
        style={{ position: 'relative', marginTop: '20px', borderRadius: '14px', backgroundColor: 'rgb(246,245,255)', padding: '16px 20px'}}
      >
        <img
          src="/money-timeline/cash-icon.png"
          alt=""
          style={{position: 'absolute', top: '-34px', right: '-12px', width: '60px', height: '60px',
          }}
        />

        <p
          style={{...BODY_TEXT_STYLE, textAlign: 'left', margin: 0, lineHeight: 1.5 }}
        >
          {summarySegments.map((seg, i) =>
            seg.highlight ? (
              <span
                key={i}
                style={{color: '#4F35EC', WebkitTextStroke: '0.3px #4F35EC'}}
              >
                {seg.text}
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </p>
      </div>
    </div>
  );
}