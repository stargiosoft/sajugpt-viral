'use client';

import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
}

export default function GisaengLanding({ onStart }: Props) {
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏮</div>

      <h1 style={{ fontSize: '26px', color: '#FFFFFF', fontWeight: 800, lineHeight: 1.4 }}>
        조선시대 기생이었다면,<br />
        <span style={{ color: '#A78BFA' }}>넌 밤새 얼마를 벌었을까?</span>
      </h1>

      <p style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '16px', lineHeight: 1.7 }}>
        사주로 기생 능력치를 뽑고<br />
        선비 3명을 동시에 관리해보세요
      </p>

      <div
        className="w-full rounded-2xl p-4 mt-8"
        style={{ backgroundColor: 'rgba(122, 56, 216, 0.1)', border: '1px solid rgba(122, 56, 216, 0.2)' }}
      >
        <div className="flex justify-between" style={{ fontSize: '13px', color: '#9CA3AF' }}>
          <span>🎭 기생 유형 6종</span>
          <span>⚔️ 선비 3명 관리</span>
          <span>💰 월급 결산</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 rounded-2xl mt-8 active:scale-[0.98] transition-transform"
        style={{ backgroundColor: '#7A38D8', color: '#FFFFFF', fontSize: '17px', fontWeight: 700 }}
      >
        내 사주로 기생 카드 뽑기
      </button>

      <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '12px' }}>
        생년월일만 있으면 됩니다 · 가입 불필요
      </p>
    </motion.div>
  );
}
