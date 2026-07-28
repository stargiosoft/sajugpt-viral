'use client';

import type { CSSProperties, ReactNode } from 'react';

import PressableButton from '@/components/PressableButton';
import { GHOST_BRUSH_FONT } from '@/lib/ghost-tarot/theme';
import { useIsDesktop, useIsNarrow } from '@/lib/ghost-tarot/useBreakpoint';

interface Props {
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  bgStyle?: CSSProperties;
  hoverBackground?: string;
  shineColor?: string;
}

export default function GhostCTAButton({ label, onClick, href, target, rel, disabled, bgStyle, hoverBackground, shineColor }: Props) {
  const isDesktop = useIsDesktop();
  const isNarrow = useIsNarrow();

  return (
    <PressableButton
      label={label}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      disabled={disabled}
      style={{ height: isDesktop ? 52 : (isNarrow ? 48 : 52) }}
      bgStyle={bgStyle}
      hoverBackground={hoverBackground}
      shineColor={shineColor}
      textStyle={{ fontFamily: GHOST_BRUSH_FONT, fontSize: isDesktop ? 21 : (isNarrow ? 20 : 21), fontWeight: 400, color: '#f5ebe0', letterSpacing: '1px' }}
    />
  );
}
