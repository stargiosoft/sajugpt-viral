'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
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
  canSubmit: boolean;
  onSubmit: () => void;
  error: string | null;
}

export default function NightBirthInput({
  birthDate, setBirthDate,
  birthTime, setBirthTime,
  unknownTime, setUnknownTime,
  gender, setGender,
  canSubmit, onSubmit, error,
}: Props) {
  const birthTimeRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '60px 24px 120px', minHeight: '100dvh' }}
    >
      <h2
        className="text-center"
        style={{ fontSize: '22px', fontWeight: 700, color: '#f0e6ff', marginBottom: '8px' }}
      >
        마마의 사주를 펼쳐주십시오
      </h2>
      <p
        className="text-center"
        style={{ fontSize: '14px', color: '#8b7aaa', marginBottom: '32px' }}
      >
        시종들이 대기 중입니다
      </p>

      {/* 성별 */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#c4b5d9', marginBottom: '8px' }}>성별</p>
        <GenderSelect value={gender} onChange={setGender} />
      </div>

      {/* 생년월일 */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#c4b5d9', marginBottom: '8px' }}>생년월일</p>
        <BirthInput
          value={birthDate}
          onChange={setBirthDate}
          onEnter={onSubmit}
          onComplete={() => birthTimeRef.current?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      {/* 태어난 시간 */}
      <div ref={birthTimeRef} style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#c4b5d9', marginBottom: '8px' }}>태어난 시간</p>
        <BirthTimeInput
          value={birthTime}
          onChange={setBirthTime}
          unknownTime={unknownTime}
          onEnter={onSubmit}
          onUnknownTimeToggle={() => {
            const newVal = !unknownTime;
            setUnknownTime(newVal);
            if (newVal) setBirthTime('오후 12:00');
            else setBirthTime('');
          }}
        />
      </div>

      {error && (
        <p className="text-center" style={{ fontSize: '14px', color: '#fa5b4a', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {/* 제출 버튼 — 하단 고정 */}
      <div
        className="fixed left-0 right-0 bottom-0 flex justify-center"
        style={{ padding: '16px 24px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <motion.button
          whileTap={canSubmit ? { scale: 0.96 } : {}}
          onClick={canSubmit ? onSubmit : undefined}
          style={{
            width: '100%',
            maxWidth: '440px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: canSubmit ? '#7A38D8' : '#3d3055',
            border: 'none',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontSize: '17px',
            fontWeight: 700,
            color: canSubmit ? '#fff' : '#6b6080',
            letterSpacing: '-0.3px',
            transition: 'background-color 0.2s, color 0.2s',
            boxShadow: canSubmit ? '0 4px 24px rgba(122, 56, 216, 0.4)' : 'none',
          }}
        >
          사주 펼치기
        </motion.button>
      </div>
    </motion.div>
  );
}
