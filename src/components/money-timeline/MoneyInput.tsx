'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import { MONEY_COLORS as C, FADE_UP } from '@/constants/moneyTimelineTheme';

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

export default function MoneyInput({
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '20px 16px 48px' }}
    >
      <div className="flex flex-col items-center" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: C.text, marginBottom: '8px', textAlign: 'center' }}>
          정보를 입력해 주세요
        </h1>
        <p style={{ fontSize: '15px', color: 'rgb(102, 102, 102)', textAlign: 'center' }}>
          입력한 정보는 저장되지 않아요
        </p>
      </div>

      <motion.div
        className="flex flex-col"
        style={{
          borderRadius: '20px',
          backgroundColor: C.panelBg,
          boxShadow: '0 8px 24px rgba(124, 92, 252, 0.16)',
          padding: '24px 20px 28px',
        }}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div
          className="flex flex-col w-full"
          variants={FADE_UP}
        >
          <FieldLabel color="rgb(153, 153, 153)" fontSize="13px" marginBottom="6px">성별</FieldLabel>
          <GenderSelect
            value={gender}
            onChange={onGenderChange}
            accentColor={C.gold}
            bgColor="#f7f7f7"
            fontSize="15px"
            height="44px"
            unselectedColor={C.textTertiary}
            border="none"
            indicatorBoxShadow="none"
            icon={isSelected => (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M7 11.625L10.3294 16L17 9"
                  stroke={isSelected ? '#fff' : 'rgb(200, 200, 200)'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
              </svg>
            )}
          />
        </motion.div>

        <motion.div
          className="flex flex-col w-full"
          style={{ marginTop: '24px' }}
          variants={FADE_UP}
        >
          <FieldLabel color="rgb(153, 153, 153)" fontSize="13px" marginBottom="6px">생년월일 (양력 기준으로 입력해 주세요)</FieldLabel>
          <BirthInput
            value={birthDate}
            onChange={onBirthDateChange}
            accentColor={C.gold}
            bgColor="#f7f7f7"
            borderColor="transparent"
            textColor={C.text}
            fontSize="16px"
            height="52px"
            onEnter={onSubmit}
          />
        </motion.div>

        <motion.div
          className="flex flex-col w-full"
          style={{ marginTop: '24px' }}
          variants={FADE_UP}
        >
          <FieldLabel color="rgb(153, 153, 153)" fontSize="13px" marginBottom="6px">태어난 시간</FieldLabel>
          <TimeSelectSheet
            value={birthTime}
            unknownTime={unknownTime}
            onSelect={onTimeSelect}
            accentColor={C.gold}
            bgColor="#f7f7f7"
            borderColor="none"
            textColor={C.text}
            placeholderColor={C.placeholder}
            sheetBgColor={C.cardBg}
            sheetTextColor={C.text}
            dragHandleColor={C.border}
            hoverBgClass="hover:bg-white/5"
            selectedBgColor={C.goldDim}
            selectedTextColor={C.gold}
            fontSize="16px"
            height="52px"
            arrowColor={C.textTertiary}
          />
        </motion.div>

        <motion.div
          style={{ marginTop: '32px' }}
          variants={FADE_UP}
        >
          <PressableButton
            onClick={isValid ? onSubmit : undefined}
            disabled={!isValid}
            label="결과보기"
            style={{ height: '56px' }}
            bgStyle={{ backgroundColor: isValid ? C.gold : '#f2f2f2', borderRadius: '16px', border: 'none' }}
            hoverBackground={C.goldHover}
            textStyle={{ color: isValid ? C.textOnGold : C.placeholder, fontWeight: 500, fontSize: '16px', WebkitTextStroke: `0.6px ${isValid ? C.textOnGold : C.placeholder}` }}
          />
        </motion.div>

        {error && (
          <motion.div
            style={{
              marginTop: '20px',
              borderRadius: '10px',
              padding: '12px 16px',
              backgroundColor: C.dangerBg,
              border: `1px solid ${C.danger}`,
            }}
            variants={FADE_UP}
          >
            <p style={{ color: C.danger, fontSize: '13px' }}>{error}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
