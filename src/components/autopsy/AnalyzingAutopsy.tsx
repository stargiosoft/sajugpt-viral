'use client';

import { motion } from 'framer-motion';
import { ANALYZING_MESSAGES } from '@/constants/autopsy';

interface Props {
  coronerName: string;
}

export default function AnalyzingAutopsy({ coronerName }: Props) {
  const messages = ANALYZING_MESSAGES.map((msg) =>
    msg.replace('검시관', `검시관 ${coronerName}`)
  );

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '40px' }}>🔬</span>
      </motion.div>

      {messages.map((msg, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.5, duration: 0.4 }}
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
