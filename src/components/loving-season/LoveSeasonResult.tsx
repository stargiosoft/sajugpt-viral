'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import ShareRow from '@/components/ShareRow';
import ResultFooterSections from '@/components/ResultFooterSections';
import { useShareActions } from '@/lib/useShareActions';
import { trackSajuGPTClick } from '@/lib/analytics';
import { SAJUGPT_URL } from '@/constants/links';
import { SOLO_COLORS as C } from '@/constants/soloGuideTheme';
import { RESULT_GAPS } from '@/constants/layoutGaps';
import type { LovingSeasonRecord } from '@/types/loving-season';

interface Props {
  result: LovingSeasonRecord;
  onRestart: () => void;
  onLeftKeyClick?: () => void;
  onCenterKeyClick?: () => void;
  onRightKeyClick?: () => void;
}

const PRETENDARD_FONT = "'Pretendard Variable', Pretendard, sans-serif";
const PIXEL_FONT = "'DungGeunMo', 'NeoDunggeunmo', monospace";

// 연애의 계절 주요 테마 색상 정의
const LC_COLORS = {
  text: '#71364F',
  accent: '#9C4767',
  accentBorder: '#B85A78',
  bgAccent: '#FFE0E9',
  bgLcd: 'rgba(255, 184, 205, 0.18)',
  textRetro: '#8F4A65',
};

function lightenHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;

  const r = Math.min(255, parseInt(clean.slice(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(clean.slice(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(clean.slice(4, 6), 16) + amount);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function LoveSeasonResult({
  result,
  onRestart,
  onLeftKeyClick,
  onCenterKeyClick,
  onRightKeyClick,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0); // 0: 첫 계절만, 1: 나머지 계절들

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const resultId = result.resultId || '';
  const shareUrl = origin ? `${origin}/loving-season/${resultId}` : '';

  const firstSeason = result.firstSeason || '';
  const allSeasons = result.allSeasons || [];

  const { saving, handleSave } = useShareActions({
    featureType: 'loving_season',
    resultId,
    getShareText: () => shareUrl,
    imageFilename: `내연애의계절_${resultId}.png`,
  });

  const handlePrev = () => {
    setActiveStep(0);
    onLeftKeyClick?.();
  };

  const handleNext = () => {
    if (allSeasons.length > 0) {
      setActiveStep(1);
    }
    onRightKeyClick?.();
  };

  const handleCenter = () => {
    onRestart();
    onCenterKeyClick?.();
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
      {/* 도트 폰트 로드 */}
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

      <div ref={cardRef}>
        {/* 전체 화면 프레임 */}
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
                linear-gradient(
                  rgba(255,255,255,0.55) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.55) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: '18px 18px',
            }}
          />

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

          {/* 상단 레트로 상태바 (타이틀 뱃지) */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative z-10 mb-3 md:mb-5 px-3 md:px-5 py-1.5 md:py-2 bg-[#8E3E5E] border-[1.5px] md:border-2 border-[#66263F] rounded-md md:rounded-lg shadow-[0_2px_0_#66263F] text-[#FFEAF2] text-[8px] md:text-[12px] font-black tracking-wider text-center flex items-center gap-1.5 md:gap-2"
            style={{
              fontFamily: '"Press Start 2P", "Courier New", monospace',
            }}
          >
            <span>♥ LOVE CALENDAR RESULT ♥</span>
            <span
              className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-[#FFB8CC]"
              style={{
                boxShadow: '0 0 6px #FFB8CC',
              }}
            />
          </motion.div>

          {/* ★ 실제 다마고치 BODY (반응형 비율 가변 340px -> 480px) */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              delay: 0.12,
              duration: 0.5,
            }}
            className="relative z-0 w-full max-w-85 md:max-w-120 mt-1 md:mt-2"
            style={{
              aspectRatio: '636 / 680',
              backgroundImage:
                'url(/loving-season/images/tamagotchi-body.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter:
                'drop-shadow(0 12px 10px rgba(100, 35, 65, 0.22))',
            }}
          >
            {/*  LCD 액정 */}
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
                background: LC_COLORS.bgLcd,
              }}
              className="p-2 md:p-4"
            >
              {/* LCD 픽셀 패턴 */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  opacity: 0.13,
                  backgroundImage: `
                    linear-gradient(
                      rgba(130, 60, 85, 0.25) 1px,
                      transparent 1px
                    ),
                    linear-gradient(
                      90deg,
                      rgba(130, 60, 85, 0.25) 1px,
                      transparent 1px
                    )
                  `,
                  backgroundSize: '4px 4px',
                }}
              />

              {/* 내부에 들어가는 결과 콘텐츠 */}
              <div style={{ width: '100%', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-[16px] md:text-[22px] leading-tight mb-0.5 md:mb-1.5"
                >
                  {activeStep === 0 ? '💌' : '🌸'}
                </motion.div>

                {/* 안내 텍스트 상자 */}
                <div
                  className="w-full bg-white/92 px-2.5 py-1.5 md:py-2.5 rounded-lg text-[#71364F] font-semibold leading-tight mb-1.5 md:mb-3 box-border text-[10px] md:text-[14px]"
                  style={{
                    fontFamily: PIXEL_FONT,
                    border: `1px dashed ${LC_COLORS.accentBorder}`,
                  }}
                >
                  {activeStep === 0 ? (
                    <>
                      너에게 다가올<br />
                      연애 타이밍, 미리 확인해봐!
                    </>
                  ) : (
                    <>
                      앞으로 너의 연애 세포가<br />
                      터질 모든 타이밍이야!
                    </>
                  )}
                </div>

                {/* 결과 화면 슬라이드 페이징 */}
                <AnimatePresence mode="wait">
                  {activeStep === 0 ? (
                    /* 가장 가까운 연애 계절만 노출 */
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{ width: '100%' }}
                    >
                      <div
                        className="bg-[#FFF4F8] rounded-[10px] p-2 md:p-3.5 shadow-sm"
                        style={{
                          border: `1.5px solid ${LC_COLORS.accentBorder}`,
                        }}
                      >
                        <p
                          className="font-semibold text-[#8F4A65] m-0 mb-0.5 text-[10px] md:text-[13px]"
                          style={{ fontFamily: PIXEL_FONT }}
                        >
                          곧 다가올 연애 시그널
                        </p>
                        <p
                          className="font-bold text-[#9C4767] m-0 text-[16px] md:text-[22px]"
                          style={{ fontFamily: PIXEL_FONT }}
                        >
                          {firstSeason || '분석 중'}
                        </p>
                      </div>

                      {allSeasons.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          className="mt-1 md:mt-2 bg-transparent border-none text-[#8F4A65] font-semibold cursor-pointer inline-flex items-center gap-0.5 text-[10px] md:text-[13px]"
                          style={{ fontFamily: PIXEL_FONT }}
                        >
                          다음 연애 타이밍 확인 ▶
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    /* 다가오는 전체 계절 목록 노출 */
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      style={{ width: '100%' }}
                    >
                      <div
                        className="bg-[#FFF4F8] rounded-[10px] p-1.5 md:p-3 shadow-sm"
                        style={{
                          border: `1.5px solid ${LC_COLORS.accentBorder}`,
                        }}
                      >
                        <p
                          className="font-semibold text-[#8F4A65] m-0 mb-1 text-[10px] md:text-[13px]"
                          style={{ fontFamily: PIXEL_FONT }}
                        >
                          앞으로 다가올 연애 시그널
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {allSeasons.map((season, idx) => (
                            <span
                              key={idx}
                              className="bg-white border border-[#D990A8] rounded-md px-1.5 py-0.5 font-semibold text-[#71364F] text-[10px] md:text-[13px]"
                              style={{ fontFamily: PIXEL_FONT }}
                            >
                              {season}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        className="mt-1 md:mt-2 bg-transparent border-none text-[#8F4A65] font-semibold cursor-pointer inline-flex items-center gap-0.5 text-[10px] md:text-[13px]"
                        style={{ fontFamily: PIXEL_FONT }}
                      >
                        ◀ 가까운 연애 타이밍 보기
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 하단 페이징 인디케이터 도트 */}
              {allSeasons.length > 0 && (
                <div className="flex gap-1 mb-0.5 md:mb-1 z-20">
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor:
                        activeStep === 0 ? LC_COLORS.accent : '#D990A8',
                    }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor:
                        activeStep === 1 ? LC_COLORS.accent : '#D990A8',
                    }}
                  />
                </div>
              )}
            </div>

            {/* =====================================================
                3. 키패드 매핑 버튼 영역 (반응형 간격 및 크기 조절)
            ===================================================== */}
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 flex gap-8 md:gap-12 z-30">
              {/* 왼쪽 버튼 (◀) */}
              <motion.button
                type="button"
                aria-label="이전"
                whileTap={{ scale: 0.86 }}
                onClick={handlePrev}
                className="w-9 h-9 md:w-12 md:h-12 border-none rounded-full bg-transparent cursor-pointer outline-none select-none"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                }}
              />

              {/* 중앙 버튼 (● - 다시하기) */}
              <motion.button
                type="button"
                aria-label="시작"
                whileTap={{ scale: 0.84 }}
                onClick={handleCenter}
                className="w-10 h-10 md:w-14 md:h-14 border-none rounded-full bg-transparent cursor-pointer outline-none select-none"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                }}
              />

              {/* 오른쪽 버튼 (▶) */}
              <motion.button
                type="button"
                aria-label="다음"
                whileTap={{ scale: 0.86 }}
                onClick={handleNext}
                className="w-9 h-9 md:w-12 md:h-12 border-none rounded-full bg-transparent cursor-pointer outline-none select-none"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* 액션 버튼 및 하단 영역 */}
      <div
        style={{
          marginTop: RESULT_GAPS.actionsToShare ?? '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <PressableButton
            onClick={onRestart}
            label="다시하기"
            style={{ flex: 1, height: '48px' }}
            bgStyle={{ backgroundColor: LC_COLORS.bgAccent, borderRadius: '12px' }}
            hoverBackground={lightenHex(LC_COLORS.accent, 60)}
            textStyle={{
              color: LC_COLORS.text,
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: PRETENDARD_FONT,
            }}
          />
          <PressableButton
            onClick={() => handleSave(cardRef)}
            label={saving ? '저장 중...' : '이미지 저장'}
            disabled={saving}
            style={{ flex: 1, height: '48px' }}
            bgStyle={{
              backgroundColor: LC_COLORS.accent,
              borderRadius: '12px',
            }}
            hoverBackground={C.primaryHover}
            textStyle={{
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: PRETENDARD_FONT,
            }}
          />
        </div>

        <OutlineBoxButton
          onClick={() => {
            trackSajuGPTClick('loving_season', resultId);
            window.open(SAJUGPT_URL, '_blank');
          }}
          height="48px"
          color={LC_COLORS.accent}
          background="rgba(255, 255, 255, 0.7)"
          borderRadius="12px"
        >
          <span
            style={{
              fontSize: '13px',
              fontFamily: PRETENDARD_FONT,
              letterSpacing: '-0.3px',
              fontWeight: 700,
            }}
          >
            내 연애 고민, 사주GPT에게 물어보기
          </span>
        </OutlineBoxButton>

        {/* ShareRow */}
        <ShareRow
          shareContent={{
            featureType: 'loving_season',
            title: `💘 내 연애 계절은: ${firstSeason}`,
            description: '사주가 알려주는 내 솔로탈출 타이밍 확인하기',
            shareUrl: shareUrl,
            imageUrl: origin
              ? `${origin}/loving-season/og-share.jpg`
              : '/loving-season/og-share.jpg',
            testId: 'loving-season',
          }}
          copyColor={LC_COLORS.accent}
          copyHoverColor={lightenHex(LC_COLORS.accent, 20)}
          copyIconColor="#FFFFFF"
        />

        {/* ResultFooterSections */}
        <div style={{ marginTop: '16px' }}>
          <ResultFooterSections
            excludeId="loving_season"
            featureType="loving_season"
            resultId={resultId}
            themeColor={LC_COLORS.accent}
            titleStyle={{
              color: LC_COLORS.text,
              fontSize: '16px',
              fontWeight: 700,
            }}
            cardBg="#FFFFFF"
            cardTitleColor={LC_COLORS.text}
            storageKey="loving_season_comments"
            placeholder="연애 타이밍에 대한 소감을 남겨주세요!"
          />
        </div>
      </div>
    </motion.div>
  );
}