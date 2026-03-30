'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterAvatar from './CharacterAvatar';
import { CHARACTERS } from '@/constants/characters';

const LINES = [
  '…잠깐.',
  '다들 나갔어?',
  '좋아. 솔직히 말할게.',
  '난 이런 백지가 더 자극적이더라.',
  '아무 색도 없는 사주. 내가 직접 물들여볼까.',
];

interface Props {
  onComplete: () => void;
}

export default function CutScene({ onComplete }: Props) {
  const [lineIndex, setLineIndex] = useState(-1);
  const [glitch, setGlitch] = useState(true);
  const yoon = CHARACTERS[0]; // 윤태산

  useEffect(() => {
    // 글리치 후 대사 순차 표시
    const glitchTimer = setTimeout(() => {
      setGlitch(false);
      setLineIndex(0);
    }, 1500);

    return () => clearTimeout(glitchTimer);
  }, []);

  useEffect(() => {
    if (lineIndex >= 0 && lineIndex < LINES.length - 1) {
      const timer = setTimeout(() => setLineIndex(i => i + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [lineIndex]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ padding: '40px 20px', minHeight: '50vh' }}
    >
      {/* 글리치 이펙트 */}
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3, 1, 0], x: [0, -5, 5, -3, 0] }}
            transition={{ duration: 1.5 }}
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#FF4444',
              textAlign: 'center',
            }}
          >
            ⚡ 시스템 오류 ⚡
          </motion.div>
        )}
      </AnimatePresence>

      {/* 윤태산 프로필 */}
      {!glitch && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="flex flex-col items-center gap-4"
        >
          <CharacterAvatar src={yoon.thumbnail} name={yoon.name} size={80} />
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#FF4444' }}>
            {yoon.name}
          </span>

          {/* 대사 */}
          <div
            className="flex flex-col gap-2"
            style={{
              backgroundColor: '#1e1e32',
              borderRadius: '16px',
              padding: '20px',
              maxWidth: '320px',
              width: '100%',
            }}
          >
            {LINES.slice(0, lineIndex + 1).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#eee',
                  lineHeight: '1.6',
                }}
              >
                "{line}"
              </motion.p>
            ))}
          </div>

          {/* CTA */}
          {lineIndex >= LINES.length - 1 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={onComplete}
              style={{
                marginTop: '16px',
                height: '56px',
                width: '100%',
                maxWidth: '320px',
                borderRadius: '16px',
                backgroundColor: '#FF4444',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              이 건방진 짐승남 기강 잡으러 가기
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
