'use client';

import { motion } from 'framer-motion';
import type { CauseOfDeathInput } from '@/types/autopsy';
import { CAUSE_OF_DEATH_INPUTS } from '@/constants/autopsy';

interface Props {
  value: CauseOfDeathInput | null;
  onChange: (v: CauseOfDeathInput) => void;
}

export default function CauseOfDeathSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
        이 놈의 사인(死因)은?
      </p>
      {CAUSE_OF_DEATH_INPUTS.map((item) => {
        const selected = value === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(item.id)}
            className="flex items-center gap-3 w-full"
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              border: selected ? '2px solid #7A38D8' : '2px solid #eee',
              backgroundColor: selected ? '#F7F2FA' : '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '22px' }}>{item.emoji}</span>
            <div className="flex flex-col">
              <span style={{ fontSize: '15px', fontWeight: 600, color: selected ? '#7A38D8' : '#333' }}>
                {item.label}
              </span>
              <span style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                {item.description}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
