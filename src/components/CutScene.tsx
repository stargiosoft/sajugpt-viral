'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterAvatar from './CharacterAvatar';
import { CHARACTERS } from '@/constants/characters';

const LINES = [
  '…어, 잠깐.',
  '페로몬 판정 다시 봐봐.',
  '짐승남 0명에 등급 CUT?',
  '근데 이런 무자극 사주가 나한텐 더 자극적인데.',
  '아무 색도 없는 사주. 내가 직접 물들여볼까.',
];

const TYPING_MS = 550;
const GAP_MS = 550;

interface Props {
  onComplete: () => void;
}

function TypingDot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay }}
      style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.45)',
        display: 'inline-block',
      }}
    />
  );
}

export default function CutScene({ onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [glitch, setGlitch] = useState(true);
  const yoon = CHARACTERS[0]; // 윤태산

  useEffect(() => {
    // 글리치 후 대사 순차 표시
    const glitchTimer = setTimeout(() => {
      setGlitch(false);
    }, 1500);

    return () => clearTimeout(glitchTimer);
  }, []);

  useEffect(() => {
    if (glitch || visibleCount >= LINES.length) return;

    setIsTyping(false);
    const startTyping = setTimeout(() => setIsTyping(true), GAP_MS);
    const reveal = setTimeout(() => {
      setIsTyping(false);
      setVisibleCount(v => v + 1);
    }, GAP_MS + TYPING_MS);

    return () => {
      clearTimeout(startTyping);
      clearTimeout(reveal);
    };
  }, [glitch, visibleCount]);

  return (
    <div
      className="flex flex-col items-center"
      style={{ padding: '40px 20px', minHeight: '50vh' }}
    >
      {/* 글리치 이펙트 */}
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3, 1, 0], x: [0, -5, 5, -3, 0] }}
            transition={{ duration: 1.5 }}
            className="flex items-center justify-center gap-2"
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#FF4438',
              textAlign: 'center',
            }}
          >
            <img src="/thunder.svg" alt="" width={24} height={24} />
            시스템 오류
            <img src="/thunder.svg" alt="" width={24} height={24} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 윤태산 프로필 */}
      {!glitch && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="flex flex-col items-center w-full"
        >
          <div style={{ marginBottom: '16px' }}>
            <CharacterAvatar src={yoon.thumbnail} name={yoon.name} size={80} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#FF4438', marginBottom: '44px' }}>
            {yoon.name}
          </span>

          {/* 대사 — 가운데 정렬된 챗 버블. 타이핑 점과 텍스트를 같은 key의 같은 버블로 취급해 점→텍스트로 자연스럽게 모양이 바뀌도록 함 */}
          <div className="flex flex-col items-center gap-[10px] w-full max-w-[400px] md:max-w-[520px] lg:max-w-[620px]">
            <AnimatePresence initial={false}>
              {Array.from({ length: visibleCount + (isTyping ? 1 : 0) }).map((_, i) => {
                const isCurrentlyTyping = isTyping && i === visibleCount;
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderRadius: '14px',
                      padding: isCurrentlyTyping ? '12px 16px' : '10px 14px',
                      fontSize: '15px',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: '1.5',
                      textAlign: 'center',
                      maxWidth: 'min(92%, 560px)',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {isCurrentlyTyping ? (
                      <div className="flex" style={{ gap: '4px', marginTop: '4px' }}>
                        <TypingDot delay={0} />
                        <TypingDot delay={0.15} />
                        <TypingDot delay={0.3} />
                      </div>
                    ) : (
                      LINES[i]
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* CTA — 시작하기 버튼과 동일한 호버/프레스 피드백 */}
          {visibleCount >= LINES.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="w-full max-w-[400px] md:max-w-[520px] lg:max-w-[620px]"
              style={{ marginTop: '48px' }}
            >
              <motion.button
                onClick={onComplete}
                whileHover={{ filter: 'brightness(1.08)' }}
                whileTap={{ filter: 'brightness(0.92)', scale: 0.995 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full transform-gpu"
                style={{
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#FF4438',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                이 건방진 짐승남 기강 잡으러 가기
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
