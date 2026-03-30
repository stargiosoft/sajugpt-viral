'use client';

import { forwardRef } from 'react';
import type { GisaengCard, SimulationResult, SeonbiType } from '@/types/gisaeng';
import { GISAENG_TYPES, SEONBI_INFO, TIER_INFO } from '@/constants/gisaeng';

interface Props {
  gisaengCard: GisaengCard;
  simulation: SimulationResult;
}

const GisaengResultCard = forwardRef<HTMLDivElement, Props>(
  ({ gisaengCard, simulation }, ref) => {
    const typeInfo = GISAENG_TYPES[gisaengCard.type];
    const tierInfo = TIER_INFO[simulation.tier];
    const seonbiTypes: SeonbiType[] = ['kwonryeok', 'romantic', 'jealousy'];

    return (
      <div
        ref={ref}
        className="rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(170deg, #0D0B1A 0%, ${typeInfo.gradientFrom}15 50%, #0D0B1A 100%)`,
          border: `1px solid ${typeInfo.gradientFrom}33`,
          padding: '24px',
        }}
      >
        {/* 헤더 */}
        <p className="text-center" style={{ fontSize: '12px', color: '#9CA3AF', letterSpacing: '2px', fontWeight: 500 }}>
          ✦ 기생 최종 성적표 ✦
        </p>

        {/* 기생 정보 */}
        <div className="text-center mt-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: `linear-gradient(135deg, ${typeInfo.gradientFrom}, ${typeInfo.gradientTo})`, fontSize: '28px' }}
          >
            {typeInfo.emoji}
          </div>
          <p style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 700, marginTop: '8px' }}>
            {gisaengCard.gisaengName}
          </p>
          <p style={{ fontSize: '13px', color: typeInfo.gradientFrom, fontWeight: 600 }}>
            {typeInfo.typeName} ({typeInfo.hanja})
          </p>
        </div>

        {/* 티어 배지 */}
        <div className="text-center mt-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: `${tierInfo.color}22`, border: `1px solid ${tierInfo.color}44` }}
          >
            <span style={{ fontSize: '22px', color: tierInfo.color, fontWeight: 800 }}>
              {simulation.tier}
            </span>
            <span style={{ fontSize: '13px', color: tierInfo.color, fontWeight: 600 }}>
              {tierInfo.label}
            </span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="my-5" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-center -mt-2.5">
            <span className="px-3" style={{ backgroundColor: '#0D0B1A', fontSize: '11px', color: '#6B7280' }}>
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
                className="rounded-xl p-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', opacity: state.alive ? 1 : 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '14px' }}>{info.emoji}</span>
                    <span style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>{info.name}</span>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>({info.title})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '12px', color: '#FF6B9D' }}>♥ {state.loyalty}</span>
                    <span style={{ fontSize: '12px', color: '#F59E0B' }}>👁 {state.suspicion}</span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', fontStyle: 'italic' }}>
                  → {comment}
                </p>
              </div>
            );
          })}
        </div>

        {/* 월 급여 결산 */}
        <div className="my-5" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-center -mt-2.5">
            <span className="px-3" style={{ backgroundColor: '#0D0B1A', fontSize: '11px', color: '#6B7280' }}>
              월 급여 결산
            </span>
          </p>
        </div>

        <div className="text-center">
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>💰 월 수입</p>
          <p style={{ fontSize: '32px', color: '#FFD700', fontWeight: 800, marginTop: '4px' }}>
            {simulation.monthlySalary.toLocaleString()}냥
          </p>
          <p style={{ fontSize: '14px', color: '#A78BFA', marginTop: '2px' }}>
            💴 현재 가치: 약 {(simulation.modernValue / 10000).toLocaleString()}만원
          </p>
        </div>

        {/* 바람끼력 변동 */}
        <div className="text-center mt-4">
          <p style={{ fontSize: '12px', color: '#6B7280' }}>
            🔥 바람끼력: {gisaengCard.totalCharm} → {simulation.totalCharmAfter}
            {simulation.totalCharmAfter > gisaengCard.totalCharm && (
              <span style={{ color: '#22C55E' }}>
                {' '}(+{simulation.totalCharmAfter - gisaengCard.totalCharm})
              </span>
            )}
          </p>
        </div>

        {/* 최종 서사 */}
        <div
          className="rounded-xl p-4 mt-5"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <p style={{ fontSize: '14px', color: '#E5E7EB', lineHeight: 1.7, textAlign: 'center' }}>
            &ldquo;{simulation.finalNarrative}&rdquo;
          </p>
        </div>

        {/* 워터마크 */}
        <p className="text-center mt-4" style={{ fontSize: '11px', color: '#4B5563' }}>
          ── nadaunse.com/gisaeng ──
        </p>
      </div>
    );
  }
);

GisaengResultCard.displayName = 'GisaengResultCard';
export default GisaengResultCard;
