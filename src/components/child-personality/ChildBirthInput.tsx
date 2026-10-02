'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Gender } from '@/types/battle';

import BirthInput from '@/components/BirthInput';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';

interface ChildGenderSelectProps {
  value: Gender | null;
  onChange: (value: Gender) => void;
  groupId?: string;
  accentColor?: string;
  bgColor?: string;
  unselectedColor?: string;
  border?: string;
  indicatorBoxShadow?: string;
  icon?: (isSelected: boolean) => ReactNode;
  fontSize?: string;
  textStrokeWidth?: string;
  height?: string;
}

function ChildGenderSelect({
  value,
  onChange,
  groupId = 'child-gender',
  accentColor = '#E98C72',
  bgColor = '#FFF9F2',
  unselectedColor = '#A89990',
  border = '1px solid #F0E5DB',
  indicatorBoxShadow = '0px 2px 7px 0px rgba(0,0,0,0.06)',
  icon,
  fontSize = '15px',
  textStrokeWidth,
  height = '48px',
}: ChildGenderSelectProps) {
  return (
    <div
      className="overflow-hidden isolate"
      style={{ backgroundColor: bgColor, borderRadius: '16px', padding: '4px', border }}
    >
      <div className="flex gap-1">
        {(['female', 'male'] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className="flex-1 flex items-center justify-between relative"
            style={{
              height,
              minWidth: 0,
              borderRadius: '12px',
              padding: '12px 20px',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {value === g && (
              <motion.div
                layoutId={`sexy-gender-indicator-${groupId}`}
                className="absolute inset-0"
                style={{
                  backgroundColor: accentColor,
                  borderRadius: '12px',
                  boxShadow: indicatorBoxShadow,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className="relative z-1"
              style={{
                fontSize,
                fontWeight: 500,
                lineHeight: '20px',
                letterSpacing: '-0.45px',
                color: value === g ? '#fff' : unselectedColor,
                transition: 'color 0.2s',
                ...(textStrokeWidth
                  ? { WebkitTextStroke: `${textStrokeWidth} ${value === g ? '#fff' : unselectedColor}` }
                  : {}),
              }}
            >
              {g === 'female' ? '여자아이' : '남자아이'}
            </span>
            <span className="relative z-1 shrink-0 flex items-center">
              {icon?.(value === g) ?? (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7 11.625L10.3294 16L17 9"
                    stroke={value === g ? '#fff' : unselectedColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    style={{ transition: 'stroke 0.2s' }}
                  />
                </svg>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  birthTime: string;
  unknownTime: boolean;
  onTimeSelect: (time: string, unknown: boolean) => void;
  gender: Gender;
  onGenderChange: (value: Gender) => void;
  isValid: boolean;
  error: string | null;
  onSubmit: () => void;
}

const COLORS = {
  page: '#FFF9F2',
  card: '#FFFFFF',
  text: '#493C35',
  sub: '#A89990',
  accent: '#E98C72',
  border: '#F0E5DB',
  badgeBg: '#FFEFEA',
};

export default function ChildBirthInput({
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
    <>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: COLORS.page,
          color: COLORS.text,
          fontFamily: "'Cafe24Surround', 'Pretendard', sans-serif",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '12px 16px 48px',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '999px',
                background: COLORS.badgeBg,
                color: COLORS.accent,
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '12px',
              }}
            >
              우리 아이 성향 테스트
            </div>

            <h1 style={{ margin: 0, marginTop: '16px', marginBottom: '16px', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              우리 아이를 알려주세요
            </h1>

            <p style={{ marginTop: '8px', color: '#7D6D64', fontSize: '14px', lineHeight: 1.5, fontFamily: "'Pretendard', sans-serif" }}>
              사주를 바탕으로 성향과 공부 스타일을 알아봐요.
            </p>
          </div>

          <div
            style={{
              background: COLORS.card,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: '24px',
              padding: '24px 20px',
              boxShadow: '0 10px 30px rgba(233, 140, 114, 0.06)',
            }}
          >
            <div>
              <FieldLabel color={COLORS.text} fontSize="13px" marginBottom="7px">
                성별
              </FieldLabel>

              <ChildGenderSelect
                value={gender}
                onChange={onGenderChange}
                accentColor={COLORS.accent}
                bgColor="#FFFDF9"
                fontSize="15px"
                height="48px"
                unselectedColor={COLORS.sub}
                border={`1.5px solid ${COLORS.border}`}
              />
            </div>

            <div style={{ marginTop: '22px' }}>
              <FieldLabel color={COLORS.text} fontSize="13px" marginBottom="7px">
                생년월일
              </FieldLabel>

              <BirthInput
                value={birthDate}
                onChange={onBirthDateChange}
                accentColor={COLORS.accent}
                bgColor="#FFFDF9"
                borderColor={COLORS.border}
                textColor={COLORS.text}
                fontSize="16px"
                height="52px"
                onEnter={onSubmit}
              />
            </div>

            <div style={{ marginTop: '22px' }}>
              <FieldLabel color={COLORS.text} fontSize="13px" marginBottom="7px">
                태어난 시간
              </FieldLabel>

              <TimeSelectSheet
                value={birthTime}
                unknownTime={unknownTime}
                onSelect={onTimeSelect}
                accentColor={COLORS.accent}
                bgColor="#FFFDF9"
                borderColor={COLORS.border}
                textColor={COLORS.text}
                placeholderColor={COLORS.sub}
                sheetBgColor={COLORS.card}
                sheetTextColor={COLORS.text}
                dragHandleColor={COLORS.border}
                selectedBgColor="#FFEFEA"
                selectedTextColor={COLORS.accent}
                fontSize="16px"
                height="52px"
              />
            </div>

            <div style={{ marginTop: '28px' }}>
              <PressableButton
                onClick={isValid ? onSubmit : undefined}
                disabled={!isValid}
                label="우리 아이 분석하기"
                style={{ width: '100%', height: '54px' }}
                bgStyle={{
                  backgroundColor: isValid ? COLORS.accent : '#F0E5DB',
                  borderRadius: '16px',
                  border: 'none',
                }}
                hoverBackground="#d87b61"
                textStyle={{
                  color: isValid ? '#ffffff' : '#A89990',
                  fontSize: '16px',
                  fontWeight: 800,
                  fontFamily: "'Cafe24Surround', 'Pretendard', sans-serif",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: '#FFF4F2',
                  border: '1px solid #F7D0CC',
                  color: '#D9534F',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}
          </div>

          <p style={{ marginTop: '16px', textAlign: 'center', color: '#A89990', fontSize: '11.5px', lineHeight: 1.5, fontFamily: "'Pretendard', sans-serif" }}>
            생년월일과 성별은 안전하게 분석용으로만 사용돼요.
          </p>
        </motion.div>
      </div>
    </>
  );
}