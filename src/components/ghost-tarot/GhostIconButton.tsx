'use client';

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

const CIRCLE_STYLE = {
  width: 46,
  height: 46,
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(232,223,208,0.06)',
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

export default function GhostIconButton({ ariaLabel, onClick, children, style, hoverBackground }: Props) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      whileHover={{ backgroundColor: hoverBackground ?? 'rgba(232,223,208,0.18)' }}
      whileTap={{ scale: .995 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{ ...CIRCLE_STYLE, ...style }}
    >
      {children}
    </motion.button>
  );
}
