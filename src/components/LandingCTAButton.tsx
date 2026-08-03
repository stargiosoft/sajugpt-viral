'use client';

import type { CSSProperties, ReactNode } from 'react';
import PressableButton from '@/components/PressableButton';

interface Props {
  onClick: () => void;
  label: ReactNode;
  background: string;
  color?: string;
  hoverBackground?: string;
  height?: string;
  boxShadow?: string;
  textStyle?: CSSProperties;
}

export default function LandingCTAButton({ onClick, label, background, color = '#fff', hoverBackground, height = '56px', boxShadow, textStyle }: Props) {
  return (
    <PressableButton
      onClick={onClick}
      label={label}
      style={{ height }}
      bgStyle={{ background, borderRadius: '16px', boxShadow }}
      hoverBackground={hoverBackground}
      textStyle={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.32px', color, ...textStyle }}
    />
  );
}
