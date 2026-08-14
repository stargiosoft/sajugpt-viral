'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { GENIUS_COLORS as C, FADE_UP } from '@/constants/shinsalGeniusTheme';
import type { ShinsalGeniusResult } from '@/types/shinsal-series';

interface Props {
  result: ShinsalGeniusResult;
}

const GeniusResultCard = forwardRef<HTMLDivElement, Props>(({ result }, ref) => {
  const { saju, crazyScore, summary, conditions } = result;

  return (
    <motion.div
      ref={ref}
      className="transform-gpu flex flex-col gap-6"
      style={{ backgroundColor: C.panelBg, borderRadius: '24px', padding: '24px 16px', border: `1px solid ${C.border}` }}
    >
      {/* 1. 요약 타이틀 */}
      <motion.div variants={FADE_UP} style={{ textAlign: 'center' }}>
        <p style={{ color: C.textSecondary, fontSize: '14px', marginBottom: '8px' }}>당신의 똘끼 지수는</p>
        <div style={{ fontSize: '64px', fontWeight: 900, color: C.accent, lineHeight: 1 }}>{crazyScore}<span style={{ fontSize: '24px' }}>%</span></div>
        <p style={{ fontSize: '15px', color: C.text, marginTop: '16px' }}>"{summary}"</p>
      </motion.div>

      <div style={{ borderTop: `1px dashed ${C.border}` }} />

      {/* 2. 만세력 8글자 뷰 */}
      <motion.div variants={FADE_UP}>
        <div style={{ textAlign: 'center', fontSize: '14px', color: C.textSecondary, marginBottom: '12px' }}>[ 스캔된 사주 원국 ]</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', backgroundColor: C.cardBg, padding: '16px', borderRadius: '16px' }}>
          <div style={{ color: C.textTertiary, fontSize: '12px' }}>시주</div>
          <div style={{ color: C.textTertiary, fontSize: '12px' }}>일주</div>
          <div style={{ color: C.textTertiary, fontSize: '12px' }}>월주</div>
          <div style={{ color: C.textTertiary, fontSize: '12px' }}>년주</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{saju.time[0]}</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{saju.day[0]}</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{saju.month[0]}</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{saju.year[0]}</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{saju.time[1]}</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{saju.day[1]}</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{saju.month[1]}</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{saju.year[1]}</div>
        </div>
      </motion.div>

      <div style={{ borderTop: `1px dashed ${C.border}` }} />

      {/* 3. 5가지 조건 상세 리포트 */}
      <motion.div variants={FADE_UP} className="flex flex-col gap-3">
        <h3 style={{ fontSize: '16px', fontWeight: 700, paddingLeft: '4px', marginBottom: '8px' }}>천재성 발현 요소 체크</h3>
        {conditions.map((shinsal, idx) => (
          <div key={idx} style={{ backgroundColor: C.cardBg, borderRadius: '16px', padding: '16px', border: `1px solid ${shinsal.exists ? C.accent : C.border}`, opacity: shinsal.exists ? 1 : 0.4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: shinsal.exists ? '12px' : '0' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: shinsal.exists ? C.accent : C.textTertiary }}>{shinsal.name}</span>
              <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '8px', backgroundColor: shinsal.exists ? `${C.accent}33` : 'transparent', color: shinsal.exists ? '#E9D5FF' : C.textTertiary }}>
                {shinsal.exists ? '활성화됨' : '발견 안 됨'}
              </span>
            </div>
            {shinsal.exists && (
              <>
                <p style={{ fontSize: '13px', color: '#E9D5FF', marginBottom: '6px' }}>{shinsal.keyword}</p>
                <p style={{ fontSize: '13px', color: C.textSecondary, lineHeight: '1.5' }}>{shinsal.description}</p>
              </>
            )}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
});

GeniusResultCard.displayName = 'GeniusResultCard';
export default GeniusResultCard;