'use client';

import localFont from 'next/font/local';

const oneMobilePop = localFont({ src: '../../fonts/ONEMobilePOP.ttf' });

// 스크롤 컨테이너 내부 첫 자식으로 배치 + sticky — 스크롤된 콘텐츠가 뒤로 블러 처리되어 비친다.
export default function MoaMoaHeader() {
  return (
    <div
      className="sticky top-0 z-20 flex items-center px-5 py-3 md:px-6 lg:px-8"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <img src="/home/fire.svg" alt="" style={{ width: '26px', height: '26px', marginRight: '6px' }} />
      <h1
        className={oneMobilePop.className}
        style={{ fontSize: '22px', color: '#0d0d0d', letterSpacing: '-0.55px', position: 'relative', top: '2px' }}
      >
        {'모아모아'.split('').map((char, i) => (
          <span
            key={i}
            style={{ display: 'inline-block', transform: char === '모' ? 'none' : 'rotate(-5deg)' }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
