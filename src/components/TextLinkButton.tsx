'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  color: string;
  hoverColor?: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  underline?: boolean;
  className?: string;
  /** 레이아웃 전용 오버라이드(padding/display/textAlign 등) — 타이포 값은 무시된다 */
  layoutStyle?: CSSProperties;
}

// 모든 테스트 공용 텍스트 버튼("다른 테스트도 해보기", 다시하기, 홈으로 등) —
// 타이포/호버·탭 피드백은 고정, 색상만 테스트별로 다르게 넘긴다.
export default function TextLinkButton({
  children,
  color,
  hoverColor,
  href,
  onClick,
  target,
  rel,
  underline = false,
  className,
  layoutStyle,
}: Props) {
  const style: CSSProperties = {
    ...layoutStyle,
    color,
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: underline ? 'underline' : 'none',
    textUnderlineOffset: underline ? '3px' : undefined,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  const motionProps = {
    whileHover: hoverColor ? { color: hoverColor } : { opacity: 0.8 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.15, ease: 'easeOut' as const },
  };

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} onClick={onClick} className={className} style={style} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} className={className} style={style} {...motionProps}>
      {children}
    </motion.button>
  );
}
