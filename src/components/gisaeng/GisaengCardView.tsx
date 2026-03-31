'use client';

import { motion } from 'framer-motion';
import type { GisaengCard } from '@/types/gisaeng';
import { GISAENG_TYPES, STAT_LABELS } from '@/constants/gisaeng';
import { trackSajuGPTClick } from '@/lib/analytics';

interface Props {
  gisaengCard: GisaengCard;
  onNext: () => void;
}

// 랜딩과 동일한 조선 컬러 팔레트
const C = {
  hanji: '#F5F0E8',
  ink: '#1A1715',
  inkSoft: '#3D3530',
  inkMuted: '#6B5F56',
  inkFaint: '#A69A8E',
  vermillion: '#B8423A',
  vermillionDark: '#9C342E',
  gold: '#C9A96E',
  border: '#DDD5C8',
  cardBg: '#FAF7F2',
};

const TIER_COLOR: Record<string, string> = {
  S: C.gold,
  A: C.vermillion,
  B: C.inkSoft,
  C: '#4488FF',
  D: C.inkFaint,
};

export default function GisaengCardView({ gisaengCard, onNext }: Props) {
  const typeInfo = GISAENG_TYPES[gisaengCard.type];
  const stats = gisaengCard.stats;
  const tierLetter = gisaengCard.tier?.charAt(0) || 'B';
  const tierColor = TIER_COLOR[tierLetter] || C.inkSoft;

  return (
    <motion.div
      className="flex-1 flex flex-col relative"
      style={{ paddingBottom: '100px', backgroundColor: C.hanji }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ padding: '24px 20px 0' }}>
        {/* 카드 */}
        <div
          className="rounded-3xl overflow-hidden transform-gpu"
          style={{
            backgroundColor: C.cardBg,
            border: `1px solid ${C.border}`,
            padding: '28px 24px 24px',
          }}
        >
          {/* 헤더 */}
          <div
            className="flex items-center justify-center"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: C.inkFaint,
              letterSpacing: '3px',
              marginBottom: '20px',
            }}
          >
            ✦ 나의 기생 카드 ✦
          </div>

          {/* 티어 배지 — 도장 스타일 */}
          <div className="flex flex-col items-center" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: `3px solid ${tierColor}`,
                backgroundColor: 'transparent',
              }}
            >
              <span style={{ fontSize: '26px', fontWeight: 900, color: tierColor }}>
                {tierLetter}
              </span>
            </div>
          </div>

          {/* 기명 */}
          <p style={{
            fontSize: '22px', fontWeight: 800, color: C.ink,
            textAlign: 'center', letterSpacing: '-0.44px',
          }}>
            「{gisaengCard.gisaengName}」
          </p>
          <p style={{
            fontSize: '14px', fontWeight: 600, color: C.vermillion,
            textAlign: 'center', letterSpacing: '-0.28px', marginTop: '4px',
          }}>
            {typeInfo.typeName} ({typeInfo.hanja}) — {typeInfo.typeSubtitle}
          </p>

          {/* 능력치 바 */}
          <div className="flex flex-col gap-3" style={{ marginTop: '28px' }}>
            {(Object.keys(stats) as (keyof typeof stats)[]).map(key => (
              <div key={key} className="flex items-center gap-3">
                <span style={{
                  fontSize: '13px', color: C.inkMuted, fontWeight: 600,
                  width: '32px', flexShrink: 0, letterSpacing: '-0.26px',
                }}>
                  {STAT_LABELS[key]}
                </span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: C.border }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats[key]}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ background: `linear-gradient(90deg, ${C.vermillion}, ${C.gold})` }}
                  />
                </div>
                <span style={{
                  fontSize: '14px', color: C.ink, fontWeight: 700,
                  width: '28px', textAlign: 'right', letterSpacing: '-0.28px',
                }}>
                  {stats[key]}
                </span>
              </div>
            ))}
          </div>

          {/* 살 태그 */}
          <div className="flex items-center justify-center flex-wrap gap-2" style={{ marginTop: '20px' }}>
            {gisaengCard.doHwaSal && (
              <span style={{
                fontSize: '12px', fontWeight: 600, color: C.vermillion,
                backgroundColor: `${C.vermillion}14`, border: `1px solid ${C.vermillion}30`,
                borderRadius: '20px', padding: '4px 12px',
              }}>
                🔥 도화살 보유
              </span>
            )}
            {gisaengCard.hongYeomSal && (
              <span style={{
                fontSize: '12px', fontWeight: 600, color: C.vermillion,
                backgroundColor: `${C.vermillion}14`, border: `1px solid ${C.vermillion}30`,
                borderRadius: '20px', padding: '4px 12px',
              }}>
                💀 홍염살 보유
              </span>
            )}
            {!gisaengCard.doHwaSal && !gisaengCard.hongYeomSal && (
              <span style={{
                fontSize: '12px', fontWeight: 500, color: C.inkFaint,
                backgroundColor: `${C.inkFaint}14`, border: `1px solid ${C.border}`,
                borderRadius: '20px', padding: '4px 12px',
              }}>
                살 없음
              </span>
            )}
          </div>

          {/* 총 바람끼력 */}
          <div className="flex flex-col items-center" style={{ marginTop: '24px' }}>
            <span style={{ fontSize: '13px', color: C.inkFaint, fontWeight: 500, letterSpacing: '-0.26px' }}>
              총 바람끼력
            </span>
            <p style={{ marginTop: '4px' }}>
              <span style={{ fontSize: '40px', fontWeight: 900, color: C.ink, lineHeight: 1 }}>
                {gisaengCard.totalCharm}
              </span>
              <span style={{ fontSize: '16px', fontWeight: 500, color: C.inkFaint }}> / 500</span>
            </p>
          </div>

          {/* 구분선 */}
          <div style={{ borderTop: `1px solid ${C.border}`, margin: '20px 0' }} />

          {/* 서사 */}
          <p style={{
            fontSize: '14px', fontWeight: 500, color: C.inkSoft,
            textAlign: 'center', lineHeight: 1.8, letterSpacing: '-0.28px',
          }}>
            "{gisaengCard.narrative}"
          </p>

          {/* 한 줄 평가 */}
          <div
            className="rounded-xl text-center"
            style={{
              marginTop: '16px', padding: '10px 12px',
              backgroundColor: `${C.vermillion}08`, border: `1px solid ${C.vermillion}18`,
            }}
          >
            <p style={{
              fontSize: '12px', fontWeight: 500, color: C.inkMuted,
              lineHeight: 1.6, letterSpacing: '-0.24px',
            }}>
              {gisaengCard.assessment}
            </p>
          </div>

          {/* 워터마크 */}
          <a
            href="https://www.sajugpt.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSajuGPTClick('gisaeng')}
            style={{
              display: 'block', textAlign: 'center', marginTop: '16px',
              fontSize: '13px', color: C.vermillion, fontWeight: 700,
              letterSpacing: '-0.26px', textDecoration: 'underline', textUnderlineOffset: '3px',
            }}
          >
            sajugpt.co.kr
          </a>
        </div>
      </div>

      {/* 하단 고정 CTA */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-start w-full z-10"
        style={{
          maxWidth: '440px',
          backgroundColor: C.hanji,
          boxShadow: `0px -8px 16px 0px ${C.hanji}c2`,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ padding: '12px 20px', width: '100%' }}>
          <motion.div
            onClick={onNext}
            className="transform-gpu"
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: C.vermillion,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{
              fontSize: '16px', fontWeight: 600, lineHeight: '25px',
              letterSpacing: '-0.32px', color: '#fff', whiteSpace: 'nowrap',
            }}>
              선비 3명 만나러 가기
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
