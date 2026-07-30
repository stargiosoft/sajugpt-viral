'use client';

import localFont from 'next/font/local';

const oneMobilePop = localFont({ src: '../fonts/ONEMobilePOP.ttf' });

interface Props {
  fontSize?: string;
  color?: string;
  letterSpacing?: string;
}

// "모아모아" 브랜드 워드마크 — 폰트 로드 + 글자별 회전 연출을 한 곳에서 관리
// lineHeight: 1로 폰트 자체 여백을 없애, 부모 flex(alignItems: center)가 다른 요소와
// 픽셀 나눔 없이 정렬되게 한다 — 기기/브라우저별 폰트 렌더링 차이에 흔들리지 않도록.
export default function MoaMoaWordmark({ fontSize = '18px', color = '#0d0d0d', letterSpacing = '-0.4px' }: Props) {
  const smallerFontSize = `${parseFloat(fontSize) - 2}px`;

  return (
    <span
      className={oneMobilePop.className}
      style={{ fontSize, color, letterSpacing, lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
    >
      {'광필연구소'.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transform: (i === 0 || char === '연' || char === '소') ? 'none' : 'rotate(7deg)',
            fontSize: (char === '필' || char === '구') ? smallerFontSize : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
