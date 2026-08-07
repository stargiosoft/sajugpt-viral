'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';

import { COUPLE_COLORS as C, FADE_UP } from '@/constants/coupleGuideTheme';

import type {
  CoupleGuideFormState,
  PersonBirthInfo,
} from '@/types/couple-guide';

interface Props {
  form: CoupleGuideFormState;
  onChange: (patch: Partial<CoupleGuideFormState>) => void;
  onSubmit: () => void;
  errorMessage?: string | null;
}

function isPersonValid(person?: PersonBirthInfo) {
  if (!person) return false;
  return (
    !!person.gender &&
    /^\d{4}-\d{2}-\d{2}$/.test(person.birthday) &&
    (person.birthTimeUnknown || !!person.birthTime)
  );
}

const HEART_PATH =
  'M19.88,4.86a5.15,5.15,0,0,0-4-1.18A5.56,5.56,0,0,0,12.06,6L12,6.05,11.94,6A5.56,5.56,0,0,0,8.12,3.68a5.15,5.15,0,0,0-4,1.18,5.27,5.27,0,0,0-.32,7.77L11.19,20a1.16,1.16,0,0,0,1.62,0l7.39-7.4a5.27,5.27,0,0,0-.32-7.77Z';

const NEUTRAL_GRAY = 'rgb(190 190 190)';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill={filled ? '#FFFFFF' : NEUTRAL_GRAY} d={HEART_PATH} />
    </svg>
  );
}

function PersonSection({
  title,
  person,
  onChange,
  onEnter,
}: {
  title: string;
  person?: PersonBirthInfo;
  onChange: (patch: Partial<PersonBirthInfo>) => void;
  onEnter: () => void;
}) {
  const safePerson = person ?? { gender: '', birthday: '', birthTime: '', birthTimeUnknown: false };

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: `1.5px solid ${C.frameBorder}`,
        padding: '24px 20px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        <FieldLabel color={C.primary} fontSize="15px" marginBottom="16px">
          {title}
        </FieldLabel>

        {/* 성별 */}
        <div className="flex flex-col w-full">
          <FieldLabel color="rgb(69 69 69)" fontSize="13px" marginBottom="6px">
            성별
          </FieldLabel>
          <GenderSelect
            groupId={title}
            value={safePerson.gender as any}
            onChange={gender => onChange({ gender })}
            accentColor={C.primary}
            bgColor={C.inputBg}
            fontSize="15px"
            height="44px"
            unselectedColor="rgb(168 168 168)"
            border="none"
            indicatorBoxShadow="none"
            textStrokeWidth="0.2px"
            icon={selected => <HeartIcon filled={selected} />}
          />
        </div>

        {/* 생년월일 */}
        <div className="flex flex-col w-full" style={{ marginTop: '20px' }}>
          <FieldLabel color="rgb(69 69 69)" fontSize="13px" marginBottom="6px">
            생년월일 (양력 기준)
          </FieldLabel>
          <BirthInput
            value={safePerson.birthday}
            onChange={val => {
              const dateVal = typeof val === 'object' && val !== null ? (val as any).birthday || (val as any).date || '' : val;
              onChange({ birthday: dateVal });
            }}
            accentColor={C.primary}
            bgColor={C.inputBg}
            borderColor="transparent"
            textColor={C.text}
            fontSize="16px"
            height="52px"
            onEnter={onEnter}
            autoFocus={false}
            textStrokeWidth="0.2px"
          />
        </div>

        {/* 시간 */}
        <div className="flex flex-col w-full" style={{ marginTop: '20px' }}>
          <FieldLabel color="rgb(69 69 69)" fontSize="13px" marginBottom="6px">
            태어난 시간
          </FieldLabel>
          <TimeSelectSheet
            value={safePerson.birthTime}
            unknownTime={safePerson.birthTimeUnknown}
            onSelect={(displayTime, unknown) =>
              onChange({
                birthTime: displayTime,
                birthTimeUnknown: unknown,
              })
            }
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
        </div>
      </div>
    </div>
  );
}

export default function CoupleInput({ form, onChange, onSubmit, errorMessage }: Props) {
  const isValid = useMemo(() => {
    return isPersonValid(form?.person1) && isPersonValid(form?.person2);
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
          <h2
            style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 700,
              color: C.text,
            }}
          >
            두 사람의 정보를 알려주세요
          </h2>
        </div>

        <motion.div
          className="flex flex-col"
          style={{ position: 'relative', gap: '16px' }}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={FADE_UP as any}>
            <PersonSection
              title="첫 번째 사람"
              person={form?.person1}
              onChange={patch =>
                onChange({
                  person1: {
                    ...(form?.person1 ?? { gender: '', birthday: '', birthTime: '', birthTimeUnknown: false }),
                    ...patch,
                  },
                })
              }
              onEnter={onSubmit}
            />
          </motion.div>

          <motion.div variants={FADE_UP as any}>
            <PersonSection
              title="두 번째 사람"
              person={form?.person2}
              onChange={patch =>
                onChange({
                  person2: {
                    ...(form?.person2 ?? { gender: '', birthday: '', birthTime: '', birthTimeUnknown: false }),
                    ...patch,
                  },
                })
              }
              onEnter={onSubmit}
            />
          </motion.div>

          {errorMessage && (
            <p style={{ fontSize: '13px', color: 'rgb(240 68 82)', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}

          <motion.div variants={FADE_UP as any} style={{ marginTop: '10px' }}>
            <PressableButton
              onClick={onSubmit}
              disabled={!isValid}
              label="궁합 결과 보기"
              style={{ height: '56px' }}
              bgStyle={{
                backgroundColor: isValid ? C.primary : '#EDEFF2',
                borderRadius: '18px',
                border: 'none',
              }}
              hoverBackground={C.primaryHover}
              textStyle={{
                color: isValid ? C.textOnPrimary : C.placeholder,
                fontWeight: 600,
                fontSize: '16px',
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}