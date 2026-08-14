'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import { GENIUS_COLORS as C, FADE_UP } from '@/constants/shinsalGeniusTheme';

interface Props {
  birthDate: string; onBirthDateChange: (value: string) => void;
  birthTime: string; unknownTime: boolean; onTimeSelect: (time: string, unknown: boolean) => void;
  gender: Gender; onGenderChange: (value: Gender) => void;
  isValid: boolean; error: string | null; onSubmit: () => void;
}

export default function GeniusInput(props: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '20px 16px 48px' }}>
      <div className="flex flex-col items-center" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: C.text, textAlign: 'center' }}>사주 정보를 입력해 주세요</h1>
      </div>

      <motion.div className="flex flex-col" style={{ borderRadius: '20px', backgroundColor: C.panelBg, padding: '24px 20px 28px', border: `1px solid ${C.border}` }} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div className="flex flex-col w-full" variants={FADE_UP}>
          <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">성별</FieldLabel>
          <GenderSelect value={props.gender} onChange={props.onGenderChange} accentColor={C.accent} bgColor={C.cardBg} fontSize="15px" height="48px" unselectedColor={C.textTertiary} border={`1px solid ${C.border}`} />
        </motion.div>

        <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
          <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">생년월일 (양력)</FieldLabel>
          <BirthInput value={props.birthDate} onChange={props.onBirthDateChange} accentColor={C.accent} bgColor={C.cardBg} borderColor={C.border} textColor={C.text} fontSize="16px" height="52px" onEnter={props.onSubmit} />
        </motion.div>

        <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
          <FieldLabel color={C.textSecondary} fontSize="13px" marginBottom="6px">태어난 시간</FieldLabel>
          <TimeSelectSheet value={props.birthTime} unknownTime={props.unknownTime} onSelect={props.onTimeSelect} accentColor={C.accent} bgColor={C.cardBg} borderColor={C.border} textColor={C.text} placeholderColor={C.textTertiary} sheetBgColor={C.panelBg} sheetTextColor={C.text} dragHandleColor={C.border} selectedBgColor={`${C.accent}33`} selectedTextColor={C.accent} fontSize="16px" height="52px" />
        </motion.div>

        <motion.div style={{ marginTop: '32px' }} variants={FADE_UP}>
          <PressableButton onClick={props.isValid ? props.onSubmit : undefined} disabled={!props.isValid} label="결과보기" style={{ height: '56px' }} bgStyle={{ backgroundColor: props.isValid ? C.accent : C.border, borderRadius: '16px', border: 'none' }} hoverBackground={C.accentHover} textStyle={{ color: props.isValid ? C.textOnAccent : C.textTertiary, fontWeight: 700, fontSize: '16px' }} />
        </motion.div>

        {props.error && (
          <motion.div style={{ marginTop: '20px', borderRadius: '10px', padding: '12px 16px', backgroundColor: '#450a0a', border: `1px solid ${C.danger}` }} variants={FADE_UP}>
            <p style={{ color: C.danger, fontSize: '13px' }}>{props.error}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}