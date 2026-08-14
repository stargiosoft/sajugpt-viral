'use client';

import { motion } from 'framer-motion';
import { GENIUS_COLORS as C } from '@/constants/shinsalGeniusTheme';

export default function GeniusAnalyzing() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '70vh', padding: '24px' }}
    >
      <div style={{ width: '160px', height: '160px', marginBottom: '24px', backgroundColor: C.panelBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}` }}>
        <span style={{ color: C.textTertiary }}>[로딩 엑박]</span>
      </div>
      <p style={{ fontSize: '22px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>
        사주 원국 스캔 중
      </p>
      <p style={{ fontSize: '15px', color: C.textSecondary, lineHeight: '1.6' }}>
        내면에 숨겨진 특수 기운을 탐지하고 있습니다...
      </p>
    </motion.div>
  );
}