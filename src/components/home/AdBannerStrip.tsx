'use client';

interface AdBannerStripProps {
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
}

// Hero+랭킹 섹션 아래 가로 띠 배너 광고 자리 — 실제 광고 연동 전까지의 플레이스홀더
export default function AdBannerStrip({ backgroundColor = '#F5F5F6', title, subtitle, imageSrc }: AdBannerStripProps) {
  const hasContent = Boolean(title || subtitle || imageSrc);

  return (
    <div
      className="relative flex items-center overflow-hidden"
      style={{
        height: '100px',
        borderRadius: '16px',
        backgroundColor,
        border: hasContent ? 'none' : '1px dashed #DADADE',
        justifyContent: 'center',
        padding: hasContent ? '0 32px' : 0,
      }}
    >
      <span
        className="absolute"
        style={{
          top: '10px',
          right: '12px',
          fontSize: '10px',
          fontWeight: 700,
          color: hasContent ? 'rgba(0,0,0,0.4)' : '#aaa',
          backgroundColor: hasContent ? 'rgba(0,0,0,0.08)' : 'transparent',
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
              style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
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
    </div>
  );
}
