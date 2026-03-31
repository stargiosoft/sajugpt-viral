'use client';

import { forwardRef } from 'react';
import type { GisaengCard, SimulationResult, SeonbiType } from '@/types/gisaeng';
import { GISAENG_TYPES, SEONBI_INFO, TIER_INFO } from '@/constants/gisaeng';
import { trackSajuGPTClick } from '@/lib/analytics';

interface Props {
  gisaengCard: GisaengCard;
  simulation: SimulationResult;
}

// 랜딩과 동일한 조선 컬러 팔레트
const C = {
  hanji: '#F5F0E8',
  ink: '#1A1715',
  inkSoft: '#3D3530',
  inkMuted: '#6B5F56',
  inkFaint: '#A69A8E',
  vermillion: '#B8423A',
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

const GisaengResultCard = forwardRef<HTMLDivElement, Props>(
  ({ gisaengCard, simulation }, ref) => {
    const typeInfo = GISAENG_TYPES[gisaengCard.type];
    const tierInfo = TIER_INFO[simulation.tier];
    const seonbiTypes: SeonbiType[] = ['kwonryeok', 'romantic', 'jealousy'];
    const charmDiff = simulation.totalCharmAfter - gisaengCard.totalCharm;
    const tierColor = TIER_COLOR[simulation.tier] || C.inkSoft;

    return (
      <div
        ref={ref}
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
          ✦ 기생 최종 성적표 ✦
        </div>

        {/* 티어 배지 — 도장 스타일 */}
        <div className="flex flex-col items-center" style={{ marginBottom: '8px' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: `3px solid ${tierColor}`,
            }}
          >
            <span style={{ fontSize: '26px', fontWeight: 900, color: tierColor }}>
              {simulation.tier}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: C.inkMuted, fontWeight: 500, marginTop: '8px' }}>
            {tierInfo.label}
          </p>
        </div>

        {/* 기명 + 유형 */}
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

        {/* 월 수입 */}
        <div className="flex flex-col items-center" style={{ marginTop: '24px' }}>
          <span style={{ fontSize: '13px', color: C.inkFaint, fontWeight: 500, letterSpacing: '-0.26px' }}>
            월 수입
          </span>
          <p style={{ marginTop: '4px' }}>
            <span style={{ fontSize: '40px', fontWeight: 900, color: C.ink, lineHeight: 1 }}>
              {simulation.monthlySalary.toLocaleString()}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600, color: C.inkSoft }}>냥</span>
          </p>
          <span style={{ fontSize: '14px', color: C.vermillion, fontWeight: 600, marginTop: '4px' }}>
            현재 가치 약 {(simulation.modernValue / 10000).toLocaleString()}만원
          </span>
        </div>

        {/* 구분선 + 라벨 */}
        <div className="my-5" style={{ borderTop: `1px solid ${C.border}` }}>
          <p className="text-center -mt-2.5">
            <span className="px-3" style={{ backgroundColor: C.cardBg, fontSize: '11px', color: C.inkFaint, fontWeight: 500, letterSpacing: '1px' }}>
              선비 관리 결산
            </span>
          </p>
        </div>

        {/* 선비별 결과 */}
        <div className="flex flex-col gap-3">
          {seonbiTypes.map(type => {
            const info = SEONBI_INFO[type];
            const state = simulation.finalSeonbi[type];
            const comment = simulation.seonbiComments[type];

            return (
              <div
                key={type}
                className="rounded-xl"
                style={{
                  padding: '12px 14px',
                  backgroundColor: state.alive ? '#fff' : '#fff',
                  border: `1px solid ${C.border}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  opacity: state.alive ? 1 : 0.5,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '13px', color: C.ink, fontWeight: 700, letterSpacing: '-0.26px' }}>
                      {info.name}
                    </span>
                    <span style={{ fontSize: '11px', color: C.inkFaint }}>
                      {info.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '12px', color: C.vermillion, fontWeight: 600 }}>
                      충성 {state.loyalty}
                    </span>
                    <span style={{ fontSize: '12px', color: C.gold, fontWeight: 600 }}>
                      의심 {state.suspicion}
                    </span>
                  </div>
                </div>
                <p style={{
                  fontSize: '13px', color: C.inkMuted,
                  marginTop: '6px', lineHeight: 1.5, letterSpacing: '-0.26px',
                }}>
                  "{comment}"
                </p>
              </div>
            );
          })}
        </div>

        {/* 바람끼력 변동 + 태그 */}
        <div className="flex items-center justify-center flex-wrap gap-2" style={{ marginTop: '20px' }}>
          <span style={{
            fontSize: '12px', fontWeight: 600, color: C.inkMuted,
            backgroundColor: C.hanji, border: `1px solid ${C.border}`,
            borderRadius: '20px', padding: '4px 12px',
          }}>
            바람끼력 {simulation.totalCharmAfter}
            {charmDiff !== 0 && (
              <span style={{ color: charmDiff > 0 ? '#16a34a' : C.vermillion }}>
                {' '}({charmDiff > 0 ? '+' : ''}{charmDiff})
              </span>
            )}
          </span>
          {gisaengCard.doHwaSal && (
            <span style={{
              fontSize: '12px', fontWeight: 600, color: C.vermillion,
              backgroundColor: `${C.vermillion}14`, border: `1px solid ${C.vermillion}30`,
              borderRadius: '20px', padding: '4px 12px',
            }}>
              도화살 보유
            </span>
          )}
        </div>

        {/* 구분선 */}
        <div style={{ borderTop: `1px solid ${C.border}`, margin: '20px 0' }} />

        {/* 최종 서사 */}
        <p style={{
          fontSize: '14px', fontWeight: 500, color: C.inkSoft,
          textAlign: 'center', lineHeight: 1.8, letterSpacing: '-0.28px',
        }}>
          "{simulation.finalNarrative}"
        </p>

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
    );
  }
);

GisaengResultCard.displayName = 'GisaengResultCard';
export default GisaengResultCard;
