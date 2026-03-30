'use client';

import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
}

export default function DatingLanding({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col justify-center items-center px-6 pb-[140px]"
    >
      <div className="text-center mb-10">
        <div
          className="mb-4"
          style={{ fontSize: '48px', lineHeight: '1' }}
        >
          💜
        </div>
        <h1
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '32px',
            letterSpacing: '-0.48px',
            color: '#1a1a1a',
          }}
        >
          5턴 안에
          <br />
          데이트 따낼 수 있어?
        </h1>
        <p
          className="mt-3"
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: '22px',
            letterSpacing: '-0.45px',
            color: '#848484',
          }}
        >
          사주 궁합 기반 AI 캐릭터와
          <br />
          5턴의 데이트 대화를 시작합니다
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-[320px] rounded-2xl py-4 active:scale-[0.98]"
        style={{
          backgroundColor: '#7A38D8',
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '25px',
          letterSpacing: '-0.32px',
          color: '#ffffff',
          transition: 'transform 0.1s',
        }}
      >
        도전하기
      </button>

      <p
        className="mt-4"
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '12px',
          fontWeight: 400,
          color: '#b0b0b0',
        }}
      >
        가입 없이 3초 만에 시작
      </p>
    </motion.div>
  );
}
