'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { StockReport } from '@/types/stock';
import { INVESTMENT_OPINIONS, INVESTMENT_OPINION_DETAILS, getPriceGrade } from '@/constants/stock';
import SajuGPTWatermark from '@/components/SajuGPTWatermark';
import TriangleIcon from '@/components/stock/TriangleIcon';

interface Props {
  report: StockReport;
}

// 점이 차트 가장자리 근처에 있으면 라벨을 중앙 정렬 대신 점 쪽으로 앵커를 바꿔서
// x좌표를 억지로 밀지 않고도(라벨이 점에서 떨어져 보이지 않게) 잘림을 방지한다.
function edgeAwareLabel(pointX: number, chartW: number, margin = 26) {
  if (pointX < margin) return { x: pointX, textAnchor: 'start' as const };
  if (pointX > chartW - margin) return { x: pointX, textAnchor: 'end' as const };
  return { x: pointX, textAnchor: 'middle' as const };
}

// ─── 토스 스타일 컬러 토큰 (StockLanding과 동일) ──────────
const COLOR_CARD = '#202632';
const COLOR_UP = '#F04452';
const COLOR_DOWN = '#3182F6';
const COLOR_BRAND = '#7A38D8';
const COLOR_BOX_BG = 'rgba(255,255,255,0.08)';
const COLOR_TEXT_PRIMARY = '#F2F3F5';
const COLOR_TEXT_SECONDARY = '#8B95A1';
const COLOR_TEXT_TERTIARY = '#4E5968';
const COLOR_DIVIDER = 'rgba(255,255,255,0.06)';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR');
}

// "**강조**" 구간만 highlightColor로 칠해서 렌더링
function renderHighlighted(text: string, highlightColor: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) => {
    const match = chunk.match(/^\*\*([^*]+)\*\*$/);
    if (!match) return <React.Fragment key={i}>{chunk}</React.Fragment>;
    return (
      <span key={i} style={{ color: highlightColor, fontWeight: 700 }}>
        {match[1]}
      </span>
    );
  });
}

function toChartPoints(
  data: number[],
  width: number,
  height: number,
  padX: number,
  padY: number
): { x: number; y: number }[] {
  if (data.length === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - padX * 2) / (data.length - 1);
  return data.map((v, i) => ({
    x: padX + i * stepX,
    y: height - padY - ((v - min) / range) * (height - padY * 2),
  }));
}

// Catmull-Rom → Bezier 변환으로 데이터 포인트를 부드러운 곡선으로 연결
function buildChartPath(
  data: number[],
  width: number,
  height: number,
  padX: number,
  padY: number
): string {
  const points = toChartPoints(data, width, height, padX, padY);
  if (points.length === 0) return '';
  if (points.length === 1) return `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const c1x = p1.x + (p2.x - p0.x) / 8;
    const c1y = p1.y + (p2.y - p0.y) / 8;
    const c2x = p2.x - (p3.x - p1.x) / 8;
    const c2y = p2.y - (p3.y - p1.y) / 8;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function getChartPoint(
  data: number[],
  index: number,
  width: number,
  height: number,
  padX: number,
  padY: number
): { x: number; y: number } {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - padX * 2) / (data.length - 1);
  const x = padX + index * stepX;
  const y = height - padY - ((data[index] - min) / range) * (height - padY * 2);
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
      chartData,
    } = report;

    const opinion = INVESTMENT_OPINIONS[investmentOpinion];
    const detail = INVESTMENT_OPINION_DETAILS[investmentOpinion];
    const grade = getPriceGrade(currentPrice);

    const isUndervalued = undervalueRate > 0;
    const changeColor = isUndervalued ? COLOR_UP : COLOR_DOWN;
    const priceDiff = Math.abs(fairValue - currentPrice);

    const isPenny = priceGrade === 'penny';
    const isWarning = priceGrade === 'warning';

    // 카드 전체의 단일 액센트 — 투자의견 색 하나로만 통일 (차트, 뱃지, 클로징 라인 공용)
    const accentColor = opinion.color;

    const meta = [sector, grade.badgeLabel].filter(Boolean).join(' · ');

    // Chart dimensions — 카드 좌우 끝까지 꽉 채우는 차트 (텍스트 패딩 밖으로 bleed)
    const chartW = 440;
    const chartH = 190;
    const chartPadX = 0;
    const chartPadY = 18;
    const chartPath = buildChartPath(chartData, chartW, chartH, chartPadX, chartPadY);

    // "현재" at index 3 (current month), surge at the peak
    const nowIndex = Math.min(3, chartData.length - 1);
    const surgeIndex = chartData.indexOf(Math.max(...chartData));
    const nowPt = getChartPoint(chartData, nowIndex, chartW, chartH, chartPadX, chartPadY);
    const surgePt = getChartPoint(chartData, surgeIndex, chartW, chartH, chartPadX, chartPadY);

    // 마커는 실제 라인 좌표와 정확히 일치해야 하므로 별도 오프셋 없이 그대로 사용
    const nowDotX = nowPt.x;
    const surgeDotX = surgePt.x;

    return (
      <div
        ref={ref}
        className="flex flex-col w-full"
        style={{
          backgroundColor: COLOR_CARD,
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.16)',
          overflow: 'hidden',
        }}
      >
        {/* 1. Header — 텍스트만, 색은 절제 */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '20px 24px', gap: '12px', borderBottom: `1px solid ${COLOR_DIVIDER}` }}
        >
          <span style={{ fontSize: '14px', fontWeight: 600, color: COLOR_TEXT_SECONDARY, whiteSpace: 'nowrap' }}>
            연애 시장가 리포트
          </span>
          {meta && (
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: COLOR_TEXT_SECONDARY,
              backgroundColor: 'rgba(255,255,255,0.08)',
              padding: '3px 9px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
            }}>
              {meta}
            </span>
          )}
        </div>

        {/* 2. 현재가 — 가장 중요한 정보, 색 없이 크기만으로 압도 */}
        <div style={{ padding: '32px 24px 40px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: COLOR_TEXT_SECONDARY, display: 'block', paddingLeft: '2px', marginBottom: '8px' }}>
            내 연애 시장가
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '46px',
              fontWeight: 700,
              color: isPenny ? COLOR_UP : isWarning ? COLOR_TEXT_SECONDARY : COLOR_TEXT_PRIMARY,
              lineHeight: 1.1,
              letterSpacing: '-1.2px',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: '24px',
            }}
          >
            {formatPrice(currentPrice)}
            <span style={{ fontSize: '18px', fontWeight: 500, marginLeft: '4px', color: COLOR_TEXT_SECONDARY }}>
              원
            </span>
          </span>

          <span className="flex items-center" style={{ fontSize: '15px', fontWeight: 800, color: changeColor, gap: '4px', marginBottom: '10px', whiteSpace: 'nowrap' }}>
            <TriangleIcon color={changeColor} up={!isUndervalued} />
            {Math.abs(undervalueRate)}% {isUndervalued ? '저평가' : '고평가'}
          </span>

          <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '12px' }}>
            <motion.div
              style={{
                height: '100%',
                borderRadius: '4px',
                backgroundColor: changeColor,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(undervalueRate), 100)}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            />
          </div>

          <p style={{ fontSize: '13px', fontWeight: 500, color: COLOR_TEXT_SECONDARY, paddingLeft: '2px', wordBreak: 'keep-all' }}>
            적정가 {formatPrice(fairValue)}원 · {formatPrice(priceDiff)}원 차이
          </p>
        </div>

        {/* 3+4+5. 차트 + 투자의견 + 클로징 — 하나의 그룹 박스로 통합 */}
        <div
          className="p-3 md:p-5"
          style={{
            margin: '0 24px 24px',
            borderRadius: '18px',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
        <div className="px-1 md:px-4" style={{ paddingTop: '40px', paddingBottom: '8px', borderRadius: '14px', backgroundColor: 'rgba(0,0,0,0.18)', marginBottom: '28px' }}>
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            width="100%"
            style={{ overflow: 'visible', display: 'block' }}
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.16" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {chartData.length > 0 && (
              <motion.path
                d={`${chartPath} L${chartW - chartPadX},${chartH - chartPadY} L${chartPadX},${chartH - chartPadY} Z`}
                fill="url(#chartGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              />
            )}

            <motion.path
              d={chartPath}
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
            />

            {/* 현재 marker — 점 하나 + 옅은 라벨 */}
            <motion.circle
              cx={nowDotX}
              cy={nowPt.y}
              r="3.3"
              fill={COLOR_CARD}
              stroke={accentColor}
              strokeWidth="1.1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35, delay: 1.2, ease: 'easeOut' }}
              style={{ transformOrigin: `${nowDotX}px ${nowPt.y}px` }}
            />
            <motion.text
              {...edgeAwareLabel(nowDotX, chartW)}
              y={nowPt.y - 18}
              fill={COLOR_TEXT_SECONDARY}
              fontSize="8"
              fontWeight="500"
              letterSpacing="0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.3 }}
            >
              현재
            </motion.text>

            {/* Surge month marker — 액센트 컬러 하나로만 강조, 은은한 글로우 */}
            {surgeIndex !== nowIndex && (
              <>
                <motion.circle
                  cx={surgeDotX}
                  cy={surgePt.y}
                  r="3.7"
                  fill={accentColor}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.3, ease: 'backOut' }}
                  style={{ transformOrigin: `${surgeDotX}px ${surgePt.y}px` }}
                />
                <motion.text
                  {...edgeAwareLabel(surgeDotX, chartW)}
                  y={surgePt.y - 18}
                  fill={accentColor}
                  fontSize="9"
                  fontWeight="500"
                  letterSpacing="0"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                >
                  {surgeMonthLabel}
                </motion.text>
              </>
            )}
          </svg>
        </div>

          <div
            className="inline-flex items-center"
            style={{
              padding: '4px 10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              marginBottom: '14px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(242,243,245,0.7)', letterSpacing: '-0.2px' }}>
              AI 투자의견 · {opinion.label}
            </span>
          </div>
          <p style={{ fontSize: '22px', fontWeight: 700, color: COLOR_TEXT_PRIMARY, lineHeight: 1.5, marginBottom: '16px', paddingLeft: '2px', wordBreak: 'keep-all' }}>
            {detail.quote}
          </p>

          <div style={{ padding: '20px 24px', borderRadius: '14px', backgroundColor: COLOR_BOX_BG }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: COLOR_TEXT_PRIMARY, lineHeight: 1.5, letterSpacing: '-0.2px', marginBottom: '6px', wordBreak: 'keep-all' }}>
              {renderHighlighted(detail.warningTitle, COLOR_TEXT_PRIMARY)}
            </p>
            <p style={{ fontSize: '13px', fontWeight: 500, color: COLOR_TEXT_SECONDARY, lineHeight: 1.7, wordBreak: 'keep-all' }}>
              {detail.warningBody}
            </p>
          </div>
        </div>

        {/* 6. Footer watermark */}
        <div className="flex justify-center" style={{ padding: '8px 24px 24px' }}>
          <SajuGPTWatermark featureType="saju_stock" letterSpacing="-0.26px" />
        </div>
      </div>
    );
  }
);

StockReportCard.displayName = 'StockReportCard';

export default StockReportCard;
