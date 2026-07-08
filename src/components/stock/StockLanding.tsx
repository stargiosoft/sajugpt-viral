'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CREW_MEMBERS, CREW_ORDER } from '@/constants/stock';
import { copyToClipboard, shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';
import LandingCTAButton from '@/components/LandingCTAButton';

interface Props {
  onStart: () => void;
}

// ─── 토스 스타일 컬러 토큰 ────────────────────────────
const COLOR_BG = '#191F28';
const COLOR_CARD = '#202632';
const COLOR_UP = '#F04452';
const COLOR_TEXT_PRIMARY = '#F2F3F5';
const COLOR_TEXT_SECONDARY = '#8B95A1';
const COLOR_TEXT_TERTIARY = '#4E5968';
const COLOR_BRAND = '#7A38D8';

const SHARE_TEXT = '📉 당신의 연애 주가, 상장폐지 직전입니다\n사주로 분석한 내 연애 시세를 확인해보세요';

/** 지정된 지연 후 0에서 목표값까지 이징을 태워 올라가는 카운트업 */
function useCountUp(target: number, duration = 1600, delay = 400): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    let cancelled = false;
    const startTimer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return value;
}

function CountUpNumber({ target, duration, delay }: { target: number; duration?: number; delay?: number }) {
  const value = useCountUp(target, duration, delay);
  return <>{value.toLocaleString()}</>;
}

// ─── 스크램블 가격 카운터 ─────────────────────────────
function ScrambledPriceCounter() {
  const [scrambledPrice, setScrambledPrice] = useState('???,???');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const digits = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
      setScrambledPrice(`${digits[0]}${digits[1]},${digits[2]}${digits[3]}${digits[4]}`);
    }, 80);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex items-baseline gap-1">
      <span style={{
        fontSize: '44px',
        fontWeight: 800,
        color: COLOR_TEXT_PRIMARY,
        letterSpacing: '-1px',
        lineHeight: '52px',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {scrambledPrice}
      </span>
      <span style={{
        fontSize: '18px',
        fontWeight: 600,
        color: COLOR_TEXT_SECONDARY,
        letterSpacing: '-0.36px',
      }}>
        원
      </span>
    </div>
  );
}

// ─── 메인 컴포넌트 ───────────────────────────────────

const sectionEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

export default function StockLanding({ onStart }: Props) {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = useCallback(async () => {
    const origin = window.location.origin;
    const ok = await copyToClipboard(`${SHARE_TEXT}\n👉 ${origin}/stock`);
    if (ok) {
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('saju_stock_share_test_clipboard');
      trackShare('saju_stock', 'clipboard');
    }
  }, []);

  const handleKakaoShare = useCallback(() => {
    const origin = window.location.origin;
    const ok = shareKakao({
      title: '연애 주가 — 사주 시세 진단',
      description: '사주로 분석한 내 연애 시세를 확인해보세요',
      imageUrl: `${origin}/home/thumbnails/stock.jpg`,
      link: `${origin}/stock`,
      buttonText: '나도 해보기',
    });
    if (ok) {
      trackEvent('saju_stock_share_test_kakao');
      trackShare('saju_stock', 'kakao');
    } else {
      handleCopy();
    }
  }, [handleCopy]);

  const handleXShare = useCallback(() => {
    const origin = window.location.origin;
    const text = encodeURIComponent(SHARE_TEXT);
    const url = encodeURIComponent(`${origin}/stock`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    trackEvent('saju_stock_share_test_x');
    trackShare('saju_stock', 'x');
  }, []);

  return (
    <div className="flex flex-col" style={{
      minHeight: '100%',
      backgroundColor: COLOR_BG,
    }}>
      <div className="flex-1 flex flex-col" style={{
        padding: '0 12px',
        paddingBottom: '120px',
      }}>

        {/* 상단 여백 */}
        <div style={{ height: '48px' }} />

        {/* ─── 헤드라인 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: sectionEase }}
          style={{ marginBottom: '8px' }}
        >
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: COLOR_TEXT_PRIMARY,
            lineHeight: '45px',
            letterSpacing: '-0.52px',
          }}>
            당신의 연애 주가,<br />
            <span style={{ color: COLOR_UP }}>상장폐지</span> 직전입니다
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: sectionEase }}
          style={{
            fontSize: '15px',
            fontWeight: 400,
            color: COLOR_TEXT_SECONDARY,
            lineHeight: '26px',
            letterSpacing: '-0.3px',
            marginBottom: '32px',
            paddingLeft: '4px',
          }}
        >
          사주로 분석한 당신의 연애 시세.<br />
          지금 확인하지 않으면 이유도 모른 채 <span style={{ color: COLOR_UP, fontWeight: 600 }}>떡락</span>합니다.
        </motion.p>

        {/* ─── 종목 리포트 미리보기 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: sectionEase }}
          style={{
            position: 'relative',
            borderRadius: '20px',
            backgroundColor: COLOR_CARD,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.16)',
            padding: '24px 20px',
            marginBottom: '32px',
          }}
        >
          {/* 실시간 분석중 배지 */}
          <div
            className="flex items-center"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(122, 56, 216, 0.12)',
            }}
          >
            <motion.span
              className="shrink-0"
              style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: COLOR_BRAND }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600, color: COLOR_BRAND, letterSpacing: '-0.22px' }}>
              실시간 분석중
            </span>
          </div>

          {/* 현재가 */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 400,
              color: COLOR_TEXT_SECONDARY,
              letterSpacing: '-0.26px',
              marginBottom: '4px',
            }}>
              당신의 현재가
            </span>
            <ScrambledPriceCounter />
          </div>

          {/* 미니 차트 (SVG, 좌→우 드로잉 애니메이션) */}
          <svg width="100%" height="48" viewBox="0 0 300 48" preserveAspectRatio="none">
            <motion.path
              d="M0,30 C30,28 50,32 80,26 C110,20 130,35 160,38 C190,41 210,24 240,18 C260,14 280,8 300,4"
              fill="none"
              stroke={COLOR_BRAND}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.9, duration: 1.2, ease: 'easeOut' }}
            />
          </svg>

          {/* 푸터 */}
          <div className="flex items-center justify-between" style={{ marginTop: '20px' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 600,
              color: COLOR_TEXT_SECONDARY,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '4px 7px 3px',
              borderRadius: '8px',
              letterSpacing: '0px',
            }}>
              생년월일 입력 시 공개
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: 500,
              color: COLOR_TEXT_TERTIARY,
            }}>
              사주증권 리서치센터
            </span>
          </div>
        </motion.div>

        {/* ─── 조작단 아바타 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: sectionEase }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center" style={{ paddingLeft: '2px' }}>
            {CREW_ORDER.map((id, index) => {
              const crew = CREW_MEMBERS[id];
              const bobDelay = 0.9 + index * 0.15;
              return (
                <motion.div
                  key={id}
                  className="overflow-hidden shrink-0 transform-gpu"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    marginLeft: index === 0 ? 0 : '-10px',
                    border: `2px solid ${COLOR_BG}`,
                    position: 'relative',
                    zIndex: CREW_ORDER.length - index,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: [0, -4, 0] }}
                  transition={{
                    opacity: { delay: bobDelay, duration: 0.4 },
                    y: { delay: bobDelay, duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' },
                  }}
                >
                  <img src={crew.image} alt={crew.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              );
            })}
          </div>
          <span style={{
            fontSize: '14px',
            fontWeight: 500,
            color: COLOR_TEXT_SECONDARY,
            letterSpacing: '-0.26px',
          }}>
            조작단 3인이 당신의 시세를 분석 중이에요
          </span>
        </motion.div>

        {/* ─── 참여자수 + 공유하기 ─── */}
        <motion.div
          className="flex flex-col items-center w-full"
          style={{ marginTop: '48px' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <div className="flex items-center justify-center w-full" style={{ gap: '48px' }}>
            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: COLOR_TEXT_SECONDARY, letterSpacing: '-0.26px' }}>참여자수</span>
              <span style={{ fontSize: '26px', fontWeight: 800, color: COLOR_TEXT_PRIMARY, letterSpacing: '-0.4px', fontVariantNumeric: 'tabular-nums' }}>
                <CountUpNumber target={98412} />
              </span>
            </div>

            <div className="flex flex-col items-center" style={{ gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: COLOR_TEXT_SECONDARY, letterSpacing: '-0.26px' }}>공유하기</span>
              <span style={{ fontSize: '26px', fontWeight: 800, color: COLOR_BRAND, letterSpacing: '-0.4px', fontVariantNumeric: 'tabular-nums' }}>
                <CountUpNumber target={12683} delay={500} />
              </span>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: '16px', marginTop: '20px' }}>
            <motion.button
              type="button"
              aria-label="카카오톡으로 공유"
              onClick={handleKakaoShare}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="transform-gpu"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#FEE500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3C6.477 3 2 6.68 2 11.2c0 2.9 1.85 5.44 4.63 6.9-.2.75-.73 2.7-.84 3.12-.13.5.18.5.38.36.16-.11 2.53-1.72 3.56-2.42.7.1 1.44.15 2.27.15 5.523 0 10-3.68 10-8.2S17.523 3 12 3z"
                  fill="#191600"
                />
              </svg>
            </motion.button>

            <motion.button
              type="button"
              aria-label="X에 공유"
              onClick={handleXShare}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="transform-gpu"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13.6 10.6 20.9 2h-1.7l-6.3 7.5L7.8 2H2l7.7 11.2L2 22h1.7l6.7-8 5.4 8H22l-8-11.4Zm-2.4 2.8-.8-1.1L4 3.3h2.6l5 7.2.8 1.1 6.6 9.4h-2.6l-5.2-7.6Z"
                  fill={COLOR_TEXT_PRIMARY}
                />
              </svg>
            </motion.button>

            <motion.button
              type="button"
              aria-label="링크 복사"
              onClick={handleCopy}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="transform-gpu"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: copied ? 'rgba(122, 56, 216, 0.18)' : 'rgba(255,255,255,0.06)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {copied ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke={COLOR_BRAND} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </motion.button>
          </div>
          {copied && (
            <p style={{ fontSize: '12px', color: COLOR_BRAND, fontWeight: 600, marginTop: '12px' }}>
              링크가 복사됐어요!
            </p>
          )}
        </motion.div>
      </div>

      {/* ─── 하단 CTA ─── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '768px',
        padding: '16px 12px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: `linear-gradient(transparent, ${COLOR_BG} 30%)`,
        pointerEvents: 'auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5, ease: sectionEase }}
        >
          <LandingCTAButton onClick={onStart} label="시작하기" background={COLOR_BRAND} />
        </motion.div>
      </div>
    </div>
  );
}
