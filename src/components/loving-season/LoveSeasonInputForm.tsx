'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';

import type { LovingSeasonInput } from '@/types/loving-season';

interface Props {
  form: LovingSeasonInput;
  onChange: (patch: Partial<LovingSeasonInput>) => void;
  onSubmit: () => void;
  errorMessage?: string | null;
  onLeftKeyClick?: () => void;
  onCenterKeyClick?: () => void;
  onRightKeyClick?: () => void;
}

const PRETENDARD_FONT = "'Pretendard Variable', Pretendard, sans-serif";
const PIXEL_FONT = "'DungGeunMo', 'NeoDunggeunmo', monospace";

export function LoveSeasonInputForm({
  form,
  onChange,
  onSubmit,
  errorMessage,
  onLeftKeyClick,
  onCenterKeyClick,
  onRightKeyClick,
}: Props) {
  const valid = useMemo(() => {
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(form.birthday) &&
      !!form.gender &&
      !!form.birthTime
    );
  }, [form]);

  const handleCenterClick = () => {
    if (onCenterKeyClick) onCenterKeyClick();
    if (valid) onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-90 md:max-w-155 mx-auto py-2 pb-8 md:py-6 md:pb-12 px-0 box-border"
      style={{
        fontFamily: PRETENDARD_FONT,
      }}
    >
      {/* 도트 폰트 및 PC 전용 반응형 스타일 지정 */}
      <style jsx global>{`
        @font-face {
          font-family: 'DungGeunMo';
          src: url('https://cdn.jsdelivr.net/gh/fontbee/font@main/Orioncactus/DungGeunMo.woff')
            format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'NeoDunggeunmo';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.3/NeoDunggeunmo.woff')
            format('woff');
          font-weight: normal;
          font-display: swap;
        }
      `}</style>

      {/* 1. 전체 화면 레트로 프레임 */}
      <div
        className="relative w-full min-h-155 md:min-h-180 rounded-[28px] md:rounded-[40px] overflow-hidden flex flex-col items-center justify-center p-6 md:p-10 box-border"
        style={{
          backgroundImage: 'url(/loving-season/images/lovingseason-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: '2px solid #FFFFFF',
          boxShadow: `
            0 12px 30px rgba(255, 120, 160, 0.25),
            inset 0 2px 6px rgba(255, 255, 255, 0.85)
          `,
        }}
      >
        {/* 배경 픽셀 그리드 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.2,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)
            `,
            backgroundSize: '18px 18px',
          }}
        />

        {/* CRT Scanline */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.06,
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(90,40,65,0.4) 0px, rgba(90,40,65,0.4) 1px, transparent 1px, transparent 4px)',
          }}
        />

        {/* 상단 레트로 상태바 */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative z-10 mb-3 md:mb-5 px-3 md:px-5 py-1.5 md:py-2 bg-[#8E3E5E] border-[1.5px] md:border-2 border-[#66263F] rounded-md md:rounded-lg shadow-[0_2px_0_#66263F] text-[#FFEAF2] text-[8px] md:text-[12px] font-black tracking-wider text-center flex items-center gap-1.5 md:gap-2"
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
          }}
        >
          <span>LOVE DATA</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-[#FFB8CC]"
              style={{
                boxShadow: '0 0 6px #FFB8CC',
              }}
            />
            READY
          </span>
        </motion.div>

        {/* 2. 다마고치 본체 (반응형 비율 가변 340px -> 500px) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="relative z-0 w-full max-w-85 md:max-w-120 mt-1 md:mt-2"
          style={{
            aspectRatio: '636 / 680',
            backgroundImage: 'url(/loving-season/images/tamagotchi-body.png)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'drop-shadow(0 12px 10px rgba(100, 35, 65, 0.22))',
          }}
        >
          {/* LCD 액정 화면 */}
          <div
            style={{
              position: 'absolute',
              top: '22%',
              left: '22%',
              width: '56%',
              height: '60%',
              borderRadius: '10px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflow: 'hidden',
              background: 'rgba(255, 184, 205, 0.18)',
            }}
            className="p-2 md:p-4"
          >
            {/* LCD 픽셀 패턴 Grid */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                opacity: 0.13,
                backgroundImage: `
                  linear-gradient(rgba(130, 60, 85, 0.25) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(130, 60, 85, 0.25) 1px, transparent 1px)
                `,
                backgroundSize: '4px 4px',
              }}
            />

            {/* 화면 헤더 타이틀 */}
            <div
              className="relative z-10 w-full mt-0.5 md:mt-2 text-center text-[#71364F] font-bold leading-tight text-[11px] md:text-[15px]"
              style={{
                fontFamily: PIXEL_FONT,
              }}
            >
              ♥ 생년월일을 입력하면<br />
              연애 타이밍을 알려줄게 ♥
            </div>

            {/* 폼 입력 레이아웃 */}
            <div className="relative z-10 w-full flex flex-col gap-1 md:gap-2.5 my-auto">
              {/* 성별 선택 */}
              <GenderSelect
                value={form.gender}
                onChange={(gender) => onChange({ gender })}
                accentColor="#9C4767"
                bgColor="#FFF4F8"
                fontSize="10px"
                height="30px"
                unselectedColor="#A9788B"
                border="1.5px solid #B85A78"
                indicatorBoxShadow="none"
                textStrokeWidth="0px"
              />

              {/* 생년월일 입력 */}
              <BirthInput
                value={form.birthday}
                onChange={(birthday) => onChange({ birthday })}
                accentColor="#9C4767"
                bgColor="#FFF4F8"
                borderColor="#B85A78"
                textColor="#71364F"
                fontSize="10px"
                height="35px"
                onEnter={onSubmit}
                autoFocus={false}
                textStrokeWidth="0px"
              />

              {/* 시간 선택 */}
              <TimeSelectSheet
                value={form.birthTime === '모름' ? '' : form.birthTime}
                unknownTime={form.birthTime === '모름'}
                onSelect={(displayTime, isUnknown) =>
                  onChange({ birthTime: isUnknown ? '모름' : displayTime })
                }
                accentColor="#9C4767"
                bgColor="#FFF4F8"
                borderColor="#B85A78"
                textColor="#71364F"
                placeholderColor="#A9788B"
                sheetBgColor="#FFF5F9"
                sheetTextColor="#71364F"
                dragHandleColor="#D990A8"
                hoverBgClass="hover:bg-pink-50"
                selectedBgColor="#F3B3C8"
                selectedTextColor="#71364F"
                fontSize="10px"
                height="35px"
                arrowColor="#9C4767"
                textStrokeWidth="0px"
              />
            </div>

            {/* 에러 메시지 */}
            {errorMessage && (
              <div
                className="relative z-20 w-full px-1 py-0.5 md:py-1 bg-[#FFE0E9] border border-[#D8587E] rounded text-[#B52F58] font-semibold text-center text-[9px] md:text-[12px]"
                style={{
                  fontFamily: PIXEL_FONT,
                }}
              >
                ! {errorMessage}
              </div>
            )}

            {/* 상태 표시 */}
            <div
              className="relative z-10 mb-0.5 md:mb-1 font-semibold text-[10px] md:text-[13px]"
              style={{
                fontFamily: PIXEL_FONT,
                color: valid ? '#9C4767' : '#8F4A65',
              }}
            >
              {valid ? '● READY (버튼을 누르세요)' : '○ WAITING...'}
            </div>
          </div>

          {/* 3. 키패드 매핑 버튼 영역 */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 flex gap-8 md:gap-12 z-30">
            {/* 왼쪽 버튼 (◀) */}
            <motion.button
              type="button"
              aria-label="이전"
              whileTap={{ scale: 0.86 }}
              onClick={onLeftKeyClick}
              className="w-9 h-9 md:w-12 md:h-12 border-none rounded-full bg-transparent cursor-pointer outline-none select-none"
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            />

            {/* 중앙 버튼 (●) */}
            <motion.button
              type="button"
              aria-label="시작"
              whileTap={{ scale: 0.84 }}
              onClick={handleCenterClick}
              className="w-10 h-10 md:w-14 md:h-14 border-none rounded-full bg-transparent outline-none select-none"
              style={{
                cursor: valid ? 'pointer' : 'default',
                opacity: valid ? 1 : 0.85,
                WebkitTapHighlightColor: 'transparent',
              }}
            />

            {/* 오른쪽 버튼 (▶) */}
            <motion.button
              type="button"
              aria-label="다음"
              whileTap={{ scale: 0.86 }}
              onClick={onRightKeyClick}
              className="w-9 h-9 md:w-12 md:h-12 border-none rounded-full bg-transparent cursor-pointer outline-none select-none"
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            />
          </div>
        </motion.div>

        {/* 하단 브랜드 문구 */}
        <div
          className="relative z-10 mt-2 md:mt-4 px-3 md:px-5 py-1 md:py-1.5 bg-[#8E3E5E] border-[1.5px] md:border-2 border-[#66263F] rounded-md shadow-[0_2px_0_#6D2947] text-[#FFEAF2] text-[7px] md:text-[10px] font-black tracking-widest text-center"
          style={{
            fontFamily: '"Press Start 2P", "Courier New", monospace',
          }}
        >
          ♥ LOVE SEASON ♥
        </div>
      </div>
    </motion.div>
  );
}