'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANALYZING_MESSAGES } from '@/constants/stock';

export default function StockAnalyzing() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= ANALYZING_MESSAGES.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0a0a14',
        padding: '0 24px',
      }}
    >
      {/* Pulsing ring + emoji */}
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
          marginBottom: '24px',
        }}
      >
        <span style={{ fontSize: '40px' }}>📈</span>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#555555',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '40px',
        }}
      >
        사주증권 리서치센터
      </motion.p>

      {/* Terminal window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '360px',
          backgroundColor: '#111118',
          borderRadius: '12px',
          border: '1px solid #1e1e2e',
          overflow: 'hidden',
        }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center gap-2"
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid #1e1e2e',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CA8A04' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#444444',
              marginLeft: '8px',
            }}
          >
            analysis.exe
          </span>
        </div>

        {/* Terminal body */}
        <div style={{ padding: '20px 16px', minHeight: '120px' }}>
          {/* Completed messages */}
          {ANALYZING_MESSAGES.slice(0, currentIndex).map((msg, i) => (
            <motion.div
              key={`done-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="flex items-center gap-2"
              style={{ marginBottom: '8px' }}
            >
              <span style={{ fontSize: '13px', color: '#059669' }}>$</span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#4ADE80',
                  lineHeight: '20px',
                  opacity: 0.4,
                }}
              >
                {msg}
              </span>
              <span style={{ fontSize: '11px', color: '#059669' }}>done</span>
            </motion.div>
          ))}

          {/* Current message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span style={{ fontSize: '13px', color: '#4ADE80' }}>$</span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#4ADE80',
                  lineHeight: '20px',
                }}
              >
                {ANALYZING_MESSAGES[currentIndex]}
              </span>
              {/* Pulsing dot */}
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#4ADE80',
                  marginLeft: '4px',
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom progress hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex items-center gap-2"
        style={{ marginTop: '32px' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: '2px solid #1e1e2e',
            borderTopColor: '#7A38D8',
          }}
        />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: '#555555',
            letterSpacing: '-0.3px',
          }}
        >
          분석에 약 10초 정도 소요됩니다
        </span>
      </motion.div>
    </div>
  );
}
