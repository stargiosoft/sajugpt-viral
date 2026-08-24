'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import useIsNarrow from '@/hooks/useIsNarrow';
import { JOB_DNA_COLORS as C, FADE_UP } from '@/constants/jobDnaTheme';

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

function CoinSlot() {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-3">
      <div
        className="rounded-full"
        style={{ width: 7, height: 7, backgroundColor: `${C.accent}55` }}
      />
      <div
        className="rounded-full"
        style={{ width: 22, height: 7, backgroundColor: `${C.accent}22`, border: `1.5px solid ${C.accent}55` }}
      />
      <div
        className="rounded-full"
        style={{ width: 7, height: 7, backgroundColor: `${C.accent}55` }}
      />
    </div>
  );
}

export default function JobDnaInput({
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
  const isNarrow = useIsNarrow();

  const handleBirthDateChange = (value: string) => {
    onBirthDateChange(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="job-dna-input-wrapper"
      style={{ 
        minHeight: '100vh', 
        backgroundColor: C.pageBg, 
        padding: '12px 12px 48px', 
      }}
    >
      {/* 상단 안내 박스 */}
      <div 
        className="flex flex-col items-center rounded-[28px] shadow-sm"
        style={{ 
          padding: '28px 32px', 
          backgroundColor: C.panelBg, 
          border: `1px solid ${C.border}` 
        }}
      >
        <CoinSlot />

        <h1
          style={{
            fontSize: isNarrow ? '24px' : '28px',
            fontWeight: 700,
            color: C.text,
            marginBottom: '4px',
            textAlign: 'center',
            letterSpacing: '-0.52px',
          }}
        >
          내 사주에 맞는 직업은?
        </h1>
        <p
          style={{
            fontSize: isNarrow ? '14px' : '15px',
            color: C.textTertiary,
            fontWeight: 400,
            textAlign: 'center',
            lineHeight: '1.6',
            whiteSpace: 'nowrap',
          }}
        >
          생년월일시로 나와 가장 잘 맞는 직업 DNA를 찾아보세요
        </p>
      </div>

      {/* 입력 폼 영역 박스 */}
      <div style={{ marginTop: '12px' }}>
        <div 
          className="flex flex-col rounded-[28px] shadow-sm"
          style={{ 
            padding: '36px 32px 40px', 
            backgroundColor: C.panelBg, 
            border: `1px solid ${C.border}` 
          }}
        >
          <motion.div
            className="flex flex-col"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* 성별 선택 */}
            <motion.div
              className="flex flex-col w-full"
              variants={FADE_UP}
            >
              <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">성별</FieldLabel>
              <GenderSelect
                value={gender}
                onChange={onGenderChange}
                accentColor={C.accent}
                bgColor={C.cardBg}
                fontSize="16px"
                height="44px"
                unselectedColor={C.textTertiary}
                textStrokeWidth="0px"
                border={`1px solid ${C.border}`}
                indicatorBoxShadow="none"
              />
            </motion.div>

            {/* 생년월일 입력 */}
            <motion.div
              className="flex flex-col w-full"
              style={{ marginTop: isNarrow ? '24px' : '36px' }}
              variants={FADE_UP}
            >
              <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">생년월일 (양력 기준으로 입력해 주세요)</FieldLabel>
              <BirthInput 
                value={birthDate} 
                onChange={handleBirthDateChange} 
                accentColor={C.accent} 
                bgColor={C.cardBg} 
                borderColor={C.border} 
                borderWidth="1px" 
                textColor={C.text} 
                fontSize="17px" 
                height="52px" 
                onEnter={onSubmit} 
              />
            </motion.div>

            {/* 태어난 시간 입력 */}
            <motion.div
              className="flex flex-col w-full"
              style={{ marginTop: isNarrow ? '24px' : '36px' }}
              variants={FADE_UP}
            >
              <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">태어난 시간</FieldLabel>
              <TimeSelectSheet
                value={birthTime}
                unknownTime={unknownTime}
                onSelect={onTimeSelect}
                accentColor={C.accent}
                bgColor={C.cardBg}
                borderColor={`1px solid ${C.border}`}
                textColor={C.text}
                placeholderColor={C.textTertiary}
                sheetBgColor={C.panelBg}
                sheetTextColor={C.text}
                dragHandleColor={C.border}
                hoverBgClass="hover:bg-amber-50"
                selectedBgColor={`${C.accent}15`}
                selectedTextColor={C.accent}
                fontSize="17px"
                height="52px"
                arrowColor={C.textTertiary}
                sheetTitleFontWeight={700}
                sheetTitleTextStrokeWidth="0px"
                sheetTitleLetterSpacing="-0.5px"
              />
            </motion.div>

            {/* 제출 버튼 */}
            <motion.div
              style={{ marginTop: '36px' }}
              variants={FADE_UP}
            >
              <PressableButton
                onClick={isValid ? onSubmit : undefined}
                disabled={!isValid}
                label={<span style={{ fontWeight: 700 }}>내 직업 DNA 뽑으러 가기</span>}
                style={{ 
                  height: '54px', 
                  backgroundColor: isValid ? '#ffab00' : '#ebdccb', 
                  borderRadius: '16px' 
                }}
                bgStyle={{ 
                  backgroundColor: isValid ? '#ffab00' : '#ebdccb', 
                  borderRadius: '16px', 
                  border: 'none' 
                }}
                hoverBackground="#e09600"
                textStyle={{ 
                  color: isValid ? '#1e1409' : '#b8a694', 
                  fontWeight: 700, 
                  fontSize: '17px', 
                  lineHeight: '24px', 
                  letterSpacing: '-0.32px',
                  // fontFamily 제거
                }}
              />
            </motion.div>

            {/* 에러 메시지 */}
            {error && (
              <motion.div
                className="flex gap-1 items-center"
                style={{
                  marginTop: '24px',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  backgroundColor: C.dangerBg,
                  border: `1px solid ${C.danger}`,
                }}
                variants={FADE_UP}
              >
                {/* fontFamily 제거 */}
                <p style={{ color: C.danger, fontSize: '13px' }}>{error}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}