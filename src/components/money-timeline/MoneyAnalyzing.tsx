'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONEY_COLORS as C } from '@/constants/moneyTimelineTheme';

const LOADING_TYPE_IMAGES = [
  '/money-timeline/loading-types/relationship.png',
  '/money-timeline/loading-types/expert.png',
  '/money-timeline/loading-types/safety.png',
  '/money-timeline/loading-types/idea.png',
  '/money-timeline/loading-types/asset.png',
];

export default function MoneyAnalyzing() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % LOADING_TYPE_IMAGES.length);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '70vh', padding: '24px' }}
    >
      <div style={{ width: '190px', height: '190px', marginBottom: '16px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={LOADING_TYPE_IMAGES[index]}
            alt=""
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0 }}
          />
        </AnimatePresence>
      </div>
      <p style={{ fontSize: '22px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>
        대운을 분석하고 있어요
      </p>
      <p style={{ fontSize: '16px', color: C.textSecondary, lineHeight: '1.6' }}>
        평생 재물운 그래프를 그리는 중...
      </p>
    </motion.div>
  );
}
