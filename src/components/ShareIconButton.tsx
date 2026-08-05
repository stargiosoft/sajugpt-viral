'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

const CIRCLE_STYLE = {
  width: 46,
  height: 46,
  borderRadius: '50%',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
} as const;

interface Props {
  ariaLabel: string;
  onClick: () => void;
  children: ReactNode;
  style?: CSSProperties;
  hoverBackground?: string;
}

export default function ShareIconButton({ ariaLabel, onClick, children, style, hoverBackground }: Props) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      whileHover={hoverBackground ? { backgroundColor: hoverBackground } : { filter: 'brightness(1.08)' }}
      whileTap={hoverBackground ? { backgroundColor: hoverBackground } : { filter: 'brightness(1.08)' }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
      style={{ ...CIRCLE_STYLE, ...style }}
    >
      {children}
    </motion.button>
  );
}
