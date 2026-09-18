'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';

interface Props {
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  birthTime: string;
  unknownTime: boolean;
  onTimeSelect: (displayTime: string, isUnknown: boolean) => void;
  gender: Gender;
  onGenderChange: (value: Gender) => void;
  isValid: boolean;
  error: string | null;
  onSubmit: () => void;
}

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
} as const;

export default function ZiweiInput({
  birthDate,
  onBirthDateChange,
  birthTime,
  unknownTime,
  onTimeSelect,
  gender,
  onGenderChange,
  isValid,
  error,
  onSubmit,
}: Props) {
  const primaryColor = '#9333ea';
  const inputBgColor = 'rgba(23, 15, 38, 0.65)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex flex-col justify-center items-center"
      style={{ 
        padding: '24px 16px 48px',
        fontFamily: "'JoseonLogo', serif"
      }}
    >
      {/* 1. 헤더 타이틀 */}
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-relaxed">
          정확한 명반을 위해<br />
          <span className="text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            정보를 입력해 주세요
          </span>
        </h1>
      </div>

      {/* 2. 메인 입력 카드 */}
      <motion.div
        className="w-full max-w-md flex flex-col rounded-3xl border border-purple-500/20 bg-[#120d26]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* 성별 선택 */}
        <motion.div className="flex flex-col w-full" variants={FADE_UP}>
          <FieldLabel color="#f1f5f9" fontSize="13px" marginBottom="8px">
            <span className="flex items-center gap-1.5 font-bold text-slate-100">
              <span className="text-purple-400">👤</span> 성별
            </span>
          </FieldLabel>
          <GenderSelect
            value={gender}
            onChange={onGenderChange}
            accentColor={primaryColor}
            bgColor={inputBgColor}
            fontSize="15px"
            height="48px"
            unselectedColor="#94a3b8"
            border="1px solid rgba(168, 85, 247, 0.2)"
            indicatorBoxShadow="0 0 12px rgba(147, 51, 234, 0.5)"
          />
        </motion.div>

        {/* 생년월일 입력 */}
        <motion.div className="flex flex-col w-full mt-6" variants={FADE_UP}>
          <FieldLabel color="#f1f5f9" fontSize="13px" marginBottom="8px">
            <span className="flex items-center gap-1.5 font-bold text-slate-100">
              <span className="text-purple-400">📅</span> 생년월일 (양력 기준)
            </span>
          </FieldLabel>
          <BirthInput
            value={birthDate ?? ''}
            onChange={onBirthDateChange}
            accentColor={primaryColor}
            bgColor={inputBgColor}
            borderColor="rgba(168, 85, 247, 0.2)"
            textColor="#ffffff"
            fontSize="16px"
            height="52px"
            onEnter={onSubmit}
          />
        </motion.div>

        {/* 태어난 시간 선택 */}
        <motion.div className="flex flex-col w-full mt-6" variants={FADE_UP}>
          <FieldLabel color="#f1f5f9" fontSize="13px" marginBottom="8px">
            <span className="flex items-center gap-1.5 font-bold text-slate-100">
              <span className="text-purple-400">⏰</span> 태어난 시간{' '}
              <span className="text-purple-300/80 font-normal text-xs ml-1">
                (시간 필수)
              </span>
            </span>
          </FieldLabel>
          <TimeSelectSheet
            value={birthTime}
            unknownTime={unknownTime}
            onSelect={onTimeSelect}
            accentColor={primaryColor}
            bgColor={inputBgColor}
            borderColor="rgba(168, 85, 247, 0.2)"
            textColor="#ffffff"
            placeholderColor="#64748b"
            sheetBgColor="#0d081e"
            sheetTextColor="#ffffff"
            dragHandleColor="rgba(255, 255, 255, 0.2)"
            selectedBgColor="rgba(147, 51, 234, 0.3)"
            selectedTextColor="#ffffff"
            fontSize="16px"
            height="52px"
            arrowColor="#c084fc"
          />
        </motion.div>

        {/* 제출 버튼 */}
        <motion.div className="mt-8" variants={FADE_UP}>
          <PressableButton
            onClick={isValid ? onSubmit : undefined}
            disabled={!isValid}
            label="명반 열어보기"
            style={{ height: '54px', fontFamily: "'JoseonLogo', serif" }}
            bgStyle={{
              background: isValid
                ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              border: isValid ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: isValid ? '0 4px 20px rgba(139, 92, 246, 0.35)' : 'none',
            }}
            hoverBackground="linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)"
            textStyle={{
              color: isValid ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '16px',
              letterSpacing: '0.01em',
              fontFamily: "'JoseonLogo', serif",
            }}
          />
        </motion.div>

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            className="mt-5 rounded-2xl p-3.5 bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs font-medium text-center flex items-center justify-center gap-1.5"
            variants={FADE_UP}
          >
            <span>⚠️</span> {error}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}