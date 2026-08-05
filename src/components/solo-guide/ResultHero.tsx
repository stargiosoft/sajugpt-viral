'use client';

import { SOLO_COLORS as C } from '@/constants/soloGuideTheme';

export default function ResultHero({ title, isMobile }: { title: string; isMobile: boolean }) {
  const titleFontSize = isMobile ? 29 : 30;

  return (
    <div style={{ position: 'relative', padding: '30px 26px 22px', textAlign: 'center' }}>
      <div style={{ marginBottom: '18px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '44px',
            padding: '0 40px',
            backgroundImage: 'url(/solo-guide/type-ribbon.png)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: '#FFFFFF',
            fontSize: '17px',
            fontWeight: 500,
            letterSpacing: '-0.2px',
            WebkitTextStroke: '0.3px #FFFFFF',
            paddingBottom: '6px',
            marginTop: '-2px',
          }}
        >
          대표 연애 유형
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <p
          style={{
            position: 'relative',
            display: 'inline-block',
            fontSize: `${titleFontSize}px`,
            fontWeight: 800,
            color: 'rgb(235 70 127)',
            letterSpacing: '-1.2px',
            lineHeight: 1.3,
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            marginBottom: '-2px',
            paddingBottom: '10px',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(/solo-guide/title-marker.png)',
            backgroundSize: '100% 10px, 100% 10px',
            backgroundPosition: 'left bottom 12px, left bottom 12px',
            backgroundRepeat: 'no-repeat, no-repeat',
          }}
        >
          {title}
          <img
            src="/solo-guide/title-heart.png"
            alt=""
            style={{ position: 'absolute', top: '-6px', right: '-22px', width: '18px', transform: 'rotate(45deg)', pointerEvents: 'none' }}
          />
        </p>
      </div>
    </div>
  );
}
