'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { OperationPlan } from '@/types/stock';
import TriangleIcon from '@/components/stock/TriangleIcon';
import { trackSajuGPTClick } from '@/lib/analytics';
import { PRESS_HOVER_PROPS } from '@/lib/motionPresets';
import { useCountUp } from '@/lib/useCountUp';

interface Props {
  plan: OperationPlan;
}

// ─── StockReportCard와 통일된 컬러 토큰 ──────────
const COLOR_CARD = '#202632';
const COLOR_UP = '#F04452';
const COLOR_BRAND = '#7A38D8';
const COLOR_TEXT_PRIMARY = '#F2F3F5';
const COLOR_TEXT_SECONDARY = '#8B95A1';
const COLOR_TEXT_TERTIARY = '#4E5968';
const COLOR_TEXT_BRIGHT = '#B8C0CC';

function LockIcon({ color, size = 10, style }: { color: string; size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', flexShrink: 0, ...style }}>
      <path
        fill={color}
        d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm0 2a3 3 0 0 1 3 3v3H9V6a3 3 0 0 1 3-3Z"
      />
    </svg>
  );
}

const StockPlanCard = React.forwardRef<HTMLDivElement, Props>(
  ({ plan }, ref) => {
    const unlockedPhases = [plan.phase1, plan.phase2];

    const growthValue = plan.growthRate.replace(/^[↑▲]\s*/, '');
    const growthTarget = parseInt(growthValue.replace(/[^0-9]/g, ''), 10) || 0;
    const growthSuffix = growthValue.replace(/^[0-9]+/, '');
    const growthCount = useCountUp(growthTarget, 1200, 300);

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: COLOR_CARD,
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.16)',
          overflow: 'hidden',
        }}
      >
        {/* Header — 결과 요약이라 가운데 정렬. 여러 줄로 이어지는 본문(코멘트)은 가독성 때문에 좌측 정렬 유지 */}
        <div className="flex flex-col items-center" style={{ padding: '24px 24px 16px' }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: COLOR_TEXT_PRIMARY, letterSpacing: '-0.3px', paddingTop: '12px', paddingBottom: '8px', marginBottom: '20px', textAlign: 'center' }}>
            주가 상승 작전 계획서
          </p>

          <div
            className="flex flex-col items-center"
            style={{
              alignSelf: 'stretch',
              padding: '24px 24px 26px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 700, color: COLOR_TEXT_PRIMARY, marginBottom: '28px', textAlign: 'center' }}>
              작전 결과
            </p>

            <span
              className="flex items-center"
              style={{
                gap: '6px',
                fontSize: '36px',
                fontWeight: 800,
                color: COLOR_UP,
                letterSpacing: '-0.8px',
                fontVariantNumeric: 'tabular-nums',
                padding: '6px 20px',
                borderRadius: '14px',
                backgroundColor: 'rgba(240,68,82,0.18)',
                marginBottom: '14px',
              }}
            >
              <TriangleIcon color={COLOR_UP} up size={21} />
              <span style={{ position: 'relative', top: '1px' }}>{growthCount.toLocaleString()}{growthSuffix}</span>
            </span>

            <p style={{ fontSize: '14px', fontWeight: 500, color: COLOR_TEXT_BRIGHT, letterSpacing: '-0.2px', fontVariantNumeric: 'tabular-nums', marginBottom: '28px' }}>
              {plan.currentToTarget}
            </p>

            <div style={{ alignSelf: 'stretch', padding: '16px 18px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: COLOR_TEXT_SECONDARY, letterSpacing: '0.5px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>
                애널리스트 코멘트
              </p>
              <p style={{ fontSize: '15px', fontWeight: 500, color: COLOR_TEXT_PRIMARY, lineHeight: '22px', letterSpacing: '-0.3px', textAlign: 'center' }}>
                {plan.crewComment}
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap — 공개된 구간을 세로 막대 차트로, 박스로 감싸 가운데 정렬 */}
        <div style={{ padding: '0 24px 16px' }}>
          <div
            className="flex flex-col items-center"
            style={{
              padding: '24px 24px 36px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            <p style={{ fontSize: '18px', fontWeight: 700, color: COLOR_TEXT_PRIMARY, marginBottom: '40px', textAlign: 'center' }}>
              작전 로드맵
            </p>

            <div className="flex justify-center" style={{ gap: '40px' }}>
              {unlockedPhases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.4 }}
                  className="flex flex-col items-center w-24 md:w-40"
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#A78BFA', marginBottom: '6px' }}>{phase.month}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: COLOR_TEXT_PRIMARY, marginBottom: '12px', textAlign: 'center' }}>{phase.title}</span>

                  <div
                    className="flex items-end w-16 md:w-[88px]"
                    style={{ height: '84px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: i === 0 ? '100%' : '70%' }}
                      transition={{ delay: 0.4 + i * 0.2, duration: 0.6 }}
                      style={{ width: '100%', borderRadius: '16px', backgroundColor: COLOR_BRAND }}
                    />
                  </div>

                  <p style={{ fontSize: '13px', fontWeight: 500, color: COLOR_TEXT_BRIGHT, marginTop: '12px', lineHeight: '18px', textAlign: 'center' }}>
                    {phase.summary.split(' + ').map((part, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && (
                          <>
                            <br />
                            <span style={{ color: COLOR_TEXT_SECONDARY }}>+</span>
                            <br />
                          </>
                        )}
                        {part}
                      </React.Fragment>
                    ))}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 3단계 잠금 해제 — 잠긴 정보와 실행 CTA를 하나의 그룹으로 묶음 */}
        <div style={{ padding: '0 24px 24px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              overflow: 'hidden',
            }}
          >
            {/* 스켈레톤처럼 은은하게 흐르는 셔머 애니메이션 — 잠금 상태를 암시 */}
            <motion.div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage: 'linear-gradient(135deg, transparent 46%, rgba(255,255,255,0.025) 50%, transparent 54%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPositionX: ['200%', '0%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            />

            <div className="flex flex-col items-center" style={{ position: 'relative', zIndex: 1, padding: '22px 24px 24px' }}>
              <div className="flex flex-col items-center" style={{ gap: '30px', marginBottom: '12px' }}>
                <span
                  className="inline-flex items-center"
                  style={{ gap: '5px', fontSize: '13px', fontWeight: 600, color: '#C4B5FD', backgroundColor: 'rgba(122,56,216,0.2)', padding: '4px 10px', borderRadius: '8px' }}
                >
                  <LockIcon color="#C4B5FD" size={15} style={{ position: 'relative', top: '1px' }} />
                  <span style={{ position: 'relative', top: '1px' }}>잠금</span>
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: COLOR_TEXT_SECONDARY, marginBottom: '4px' }}>{plan.phase3.month}</span>
              </div>

              <p style={{ fontSize: '18px', fontWeight: 700, color: COLOR_TEXT_PRIMARY, marginBottom: '10px', textAlign: 'center' }}>
                {plan.phase3.title}
              </p>

              <p style={{ fontSize: '14px', fontWeight: 400, color: COLOR_TEXT_BRIGHT, lineHeight: '20px', marginBottom: '36px', textAlign: 'center' }}>
                {plan.phase3.teaser}
              </p>

              <motion.a
                href="https://www.sajugpt.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSajuGPTClick('saju_stock')}
                className="flex items-center justify-center transform-gpu"
                {...PRESS_HOVER_PROPS}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: COLOR_BRAND,
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                3단계 작전 실행하기
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

StockPlanCard.displayName = 'StockPlanCard';

export default StockPlanCard;
