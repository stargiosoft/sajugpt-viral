'use client';

import { motion } from 'framer-motion';
import type { DatingStep } from '@/types/dating';

interface Props {
  phase: DatingStep;
}

const PHASE_CONFIG: Record<string, { messages: string[] }> = {
  analyzing: {
    messages: [
      '사주 데이터를 분석하고 있습니다...',
      '도화살, 홍염살 탐지 중...',
      '궁합 좋은 캐릭터를 찾고 있어요...',
      '캐릭터별 성공률 계산 중...',
    ],
  },
  preparing: {
    messages: [
      '캐릭터가 당신의 사주를 읽고 있어요...',
      '대화 시나리오 준비 중...',
      '선택지를 만들고 있어요...',
      '호감도 기준을 설정하는 중...',
    ],
  },
  calculating: {
    messages: [
      '캐릭터가 점수를 매기고 있어요...',
      '전체 유저 등수를 계산하는 중...',
      '같은 사주 유저와 비교 중...',
      '팩폭 코멘트 작성 중...',
    ],
  },
};

export default function DatingAnalyzing({ phase }: Props) {
  const config = PHASE_CONFIG[phase] ?? PHASE_CONFIG.analyzing;

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '60vh', padding: '0 24px' }}
    >
      {/* 펄싱 링 — 색기 배틀 AnalyzingScreen 동일 패턴 */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '3px solid #7A38D8',
          marginBottom: '32px',
        }}
      />

      {/* 순차 등장 메시지 */}
      {config.messages.map((msg, i) => (
        <motion.p
          key={`${phase}-${i}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.6, duration: 0.4 }}
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            color: '#666',
            marginBottom: '8px',
            textAlign: 'center',
            letterSpacing: '-0.3px',
          }}
        >
          {msg}
        </motion.p>
      ))}
    </div>
  );
}
