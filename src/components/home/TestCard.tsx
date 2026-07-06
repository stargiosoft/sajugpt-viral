'use client';

import { motion } from 'framer-motion';
import type { TestCatalogItem, TestColorTheme } from '@/types/testCatalog';
import { CATEGORIES } from '@/constants/categories';

// White / Gray 스케일 / 홈 화면 브랜드 오렌지만 사용하는 썸네일 컬러 팔레트
const THEME_STYLES: Record<TestColorTheme, { bg: string; fg: string }> = {
  orange: { bg: '#FF7A1A', fg: '#ffffff' },
  orangeDark: { bg: '#E8600A', fg: '#ffffff' },
  orangeLight: { bg: '#FFF1E6', fg: '#FF7A1A' },
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
      {/* 썸네일 (가로형) — 박스는 고정, 내부 이미지만 확대되어 클리핑됨 */}
      <motion.div
        whileTap={item.ready ? { filter: 'brightness(1.05)' } : undefined}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="relative transform-gpu w-full aspect-[4/3]"
        style={{
          borderRadius: '16px',
          backgroundColor: theme.bg,
          overflow: 'hidden',
        }}
      >
        <div className="w-full h-full transition-transform duration-200 ease-out group-hover:scale-110">
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

        {/* 좌측 하단 오버레이: NEW 라벨 또는 참여 수 */}
        <span
          style={{
            position: 'absolute',
            left: '8px',
            bottom: '8px',
            fontSize: '11px',
            fontWeight: 700,
            color: isNew ? '#ffffff' : '#0d0d0d',
            backgroundColor: isNew ? '#FF7A1A' : 'rgba(255,255,255,0.92)',
            padding: '4.5px 9px 4px',
            borderRadius: '20px',
            letterSpacing: '-0.2px',
          }}
        >
          {isNew ? 'NEW' : `${item.participantLabel} 참여`}
        </span>

        {!item.ready && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff' }}>준비 중</span>
          </div>
        )}
      </motion.div>

      {/* 텍스트 */}
      <div style={{ padding: '10px 2px 0' }}>
        <p
          style={{
            fontSize: '13.5px',
            fontWeight: 700,
            color: '#0d0d0d',
            letterSpacing: '-0.3px',
            lineHeight: '1.3',
            marginBottom: '-1px',
          }}
        >
          {item.title}
        </p>
        <span style={{ fontSize: '11px', color: '#999', letterSpacing: '-0.2px' }}>{categoryLabel}</span>
      </div>
    </motion.div>
  );
}
