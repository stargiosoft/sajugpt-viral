'use client';

import { motion } from 'framer-motion';

interface Props {
  label: string;
  value: number;
  color?: string;
}

export default function StatBar({ label, value, color = '#7A38D8' }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span style={{ fontSize: '13px', color: '#D1D5DB', fontWeight: 600, width: '32px', flexShrink: 0 }}>
        {label}
      </span>
      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
        />
      </div>
      <span style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 700, width: '28px', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}
