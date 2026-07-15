'use client';

import TestCard from './TestCard';
import type { TestCatalogItem } from '@/types/testCatalog';

interface TestGridSectionProps {
  title: string;
  items: TestCatalogItem[];
  filter: (item: TestCatalogItem) => boolean | undefined;
  isNew?: boolean;
  paddingBottom: number;
  onSelect: (item: TestCatalogItem) => void;
  selectedId?: string | null;
}

// 에디터 추천 / 새로 올라온 테스트가 공유하는 카드 그리드 레이아웃 — 필터 기준과 하단 여백만 다름
export default function TestGridSection({ title, items, filter, isNew, paddingBottom, onSelect, selectedId }: TestGridSectionProps) {
  const filtered = items.filter(filter);

  if (filtered.length === 0) return null;

  return (
    <div style={{ padding: `48px 0 ${paddingBottom}px` }}>
      <h2
        className="px-3 md:px-6 lg:px-8"
        style={{
          fontSize: '18px',
          fontWeight: 800,
          color: '#0d0d0d',
          letterSpacing: '-0.4px',
          marginBottom: '14px',
        }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 px-3 md:px-6 lg:px-8" style={{ columnGap: '12px', rowGap: '16px' }}>
        {filtered.map((item) => (
          <TestCard key={item.id} item={item} isNew={isNew} onSelect={onSelect} selectedId={selectedId} />
        ))}
      </div>
    </div>
  );
}
