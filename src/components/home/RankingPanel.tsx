'use client';

import type { TestCatalogItem } from '@/types/testCatalog';
import { CATEGORIES } from '@/constants/categories';

interface RankingPanelProps {
  items: TestCatalogItem[];
  onSelect: (item: TestCatalogItem) => void;
}

export default function RankingPanel({ items, onSelect }: RankingPanelProps) {
  const ranked = [...items]
    .sort((a, b) => parseFloat(b.participantLabel) - parseFloat(a.participantLabel))
    .slice(0, 5);

  return (
    <div
      style={{
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #E5E5E9',
        padding: '14px 18px 18px',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0d0d0d', letterSpacing: '-0.3px', padding: '3px 0 1px' }}>
          실시간 인기 순위
        </h2>
      </div>
      <div className="flex flex-col" style={{ gap: '13px' }}>
        {ranked.map((item, i) => (
          <button
            key={item.id}
            onClick={() => { if (item.ready) onSelect(item); }}
            disabled={!item.ready}
            className="group flex items-center w-full text-left shrink-0 bg-transparent transition-all duration-150 hover:brightness-110 active:brightness-105 active:scale-[0.995]"
            style={{
              gap: '10px',
              border: 'none',
              padding: 0,
              borderRadius: '12px',
              cursor: item.ready ? 'pointer' : 'default',
              opacity: item.ready ? 1 : 0.5,
            }}
          >
            <span
              className="relative block shrink-0 overflow-hidden aspect-[4/3]"
              style={{ width: '60px', borderRadius: '9px' }}
            >
              {item.imageSrc ? (
                <img src={item.imageSrc} alt="" className="w-full h-full" style={{ objectFit: 'cover' }} />
              ) : (
                <span className="w-full h-full flex items-center justify-center" style={{ fontSize: '16px', backgroundColor: '#FFF1E6' }}>
                  {item.emoji}
                </span>
              )}
              <span
                className="absolute flex items-center justify-center"
                style={{
                  top: 0,
                  left: 0,
                  minWidth: '15px',
                  height: '15px',
                  padding: '1px 4px',
                  borderTopLeftRadius: '9px',
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: '6px',
                  backgroundColor: 'rgba(20,20,20,0.72)',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {i + 1}
              </span>
            </span>
            <span className="flex-1 min-w-0">
              <span className="block truncate transition-opacity duration-150 group-hover:opacity-60" style={{ fontSize: '12.5px', fontWeight: 600, color: '#0d0d0d', letterSpacing: '-0.2px', marginBottom: '3px' }}>
                {item.title}
              </span>
              <span className="block truncate transition-opacity duration-150 group-hover:opacity-60" style={{ fontSize: '11px', color: '#999', letterSpacing: '-0.2px', paddingLeft: '1px' }}>
                {CATEGORIES.find((c) => c.key === item.category)?.label ?? ''} · 참여 {item.participantLabel}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
