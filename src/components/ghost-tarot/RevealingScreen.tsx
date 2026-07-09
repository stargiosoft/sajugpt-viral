'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GhostCardData, GhostResult } from '@/types/ghost-tarot';

interface Props {
  card: GhostCardData;
  result: GhostResult;
  onComplete: () => void;
}

export default function RevealingScreen({ card, result, onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle, #32134f 0%, #08050c 65%, #000)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 영혼 빛 */}
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.7, 0.2], }}
        transition={{ duration: 2, repeat: Infinity, }}
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #9333ea, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 카드 */}
      <motion.div
        initial={{ scale: 0.2, y: 150, rotate: 20, opacity: 0, }}
        animate={{ scale: 1, y: 0, rotate: [0, -8, 8, -5, 5, 0], opacity: 1, }}
        transition={{ duration: 1.4, }}
        style={{
          width: 170,
          height: 260,
          borderRadius: 20,
          background: 'linear-gradient(145deg, #090510, #241236)',
          border: '1px solid #a855f7',
          boxShadow: '0 0 60px rgba(168, 85, 247, 0.7)',
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* 카드 문양 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear',}}
          style={{
            position: 'absolute',
            inset: 30,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />

        {/* 눈 */}
        <motion.div
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 0.8, repeat: Infinity, }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 80,
            filter: 'drop-shadow(0 0 30px #c084fc)',
          }}
        >
          👁
        </motion.div>
      </motion.div>

      {/* 카드 이름 */}
      <motion.h2
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)',}}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)',}}
        transition={{ delay: 2.2, duration: 1, }}
        style={{
          marginTop: 45,
          color: '#fff',
          fontSize: 36,
          fontWeight: 900,
          textShadow: '0 0 20px #a855f7',
          letterSpacing: '-1px',
        }}
      >
        {card.card_name}
      </motion.h2>

      {/* 7월 운명의 제목 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        style={{
          marginTop: 15,
          color: '#ddd6fe',
          fontSize: 16,
          textAlign: 'center',
          lineHeight: 1.8,
          padding: '0 40px',
        }}
      >
        {result.july_title}
      </motion.p>

      {/* 의식 진행 */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, }}
        style={{
          marginTop: 60,
          color: '#a78bfa',
          fontSize: 14,
          letterSpacing: '1px',
        }}
      >
        어둠 속의 존재가 깨어나고 있습니다...
      </motion.div>
    </motion.div>
  );
}