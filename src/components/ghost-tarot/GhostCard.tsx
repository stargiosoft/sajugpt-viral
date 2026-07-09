'use client';

import Image from 'next/image';
import type { GhostCard as GhostCardType } from '@/types/ghost-tarot';

interface Props {
  card: GhostCardType;
  onClick: () => void;
  backImage?: string;
}

export default function GhostCard({
  card,
  onClick,
  backImage = 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/ghost_back_01.png',
}: Props) {
  if (!card) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 64,
        height: 96,
        padding: 0,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      }}
      className="transition-transform active:scale-95 focus:outline-none"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid rgba(168,85,247,.5)',
          boxShadow: '0 0 20px rgba(168,85,247,.35)',
          background: '#10051c',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <Image
          src={backImage}
          alt="봉인된 귀신 카드 뒷면"
          fill
          sizes="64px"
          priority={true}
          unoptimized={true}
          style={{
            objectFit: 'cover',
            imageRendering: 'auto',
          }}
        />
      </div>
    </button>
  );
}