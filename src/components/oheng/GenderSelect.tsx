'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/types/oheng';

interface Props {
  value: Gender | null;
  onChange: (value: Gender) => void;
  accentColor?: string;
  bgColor?: string;
  unselectedColor?: string;
}

export default function GenderSelect({
  value,
  onChange,
  accentColor = '#2B2013',
  bgColor = '#EFE2C1',
  unselectedColor = '#9C8A63',
}: Props) {
  return (
    <div
      className="overflow-hidden isolate"
      style={{ backgroundColor: bgColor, borderRadius: '16px', padding: '8px' }}
    >
      <div className="flex gap-2">
        {(['female', 'male'] as const).map(g => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className="flex-1 flex items-center justify-between relative"
            style={{
              height: '48px',
              minWidth: 0,
              borderRadius: '12px',
              padding: '12px 20px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {value === g && (
              <motion.div
                layoutId="oheng-gender-indicator"
                className="absolute inset-0"
                style={{
                  backgroundColor: accentColor,
                  borderRadius: '12px',
                  boxShadow: '0px 2px 7px 0px rgba(0,0,0,0.12)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className="relative z-[1]"
              style={{
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: '20px',
                letterSpacing: '-0.45px',
                color: value === g ? '#F3E7C9' : unselectedColor,
                transition: 'color 0.2s',
              }}
            >
              {g === 'female' ? '여성' : '남성'}
            </span>
            <svg className="relative z-[1] shrink-0" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 11.625L10.3294 16L17 9"
                stroke={value === g ? '#F3E7C9' : unselectedColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                style={{ transition: 'stroke 0.2s' }}
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
