'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import { ZIWEI_PALETTE as C } from '@/lib/ziwei-chart/theme';

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ZiweiInput({
  birthDate, onBirthDateChange, birthTime, unknownTime, onTimeSelect,
  gender, onGenderChange, isValid, error, onSubmit,
}: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '20px 16px 48px' }}>
      <div className="flex flex-col items-center" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: C.textMain, marginBottom: '8px', textAlign: 'center' }}>
          정확한 명반을 위해<br/>정보를 입력해 주세요
        </h1>
      </div>

      <motion.div
        className="flex flex-col"
        style={{ borderRadius: '20px', backgroundColor: C.panel, padding: '24px 20px 28px' }}
        initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div className="flex flex-col w-full" variants={FADE_UP}>
          <FieldLabel color={C.textSub} fontSize="13px" marginBottom="6px">성별</FieldLabel>
          <GenderSelect
            value={gender} onChange={onGenderChange}
            accentColor={C.primary} bgColor="#f7f7f7" fontSize="15px" height="44px"
            unselectedColor={C.textSub} border="none" indicatorBoxShadow="none"
          />
        </motion.div>

        <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
          <FieldLabel color={C.textSub} fontSize="13px" marginBottom="6px">생년월일 (양력 기준)</FieldLabel>
          <BirthInput
            value={birthDate} onChange={onBirthDateChange}
            accentColor={C.primary} bgColor="#f7f7f7" borderColor="transparent"
            textColor={C.textMain} fontSize="16px" height="52px" onEnter={onSubmit}
          />
        </motion.div>

        <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
          <FieldLabel color={C.textSub} fontSize="13px" marginBottom="6px">태어난 시간 (자미두수는 시간이 필수입니다)</FieldLabel>
          <TimeSelectSheet
            value={birthTime} unknownTime={unknownTime} onSelect={onTimeSelect}
            accentColor={C.primary} bgColor="#f7f7f7" borderColor="none" textColor={C.textMain}
            placeholderColor="#9CA3AF" sheetBgColor={C.panel} sheetTextColor={C.textMain}
            dragHandleColor="#E5E7EB" selectedBgColor="#F3E8FF" selectedTextColor={C.primary}
            fontSize="16px" height="52px" arrowColor={C.textSub}
          />
        </motion.div>

        <motion.div style={{ marginTop: '32px' }} variants={FADE_UP}>
          <PressableButton
            onClick={isValid ? onSubmit : undefined} disabled={!isValid} label="명반 열어보기"
            style={{ height: '56px' }}
            bgStyle={{ backgroundColor: isValid ? C.primary : '#f2f2f2', borderRadius: '16px', border: 'none' }}
            hoverBackground="#5A26A6"
            textStyle={{ color: isValid ? '#FFFFFF' : '#9CA3AF', fontWeight: 600, fontSize: '15px' }}
          />
        </motion.div>

        {error && (
          <motion.div style={{ marginTop: '20px', borderRadius: '10px', padding: '12px 16px', backgroundColor: '#FEE2E2' }} variants={FADE_UP}>
            <p style={{ color: '#B91C1C', fontSize: '13px' }}>{error}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}