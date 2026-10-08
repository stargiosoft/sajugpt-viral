'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import TestTopNav from '@/components/TestTopNav';

interface MoneyTypeBirthInputProps {
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  birthTime: string;
  unknownTime: boolean;
  onTimeSelect: (displayTime: string, isUnknown?: boolean) => void;
  gender: Gender;
  onGenderChange: (value: Gender) => void;
  isValid: boolean;
  error: string | null;
  onSubmit: () => void;
}

const C = {
  text: '#493C35',
  textTertiary: '#A89990',
  panelBg: '#FFFFFF',
  gold: '#E98C72',
  goldHover: '#D87B61',
  goldDim: '#FFEFEA',
  cardBg: '#FFF9F2',
  border: '#F0E5DB',
  placeholder: '#B9AAA1',
  dangerBg: '#FFF1EE',
  danger: '#D96E52',
};

const FADE_UP = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MoneyTypeBirthInput({
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
}: MoneyTypeBirthInputProps) {
  return (
    <div style={{ backgroundColor: '#FFF9F2', minHeight: '100vh', overflowX: 'hidden' }}>
      <style jsx global>{`
        .font-keris {
          font-family: 'KerisKeduLine', sans-serif;
        }
      `}</style>

      {/* 0. 상단 브랜드 네비게이션 배너 */}
      <TestTopNav
        bgColor="transparent"
        logoColor={C.text}
        xColor={C.text}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto w-full max-w-130 px-5 pb-12"
      >
        {/* 헤더 */}
        <div className="mb-7">
          <h1 className="font-keris text-[29px] font-extrabold leading-[1.3] tracking-[-0.02em] text-[#493C35]">
            나는 돈을
            <br />
            어떻게 버는 사람일까?
          </h1>

          <p className="mt-3 text-[14px] leading-6 text-[#A89990]">
            생년월일을 입력하면
            <br />
            나에게 잘 맞는 돈 버는 방식을 찾아드려요.
          </p>
        </div>

        {/* 입력 카드 */}
        <motion.div
          className="flex flex-col rounded-3xl border border-[#F0E5DB] bg-white p-5 shadow-[0_8px_30px_rgba(73,60,53,0.04)]"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* 성별 */}
          <motion.div className="flex flex-col w-full" variants={FADE_UP}>
            <FieldLabel color="rgb(153, 153, 153)" fontSize="13px" marginBottom="6px">
              성별
            </FieldLabel>
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

          {/* 생년월일 */}
          <motion.div className="mt-6 flex flex-col w-full" variants={FADE_UP}>
            <FieldLabel color="rgb(153, 153, 153)" fontSize="13px" marginBottom="6px">
              생년월일 (양력 기준으로 입력해 주세요)
            </FieldLabel>
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

          {/* 출생시간 */}
          <motion.div className="mt-6 flex flex-col w-full" variants={FADE_UP}>
            <FieldLabel color="rgb(153, 153, 153)" fontSize="13px" marginBottom="6px">
              태어난 시간
            </FieldLabel>
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

          {/* CTA */}
          <motion.div className="mt-7" variants={FADE_UP}>
            <PressableButton
              onClick={isValid ? onSubmit : undefined}
              disabled={!isValid}
              label="내 돈 버는 방식 분석하기"
              style={{ height: '56px' }}
              bgStyle={{
                backgroundColor: isValid ? C.gold : '#f2f2f2',
                borderRadius: '16px',
                border: 'none',
              }}
              hoverBackground={C.goldHover}
              textStyle={{
                color: isValid ? '#ffffff' : C.placeholder,
                fontWeight: 700,
                fontSize: '16px',
              }}
            />
          </motion.div>

          {/* 에러 */}
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

        {/* 하단 안내 */}
        <div className="mt-5 text-center">
          <p className="text-xs leading-5 text-[#B9AAA1]">
            입력한 생년월일은 사주 분석을 위해서만 사용돼요.
          </p>
        </div>
      </motion.div>
    </div>
  );
}