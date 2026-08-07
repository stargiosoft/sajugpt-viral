'use client';

import { motion } from 'framer-motion';
import { COUPLE_COLORS as C } from '@/constants/coupleGuideTheme';

interface Props {
  /** 겉궁합 점수, 예: 71 */
  score: number;
  /** 예: '겉궁합' - 다른 궁합 지표를 추가하게 되면 라벨만 바꿔서 재사용 */
  label?: string;
}

export default function ScoreHeader({ score, label = '겉궁합' }: Props) {
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div className="flex flex-col items-center" style={{ padding: '8px 0 4px' }}>
      <span style={{ fontSize: '14px', fontWeight: 600, color: C.primary }}>{label} 점수</span>

      <div style={{ position: 'relative', width: '140px', height: '140px', marginTop: '10px' }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r="62" fill="none" stroke={C.primaryDim} strokeWidth="12" />
          <motion.circle
            cx="70"
            cy="70"
            r="62"
            fill="none"
            stroke={C.primary}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 62}
            initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 62 * (1 - clamped / 100) }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{ fontSize: '32px', fontWeight: 800, color: C.text }}
          >
            {Math.round(score)}
            <span style={{ fontSize: '16px', fontWeight: 600, color: C.textTertiary }}>점</span>
          </motion.span>
        </div>
      </div>
    </div>
  );
}