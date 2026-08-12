'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import FieldLabel from '@/components/FieldLabel';
import PressableButton from '@/components/PressableButton';
import { LOVE_SPOT_COLORS as C, FADE_UP } from '@/constants/loveSpotTheme';
import type { LoveSpotFormState } from '@/types/love-spot';

interface Props {
  form: LoveSpotFormState;
  onChange: (patch: Partial<LoveSpotFormState>) => void;
  onSubmit: () => void;
  errorMessage?: string | null;
}

const HEART_PATH = 'M19.88,4.86a5.15,5.15,0,0,0-4-1.18A5.56,5.56,0,0,0,12.06,6L12,6.05,11.94,6A5.56,5.56,0,0,0,8.12,3.68a5.15,5.15,0,0,0-4,1.18,5.27,5.27,0,0,0-.32,7.77L11.19,20a1.16,1.16,0,0,0,1.62,0l7.39-7.4a5.27,5.27,0,0,0-.32-7.77Z';

const NEUTRAL_GRAY = 'rgb(180 180 180)';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill={filled ? '#FFFFFF' : NEUTRAL_GRAY} d={HEART_PATH} />
    </svg>
  );
}

export default function LoveSpotInputForm({ form, onChange, onSubmit, errorMessage }: Props) {
  const isValid = useMemo(() => {
    return !!form.gender && /^\d{4}-\d{2}-\d{2}$/.test(form.birthday) && (form.birthTimeUnknown || !!form.birthTime);
  }, [form]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '12px 8px 48px' }}
    >
      <div
        style={{
          position: 'relative',
          backgroundImage: 'url(/love-spot/heart-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: '2.5px solid #FFFFFF',
          borderRadius: '36px',
          padding: '28px 20px',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(255, 150, 175, 0.25), inset 0 2px 6px rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* 상단 타이틀 */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '22px' }}>
          <p
            style={{
              fontSize: '22px',
              fontWeight: 800,
              fontFamily: '"Cafe24Ssurround", "Pretendard", -apple-system, sans-serif',
              letterSpacing: '-0.5px',
              color: '#D83B64',
              textShadow: '0 2px 4px rgba(255, 255, 255, 0.9)',
            }}
          >
            내 인연 스팟을 확인해 볼까요? ✨
          </p>
          <span
            style={{
              display: 'block',
              marginTop: '4px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#A8526B',
              letterSpacing: '-0.3px',
            }}
          >
            설레는 만남이 기다리는 곳을 찾아드려요 💖
          </span>
        </div>
        <div
          style={{
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            borderRadius: '28px',
            border: '2px solid #FFF0F3',
            padding: '28px 22px',
            boxShadow: '0 8px 24px rgba(212, 125, 149, 0.1)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '8px',
              borderRadius: '22px',
              border: '1.5px dashed #FFD1DC',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            className="flex flex-col"
            style={{ position: 'relative', paddingTop: '4px' }}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {/* 성별 선택 */}
            <motion.div className="flex flex-col w-full" variants={FADE_UP}>
              <FieldLabel color="#666666" fontSize="13px" marginBottom="6px">성별</FieldLabel>
              <GenderSelect
                value={form.gender}
                onChange={g => onChange({ gender: g })}
                accentColor={C.primary}
                bgColor="#FFF5F7"
                fontSize="15px"
                height="48px"
                unselectedColor="rgb(168 168 168)"
                border="none"
                indicatorBoxShadow="0 4px 12px rgba(255,117,140,0.18)"
                icon={isSelected => <HeartIcon filled={isSelected} />}
                textStrokeWidth="0.2px"
              />
            </motion.div>

            {/* 생년월일 */}
            <motion.div className="flex flex-col w-full" style={{ marginTop: '22px' }} variants={FADE_UP}>
              <FieldLabel color="#666666" fontSize="13px" marginBottom="6px">
                생년월일 (양력 기준으로 입력해 주세요)
              </FieldLabel>
              <BirthInput
                value={form.birthday}
                onChange={v => onChange({ birthday: v })}
                accentColor={C.primary}
                bgColor="#FFF5F7"
                borderColor="transparent"
                textColor={C.text}
                fontSize="16px"
                height="54px"
                onEnter={onSubmit}
                autoFocus={false}
                textStrokeWidth="0.2px"
              />
            </motion.div>

            {/* 태어난 시간 */}
            <motion.div className="flex flex-col w-full" style={{ marginTop: '22px' }} variants={FADE_UP}>
              <FieldLabel color="#666666" fontSize="13px" marginBottom="6px">태어난 시간</FieldLabel>
              <TimeSelectSheet
                value={form.birthTime}
                unknownTime={form.birthTimeUnknown}
                onSelect={(displayTime, isUnknown) => onChange({ birthTime: displayTime, birthTimeUnknown: isUnknown })}
                accentColor={C.primary}
                bgColor="#FFF5F7"
                borderColor="none"
                textColor={C.text}
                placeholderColor={C.textTertiary}
                sheetBgColor="#FFFFFF"
                sheetTextColor={C.text}
                dragHandleColor="#FFD1DC"
                hoverBgClass="hover:bg-black/[0.03]"
                selectedBgColor="rgba(255,138,158,0.12)"
                selectedTextColor={C.primary}
                fontSize="16px"
                height="54px"
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

            {/* 제출 버튼 */}
            <motion.div style={{ marginTop: '30px' }} variants={FADE_UP}>
              <PressableButton
                onClick={onSubmit}
                disabled={!isValid}
                label="내 인연 스팟 보기 💕"
                style={{ height: '58px' }}
                bgStyle={{
                  backgroundColor: isValid ? undefined : '#F2E6EA',
                  backgroundImage: isValid ? 'linear-gradient(135deg, #FF8A9E 0%, #FF9AAD 50%, #FFB3C6 100%)' : 'none',
                  borderRadius: '20px',
                  border: 'none',
                  boxShadow: isValid ? '0 8px 20px rgba(255, 138, 158, 0.45)' : 'none',
                }}
                hoverBackground={C.primaryHover}
                textStyle={{
                  color: isValid ? C.textOnPrimary : '#B5A0A7',
                  fontWeight: 700,
                  fontSize: '16px',
                  letterSpacing: '-0.3px',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}