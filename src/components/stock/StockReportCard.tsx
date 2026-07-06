'use client';

import React from 'react';
import type { StockReport } from '@/types/stock';
import { INVESTMENT_OPINIONS, getPriceGrade, FAIR_VALUE_GRADES } from '@/constants/stock';
import SajuGPTWatermark from '@/components/SajuGPTWatermark';

interface Props {
  report: StockReport;
}

// ─── 토스 스타일 컬러 토큰 (StockLanding과 동일) ──────────
const COLOR_CARD = '#202632';
const COLOR_UP = '#F04452';
const COLOR_DOWN = '#3182F6';
const COLOR_TEXT_PRIMARY = '#F2F3F5';
const COLOR_TEXT_SECONDARY = '#8B95A1';
const COLOR_TEXT_TERTIARY = '#4E5968';
const COLOR_DIVIDER = 'rgba(255,255,255,0.06)';

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
    const changeSymbol = isUndervalued ? '▼' : '▲';
    const changeColor = isUndervalued ? COLOR_UP : COLOR_DOWN;

    // Price grade accent
    const accentColor =
      priceGrade === 'premium'
        ? '#CA8A04'
        : priceGrade === 'penny'
          ? COLOR_UP
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
          backgroundColor: COLOR_CARD,
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.28)',
          overflow: 'hidden',
        }}
      >
        {/* 1. Header */}
        <div
          className="flex flex-col"
          style={{ gap: '12px', padding: '20px 20px', borderBottom: `1px solid ${COLOR_DIVIDER}` }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: COLOR_TEXT_SECONDARY,
              letterSpacing: '-0.24px',
            }}
          >
            연애 시장가 리포트
          </span>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: accentColor,
                backgroundColor: `${accentColor}22`,
                padding: '4px 10px',
                borderRadius: '8px',
              }}
            >
              {sector}
            </span>
            {grade.badgeLabel && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: COLOR_TEXT_SECONDARY,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                }}
              >
                {grade.badgeLabel}
              </span>
            )}
          </div>
        </div>

        {/* 2. Current Price + Chart */}
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${COLOR_DIVIDER}` }}>
          <div className="flex flex-col" style={{ marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 400,
                color: COLOR_TEXT_SECONDARY,
                marginBottom: '4px',
              }}
            >
              내 연애 시장가
            </span>
            <span
              style={{
                fontSize: '44px',
                fontWeight: 800,
                color: isPenny ? COLOR_UP : isWarning ? COLOR_TEXT_SECONDARY : COLOR_TEXT_PRIMARY,
                lineHeight: 1.1,
                letterSpacing: '-1px',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatPrice(currentPrice)}
              <span style={{ fontSize: '18px', fontWeight: 600, marginLeft: '2px', color: COLOR_TEXT_SECONDARY }}>
                원
              </span>
            </span>
          </div>

          {/* Fair Value line */}
          <div className="flex items-center gap-2" style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 400, color: COLOR_TEXT_SECONDARY }}>
              적정가{' '}
              <span style={{ color: fvGrade.color, fontWeight: 700 }}>
                {formatPrice(fairValue)}원
              </span>
            </span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 8px',
                borderRadius: '8px',
                backgroundColor: `${changeColor}22`,
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: changeColor }}>
                {changeSymbol} {Math.abs(undervalueRate)}%
              </span>
            </div>
            {isUndervalued && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: COLOR_UP,
                  backgroundColor: `${COLOR_UP}1A`,
                  padding: '3px 8px',
                  borderRadius: '8px',
                }}
              >
                저평가
              </span>
            )}
          </div>

          {/* Mini Chart */}
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            width="100%"
            height="80"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {chartData.length > 0 && (
              <path
                d={`${chartPath} L${chartW - chartPad},${chartH - chartPad} L${chartPad},${chartH - chartPad} Z`}
                fill="url(#chartGrad)"
              />
            )}

            <path
              d={chartPath}
              fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* NOW marker */}
            <circle cx={nowPt.x} cy={nowPt.y} r="4" fill={COLOR_TEXT_PRIMARY} />
            <circle cx={nowPt.x} cy={nowPt.y} r="6" fill="none" stroke={COLOR_TEXT_PRIMARY} strokeWidth="1.5" opacity="0.4" />
            <text
              x={nowPt.x}
              y={nowPt.y - 10}
              textAnchor="middle"
              fill={COLOR_TEXT_PRIMARY}
              fontSize="9"
              fontWeight="700"
            >
              NOW
            </text>

            {/* Surge month marker */}
            {surgeIndex !== nowIndex && (
              <>
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

        {/* 3. Investment Opinion + Comment */}
        <div className="flex flex-col items-center" style={{ padding: '24px 20px', borderBottom: `1px solid ${COLOR_DIVIDER}` }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '17px',
              fontWeight: 800,
              color: opinion.color,
              backgroundColor: `${opinion.color}1F`,
              padding: '10px 24px',
              borderRadius: '12px',
              letterSpacing: '-0.34px',
              marginBottom: '16px',
            }}
          >
            {investmentOpinion === 'strong_buy' ? '★' : '●'} {opinion.label}
          </div>

          <p
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: COLOR_TEXT_SECONDARY,
              lineHeight: 1.6,
              textAlign: 'center',
              padding: '0 8px',
            }}
          >
            &quot;{analystComment}&quot;
          </p>
        </div>

        {/* 4. Footer watermark */}
        <div className="flex justify-center" style={{ padding: '16px 20px' }}>
          <SajuGPTWatermark featureType="saju_stock" letterSpacing="-0.26px" />
        </div>
      </div>
    );
  }
);

StockReportCard.displayName = 'StockReportCard';

export default StockReportCard;
