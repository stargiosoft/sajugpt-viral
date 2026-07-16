'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ElementPentagon } from './icons';

const MESSAGES = [
  '사주팔자를 펼치는 중...',
  '오행의 균형을 살피는 중...',
  '부족한 기운을 찾는 중...',
];

export default function AnalyzingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex(i => (i + 1) % MESSAGES.length);
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 52px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: '#F3E7C9',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2B2013', lineHeight: 1.5 }}>
        당신의<br />오행 분석 중...
      </h2>

      <div style={{ marginTop: '36px' }}>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ElementPentagon weakest="火" size={220} />
        </motion.div>
      </div>

      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginTop: '32px', fontSize: '15px', color: '#6B5B3A' }}
      >
        {MESSAGES[messageIndex]}
      </motion.p>
    </div>
  );
}
