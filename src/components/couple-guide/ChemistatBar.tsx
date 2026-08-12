'use client';

import { motion } from 'framer-motion';
import { COUPLE_COLORS as C } from '@/constants/coupleGuideTheme';
import type { ChemiStat } from '@/types/couple-guide';

interface Props extends ChemiStat {
  /** 애니메이션 시작을 늦추고 싶을 때 (여러 바를 순차 등장시킬 때 사용) */
  delay?: number;
  /** 게이지바 끝에 표시할 아이콘 이미지 경로 */
  barEndIcon?: string;
  /** 게이지바 끝 아이콘 크기 */
  barEndIconSize?: string;
}

export default function ChemiStatBar({
  label,
  value,
  color,
  caption,
  delay = 0,
  barEndIcon = '/couple-guide/icon-heart.svg',
  barEndIconSize = '16px',
}: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor = color ?? C.primary;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '4px' }}>
        <span style={{ fontSize: '16px', fontWeight: 500, color: '#000000', WebkitTextStroke: '0.2px #000000', letterSpacing: '-0.5px' }}>{label}</span>
      </div>

      {caption && (
        <p style={{ marginBottom: '6px', fontSize: '13px', color: 'rgb(96 96 96)', letterSpacing: '-0.5px' }}>{caption}</p>
      )}

      <div className="flex items-center" style={{ gap: '14px', paddingLeft: '2px' }}>
        <div
          style={{
            position: 'relative',
            flex: 1,
            height: '10px',
            borderRadius: '999px',
            backgroundColor: 'rgb(255 240 241)',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: '999px', backgroundColor: barColor, overflow: 'hidden' }}
          />
          <motion.img
            src={barEndIcon}
            alt=""
            initial={{ left: 0 }}
            animate={{ left: `${clamped}%` }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              width: barEndIconSize,
              height: barEndIconSize,
              transform: 'translate(-50%, -50%)',
              filter:
                'drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff)',
            }}
          />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 700, color: barColor, flexShrink: 0 }}>{Math.round(clamped)}%</span>
      </div>
    </div>
  );
}