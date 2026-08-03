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
  letterSpacing?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
  hoverBackground?: string;
}

export default function OutlineBoxButton({
  children,
  color,
  background = 'transparent',
  border = 'none',
  height = '48px',
  borderRadius = '12px',
  fontSize = '14px',
  fontWeight = 600,
  letterSpacing,
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
    letterSpacing,
    textDecoration: 'none',
    cursor: 'pointer',
    outline: 'none',
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