'use client';

import React from 'react';
import type { StockReport } from '@/types/stock';
import { INVESTMENT_OPINIONS, getPriceGrade, FAIR_VALUE_GRADES } from '@/constants/stock';

interface Props {
  report: StockReport;
}

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR');
}

function buildChartPath(
  data: number[],
  width: number,
  height: number,
  padding: number
): string {
  if (data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (data.length - 1);

  return data
    .map((v, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((v - min) / range) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function getChartPoint(
  data: number[],
  index: number,
  width: number,
  height: number,
  padding: number
): { x: number; y: number } {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (data.length - 1);
  const x = padding + index * stepX;
  const y = height - padding - ((data[index] - min) / range) * (height - padding * 2);
  return { x, y };
}

const StockReportCard = React.forwardRef<HTMLDivElement, Props>(
  ({ report }, ref) => {
    const {
      currentPrice,
      fairValue,
      undervalueRate,
      investmentOpinion,
      surgeMonthLabel,
      sector,
      priceGrade,
      fairValueGrade,
      analystComment,
      chartData,
    } = report;

    const opinion = INVESTMENT_OPINIONS[investmentOpinion];
    const grade = getPriceGrade(currentPrice);
    const fvGrade = FAIR_VALUE_GRADES[fairValueGrade];

    const isUndervalued = undervalueRate > 0;
    const changeSymbol = isUndervalued ? '\u25BC' : '\u25B2';
    const changeColor = isUndervalued ? '#DC2626' : '#059669';

    // Price grade accent
    const accentColor =
      priceGrade === 'premium'
        ? '#CA8A04'
        : priceGrade === 'penny'
          ? '#DC2626'
          : priceGrade === 'warning'
            ? '#6B7280'
            : '#7A38D8';

    const isPenny = priceGrade === 'penny';
    const isWarning = priceGrade === 'warning';

    // Chart dimensions
    const chartW = 320;
    const chartH = 80;
    const chartPad = 12;
    const chartPath = buildChartPath(chartData, chartW, chartH, chartPad);

    // "NOW" at index 3 (current month), surge at the peak
    const nowIndex = Math.min(3, chartData.length - 1);
    const surgeIndex = chartData.indexOf(Math.max(...chartData));
    const nowPt = getChartPoint(chartData, nowIndex, chartW, chartH, chartPad);
    const surgePt = getChartPoint(chartData, surgeIndex, chartW, chartH, chartPad);

    return (
      <div
        ref={ref}
        className="flex flex-col w-full"
        style={{
          background: isWarning
            ? 'linear-gradient(180deg, #111111 0%, #1a1a1a 100%)'
            : isPenny
              ? 'linear-gradient(180deg, #0f0f1e 0%, #1e0a0a 100%)'
              : 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)',
          border: `1px solid ${isPenny ? '#3a1a1a' : isWarning ? '#2a2a2a' : '#2a2a3e'}`,
          borderRadius: '16px',
          padding: '28px 24px 20px',
          aspectRatio: '9 / 16',
          maxWidth: '400px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow effect for penny stocks */}
        {isPenny && (
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '160px',
              height: '160px',
              background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Premium glow */}
        {priceGrade === 'premium' && (
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              width: '140px',
              height: '140px',
              background: 'radial-gradient(circle, rgba(202,138,4,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* 1. Header */}
        <div className="flex flex-col gap-2">
          <div
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#666666',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            사주증권 리서치센터
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: accentColor,
                backgroundColor: `${accentColor}18`,
                padding: '3px 10px',
                borderRadius: '20px',
                border: `1px solid ${accentColor}33`,
              }}
            >
              {sector}
            </span>
            {grade.badgeLabel && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: grade.borderColor,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: `1px solid ${grade.borderColor}44`,
                }}
              >
                {grade.badgeLabel}
              </span>
            )}
          </div>
        </div>

        {/* 2. Current Price (THE STAR) */}
        <div className="flex flex-col" style={{ marginTop: '28px' }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#777777',
              marginBottom: '4px',
            }}
          >
            현재 시장가
          </span>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: isPenny ? '#FF4444' : isWarning ? '#888888' : '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textShadow: isPenny
                ? '0 0 20px rgba(220,38,38,0.3)'
                : 'none',
            }}
          >
            {formatPrice(currentPrice)}
            <span style={{ fontSize: '20px', fontWeight: 600, marginLeft: '2px' }}>
              원
            </span>
          </span>
        </div>

        {/* 3. Fair Value line */}
        <div className="flex items-center gap-2" style={{ marginTop: '12px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#888888',
            }}
          >
            적정가{' '}
            <span style={{ color: fvGrade.color, fontWeight: 600 }}>
              {formatPrice(fairValue)}원
            </span>
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: changeColor,
            }}
          >
            {changeSymbol}
            {Math.abs(undervalueRate)}%
          </span>
          {isUndervalued && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#DC2626',
                backgroundColor: 'rgba(220,38,38,0.1)',
                padding: '2px 6px',
                borderRadius: '8px',
              }}
            >
              저평가
            </span>
          )}
        </div>

        {/* 4. Mini Chart */}
        <div
          style={{
            marginTop: '24px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '12px 8px 8px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            width="100%"
            height="80"
            style={{ overflow: 'visible' }}
          >
            {/* Gradient fill under the line */}
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A38D8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7A38D8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Fill area */}
            {chartData.length > 0 && (
              <path
                d={`${chartPath} L${chartW - chartPad},${chartH - chartPad} L${chartPad},${chartH - chartPad} Z`}
                fill="url(#chartGrad)"
              />
            )}

            {/* Line */}
            <path
              d={chartPath}
              fill="none"
              stroke="#7A38D8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* NOW marker */}
            <circle cx={nowPt.x} cy={nowPt.y} r="4" fill="#FFFFFF" />
            <circle cx={nowPt.x} cy={nowPt.y} r="6" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
            <text
              x={nowPt.x}
              y={nowPt.y - 10}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="700"
            >
              NOW
            </text>

            {/* Surge month marker */}
            {surgeIndex !== nowIndex && (
              <>
                {/* Star icon */}
                <text
                  x={surgePt.x}
                  y={surgePt.y - 2}
                  textAnchor="middle"
                  fontSize="14"
                  fill={accentColor}
                >
                  {'*'}
                </text>
                <circle cx={surgePt.x} cy={surgePt.y} r="3" fill={accentColor} />
                <text
                  x={surgePt.x}
                  y={surgePt.y + 14}
                  textAnchor="middle"
                  fill={accentColor}
                  fontSize="8"
                  fontWeight="600"
                >
                  {surgeMonthLabel}
                </text>
              </>
            )}
          </svg>
        </div>

        {/* 5. Investment Opinion Badge */}
        <div className="flex justify-center" style={{ marginTop: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '18px',
              fontWeight: 800,
              color: opinion.color,
              backgroundColor: `${opinion.color}15`,
              padding: '10px 24px',
              borderRadius: '12px',
              border: `1.5px solid ${opinion.color}33`,
              letterSpacing: '0.02em',
            }}
          >
            {investmentOpinion === 'strong_buy' ? '\u2605' : '\u25CF'}{' '}
            {opinion.label}{' '}
            {investmentOpinion === 'strong_buy' ? '\u2605' : '\u25CF'}
          </div>
        </div>

        {/* 6. Analyst Comment */}
        <div
          style={{
            marginTop: '20px',
            fontSize: '13px',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#AAAAAA',
            lineHeight: 1.6,
            textAlign: 'center',
            padding: '0 8px',
          }}
        >
          &quot;{analystComment}&quot;
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* 7. Footer watermark */}
        <div
          className="flex justify-center"
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#444444',
              letterSpacing: '0.04em',
            }}
          >
            nadaunse.com/stock
          </span>
        </div>
      </div>
    );
  }
);

StockReportCard.displayName = 'StockReportCard';

export default StockReportCard;
