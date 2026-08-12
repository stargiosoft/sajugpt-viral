'use client';

import Link from 'next/link';
import type { TestCatalogItem } from '@/types/testCatalog';
import PlaceholderRankingRow from './PlaceholderRankingRow';
import SectionStats from './SectionStats';

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
        padding: '12px 18px var(--rp-padding-bottom)',
      }}
    >
      <div style={{ marginBottom: 'var(--rp-title-gap)' }}>
        <h2 style={{ fontSize: 'var(--rp-heading-size)', fontWeight: 800, color: '#0d0d0d', letterSpacing: '-0.3px', padding: '3px 0 1px' }}>
          인기 테스트
        </h2>
      </div>
      <div className="flex flex-col" style={{ gap: '7px' }}>
        {ranked.map((item, i) => {
          const isDimmed = !!selectedId && selectedId !== item.id;
          return (
          <Link
            key={item.id}
            href={item.ready ? item.href : '#'}
            aria-disabled={!item.ready}
            onClick={(e) => {
              if (!item.ready) { e.preventDefault(); return; }
              e.preventDefault();
              onSelect(item);
            }}
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
              style={{ width: '68px', borderRadius: '9px' }}
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
                  padding: '2px 4px 1px',
                  borderTopLeftRadius: '9px',
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: '6px',
                  backgroundColor: '#fc3e4d',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {i + 1}
              </span>
            </span>
            <span className="flex-1 min-w-0">
              <span className="block truncate pb-[2px] lg:pb-0" style={{ fontSize: 'var(--rp-title-size)', fontWeight: 600, color: '#0d0d0d', letterSpacing: '-0.2px', marginBottom: '3px' }}>
                {item.title}
              </span>
              <SectionStats plays={item.participantLabel} shares={item.shareLabel ?? '0'} />
            </span>
          </Link>
          );
        })}
        {Array.from({ length: placeholderCount }, (_, i) => (
          <PlaceholderRankingRow key={`placeholder-${i}`} rank={ranked.length + i + 1} />
        ))}
      </div>
    </div>
  );
}
