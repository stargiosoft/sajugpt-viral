'use client';

import { motion } from 'framer-motion';
import { FADE_UP } from '@/constants/coupleGuideTheme';

interface Props {
  title: string;
  subtitle: string;
}

export default function RelationshipTitle({ title, subtitle }: Props) {
  return (
    <motion.div
      variants={FADE_UP as any}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center"
      style={{ textAlign: 'center', marginTop: '-4px', paddingTop: 0, paddingBottom: '4px', paddingLeft: '12px', paddingRight: '12px' }}
    >
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#000000', lineHeight: 1.3, letterSpacing: '-0.5px' }}>{title}</h2>
      <p style={{ marginTop: '6px', fontSize: '16px', color: 'rgb(96 96 96)', letterSpacing: '-0.5px' }}>{subtitle}</p>
    </motion.div>
  );
}