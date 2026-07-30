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
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{ ...CIRCLE_STYLE, ...style }}
    >
      {children}
    </motion.button>
  );
}
