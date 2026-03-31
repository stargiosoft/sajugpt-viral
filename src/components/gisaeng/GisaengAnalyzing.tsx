'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ANALYZING_MESSAGES, CALCULATING_MESSAGES } from '@/constants/gisaeng';

const C = {
  hanji: '#F5F0E8',
  inkMuted: '#6B5F56',
  inkFaded: '#B0A89E',
  vermillion: '#B8423A',
};

interface Props {
  type: 'analyzing' | 'calculating';
}

export default function GisaengAnalyzing({ type }: Props) {
  const messages = type === 'analyzing' ? ANALYZING_MESSAGES : CALCULATING_MESSAGES;
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setVisibleCount(1);
    const timers = messages.map((msg, i) => {
      if (i === 0) return null;
      return setTimeout(() => setVisibleCount(i + 1), msg.delay);
    });
    return () => timers.forEach(t => t && clearTimeout(t));
  }, [messages]);

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ minHeight: '100dvh', backgroundColor: C.hanji }}
    >
      {/* Pulsing ring — 화면 중앙 고정 */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: '35%' }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: `3px solid ${C.vermillion}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}
        >
          🏮
        </motion.div>
      </div>

      {/* 메시지 — 링 아래 고정 위치에서 쌓임 */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: 'calc(35% + 152px)', padding: '0 24px' }}
      >
        {messages.slice(0, visibleCount).map((msg, i) => {
          const isCurrent = i === visibleCount - 1;
          return (
            <motion.p
              key={`${type}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isCurrent ? 1 : 0.4, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize: '15px',
                fontWeight: 500,
                color: isCurrent ? C.inkMuted : C.inkFaded,
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              {msg.text}
            </motion.p>
          );
        })}
      </div>
    </div>
  );
}
