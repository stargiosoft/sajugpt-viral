'use client';

import type { TestCatalogItem } from '@/types/testCatalog';
import { CATEGORIES } from '@/constants/categories';
import PlaceholderRankingRow from './PlaceholderRankingRow';

const RANKING_SIZE = 5;

interface RankingPanelProps {
  items: TestCatalogItem[];
  onSelect: (item: TestCatalogItem) => void;
  selectedId?: string | null;
}

export default function RankingPanel({ items, onSelect, selectedId }: RankingPanelProps) {
  const ranked = [...items]
    .sort((a, b) => {
      if (a.popularityRank && b.popularityRank) return a.popularityRank - b.popularityRank;
      if (a.popularityRank) return -1;
      if (b.popularityRank) return 1;
      return parseFloat(b.participantLabel) - parseFloat(a.participantLabel);
    })
    .slice(0, RANKING_SIZE);
  const placeholderCount = Math.max(0, RANKING_SIZE - ranked.length);

  return (
    <div
      className="ranking-panel"
      style={{
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #E5E5E9',
        padding: '14px 18px 18px',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: 'var(--rp-heading-size)', fontWeight: 800, color: '#0d0d0d', letterSpacing: '-0.3px', padding: '3px 0 1px' }}>
          실시간 인기 순위
        </h2>
      </div>
      <div className="flex flex-col" style={{ gap: '13px' }}>
        {ranked.map((item, i) => {
          const isDimmed = !!selectedId && selectedId !== item.id;
          return (
          <button
            key={item.id}
            onClick={() => { if (item.ready) onSelect(item); }}
            disabled={!item.ready}
            className="group flex items-center w-full text-left shrink-0 bg-transparent transition-all duration-200 active:brightness-105 active:scale-[0.995]"
            style={{
              gap: '10px',
              border: 'none',
              padding: 0,
              borderRadius: '12px',
              cursor: item.ready ? 'pointer' : 'default',
              opacity: isDimmed ? 0.95 : item.ready ? 1 : 0.5,
              transform: isDimmed ? 'scale(0.9998)' : 'scale(1)',
            }}
          >
            <span
              className="relative block shrink-0 overflow-hidden aspect-[4/3]"
              style={{ width: '60px', borderRadius: '9px' }}
            >
              <span className="block w-full h-full transition-transform duration-200 ease-out group-hover:scale-110">
                {item.imageSrc ? (
                  <img src={item.imageSrc} alt="" className="w-full h-full" style={{ objectFit: 'cover' }} />
                ) : (
                  <span className="w-full h-full flex items-center justify-center" style={{ fontSize: '16px', backgroundColor: '#FFF1E6' }}>
                    {item.emoji}
                  </span>
                )}
              </span>
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
            <span className="flex-1 min-w-0" style={{ position: 'relative', top: '1.5px' }}>
              <span className="block truncate" style={{ fontSize: 'var(--rp-title-size)', fontWeight: 600, color: '#0d0d0d', letterSpacing: '-0.2px', marginBottom: '2px' }}>
                {item.title}
              </span>
              <span className="block truncate" style={{ fontSize: 'var(--rp-sub-size)', fontWeight: 500, color: '#757474', letterSpacing: '-0.2px', paddingLeft: '1px' }}>
                {CATEGORIES.find((c) => c.key === item.category)?.label ?? ''} · 참여 {item.participantLabel}
              </span>
            </span>
          </button>
          );
        })}
        {Array.from({ length: placeholderCount }, (_, i) => (
          <PlaceholderRankingRow key={`placeholder-${i}`} rank={ranked.length + i + 1} />
        ))}
      </div>
    </div>
  );
}
