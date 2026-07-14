'use client';

import { useEffect, useId, useState, type MouseEventHandler, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GHOST_BRUSH_FONT } from '@/lib/ghost-tarot/theme';

interface Props {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  fontSize?: number;
  /** 웹(768px 이상)에서만 다르게 쓸 폰트 크기 — 없으면 fontSize 그대로 */
  webFontSize?: number;
  /** 320px급 좁은 화면(360px 이하)에서만 다르게 쓸 폰트 크기 — 없으면 fontSize 그대로 */
  narrowFontSize?: number;
  fontFamily?: string;
  disabled?: boolean;
}

// 프로젝트 공통 md: 브레이크포인트(768px)와 동일 기준으로 웹/모바일 판별
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isDesktop;
}

// 320px급 좁은 화면(아이폰 SE 등) 전용 분기 — useIsDesktop과 별개
function useIsNarrow() {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const update = () => setIsNarrow(window.innerWidth <= 360);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isNarrow;
}

const VARIANT_STYLE = {
  primary: {
    height: 52,
    fontSize: 22,
    color: '#f5ebe0',
    background: 'rgb(179,47,23)',
    stroke: '#8a6d3b',
    glow: 'none',
  },
  secondary: {
    height: 50,
    fontSize: 16,
    color: '#d9cbb4',
    background: 'linear-gradient(160deg, #16110b 0%, #0c0906 55%, #050403 100%)',
    stroke: '#8a6d3b',
    glow: 'none',
  },
} as const;

export default function GhostSealButton({ children, variant = 'primary', onClick, className, fontSize, webFontSize, narrowFontSize, fontFamily, disabled }: Props) {
  const style = VARIANT_STYLE[variant];
  const filterId = `ghost-seal-rough-${useId().replace(/[:]/g, '')}`;
  const isDesktop = useIsDesktop();
  const isNarrow = useIsNarrow();
  const resolvedFontSize = isDesktop && webFontSize
    ? webFontSize
    : (!isDesktop && isNarrow && narrowFontSize !== undefined ? narrowFontSize : (fontSize ?? style.fontSize));
  const resolvedHeight = isDesktop ? style.height : (isNarrow ? 48 : style.height);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={disabled ? undefined : { filter: 'brightness(0.88)' }}
      whileTap={disabled ? undefined : { filter: 'brightness(0.8)', scale: 0.995 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        width: '100%',
        height: resolvedHeight,
        padding: '0 20px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        position: 'relative',
        background: style.background,
        border: 'none',
        borderRadius: 12,
        boxShadow: style.glow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 피가 끓는 듯한 은은한 텍스처 움직임 (primary만) */}
      {variant === 'primary' && (
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,110,60,.16), transparent 55%), radial-gradient(circle at 80% 70%, rgba(60,0,0,.22), transparent 55%), radial-gradient(circle at 50% 100%, rgba(255,70,30,.12), transparent 60%)',
            backgroundSize: '220% 220%',
            mixBlendMode: 'soft-light',
          }}
          animate={{ backgroundPosition: ['0% 40%', '100% 60%', '40% 100%', '0% 40%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* 사선 빛줄기가 좌→우로 흐르는 CTA 강조 효과 (primary만, 귀신타로 이어보기 버튼과 동일) */}
      {variant === 'primary' && (
        <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 12, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              left: '-55%',
              width: '45%',
              height: '160%',
              transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, transparent 0%, rgba(150,39,20,0.55) 50%, transparent 100%)',
              animation: 'ghost-cta-sheen 4s linear infinite',
            }}
          />
        </div>
      )}

      {/* 지글거리는 손그림 느낌의 테두리 (secondary만) */}
      {variant === 'secondary' && (
        <svg
          aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
        >
          <defs>
            <filter id={filterId} x="-20%" y="-100%" width="140%" height="300%">
              <feTurbulence type="fractalNoise" baseFrequency="0.5 0.2" numOctaves="2" seed="6" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect
            x="1.5"
            y="1.5"
            style={{ width: 'calc(100% - 3px)', height: 'calc(100% - 3px)' }}
            rx="3"
            fill="none"
            stroke={style.stroke}
            strokeWidth="1"
            opacity="0.75"
            filter={`url(#${filterId})`}
          />
        </svg>
      )}

      <span
        style={{
          fontFamily: fontFamily ?? GHOST_BRUSH_FONT,
          fontSize: resolvedFontSize,
          color: style.color,
          letterSpacing: '1px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </span>
    </motion.button>
  );
}
