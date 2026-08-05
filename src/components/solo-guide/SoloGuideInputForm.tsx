'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import { SOLO_COLORS as C, FADE_UP } from '@/constants/soloGuideTheme';
import type { SoloGuideFormState } from '@/types/solo-guide';

interface Props {
  form: SoloGuideFormState;
  onChange: (patch: Partial<SoloGuideFormState>) => void;
  onSubmit: () => void;
  errorMessage?: string | null;
}

const HEART_PATH = 'M19.88,4.86a5.15,5.15,0,0,0-4-1.18A5.56,5.56,0,0,0,12.06,6L12,6.05,11.94,6A5.56,5.56,0,0,0,8.12,3.68a5.15,5.15,0,0,0-4,1.18,5.27,5.27,0,0,0-.32,7.77L11.19,20a1.16,1.16,0,0,0,1.62,0l7.39-7.4a5.27,5.27,0,0,0-.32-7.77Z';

const NEUTRAL_GRAY = 'rgb(190 190 190)';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill={filled ? '#FFFFFF' : NEUTRAL_GRAY} d={HEART_PATH} />
    </svg>
  );
}

export default function SoloGuideInputForm({ form, onChange, onSubmit, errorMessage }: Props) {
  const isValid = useMemo(() => {
    return !!form.gender && /^\d{4}-\d{2}-\d{2}$/.test(form.birthday) && (form.birthTimeUnknown || !!form.birthTime);
  }, [form]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '12px 8px 48px' }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: C.frameBg,
          border: `2.5px solid ${C.frameBorder}`,
          borderRadius: '28px',
          padding: '22px 18px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/solo-guide/card-bg-notepaper.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'scale(1.8)',
            opacity: 0.5,
          }}
        />

        <div className="flex flex-col items-center" style={{ position: 'relative', marginBottom: '20px' }}>
          <img
            src="/solo-guide/input-title.png"
            alt="내 연애 유형을 확인해 볼까요?"
            style={{ display: 'block', width: '90%', maxWidth: '428px' }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: `1.5px solid ${C.frameBorder}`,
            padding: '26px 26px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '6px',
              borderRadius: '19px',
              border: '1.2px dashed #FFC2D6',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            className="flex flex-col"
            style={{ position: 'relative', paddingTop: '4px' }}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
          <motion.div className="flex flex-col w-full" variants={FADE_UP}>
            <FieldLabel color="rgb(69 69 69)" fontSize="13px" marginBottom="6px">성별</FieldLabel>
            <GenderSelect
              value={form.gender}
              onChange={g => onChange({ gender: g })}
              accentColor={C.primary}
              bgColor={C.inputBg}
              fontSize="15px"
              height="44px"
              unselectedColor="rgb(168 168 168)"
              border="none"
              indicatorBoxShadow="none"
              icon={isSelected => <HeartIcon filled={isSelected} />}
              textStrokeWidth="0.2px"
            />
          </motion.div>

          <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
            <FieldLabel color="rgb(69 69 69)" fontSize="13px" marginBottom="6px">생년월일 (양력 기준으로 입력해 주세요)</FieldLabel>
            <BirthInput
              value={form.birthday}
              onChange={v => onChange({ birthday: v })}
              accentColor={C.primary}
              bgColor={C.inputBg}
              borderColor="transparent"
              textColor={C.text}
              fontSize="16px"
              height="52px"
              onEnter={onSubmit}
              autoFocus={false}
              textStrokeWidth="0.2px"
            />
          </motion.div>

          <motion.div className="flex flex-col w-full" style={{ marginTop: '24px' }} variants={FADE_UP}>
            <FieldLabel color="rgb(69 69 69)" fontSize="13px" marginBottom="6px">태어난 시간</FieldLabel>
            <TimeSelectSheet
              value={form.birthTime}
              unknownTime={form.birthTimeUnknown}
              onSelect={(displayTime, isUnknown) => onChange({ birthTime: displayTime, birthTimeUnknown: isUnknown })}
              accentColor={C.primary}
              bgColor={C.inputBg}
              borderColor="none"
              textColor={C.text}
              placeholderColor={C.textTertiary}
              sheetBgColor="#FFFFFF"
              sheetTextColor={C.text}
              dragHandleColor={C.border}
              hoverBgClass="hover:bg-black/[0.03]"
              selectedBgColor={C.primaryDim}
              selectedTextColor={C.primary}
              fontSize="16px"
              height="52px"
              arrowColor={NEUTRAL_GRAY}
              textStrokeWidth="0.2px"
              sheetTitleFontSize="22px"
              sheetTitleLetterSpacing="-0.8px"
              sheetTitlePaddingBottom="2px"
            />
          </motion.div>

          {errorMessage && (
            <p style={{ marginTop: '14px', fontSize: '13px', color: 'rgb(240 68 82)', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}

          <motion.div style={{ marginTop: '26px' }} variants={FADE_UP}>
            <PressableButton
              onClick={onSubmit}
              disabled={!isValid}
              label="내 연애 유형 보기"
              style={{ height: '56px' }}
              bgStyle={{ backgroundColor: isValid ? C.primary : '#EDEFF2', borderRadius: '18px', border: 'none' }}
              hoverBackground={C.primaryHover}
              textStyle={{ color: isValid ? C.textOnPrimary : C.placeholder, fontWeight: 600, fontSize: '16px' }}
            />
          </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
