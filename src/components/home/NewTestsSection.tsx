'use client';

import TestCard from './TestCard';
import type { TestCatalogItem } from '@/types/testCatalog';

interface NewTestsSectionProps {
  items: TestCatalogItem[];
  onSelect: (item: TestCatalogItem) => void;
}

export default function NewTestsSection({ items, onSelect }: NewTestsSectionProps) {
  const newItems = items.filter((item) => item.isNew);

  if (newItems.length === 0) return null;

  return (
    <div style={{ padding: '48px 0 4px' }}>
      <h2
        className="px-4 md:px-6 lg:px-8"
        style={{
          fontSize: '18px',
          fontWeight: 800,
          color: '#0d0d0d',
          letterSpacing: '-0.4px',
          marginBottom: '14px',
        }}
      >
        새로 올라온 테스트
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 md:px-6 lg:px-8">
        {newItems.map((item) => (
          <TestCard key={item.id} item={item} isNew onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
