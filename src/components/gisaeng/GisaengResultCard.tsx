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
        className="rounded-3xl overflow-hidden transform-gpu"
        style={{
          backgroundColor: '#FAF8FC',
          border: '1px solid #e7e7e7',
          padding: '24px',
        }}
      >
        {/* 헤더 */}
        <p className="text-center" style={{ fontSize: '12px', color: '#848484', letterSpacing: '2px', fontWeight: 500 }}>
          ✦ 기생 최종 성적표 ✦
        </p>

        {/* 기생 정보 */}
        <div className="text-center mt-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: '#EDE5F7', fontSize: '28px' }}
          >
            {typeInfo.emoji}
          </div>
          <p style={{ fontSize: '16px', color: '#151515', fontWeight: 700, marginTop: '8px', letterSpacing: '-0.32px' }}>
            {gisaengCard.gisaengName}
          </p>
          <p style={{ fontSize: '13px', color: '#7A38D8', fontWeight: 600, letterSpacing: '-0.26px' }}>
            {typeInfo.typeName} ({typeInfo.hanja})
          </p>
        </div>

        {/* 티어 배지 */}
        <div className="text-center mt-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: '#F7F2FA', border: '1px solid #EDE5F7' }}
          >
            <span style={{ fontSize: '22px', color: '#7A38D8', fontWeight: 800 }}>
              {simulation.tier}
            </span>
            <span style={{ fontSize: '13px', color: '#7A38D8', fontWeight: 600, letterSpacing: '-0.26px' }}>
              {tierInfo.label}
            </span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="my-5" style={{ borderTop: '1px solid #e7e7e7' }}>
          <p className="text-center -mt-2.5">
            <span className="px-3" style={{ backgroundColor: '#FAF8FC', fontSize: '11px', color: '#848484' }}>
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
                style={{ backgroundColor: '#f9f9f9', border: '1px solid #e7e7e7', opacity: state.alive ? 1 : 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '14px' }}>{info.emoji}</span>
                    <span style={{ fontSize: '13px', color: '#151515', fontWeight: 600, letterSpacing: '-0.26px' }}>{info.name}</span>
                    <span style={{ fontSize: '11px', color: '#848484' }}>({info.title})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '12px', color: '#FF6B9D' }}>♥ {state.loyalty}</span>
                    <span style={{ fontSize: '12px', color: '#F59E0B' }}>👁 {state.suspicion}</span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#848484', marginTop: '4px', fontStyle: 'italic', letterSpacing: '-0.24px' }}>
                  → {comment}
                </p>
              </div>
            );
          })}
        </div>

        {/* 월 급여 결산 */}
        <div className="my-5" style={{ borderTop: '1px solid #e7e7e7' }}>
          <p className="text-center -mt-2.5">
            <span className="px-3" style={{ backgroundColor: '#FAF8FC', fontSize: '11px', color: '#848484' }}>
              월 급여 결산
            </span>
          </p>
        </div>

        <div className="text-center">
          <p style={{ fontSize: '14px', color: '#848484', letterSpacing: '-0.28px' }}>💰 월 수입</p>
          <p style={{ fontSize: '32px', color: '#7A38D8', fontWeight: 800, marginTop: '4px', letterSpacing: '-0.64px' }}>
            {simulation.monthlySalary.toLocaleString()}냥
          </p>
          <p style={{ fontSize: '14px', color: '#6B2FC2', marginTop: '2px', letterSpacing: '-0.28px' }}>
            💴 현재 가치: 약 {(simulation.modernValue / 10000).toLocaleString()}만원
          </p>
        </div>

        {/* 바람끼력 변동 */}
        <div className="text-center mt-4">
          <p style={{ fontSize: '12px', color: '#848484', letterSpacing: '-0.24px' }}>
            🔥 바람끼력: {gisaengCard.totalCharm} → {simulation.totalCharmAfter}
            {simulation.totalCharmAfter > gisaengCard.totalCharm && (
              <span style={{ color: '#16a34a' }}>
                {' '}(+{simulation.totalCharmAfter - gisaengCard.totalCharm})
              </span>
            )}
          </p>
        </div>

        {/* 최종 서사 */}
        <div
          className="rounded-xl p-4 mt-5"
          style={{ backgroundColor: '#F7F2FA' }}
        >
          <p style={{ fontSize: '14px', color: '#525252', lineHeight: 1.7, textAlign: 'center', letterSpacing: '-0.28px' }}>
            &ldquo;{simulation.finalNarrative}&rdquo;
          </p>
        </div>

        {/* 워터마크 */}
        <p className="text-center mt-4" style={{ fontSize: '11px', color: '#b7b7b7' }}>
          ── sajugpt.co.kr ──
        </p>
      </div>
    );
  }
);

GisaengResultCard.displayName = 'GisaengResultCard';
export default GisaengResultCard;
