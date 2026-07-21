'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Lottie from 'lottie-react';
import petFootprint from '@/lottie/pet-footprint.json';
import { recolorLottie } from '@/lib/lottieRecolor';
import useIsNarrow from '@/hooks/useIsNarrow';

export default function DeangAnalyzing() {
  const lottieData = useMemo(() => recolorLottie(petFootprint, '#58B888'), []);
  const isNarrow = useIsNarrow();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '70vh', padding: '24px' }}
    >
      <div style={{ width: isNarrow ? '100px' : '116px', height: isNarrow ? '100px' : '116px', marginBottom: '24px' }}>
        <Lottie animationData={lottieData} loop autoplay />
      </div>
      <p style={{ fontFamily: 'Cafe24 Dongdong, sans-serif', fontSize: isNarrow ? '21px' : '23px', color: '#000000', WebkitTextStroke: '0.2px #000000', marginBottom: '8px' }}>
        사주를 분석하고 있어요
      </p>
      <p style={{ fontSize: '19px', color: 'rgb(52, 52, 52)', lineHeight: '1.65' }}>
        딱 맞는 강아지를 찾는 중...
      </p>
    </motion.div>
  );
}
