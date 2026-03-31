'use client';

import { motion } from 'framer-motion';
import { ANALYZING_MESSAGES } from '@/constants/court';

export default function CourtAnalyzing() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ minHeight: '60vh', padding: '0 24px' }}
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '2px solid rgba(122, 56, 216, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        <span style={{ fontSize: '40px' }}>⚖️</span>
      </motion.div>

      {ANALYZING_MESSAGES.map((msg, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.6, duration: 0.4 }}
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#6B5C85',
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
