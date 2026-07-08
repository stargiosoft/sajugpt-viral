'use client';

import MoaMoaWordmark from '@/components/MoaMoaWordmark';

// 스크롤 컨테이너 내부 첫 자식으로 배치 + sticky — 스크롤된 콘텐츠가 뒤로 블러 처리되어 비친다.
export default function MoaMoaHeader() {
  return (
    <div
      className="sticky top-0 z-20 flex items-center px-3 py-3 md:px-6 lg:px-8"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
      }}
    >
      <img src="/home/fire.svg" alt="" style={{ width: '26px', height: '26px', marginRight: '6px' }} />
      <h1>
        <MoaMoaWordmark fontSize="22px" letterSpacing="-0.55px" />
      </h1>
    </div>
  );
}
