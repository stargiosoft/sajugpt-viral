'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GeniusAnalyzing() {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 180);
    return () => clearInterval(timer);
  }, []);

  const totalBlocks = 16;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        minHeight: '70vh',
        padding: '24px',
        backgroundColor: '#050B07', 
        color: '#00FF66',
        fontFamily: 'monospace, sans-serif',
      }}
    >
      {/* 은은한 배경 스캔라인 효과 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* 메인 레트로 콘솔 박스 */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '340px',
          padding: '28px 24px',
          backgroundColor: '#0A140E',
          borderRadius: '16px',
          border: '2px solid #00FF66',
          boxShadow: '0 0 25px rgba(0, 255, 102, 0.25), inset 0 0 15px rgba(0, 255, 102, 0.08)',
          textAlign: 'center',
        }}
      >
        {/* 상단 타이틀 */}
        <div
          style={{
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '2px',
            color: '#00FF66',
            marginBottom: '20px',
            textShadow: '0 0 8px rgba(0, 255, 102, 0.6)',
          }}
        >
          PLEASE WAIT
        </div>

        {/* 픽셀/블록 스타일 프로그레스 바 영역 */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              padding: '0 2px',
            }}
          >
            <div style={{ display: 'flex', gap: '3px' }}>
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '10px',
                    height: '18px',
                    backgroundColor: i < filledBlocks ? '#00FF66' : '#12261A',
                    boxShadow: i < filledBlocks ? '0 0 6px rgba(0, 255, 102, 0.8)' : 'none',
                    borderRadius: '2px',
                    transition: 'background-color 0.15s ease',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#00FF66',
                minWidth: '42px',
                textAlign: 'right',
                textShadow: '0 0 6px rgba(0, 255, 102, 0.6)',
              }}
            >
              {progress}%
            </span>
          </div>
        </div>

        {/* 하단 서브 텍스트 */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: '#00CC52',
            opacity: 0.85,
            textTransform: 'uppercase',
          }}
        >
          WITTY RESPONSE LOADING
        </div>
      </motion.div>

      {/* 부가 설명 문구 (원하시는 사주 감정 맥락 유지) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginTop: '24px', textAlign: 'center', zIndex: 10 }}
      >
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#E2F8EC', marginBottom: '6px' }}>
          사주 속 천재 스탯 스캔 중
        </p>
        <p style={{ fontSize: '12px', color: '#66A380', lineHeight: '1.5' }}>
          내면에 숨겨진 천재 에너지를 탐지하고 있습니다...
        </p>
      </motion.div>
    </motion.div>
  );
}