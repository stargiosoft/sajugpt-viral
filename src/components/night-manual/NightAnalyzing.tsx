'use client';

import { motion } from 'framer-motion';

const messages = [
  '사주 원국 펼치는 중...',
  '도화살·홍염살 감지 중...',
  '은밀한 체질 분석 중...',
  '시종 3명 소집 중...',
];

export default function NightAnalyzing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh', padding: '0 24px' }}
    >
      {/* Pulsing moon */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex items-center justify-center"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '2px solid #7A38D8',
          marginBottom: '32px',
        }}
      >
        <span style={{ fontSize: '40px' }}>🌙</span>
      </motion.div>

      <p style={{ fontSize: '18px', fontWeight: 700, color: '#f0e6ff', marginBottom: '24px' }}>
        밤의 장막이 내려오는 중...
      </p>

      {messages.map((msg, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.7, duration: 0.4 }}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#8b7aaa',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          {msg}
        </motion.p>
      ))}
    </motion.div>
  );
}
