'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { PRESS_HOVER_PROPS } from '@/lib/motionPresets';

interface Props {
  isValid: boolean;
  onClick: () => void;
  label: ReactNode;
  containerBackground: string;
  containerBoxShadow?: string;
  activeBackground: string;
  inactiveBackground: string;
  activeBoxShadow?: string;
  activeTextColor?: string;
  inactiveTextColor: string;
  fontWeight: number;
  lineHeight?: string;
  letterSpacing?: string;
}

// 하단 고정 CTA 바 — 입력 폼 유효성에 따라 활성/비활성 스타일만 바뀌고
// 색상/그림자/문구는 테스트별로 다르다.
export default function StickyCTAButton({
  isValid,
  onClick,
  label,
  containerBackground,
  containerBoxShadow,
  activeBackground,
  inactiveBackground,
  activeBoxShadow,
  activeTextColor = '#fff',
  inactiveTextColor,
  fontWeight,
  lineHeight,
  letterSpacing,
}: Props) {
  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-start w-full z-10 pointer-events-auto"
      style={{
        maxWidth: '768px',
        background: containerBackground,
        boxShadow: containerBoxShadow,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div style={{ padding: '12px 20px', width: '100%' }}>
        <div style={{ position: 'relative', height: '56px' }}>
          <motion.div
            onClick={isValid ? onClick : undefined}
            className="transform-gpu"
            {...(isValid ? PRESS_HOVER_PROPS : {})}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              background: isValid ? activeBackground : inactiveBackground,
              boxShadow: isValid ? activeBoxShadow : undefined,
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
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
            <p
              style={{
                fontSize: '16px',
                fontWeight,
                lineHeight,
                letterSpacing,
                color: isValid ? activeTextColor : inactiveTextColor,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
