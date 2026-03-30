'use client';

import { motion } from 'framer-motion';
import type { CoronerId } from '@/types/autopsy';
import { CORONERS } from '@/constants/autopsy';

interface Props {
  value: CoronerId | null;
  onChange: (v: CoronerId) => void;
}

export default function CoronerSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
        검시관을 선택하세요
      </p>
      <div className="flex gap-3">
        {CORONERS.map((coroner) => {
          const selected = value === coroner.id;
          return (
            <motion.button
              key={coroner.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(coroner.id)}
              className="flex-1 flex flex-col items-center gap-2"
              style={{
                padding: '16px 12px',
                borderRadius: '16px',
                border: selected ? '2px solid #7A38D8' : '2px solid #eee',
                backgroundColor: selected ? '#F7F2FA' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div className="overflow-hidden transform-gpu" style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: selected ? '2px solid #7A38D8' : '2px solid #eee',
              }}>
                <img
                  src={coroner.thumbnail}
                  alt={coroner.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: selected ? '#7A38D8' : '#333' }}>
                {coroner.name}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#999',
                padding: '2px 8px',
                borderRadius: '8px',
                backgroundColor: selected ? '#E8D5F5' : '#f5f5f5',
              }}>
                {coroner.tone}
              </span>
              <span style={{ fontSize: '12px', color: '#777', textAlign: 'center', lineHeight: '1.4' }}>
                {coroner.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
