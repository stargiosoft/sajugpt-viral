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
  /** rgba 배경처럼 밝기(filter) 변화가 잘 안 보이는 어두운 배경용 — 호버 시 이 색으로 직접 전환 */
  hoverBackground?: string;
}

// "시작하기" 버튼과 동일한 프레스/호버 효과를 내는 공용 버튼 —
// 배경(애니메이션 레이어)과 텍스트(고정 레이어)를 분리해서 눌렀을 때 텍스트가 같이 움직이지 않는다.
export default function PressableButton({ label, onClick, href, target, rel, disabled, style, bgStyle, textStyle, hoverBackground }: Props) {
  const hoverProps = hoverBackground
    ? {
        whileHover: { backgroundColor: hoverBackground },
        whileTap: { backgroundColor: hoverBackground, filter: 'brightness(0.97)', scale: 0.995 },
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
        {...(disabled ? {} : hoverProps)}
        style={{
          position: 'absolute',
          inset: 0,
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textDecoration: 'none',
          ...bgStyle,
        }}
      />
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
