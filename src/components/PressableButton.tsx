'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { PRESS_HOVER_PROPS } from '@/lib/motionPresets';

interface Props {
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  style?: CSSProperties;
  bgStyle?: CSSProperties;
  textStyle?: CSSProperties;
  hoverBackground?: string;
  shineColor?: string;
}

export default function PressableButton({ label, onClick, href, target, rel, disabled, style, bgStyle, textStyle, hoverBackground, shineColor }: Props) {
  const restingBackground = bgStyle?.backgroundColor ?? bgStyle?.background;

  const hoverProps = hoverBackground
    ? {
        whileHover: { backgroundColor: hoverBackground },
        whileTap: { backgroundColor: hoverBackground, filter: 'brightness(0.88)', scale: 0.998 },
        transition: PRESS_HOVER_PROPS.transition,
      }
    : PRESS_HOVER_PROPS;

  const BgTag = href ? motion.a : motion.button;

  return (
    <div style={{ position: 'relative', height: '56px', ...style }}>
      <BgTag
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        disabled={href ? undefined : disabled}
        className="transform-gpu w-full h-full"
        animate={restingBackground !== undefined ? { backgroundColor: restingBackground } : undefined}
        {...(disabled ? {} : hoverProps)}
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textDecoration: 'none',
          ...bgStyle,
        }}
      />
      {shineColor && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            borderRadius: bgStyle?.borderRadius,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              left: '-55%',
              width: '45%',
              height: '160%',
              transform: 'skewX(-20deg)',
              background: `linear-gradient(90deg, transparent 0%, ${shineColor} 50%, transparent 100%)`,
              animation: 'ghost-cta-sheen 4s linear infinite',
            }}
          />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <p style={{ fontSize: '15px', fontWeight: 600, whiteSpace: 'nowrap', ...textStyle }}>
          {label}
        </p>
      </div>
    </div>
  );
}
