'use client';

import { motion } from 'framer-motion';
import { COUPLE_COLORS as C } from '@/constants/coupleGuideTheme';
import type { ChemiStat } from '@/types/couple-guide';

interface Props extends ChemiStat {
  /** 애니메이션 시작을 늦추고 싶을 때 (여러 바를 순차 등장시킬 때 사용) */
  delay?: number;
}

export default function ChemiStatBar({ label, value, color, caption, delay = 0 }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor = color ?? C.primary;

  return (
    <div style={{ width: '100%' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: barColor }}>{Math.round(clamped)}%</span>
      </div>

      <div
        style={{
          width: '100%',
          height: '10px',
          borderRadius: '999px',
          backgroundColor: C.primaryDim,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: '999px', backgroundColor: barColor }}
        />
      </div>

      {caption && (
        <p style={{ marginTop: '6px', fontSize: '12px', color: C.textTertiary }}>{caption}</p>
      )}
    </div>
  );
}