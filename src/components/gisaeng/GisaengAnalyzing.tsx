'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ANALYZING_MESSAGES, CALCULATING_MESSAGES } from '@/constants/gisaeng';

interface Props {
  type: 'analyzing' | 'calculating';
}

export default function GisaengAnalyzing({ type }: Props) {
  const messages = type === 'analyzing' ? ANALYZING_MESSAGES : CALCULATING_MESSAGES;
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timers = messages.map((msg, i) => {
      if (i === 0) return null;
      return setTimeout(() => setCurrentIdx(i), msg.delay);
    });
    return () => timers.forEach(t => t && clearTimeout(t));
  }, [messages]);

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 회전 아이콘 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{ fontSize: '40px', marginBottom: '24px' }}
      >
        🏮
      </motion.div>

      {/* 메시지 */}
      <motion.p
        key={currentIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '16px', color: '#E5E7EB', fontWeight: 500 }}
      >
        {messages[currentIdx].text}
      </motion.p>

      {/* 프로그레스 도트 */}
      <div className="flex gap-2 mt-6">
        {messages.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i <= currentIdx ? '24px' : '8px',
              height: '8px',
              backgroundColor: i <= currentIdx ? '#7A38D8' : '#374151',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
