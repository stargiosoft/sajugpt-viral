'use client';

import { motion } from 'framer-motion';
import { ZIWEI_PALETTE as C } from '@/lib/ziwei-chart/theme';

export default function ZiweiAnalyzing() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '70vh', padding: '24px' }}
    >
      <div 
        className="flex items-center justify-center"
        style={{ width: '120px', height: '120px', marginBottom: '24px', backgroundColor: '#E5E7EB', borderRadius: '50%' }}
      >
        <p style={{ fontSize: '12px', color: '#6B7280' }}>로딩 Lottie 영역</p>
      </div>
      <p style={{ fontSize: '22px', fontWeight: 700, color: C.textMain, marginBottom: '8px' }}>
        명반을 조립하고 있어요
      </p>
      <p style={{ fontSize: '16px', color: C.textSub, lineHeight: '1.6' }}>
        12궁의 별자리 배치 중...
      </p>
    </motion.div>
  );
}