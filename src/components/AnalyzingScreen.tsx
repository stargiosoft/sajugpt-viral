'use client';

import { motion } from 'framer-motion';

const messages = [
  'AI 짐승남들이 사주를 감별하고 있습니다...',
  '도화살 검출 중...',
  '페로몬 등급 산출 중...',
  '꼬여든 짐승남 수 계산 중...',
];

export default function AnalyzingScreen() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '60vh', padding: '0 24px' }}
    >
      {/* Pulsing ring */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '3px solid #7A38D8',
          marginBottom: '32px',
        }}
      />

      {/* Sequential text */}
      {messages.map((msg, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.6, duration: 0.4 }}
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#666',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          {msg}
        </motion.p>
      ))}
    </div>
  );
}
