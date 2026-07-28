'use client';

export const CARD_SHADOW = '0 1px 2px rgba(0,0,0,0.04)';

export function kakaoBubbleRadius(size: number, flipped = false) {
  return flipped ? `${size}px 4px ${size}px ${size}px` : `4px ${size}px ${size}px ${size}px`;
}

export function SectionTitle({
  icon,
  iconSize = 16,
  gap = '4px',
  marginBottom = '4px',
  children,
}: {
  icon: string;
  iconSize?: number;
  gap?: string;
  marginBottom?: string;
  children: string;
}) {
  return (
    <div className="flex items-center" style={{ gap, marginBottom }}>
      <span className="flex items-center justify-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}>
        <img src={icon} alt="" width={iconSize + 4} height={iconSize + 4} />
      </span>
      <p style={{ fontSize: '22px', fontWeight: 500, color: '#1C2333', fontFamily: "'Ongeulip Minmi', sans-serif" }}>
        {children}
      </p>
    </div>
  );
}
