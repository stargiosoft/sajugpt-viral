'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import squareShapeLoading from '@/lottie/square-shape-loading-11.json';
import { recolorLottie } from '@/lib/lottieRecolor';
import { ANALYZING_MESSAGES } from '@/constants/stock';

// 분석 시간이 길어서 메시지 하나씩 순환 반복 — 고정 목록을 한 번에 다 보여주면
// 실제 로딩이 더 길어졌을 때 마지막 메시지에서 멈춘 것처럼 보인다.
export default function StockAnalyzing() {
  const [index, setIndex] = useState(0);
  const lottieData = useMemo(() => recolorLottie(squareShapeLoading, '#7A38D8', [0.4, 0.7, 1]), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANALYZING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh', backgroundColor: '#191F28', padding: '0 24px' }}
    >
      <div style={{ width: '160px', height: '160px', marginBottom: '24px' }}>
        <Lottie animationData={lottieData} loop autoplay />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#8B95A1',
            letterSpacing: '-0.3px',
            textAlign: 'center',
          }}
        >
          {ANALYZING_MESSAGES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
