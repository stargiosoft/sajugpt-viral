'use client';

import Image from 'next/image';
import type { GhostCard as GhostCardType } from '@/types/ghost-tarot';

interface Props {
  card: GhostCardType;
  onClick: () => void;
  backImage?: string;
  glow?: boolean;
}

export default function GhostCard({
  card,
  onClick,
  backImage = '/ghost-tarot/card-back.png',
  glow = false,
}: Props) {
  if (!card) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        aspectRatio: '2 / 3',
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
          borderRadius: '8%',
          overflow: 'hidden',
          border: '1px solid rgba(138,109,59,.7)',
          boxShadow: glow ? '0 0 20px rgba(179,39,58,.5)' : '0 4px 10px rgba(0,0,0,.35)',
          background: '#0c0906',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <Image
          src={backImage}
          alt="봉인된 귀신 카드 뒷면"
          fill
          sizes="80px"
          priority={true}
          unoptimized={true}
          style={{
            objectFit: 'contain',
            imageRendering: 'auto',
          }}
        />
      </div>
    </button>
  );
}