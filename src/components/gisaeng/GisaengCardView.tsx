'use client';

import { motion } from 'framer-motion';
import type { GisaengCard } from '@/types/gisaeng';
import { GISAENG_TYPES, STAT_LABELS } from '@/constants/gisaeng';
import StatBar from './StatBar';

interface Props {
  gisaengCard: GisaengCard;
  onNext: () => void;
}

export default function GisaengCardView({ gisaengCard, onNext }: Props) {
  const typeInfo = GISAENG_TYPES[gisaengCard.type];
  const stats = gisaengCard.stats;

  return (
    <motion.div
      className="flex-1 flex flex-col relative"
      style={{ paddingBottom: '140px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="px-5 pt-8">
        {/* 카드 */}
        <div
          className="rounded-3xl p-6 flex flex-col gap-5 transform-gpu overflow-hidden"
          style={{
            backgroundColor: '#FAF8FC',
            border: '1px solid #e7e7e7',
          }}
        >
          {/* 헤더 */}
          <div className="text-center">
            <p style={{ fontSize: '12px', color: '#848484', fontWeight: 500, letterSpacing: '2px' }}>
              ✦ 나의 기생 카드 ✦
            </p>
          </div>

          {/* 유형 아이콘 + 이름 */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#EDE5F7',
                fontSize: '36px',
              }}
            >
              {typeInfo.emoji}
            </div>
            <div className="text-center">
              <p style={{ fontSize: '18px', color: '#151515', fontWeight: 700, letterSpacing: '-0.36px' }}>
                기명: {gisaengCard.gisaengName}
              </p>
              <p style={{ fontSize: '14px', color: '#7A38D8', fontWeight: 600, marginTop: '4px', letterSpacing: '-0.28px' }}>
                {typeInfo.typeName} ({typeInfo.hanja}) — {typeInfo.typeSubtitle}
              </p>
              <p style={{ fontSize: '13px', color: '#848484', marginTop: '4px', letterSpacing: '-0.26px' }}>
                등급: {gisaengCard.tier}
              </p>
            </div>
          </div>

          {/* 능력치 바 */}
          <div className="flex flex-col gap-2.5">
            {(Object.keys(stats) as (keyof typeof stats)[]).map(key => (
              <StatBar
                key={key}
                label={STAT_LABELS[key]}
                value={stats[key]}
                color="#7A38D8"
              />
            ))}
          </div>

          {/* 살 정보 */}
          <div className="flex gap-3 justify-center">
            {gisaengCard.doHwaSal && (
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#fff6f7', color: '#ef6878', fontSize: '12px', fontWeight: 600 }}>
                🔥 도화살 보유
              </span>
            )}
            {gisaengCard.hongYeomSal && (
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#fff6f7', color: '#ef6878', fontSize: '12px', fontWeight: 600 }}>
                💀 홍염살 보유
              </span>
            )}
            {!gisaengCard.doHwaSal && !gisaengCard.hongYeomSal && (
              <span className="px-3 py-1 rounded-full" style={{ backgroundColor: '#f3f3f3', color: '#848484', fontSize: '12px' }}>
                살 없음
              </span>
            )}
          </div>

          {/* 총 바람끼력 */}
          <div className="text-center">
            <p style={{ fontSize: '13px', color: '#848484', letterSpacing: '-0.26px' }}>총 바람끼력</p>
            <p style={{ fontSize: '28px', color: '#151515', fontWeight: 800, letterSpacing: '-0.56px' }}>
              {gisaengCard.totalCharm} <span style={{ fontSize: '16px', color: '#b7b7b7' }}>/ 500</span>
            </p>
          </div>

          {/* 서사 */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#F7F2FA' }}
          >
            <p style={{ fontSize: '13px', color: '#525252', lineHeight: 1.8, letterSpacing: '-0.26px' }}>
              {gisaengCard.narrative}
            </p>
          </div>

          {/* 한 줄 평가 */}
          <p className="text-center" style={{ fontSize: '12px', color: '#848484', lineHeight: 1.6, letterSpacing: '-0.24px' }}>
            {gisaengCard.assessment}
          </p>
        </div>
      </div>

      {/* 디자인 시스템 표준 하단 고정 CTA */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px]"
        style={{ backgroundColor: '#ffffff', boxShadow: '0px -8px 16px 0px rgba(255, 255, 255, 0.76)' }}
      >
        <div style={{ padding: '12px 20px' }}>
          <button
            onClick={onNext}
            className="w-full flex items-center justify-center"
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#7A38D8',
              border: 'none',
              transition: 'all 0.15s ease',
            }}
            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
            onPointerUp={e => { e.currentTarget.style.transform = ''; }}
            onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            <span style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '25px',
              letterSpacing: '-0.32px',
              color: '#ffffff',
            }}>
              선비 3명 만나러 가기 ⚔️
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
