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
      className="flex-1 flex flex-col px-5 pt-8 pb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      {/* 카드 */}
      <div
        className="rounded-3xl p-6 flex flex-col gap-5"
        style={{
          background: `linear-gradient(145deg, ${typeInfo.gradientFrom}22, ${typeInfo.gradientTo}11)`,
          border: `1px solid ${typeInfo.gradientFrom}44`,
        }}
      >
        {/* 헤더 */}
        <div className="text-center">
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500, letterSpacing: '2px' }}>
            ✦ 나의 기생 카드 ✦
          </p>
        </div>

        {/* 유형 아이콘 + 이름 */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${typeInfo.gradientFrom}, ${typeInfo.gradientTo})`,
              fontSize: '36px',
            }}
          >
            {typeInfo.emoji}
          </div>
          <div className="text-center">
            <p style={{ fontSize: '18px', color: '#FFFFFF', fontWeight: 700 }}>
              기명: {gisaengCard.gisaengName}
            </p>
            <p style={{ fontSize: '14px', color: typeInfo.gradientFrom, fontWeight: 600, marginTop: '4px' }}>
              {typeInfo.typeName} ({typeInfo.hanja}) — {typeInfo.typeSubtitle}
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
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
              color={typeInfo.gradientFrom}
            />
          ))}
        </div>

        {/* 살 정보 */}
        <div className="flex gap-3 justify-center">
          {gisaengCard.doHwaSal && (
            <span className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255, 71, 87, 0.2)', color: '#FF6B6B', fontSize: '12px', fontWeight: 600 }}>
              🔥 도화살 보유
            </span>
          )}
          {gisaengCard.hongYeomSal && (
            <span className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255, 71, 87, 0.2)', color: '#FF6B6B', fontSize: '12px', fontWeight: 600 }}>
              💀 홍염살 보유
            </span>
          )}
          {!gisaengCard.doHwaSal && !gisaengCard.hongYeomSal && (
            <span className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(156, 163, 175, 0.2)', color: '#9CA3AF', fontSize: '12px' }}>
              살 없음
            </span>
          )}
        </div>

        {/* 총 바람끼력 */}
        <div className="text-center">
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>총 바람끼력</p>
          <p style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 800 }}>
            {gisaengCard.totalCharm} <span style={{ fontSize: '16px', color: '#6B7280' }}>/ 500</span>
          </p>
        </div>

        {/* 서사 */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.8 }}>
            {gisaengCard.narrative}
          </p>
        </div>

        {/* 한 줄 평가 */}
        <p className="text-center" style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.6 }}>
          {gisaengCard.assessment}
        </p>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl mt-6 active:scale-[0.98] transition-transform"
        style={{ backgroundColor: '#7A38D8', color: '#FFFFFF', fontSize: '16px', fontWeight: 700 }}
      >
        선비 3명 만나러 가기 ⚔️
      </button>
    </motion.div>
  );
}
