'use client';

import { LOVE_SPOT_COLORS as C } from '@/constants/loveSpotTheme';

interface Props {
  imageSlug: string;
  label?: string;
  places: string; 
  placeDesc: string;
}

const CARD_FONT_FAMILY = '"Do Hyeon", sans-serif';

export default function SpotVisualCard({ imageSlug, label, places, placeDesc }: Props) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FFF9FA 0%, #FFF0F3 100%)',
        border: `1px solid ${C.frameBorder}`,
        borderRadius: '20px',
        padding: '10px',
        marginBottom: '14px',
        overflow: 'hidden',
        fontFamily: CARD_FONT_FAMILY,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/love-spot/images/${imageSlug}.png`}
        alt={places}
        onError={e => {
          e.currentTarget.style.opacity = '0';
        }}
        style={{
          width: '100%',
          height: '250px',
          display: 'block',
          objectFit: 'cover',
          marginBottom: '10px',
          borderRadius: '15px',
          backgroundColor: '#FFE9EE',
        }}
      />

      <div style={{ padding: '10px 5px 4px' }}>
        {label && (
          <span
            style={{
              display: 'block',
              marginBottom: '2px',
              fontSize: '14px',
              color: C.textTertiary,
              fontWeight: 700,
              fontFamily: CARD_FONT_FAMILY,
              lineHeight: 1.1,
            }}
          >
            💗 {label}
          </span>
        )}
        <strong
          style={{
            display: 'block',
            fontSize: '16px', 
            lineHeight: 1.15,
            color: '#292929',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            wordBreak: 'keep-all',
            fontFamily: CARD_FONT_FAMILY,
          }}
        >
          {places}
        </strong>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '14px', 
            lineHeight: 1.35,
            color: C.textSecondary,
            wordBreak: 'keep-all',
            fontFamily: CARD_FONT_FAMILY,
            fontWeight: 500,
          }}
        >
          {placeDesc}
        </p>
      </div>
    </div>
  );
}