'use client';

import { MONEY_COLORS as C, BODY_TEXT_STYLE } from '@/constants/moneyTimelineTheme';

interface Props {
  overallScore: number;
  summaryLine: string;
  bestAgeLabel: string;
}

function highlightTerms(text: string, terms: string[]) {
  let segments: { text: string; highlight: boolean }[] = [{ text, highlight: false }];
  for (const term of terms) {
    segments = segments.flatMap((seg) => {
      if (seg.highlight) return [seg];
      const pieces = seg.text.split(term);
      const result: typeof segments = [];
      pieces.forEach((piece, i) => {
        if (piece) result.push({ text: piece, highlight: false });
        if (i < pieces.length - 1) result.push({ text: term, highlight: true });
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
        d="M21.7,11l-3.1,4l0.1,5.1c0,0.5-0.2,0.9-0.6,1.2c-0.3,0.2-0.6,0.3-0.9,0.3c-0.2,0-0.3,0-0.5-0.1L12,19.8  l-4.8,1.7c-0.5,0.2-1,0.1-1.4-0.2c-0.4-0.3-0.6-0.7-0.6-1.2L5.4,15l-3.1-4C2,10.6,1.9,10.1,2.1,9.6c0.2-0.5,0.5-0.8,1-0.9l4.9-1.4  L10.8,3c0.6-0.8,1.9-0.8,2.4,0l2.9,4.2L21,8.7c0.5,0.1,0.8,0.5,1,0.9C22.1,10.1,22,10.6,21.7,11z"
        fill={filled ? '#ffc52e' : '#E5E5E5'}
      />
    </svg>
  );
}

function StarRow({ score }: { score: number }) {
  const filled = Math.max(1, Math.min(5, Math.round(score / 20)));
  return (
    <div className="flex items-center justify-center" style={{ gap: '4px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < filled} />
      ))}
    </div>
  );
}

export default function InsightCard({ overallScore, summaryLine, bestAgeLabel }: Props) {
  return (
    <div style={{ padding: '20px 0 24px', textAlign: 'center' }}>
      <p style={{ fontSize: '18.5px', fontWeight: 400, color: C.text, marginTop: '4px', marginBottom: '4px', letterSpacing: '-0.8px', WebkitTextStroke: `0.5px ${C.text}` }}>
        재물운 평균 점수
      </p>

      <p style={{ fontSize: '56px', fontWeight: 800, color: '#735EF2', letterSpacing: '-1.1px', paddingLeft: '4px' }}>
        <span style={{ paddingLeft: '4px', letterSpacing: '0.4px' }}>{overallScore}</span><span style={{ fontSize: '18px', fontWeight: 700, marginLeft: '7px', paddingBottom: '2px' }}>점</span>
      </p>

      <div style={{ marginTop: '-6px', marginBottom: '6px' }}>
        <StarRow score={overallScore} />
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: '20px',
          borderRadius: '14px',
          backgroundColor: 'rgb(246, 245, 255)',
          padding: '16px 20px',
        }}
      >
        <img
          src="/money-timeline/cash-icon.png"
          alt=""
          style={{ position: 'absolute', top: '-34px', right: '-12px', width: '60px', height: '60px' }}
        />
        <p style={{ ...BODY_TEXT_STYLE, textAlign: 'left' }}>
          {highlightTerms(summaryLine, [bestAgeLabel, '골든타임']).map((seg, i) =>
            seg.highlight ? (
              <span key={i} style={{ color: 'rgb(79, 53, 236)', WebkitTextStroke: '0.3px rgb(79, 53, 236)' }}>
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
