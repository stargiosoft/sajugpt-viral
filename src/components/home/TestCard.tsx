'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { TestCatalogItem, TestColorTheme } from '@/types/testCatalog';
import { MOAMOA_ORANGE, MOAMOA_ORANGE_DARK } from '@/constants/theme';
import SectionStats from './SectionStats';

// 실제 <a href>로 렌더링해 검색엔진이 크롤링할 수 있게 하면서, 클릭 시 선택 애니메이션 후
// 이동하는 기존 UX(180ms 지연)는 onClick에서 preventDefault로 유지한다.
const MotionLink = motion.create(Link);

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
  const isDimmed = !!selectedId && selectedId !== item.id;

  return (
    <MotionLink
      href={item.ready ? item.href : '#'}
      aria-label={item.title}
      onClick={(e) => {
        e.preventDefault();
        if (item.ready) onSelect(item);
      }}
      animate={{
        scale: isDimmed ? 0.9998 : 1,
        opacity: isDimmed ? 0.95 : item.ready ? 1 : 0.55,
      }}
      whileTap={item.ready ? { scale: 0.995 } : undefined}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group transform-gpu w-full block"
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
          borderRadius: '12px',
          backgroundColor: item.imageSrc ? undefined : theme.bg,
          overflow: 'hidden',
        }}
      >
        <div className="w-full h-full transition-transform duration-200 ease-out transform-gpu" style={{ borderRadius: 'inherit', overflow: 'hidden' }}>
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
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 'inherit', border: '1px solid rgba(0,0,0,0.06)' }}
        />

        <div
          className="flex items-center"
          style={{ position: 'absolute', left: '8px', bottom: '8px', gap: '4px' }}
        >
          {isNew && (
          <span
            className="inline-flex items-center"
            style={{
              fontSize: '10px',
              lineHeight: 1,
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: MOAMOA_ORANGE,
              padding: '0 6px',
              borderRadius: '6px',
              letterSpacing: '-0.2px',
              height: '19px',
            }}
          >
            New
          </span>
          )}
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
            fontSize: '15px',
            fontWeight: 700,
            color: '#0d0d0d',
            letterSpacing: '-0.1px',
            lineHeight: '1.3',
            marginBottom: '3px',
            paddingBottom: '2px',
          }}
        >
          {item.title}
        </p>
        <SectionStats plays={item.participantLabel} shares={item.shareLabel ?? '0'} />
      </div>
    </MotionLink>
  );
}
