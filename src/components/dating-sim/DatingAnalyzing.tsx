'use client';

import { motion } from 'framer-motion';
import type { DatingStep } from '@/types/dating';

interface Props {
  phase: DatingStep;
}

const MESSAGES: Record<string, { title: string; sub: string }> = {
  analyzing: {
    title: '사주 분석 중...',
    sub: '당신과 궁합이 좋은 캐릭터를 찾고 있어요',
  },
  preparing: {
    title: '대화 준비 중...',
    sub: '캐릭터가 당신의 사주를 읽고 있어요',
  },
  calculating: {
    title: '결과 계산 중...',
    sub: '캐릭터가 점수를 매기고 있어요',
  },
};

export default function DatingAnalyzing({ phase }: Props) {
  const msg = MESSAGES[phase] ?? MESSAGES.analyzing;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col justify-center items-center px-6"
    >
      {/* 펄스 애니메이션 */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className="mb-8"
        style={{ fontSize: '56px' }}
      >
        💜
      </motion.div>

      <h2
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '-0.4px',
          color: '#1a1a1a',
        }}
      >
        {msg.title}
      </h2>

      <p
        className="mt-2"
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          color: '#848484',
        }}
      >
        {msg.sub}
      </p>

      {/* 로딩 바 */}
      <div
        className="mt-8 w-48 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: '#EDE5F7' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: '#7A38D8' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
