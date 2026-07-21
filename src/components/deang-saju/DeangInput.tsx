'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import { DEANG_COLORS as C } from '@/constants/deangTheme';
import DeangOutlineBox from './DeangOutlineBox';
import useIsNarrow from '@/hooks/useIsNarrow';

const ACCENT = '#16C17E';

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

export default function DeangInput({
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '12px 12px 48px' }}
    >
      <DeangOutlineBox radius={20} backgroundColor="rgb(247, 250, 245)" stitch stitchColor="rgb(202, 230, 218)" style={{ padding: '28px 32px' }}>
      <div className="flex flex-col items-center">
        <h1
          style={{
            fontSize: isNarrow ? '26px' : '30px',
            fontWeight: 500,
            color: '#000000',
            WebkitTextStroke: '0.8px #000000',
            marginBottom: '4px',
            textAlign: 'center',
            letterSpacing: '-0.52px',
          }}
        >
          내 사주 속 강아지는?
        </h1>
        <p
          style={{
            fontSize: isNarrow ? '14px' : '16px',
            color: 'rgb(52, 52, 52)',
            fontWeight: 500,
            textAlign: 'center',
            lineHeight: '1.6',
            whiteSpace: 'nowrap',
          }}
        >
          생년월일시로 나와 닮은 강아지를 찾아보세요
        </p>
      </div>
      </DeangOutlineBox>

      <div style={{ marginTop: '8px' }}>
      <DeangOutlineBox radius={20} backgroundColor="rgb(247, 250, 245)" stitch stitchColor="rgb(202, 230, 218)" style={{ padding: '36px 32px 40px' }}>
      <motion.div
        className="flex flex-col"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div
          className="flex flex-col w-full"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
        >
          <FieldLabel color="rgb(52, 52, 52)" fontSize="13px" marginBottom="6px">성별</FieldLabel>
          <GenderSelect
            value={gender}
            onChange={onGenderChange}
            accentColor="#58B889"
            bgColor="#FFFFFF"
            fontSize="16px"
            height="44px"
            unselectedColor="rgb(150, 175, 163)"
            textStrokeWidth="0.2px"
            border="2px solid rgb(202, 230, 218)"
            indicatorBoxShadow="none"
            icon={isSelected => (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: isSelected ? '#FFFFFF' : 'rgba(150, 175, 163, 0.65)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M7.67022 12.843C7.92154 11.8859 8.48261 11.0388 9.26591 10.4341C10.0492 9.82935 11.0106 9.5009 12.0002 9.5C12.9899 9.50085 13.9515 9.82926 14.735 10.434C15.5184 11.0387 16.0797 11.8858 16.3312 12.843C16.4232 13.191 16.6482 13.496 16.9732 13.734C17.5574 14.1633 18.0047 14.7526 18.261 15.4307C18.5172 16.1088 18.5715 16.8467 18.4172 17.555C18.297 18.1011 18.0562 18.6134 17.7125 19.0544C17.3687 19.4954 16.9306 19.8539 16.4304 20.1038C15.9301 20.3536 15.3804 20.4884 14.8213 20.4983C14.2622 20.5082 13.708 20.393 13.1992 20.161C12.8242 19.9856 12.4152 19.8947 12.0012 19.8947C11.5872 19.8947 11.1782 19.9856 10.8032 20.161C9.96027 20.5422 9.0061 20.5982 8.12435 20.3182C7.24259 20.0382 6.49555 19.442 6.02699 18.6442C5.55844 17.8465 5.40148 16.9037 5.58632 15.9972C5.77116 15.0907 6.28474 14.2846 7.02822 13.734C7.35122 13.496 7.57822 13.19 7.66822 12.844L7.67022 12.843Z" fill="currentColor" />
                <path d="M9.35294 3C8.79131 3 8.25268 3.2218 7.85554 3.61662C7.4584 4.01143 7.23529 4.54691 7.23529 5.10526V6.15789C7.23529 6.71625 7.4584 7.25173 7.85554 7.64654C8.25268 8.04135 8.79131 8.26316 9.35294 8.26316C9.91458 8.26316 10.4532 8.04135 10.8503 7.64654C11.2475 7.25173 11.4706 6.71625 11.4706 6.15789V5.10526C11.4706 4.54691 11.2475 4.01143 10.8503 3.61662C10.4532 3.2218 9.91458 3 9.35294 3ZM14.6471 3C14.0854 3 13.5468 3.2218 13.1497 3.61662C12.7525 4.01143 12.5294 4.54691 12.5294 5.10526V6.15789C12.5294 6.71625 12.7525 7.25173 13.1497 7.64654C13.5468 8.04135 14.0854 8.26316 14.6471 8.26316C15.2087 8.26316 15.7473 8.04135 16.1445 7.64654C16.5416 7.25173 16.7647 6.71625 16.7647 6.15789V5.10526C16.7647 4.54691 16.5416 4.01143 16.1445 3.61662C15.7473 3.2218 15.2087 3 14.6471 3ZM18.8824 7.73684C18.3207 7.73684 17.7821 7.95865 17.385 8.35346C16.9878 8.74827 16.7647 9.28375 16.7647 9.84211V10.8947C16.7647 11.4531 16.9878 11.9886 17.385 12.3834C17.7821 12.7782 18.3207 13 18.8824 13C19.444 13 19.9826 12.7782 20.3798 12.3834C20.7769 11.9886 21 11.4531 21 10.8947V9.84211C21 9.28375 20.7769 8.74827 20.3798 8.35346C19.9826 7.95865 19.444 7.73684 18.8824 7.73684ZM5.11765 7.73684C4.55601 7.73684 4.01738 7.95865 3.62024 8.35346C3.22311 8.74827 3 9.28375 3 9.84211V10.8947C3 11.4531 3.22311 11.9886 3.62024 12.3834C4.01738 12.7782 4.55601 13 5.11765 13C5.67928 13 6.21791 12.7782 6.61505 12.3834C7.01219 11.9886 7.23529 11.4531 7.23529 10.8947V9.84211C7.23529 9.28375 7.01219 8.74827 6.61505 8.35346C6.21791 7.95865 5.67928 7.73684 5.11765 7.73684Z" fill="currentColor" />
              </svg>
            )}
          />
        </motion.div>

        <motion.div
          className="flex flex-col w-full"
          style={{ marginTop: isNarrow ? '24px' : '36px' }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
        >
          <FieldLabel color="rgb(52, 52, 52)" fontSize="13px" marginBottom="6px">생년월일 (양력 기준으로 입력해 주세요)</FieldLabel>
          <BirthInput value={birthDate} onChange={onBirthDateChange} accentColor="rgb(88, 184, 137)" bgColor="#FFFFFF" borderColor="rgb(202, 230, 218)" borderWidth="2px" textColor="#000000" fontSize="17px" height="52px" onEnter={onSubmit} />
        </motion.div>

        <motion.div
          className="flex flex-col w-full"
          style={{ marginTop: isNarrow ? '24px' : '36px' }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
        >
          <FieldLabel color="rgb(52, 52, 52)" fontSize="13px" marginBottom="6px">태어난 시간</FieldLabel>
          <TimeSelectSheet
            value={birthTime}
            unknownTime={unknownTime}
            onSelect={onTimeSelect}
            accentColor={ACCENT}
            bgColor="#FFFFFF"
            borderColor="2px solid rgb(202, 230, 218)"
            textColor="#000000"
            placeholderColor={C.faintText}
            sheetBgColor={C.pageBg}
            sheetTextColor="rgb(52, 52, 52)"
            dragHandleColor="rgba(0, 0, 0, 0.15)"
            hoverBgClass="hover:bg-[#16C17E]/10"
            selectedBgColor="rgb(88, 184, 137)"
            selectedTextColor="#FFFFFF"
            fontSize="17px"
            height="52px"
            arrowColor="rgb(150, 175, 163)"
            sheetTitleFontWeight={500}
            sheetTitleTextStrokeWidth="0.5px"
            sheetTitleLetterSpacing="-1.5px"
          />
        </motion.div>

        <motion.div
          style={{ marginTop: '36px' }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
        >
          <PressableButton
            onClick={isValid ? onSubmit : undefined}
            disabled={!isValid}
            label={<span style={{ WebkitTextStroke: isValid ? '0.3px #FFFFFF' : 'none' }}>내 댕댕이 뽑기</span>}
            style={{ height: '54px' }}
            bgStyle={{ backgroundColor: isValid ? '#58B889' : 'rgb(240, 240, 240)', borderRadius: '16px', border: 'none' }}
            hoverBackground="#4ba679"
            textStyle={{ color: isValid ? '#FFFFFF' : 'rgb(150, 140, 128)', fontWeight: 500, fontSize: '17px', lineHeight: '24px', letterSpacing: '-0.32px' }}
          />
        </motion.div>

        {error && (
          <motion.div
            className="flex gap-1 items-center"
            style={{
              marginTop: '24px',
              borderRadius: '10px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
            }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
          >
            <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>
          </motion.div>
        )}
      </motion.div>
      </DeangOutlineBox>
      </div>
    </motion.div>
  );
}
