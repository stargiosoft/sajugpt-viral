'use client';

import { motion } from 'framer-motion';
import { ElementIcon, ELEMENT_ORDER } from './icons';
import { OHENG_COLORS as C } from '@/constants/ohengTheme';

function ElementDotLoader() {
  return (
    <div style={{ display: 'flex', gap: '14px' }}>
      {ELEMENT_ORDER.map((key, i) => (
        <motion.div
          key={key}
          animate={{ y: [0, -18, 0], scale: [1, 1.12, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.3,
            ease: 'easeInOut',
            delay: i * 0.14,
          }}
        >
          <ElementIcon elementKey={key} size={44} />
        </motion.div>
      ))}
    </div>
  );
}

export default function AnalyzingScreen() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 52px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      <ElementDotLoader />

      <h2 style={{ marginTop: '36px', fontSize: '22px', fontWeight: 800, color: C.text, lineHeight: 1.5 }}>
        분석중..
      </h2>
    </div>
  );
}
