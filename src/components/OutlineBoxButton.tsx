'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode, MouseEvent } from 'react';
import { PRESS_HOVER_PROPS } from '@/lib/motionPresets';

interface Props {
  children: ReactNode;
  color: string;
  background?: string;
  border?: string;
  height?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: number;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
  hoverBackground?: string;
}

// 결과 화면 하단 보조 버튼("다시 해보기", "링크 복사" 등) 공용 박스 버튼 —
// 타이포(14px/600)와 프레스·호버 피드백은 고정, 배경/테두리/글자색만 테스트별로 다르게 넘긴다.
export default function OutlineBoxButton({
  children,
  color,
  background = 'transparent',
  border = 'none',
  height = '48px',
  borderRadius = '12px',
  fontSize = '14px',
  fontWeight = 600,
  href,
  target,
  rel,
  onClick,
  className,
  hoverBackground,
}: Props) {
  const hoverProps = hoverBackground
    ? {
        whileHover: { backgroundColor: hoverBackground },
        whileTap: { backgroundColor: hoverBackground, filter: 'brightness(0.88)', scale: 0.998 },
        transition: PRESS_HOVER_PROPS.transition,
      }
    : PRESS_HOVER_PROPS;

  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height,
    borderRadius,
    background,
    border,
    color,
    fontSize,
    fontWeight,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'filter 0.15s',
  };

  if (href) {
    return (
      <motion.a 
        href={href} 
        target={target} 
        rel={rel} 
        onClick={onClick} 
        className={className} 
        style={style} 
        {...hoverProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button 
      onClick={onClick} 
      className={className} 
      style={style} 
      {...hoverProps}
    >
      {children}
    </motion.button>
  );
}