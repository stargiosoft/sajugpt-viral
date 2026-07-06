'use client';

import { motion } from 'framer-motion';

interface AdBannerStripProps {
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  href?: string;
}

// Hero+랭킹 섹션 아래 가로 띠 배너 광고 자리 — 실제 광고 연동 전까지의 플레이스홀더
export default function AdBannerStrip({ backgroundColor = '#F5F5F6', title, subtitle, imageSrc, href }: AdBannerStripProps) {
  const hasContent = Boolean(title || subtitle || imageSrc);

  const containerStyle = {
    height: '100px',
    borderRadius: '16px',
    backgroundColor,
    border: hasContent ? 'none' : '1px dashed #DADADE',
    justifyContent: 'center' as const,
    padding: hasContent ? '0 28px 0 36px' : 0,
  };

  const content = (
    <>
      <span
        className="absolute"
        style={{
          top: '10px',
          right: '12px',
          fontSize: '10px',
          fontWeight: 700,
          color: hasContent ? '#B0793F' : '#aaa',
          backgroundColor: hasContent ? 'rgba(255,255,255,0.85)' : 'transparent',
          padding: hasContent ? '3px 9px' : 0,
          borderRadius: '999px',
          letterSpacing: '0.3px',
        }}
      >
        AD
      </span>

      {hasContent ? (
        <div className="flex items-center min-w-0" style={{ gap: '20px' }}>
          {imageSrc && (
            <img
              src={imageSrc}
              alt=""
              className="shrink-0"
              style={{ height: '64px', width: 'auto', objectFit: 'contain' }}
            />
          )}
          <div className="flex flex-col justify-center min-w-0" style={{ gap: '5px' }}>
            {title && (
              <span className="truncate" style={{ fontSize: '16px', fontWeight: 800, color: '#171719', letterSpacing: '-0.3px' }}>
                {title}
              </span>
            )}
            {subtitle && (
              <span className="truncate" style={{ fontSize: '13px', fontWeight: 500, color: '#767680', letterSpacing: '-0.2px' }}>
                {subtitle}
              </span>
            )}
          </div>
        </div>
      ) : (
        <span style={{ fontSize: '13px', color: '#aaa', letterSpacing: '-0.2px' }}>
          광고 배너 영역
        </span>
      )}
    </>
  );

  if (hasContent && href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileTap={{ scale: 0.998 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        className="relative flex items-center overflow-hidden transform-gpu"
        style={containerStyle}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <div className="relative flex items-center overflow-hidden" style={containerStyle}>
      {content}
    </div>
  );
}
