'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CREW_MEMBERS, CREW_ORDER } from '@/constants/stock';

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
  return (
    <div className="flex flex-col" style={{
      minHeight: '100%',
      backgroundColor: COLOR_BG,
    }}>
      <div className="flex-1 flex flex-col" style={{
        padding: '0 20px',
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
            borderRadius: '20px',
            backgroundColor: COLOR_CARD,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.28)',
            padding: '24px 20px',
            marginBottom: '32px',
          }}
        >
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
      </div>

      {/* ─── 하단 CTA ─── */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '768px',
        padding: '16px 20px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: `linear-gradient(transparent, ${COLOR_BG} 30%)`,
        pointerEvents: 'auto',
      }}>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5, ease: sectionEase }}
          whileHover={{ filter: 'brightness(1.08)', transition: { duration: 0.15, ease: 'easeOut' } }}
          whileTap={{ filter: 'brightness(0.92)', scale: 0.995, transition: { duration: 0.15, ease: 'easeOut' } }}
          onClick={onStart}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            backgroundColor: COLOR_BRAND,
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '-0.32px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          시작하기
        </motion.button>
      </div>
    </div>
  );
}
