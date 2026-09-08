'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import { FADE_UP } from '@/constants/shinsalGeniusTheme';

const LIGHT_LAVENDER_COLORS = {
  accent: '#8B5CF6',  
  accentHover: '#7C3AED',   
  text: '#2D2438',       
  textSecondary: '#6B5B95',
  textTertiary: '#A093C4', 
  textOnAccent: '#FFFFFF', 
  panelBg: '#FAF5FF',      
  cardBg: '#FFFFFF',     
  border: '#E9D8FD',    
  disabledBg: '#EFEAF6',   
  danger: '#EF4444',      
};

const C = LIGHT_LAVENDER_COLORS;
const MAIN_FONT = "var(--font-jandari), 'Pretendard', sans-serif";
const TITLE_FONT = "'JejuStoneWall', sans-serif";


interface SkillInputProps {
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  birthTime: string;
  unknownTime: boolean;
  onTimeSelect: (displayTime: string, isUnknown: boolean) => void;
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
  isValid: boolean;
  error: string | null;
  onSubmit: () => void | Promise<void>;
  isSubmitting?: boolean;
}

export default function SkillInput({
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
  isSubmitting = false,
}: SkillInputProps) {
  const isButtonDisabled = !isValid || isSubmitting;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        padding: '20px 16px 48px',
        fontFamily: MAIN_FONT,
      }}
    >

      <div className="flex flex-col items-center" style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: C.text,
            textAlign: 'center',
            fontFamily: TITLE_FONT,
            lineHeight: 1.3,
          }}
        >
          당신의 사주에는
          <br />
          어떤 신살이 함께하고 있을까요?
        </h1>
      </div>

      <motion.div
        className="flex flex-col"
        style={{
          borderRadius: '20px',
          backgroundColor: C.panelBg,
          padding: '24px 20px 28px',
          border: `1px solid ${C.border}`,
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.05)',
        }}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >

        <motion.div className="flex flex-col w-full" variants={FADE_UP}>
          <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">
            성별
          </FieldLabel>
          <GenderSelect
            value={gender}
            onChange={onGenderChange}
            accentColor={C.accent}
            bgColor={C.cardBg}
            fontSize="15px"
            height="48px"
            unselectedColor={C.textSecondary}
            border={`1px solid ${C.border}`}
          />
        </motion.div>

        <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
          <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">
            생년월일 (양력)
          </FieldLabel>
          <BirthInput
            value={birthDate}
            onChange={onBirthDateChange}
            accentColor={C.accent}
            bgColor={C.cardBg}
            borderColor={C.border}
            textColor={C.text}
            fontSize="16px"
            height="52px"
            onEnter={onSubmit}
          />
        </motion.div>

        <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
          <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">
            태어난 시간
          </FieldLabel>
          <TimeSelectSheet
            value={birthTime}
            unknownTime={unknownTime}
            onSelect={onTimeSelect}
            accentColor={C.accent}
            bgColor={C.cardBg}
            borderColor={C.border}
            textColor={C.text}
            placeholderColor={C.textTertiary}
            sheetBgColor="#FFFFFF"
            sheetTextColor={C.text}
            dragHandleColor={C.border}
            selectedBgColor="rgba(139, 92, 246, 0.1)"
            selectedTextColor={C.accent}
            fontSize="16px"
            height="52px"
          />
        </motion.div>

        <motion.div style={{ marginTop: '32px' }} variants={FADE_UP}>
          <PressableButton
            onClick={!isButtonDisabled ? onSubmit : undefined}
            disabled={isButtonDisabled}
            label={isSubmitting ? '12신살 분석 중...' : '내 신살 확인하기'}
            style={{ height: '56px', width: '100%' }}
            bgStyle={{
              backgroundColor: !isButtonDisabled ? C.accent : C.disabledBg,
              borderRadius: '16px',
              border: 'none',
            }}
            hoverBackground={C.accentHover}
            textStyle={{
              color: !isButtonDisabled ? C.textOnAccent : C.textTertiary,
              fontWeight: 700,
              fontSize: '16px',
              fontFamily: MAIN_FONT,
            }}
          />
        </motion.div>

        {error && (
          <motion.div
            style={{
              marginTop: '20px',
              borderRadius: '10px',
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              border: `1px solid ${C.danger}40`,
            }}
            variants={FADE_UP}
          >
            <p style={{ color: C.danger, fontSize: '13px', fontFamily: MAIN_FONT }}>
              {error}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}