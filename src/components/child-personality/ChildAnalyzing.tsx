'use client';

import { motion } from 'framer-motion';
import useIsNarrow from '@/hooks/useIsNarrow';

export default function ChildAnalyzing() {
  const isNarrow = useIsNarrow();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center"
        style={{ minHeight: '70vh', padding: '24px', fontFamily: "'Cafe24Surround', 'Pretendard', sans-serif" }}
      >
        <div 
          style={{ 
            fontSize: isNarrow ? '48px' : '56px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🧸
        </div>

        <p 
          style={{ 
            fontSize: isNarrow ? '21px' : '23px', 
            fontWeight: 700, 
            color: '#493C35', 
            marginBottom: '8px',
            letterSpacing: '-0.5px',
            textAlign: 'center',
          }}
        >
          우리 아이 사주를 분석하고 있어요
        </p>

        <p 
          style={{ 
            fontSize: '15px', 
            color: '#8C7D73', 
            lineHeight: '1.65',
            textAlign: 'center',
            fontFamily: "'Pretendard', sans-serif",
          }}
        >
          아이의 본질적인 성향과 맞춤 육아 팁을 찾는 중...
        </p>
      </motion.div>
    </>
  );
}