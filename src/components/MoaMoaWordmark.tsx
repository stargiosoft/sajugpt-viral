'use client';

import localFont from 'next/font/local';

const oneMobilePop = localFont({ src: '../fonts/ONEMobilePOP.ttf' });

interface Props {
  fontSize?: string;
  color?: string;
  letterSpacing?: string;
  top?: string;
}

// "모아모아" 브랜드 워드마크 — 폰트 로드 + 글자별 회전 연출을 한 곳에서 관리
export default function MoaMoaWordmark({ fontSize = '18px', color = '#0d0d0d', letterSpacing = '-0.4px', top = '2px' }: Props) {
  const smallerFontSize = `${parseFloat(fontSize) - 2}px`;

  return (
    <span
      className={oneMobilePop.className}
      style={{ fontSize, color, letterSpacing, position: 'relative', top }}
    >
      {'광필연구소'.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transform: (i === 0 || char === '연' || char === '소') ? 'none' : 'rotate(-5deg)',
            fontSize: (char === '필' || char === '구') ? smallerFontSize : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
