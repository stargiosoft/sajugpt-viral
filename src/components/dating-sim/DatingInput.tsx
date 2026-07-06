'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Gender } from '@/types/dating';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import StickyCTAButton from '@/components/StickyCTAButton';

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

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

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
  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const [year, month, day] = birthDate.split('-').map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
    if (!birthTime && !unknownTime) return false;
    return true;
  }, [birthDate, birthTime, unknownTime]);

  const handleTimeSelect = useCallback((displayTime: string, isUnknown: boolean) => {
    setUnknownTime(isUnknown);
    setBirthTime(displayTime);
  }, [setUnknownTime, setBirthTime]);

  return (
    <motion.div
      key="input"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '48px 20px 120px' }}
    >
      {/* 헤더 — 색기 배틀 동일 패턴 */}
      <div className="flex flex-col items-center" style={{ marginBottom: '40px' }}>
        <span style={{ fontSize: '40px', marginBottom: '8px' }}>💜</span>
        <h1 style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '28px',
          fontWeight: 800,
          color: '#151515',
          marginBottom: '8px',
          textAlign: 'center',
          letterSpacing: '-0.56px',
        }}>
          데이트 시뮬레이션
        </h1>
        <p style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '15px',
          color: '#666',
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: '1.6',
          letterSpacing: '-0.45px',
        }}>
          사주 궁합 기반 AI 캐릭터와<br />5턴의 데이트 대화를 시작합니다
        </p>
      </div>

      {/* 입력 폼 — 색기 배틀 동일 패턴 */}
      <motion.div
        className="flex flex-col"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* 성별 */}
        <motion.div
          className="flex flex-col gap-1 w-full"
          variants={fadeUpVariant}
        >
          <p style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#848484',
            lineHeight: '16px',
            letterSpacing: '-0.24px',
            padding: '0 4px',
          }}>
            성별
          </p>
          <GenderSelect value={gender} onChange={setGender} />
        </motion.div>

        {/* 생년월일 */}
        <motion.div
          className="flex flex-col gap-1 w-full"
          style={{ marginTop: '36px' }}
          variants={fadeUpVariant}
        >
          <p style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#848484',
            lineHeight: '16px',
            letterSpacing: '-0.24px',
            padding: '0 4px',
          }}>
            생년월일 (양력 기준으로 입력해 주세요)
          </p>
          <BirthInput
            value={birthDate}
            onChange={setBirthDate}
            onEnter={() => { if (isFormValid() && !submitting) onSubmit(); }}
          />
        </motion.div>

        {/* 태어난 시간 */}
        <motion.div
          className="flex flex-col gap-1 w-full"
          style={{ marginTop: '36px' }}
          variants={fadeUpVariant}
        >
          <p style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#848484',
            lineHeight: '16px',
            letterSpacing: '-0.24px',
            padding: '0 4px',
          }}>
            태어난 시간
          </p>
          <TimeSelectSheet
            value={birthTime}
            unknownTime={unknownTime}
            onSelect={handleTimeSelect}
            accentColor="#7A38D8"
            bgColor="#fff"
            borderColor="1px solid #e7e7e7"
            textColor="#151515"
            placeholderColor="#b7b7b7"
          />
        </motion.div>

        {/* 에러 */}
        {error && (
          <motion.div
            className="flex gap-1 items-center"
            style={{
              marginTop: '24px',
              borderRadius: '10px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
            }}
            variants={fadeUpVariant}
          >
            <p style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              color: '#dc2626',
              fontSize: '13px',
            }}>
              {error}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* 하단 고정 CTA 버튼 — 디자인 시스템 패턴 */}
      <StickyCTAButton
        isValid={isFormValid() && !submitting}
        onClick={onSubmit}
        label={submitting ? '분석 중...' : '사주 분석하기'}
        containerBackground="#fff"
        containerBoxShadow="0px -8px 16px 0px rgba(255, 255, 255, 0.76)"
        activeBackground="#7A38D8"
        inactiveBackground="#f8f8f8"
        inactiveTextColor="#b7b7b7"
        fontWeight={500}
        lineHeight="25px"
        letterSpacing="-0.32px"
      />
    </motion.div>
  );
}
