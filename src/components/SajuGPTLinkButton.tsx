'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { SAJUGPT_URL } from '@/constants/links';
import { trackSajuGPTClick, type FeatureType } from '@/lib/analytics';

interface Props {
  featureType: FeatureType;
  color: string;
  hoverColor?: string;
  label?: ReactNode;
}

export default function SajuGPTLinkButton({ featureType, color, hoverColor, label = '사주GPT 바로가기' }: Props) {
  return (
    <motion.a
      href={SAJUGPT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackSajuGPTClick(featureType)}
      whileHover={hoverColor ? { color: hoverColor } : { opacity: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
      style={{
        display: 'block',
        marginTop: '24px',
        textAlign: 'center',
        color,
        fontFamily: 'Pretendard',
        fontSize: '13px',
        fontWeight: 600,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </motion.a>
  );
}
