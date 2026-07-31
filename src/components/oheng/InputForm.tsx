'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import { OHENG_COLORS as C, FADE_UP } from '@/constants/ohengTheme';
import type { OhengFormState } from '@/types/oheng';

interface Props {
  form: OhengFormState;
  onChange: (patch: Partial<OhengFormState>) => void;
  onSubmit: () => void;
}

export default function InputForm({ form, onChange, onSubmit }: Props) {
  const isValid = useMemo(() => {
    return !!form.gender && /^\d{4}-\d{2}-\d{2}$/.test(form.birthday);
  }, [form]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '12px 16px 48px' }}
    >
      <div className="flex flex-col items-center" style={{ paddingTop: '12px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: C.text, textAlign: 'center' }}>
          사주 정보를 입력해 주세요
        </h1>
        <p style={{ fontSize: '13px', color: C.textSecondary, marginTop: '6px', textAlign: 'center' }}>
          입력한 정보는 저장되지 않습니다.
        </p>
      </div>

      <motion.div
        className="flex flex-col"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div className="flex flex-col w-full" variants={FADE_UP}>
          <FieldLabel color={C.textTertiary} fontSize="13px" marginBottom="6px">성별</FieldLabel>
          <GenderSelect
            value={form.gender}
            onChange={g => onChange({ gender: g })}
            accentColor={C.blue}
            bgColor="#F2F4F6"
            fontSize="15px"
            height="44px"
            unselectedColor={C.textTertiary}
            border="none"
            indicatorBoxShadow="none"
          />
        </motion.div>

        <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
          <FieldLabel color={C.textTertiary} fontSize="13px" marginBottom="6px">생년월일 (양력 기준으로 입력해 주세요)</FieldLabel>
          <BirthInput
            value={form.birthday}
            onChange={v => onChange({ birthday: v })}
            accentColor={C.blue}
            bgColor="#F2F4F6"
            borderColor="transparent"
            textColor={C.text}
            fontSize="16px"
            height="52px"
            onEnter={onSubmit}
            autoFocus={false}
          />
        </motion.div>

        <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
          <FieldLabel color={C.textTertiary} fontSize="13px" marginBottom="6px">태어난 시간</FieldLabel>
          <TimeSelectSheet
            value={form.birthTime}
            unknownTime={form.birthTimeUnknown}
            onSelect={(displayTime, isUnknown) => onChange({ birthTime: displayTime, birthTimeUnknown: isUnknown })}
            accentColor={C.blue}
            bgColor="#F2F4F6"
            borderColor="none"
            textColor={C.text}
            placeholderColor={C.textTertiary}
            sheetBgColor="#FFFFFF"
            sheetTextColor={C.text}
            dragHandleColor={C.border}
            hoverBgClass="hover:bg-black/[0.03]"
            selectedBgColor={C.blueDim}
            selectedTextColor={C.blue}
            fontSize="16px"
            height="52px"
            arrowColor={C.textTertiary}
          />
        </motion.div>

        <motion.div style={{ marginTop: '32px' }} variants={FADE_UP}>
          <PressableButton
            onClick={onSubmit}
            disabled={!isValid}
            label="입력 완료"
            style={{ height: '56px' }}
            bgStyle={{ backgroundColor: isValid ? C.blue : '#EDEFF2', borderRadius: '16px', border: 'none' }}
            hoverBackground={C.blueHover}
            textStyle={{ color: isValid ? C.textOnBlue : C.placeholder, fontWeight: 600, fontSize: '16px' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
