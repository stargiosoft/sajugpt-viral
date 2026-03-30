'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/dating';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import BirthTimeInput from '@/components/BirthTimeInput';

interface Props {
  birthDate: string;
  setBirthDate: (v: string) => void;
  birthTime: string;
  setBirthTime: (v: string) => void;
  unknownTime: boolean;
  setUnknownTime: (v: boolean) => void;
  gender: Gender;
  setGender: (v: Gender) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}

export default function DatingInput({
  birthDate,
  setBirthDate,
  birthTime,
  setBirthTime,
  unknownTime,
  setUnknownTime,
  gender,
  setGender,
  onSubmit,
  submitting,
  error,
}: Props) {
  const isValid = birthDate.length === 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col px-6 pt-12 pb-[140px]"
    >
      <h2
        className="mb-8"
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: '28px',
          letterSpacing: '-0.4px',
          color: '#1a1a1a',
        }}
      >
        사주 정보를 입력해주세요
      </h2>

      <div className="flex flex-col gap-6">
        <GenderSelect value={gender} onChange={setGender} />

        <BirthInput value={birthDate} onChange={setBirthDate} />

        <BirthTimeInput
          value={birthTime}
          onChange={setBirthTime}
          unknownTime={unknownTime}
          onUnknownTimeToggle={() => setUnknownTime(!unknownTime)}
        />
      </div>

      {error && (
        <p
          className="mt-4"
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '13px',
            fontWeight: 400,
            color: '#FF4444',
          }}
        >
          {error}
        </p>
      )}

      {/* 하단 고정 CTA */}
      <div className="mt-auto pt-8">
        <button
          onClick={onSubmit}
          disabled={!isValid || submitting}
          className="w-full rounded-2xl py-4 active:scale-[0.98] disabled:opacity-40"
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
          {submitting ? '분석 중...' : '사주 분석하기'}
        </button>
      </div>
    </motion.div>
  );
}
