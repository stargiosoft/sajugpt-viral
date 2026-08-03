'use client';

import { motion } from 'framer-motion';
import type { TestCatalogItem, TestColorTheme } from '@/types/testCatalog';
import { CATEGORIES } from '@/constants/categories';
import { MOAMOA_ORANGE, MOAMOA_ORANGE_DARK } from '@/constants/theme';
import SectionStats from './SectionStats';

const THEME_STYLES: Record<TestColorTheme, { bg: string; fg: string }> = {
  orange: { bg: MOAMOA_ORANGE, fg: '#ffffff' },
  orangeDark: { bg: MOAMOA_ORANGE_DARK, fg: '#ffffff' },
  orangeLight: { bg: '#FFF1E6', fg: MOAMOA_ORANGE },
  graphite: { bg: '#3F3F46', fg: '#ffffff' },
  slate: { bg: '#6B7280', fg: '#ffffff' },
  mist: { bg: '#E5E5EA', fg: '#52525B' },
};

interface TestCardProps {
  item: TestCatalogItem;
  isNew?: boolean;
  onSelect: (item: TestCatalogItem) => void;
  selectedId?: string | null;
}

export default function TestCard({ item, isNew, onSelect, selectedId }: TestCardProps) {
  const theme = THEME_STYLES[item.colorTheme];
  const categoryLabel = CATEGORIES.find((c) => c.key === item.category)?.label ?? '';
  const isDimmed = !!selectedId && selectedId !== item.id;

  return (
    <motion.div
      onClick={() => { if (item.ready) onSelect(item); }}
      animate={{
        scale: isDimmed ? 0.9998 : 1,
        opacity: isDimmed ? 0.95 : item.ready ? 1 : 0.55,
      }}
      whileTap={item.ready ? { scale: 0.995 } : undefined}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group transform-gpu w-full"
      style={{
        cursor: item.ready ? 'pointer' : 'default',
        outline: 'none',
      }}
    >
      <motion.div
        whileTap={item.ready ? { filter: 'brightness(1.05)' } : undefined}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="relative w-full aspect-[4/3]"
        style={{
          borderRadius: '16px',
          backgroundColor: item.imageSrc ? undefined : theme.bg,
          overflow: 'hidden',
        }}
      >
        <div className="w-full h-full transition-transform duration-200 ease-out group-hover:scale-110 transform-gpu" style={{ borderRadius: 'inherit', overflow: 'hidden' }}>
          {item.imageSrc ? (
            <img
              src={item.imageSrc}
              alt=""
              className="w-full h-full"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontSize: '52px', lineHeight: 1 }}>{item.emoji}</span>
            </div>
          )}
        </div>

        <div
          className="flex items-center"
          style={{ position: 'absolute', left: '8px', bottom: '8px', gap: '4px' }}
        >
          <span
            className="inline-flex items-center"
            style={{
              fontSize: '10px',
              lineHeight: 1,
              fontWeight: 700,
              color: isNew ? '#ffffff' : '#0d0d0d',
              backgroundColor: isNew ? MOAMOA_ORANGE : 'rgba(255,255,255,0.92)',
              padding: '0 6px',
              borderRadius: '6px',
              letterSpacing: '-0.2px',
              height: '19px',
            }}
          >
            {isNew ? 'New' : `${item.participantLabel} 참여`}
          </span>
          {isNew && item.sajugptBadge && (
            <span
              className="inline-flex items-center"
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: '#7A38D8',
                padding: '0 6px',
                borderRadius: '6px',
                letterSpacing: '-0.2px',
                height: '19px',
              }}
            >
              <span style={{ display: 'block', lineHeight: 1, paddingTop: '1px' }}>사주GPT</span>
            </span>
          )}
        </div>

        {!item.ready && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff' }}>준비 중</span>
          </div>
        )}
      </motion.div>

      <div style={{ padding: '10px 2px 0' }}>
        <p
          style={{
            fontSize: '13.5px',
            fontWeight: 600,
            color: '#0d0d0d',
            letterSpacing: '-0.3px',
            lineHeight: '1.3',
            marginBottom: '3px',
            paddingBottom: '2px',
          }}
        >
          {item.title}
        </p>
        {isNew ? (
          <SectionStats plays={item.participantLabel} shares={item.shareLabel ?? '0'} />
        ) : (
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#757474', letterSpacing: '-0.2px' }}>{categoryLabel}</span>
        )}
      </div>
    </motion.div>
  );
}
