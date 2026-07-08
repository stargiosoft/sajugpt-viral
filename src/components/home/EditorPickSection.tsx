'use client';

import TestCard from './TestCard';
import type { TestCatalogItem } from '@/types/testCatalog';

interface EditorPickSectionProps {
  items: TestCatalogItem[];
  onSelect: (item: TestCatalogItem) => void;
  selectedId?: string | null;
}

// 참여자 수 기준인 RankingPanel과 겹치지 않도록, 카테고리 다양성 기준으로 고른 에디터 추천
export default function EditorPickSection({ items, onSelect, selectedId }: EditorPickSectionProps) {
  const picks = items.filter((item) => item.editorPick);

  if (picks.length === 0) return null;

  return (
    <div style={{ padding: '48px 0 4px' }}>
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
        에디터 추천
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 px-3 md:px-6 lg:px-8" style={{ columnGap: '12px', rowGap: '16px' }}>
        {picks.map((item) => (
          <TestCard key={item.id} item={item} onSelect={onSelect} selectedId={selectedId} />
        ))}
      </div>
    </div>
  );
}
