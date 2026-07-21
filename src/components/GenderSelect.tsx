'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Gender } from '@/types/battle';

interface Props {
  value: Gender;
  onChange: (value: Gender) => void;
  accentColor?: string;
  bgColor?: string;
  unselectedColor?: string;
  border?: string;
  indicatorBoxShadow?: string;
  icon?: (isSelected: boolean) => ReactNode;
  fontSize?: string;
  textStrokeWidth?: string;
  height?: string;
}

export default function GenderSelect({ value, onChange, accentColor = '#7A38D8', bgColor = '#f8f8f8', unselectedColor = '#b7b7b7', border = 'none', indicatorBoxShadow = '0px 2px 7px 0px rgba(0,0,0,0.12)', icon, fontSize = '15px', textStrokeWidth, height = '48px' }: Props) {
  return (
    <div
      className="overflow-hidden isolate"
      style={{ backgroundColor: bgColor, borderRadius: '16px', padding: '4px', border }}
    >
      <div className="flex gap-1">
        {(['female', 'male'] as const).map(g => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            className="flex-1 flex items-center justify-between relative"
            style={{
              height,
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
                layoutId="sexy-gender-indicator"
                className="absolute inset-0"
                style={{
                  backgroundColor: accentColor,
                  borderRadius: '12px',
                  boxShadow: indicatorBoxShadow,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className="relative z-[1]"
              style={{
                fontSize,
                fontWeight: 500,
                lineHeight: '20px',
                letterSpacing: '-0.45px',
                color: value === g ? '#fff' : unselectedColor,
                transition: 'color 0.2s',
                ...(textStrokeWidth ? { WebkitTextStroke: `${textStrokeWidth} ${value === g ? '#fff' : unselectedColor}` } : {}),
              }}
            >
              {g === 'female' ? '여성' : '남성'}
            </span>
            <span className="relative z-[1] shrink-0 flex items-center">
              {icon?.(value === g) ?? (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M7 11.625L10.3294 16L17 9"
                    stroke={value === g ? '#fff' : unselectedColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    style={{ transition: 'stroke 0.2s' }}
                  />
                </svg>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
