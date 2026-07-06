'use client';

import { useRouter } from 'next/navigation';
import MoaMoaWordmark from '@/components/MoaMoaWordmark';

interface Props {
  bgColor?: string;
}

// 모든 테스트 상단에 고정 노출되는 모아모아 x 사주GPT 크로스 브랜딩 네비
export default function TestTopNav({ bgColor = '#0d0d0d' }: Props) {
  const router = useRouter();

  return (
    <div
      className="sticky top-0 z-20 flex items-center justify-center w-full"
      style={{
        padding: '12px',
        backgroundColor: bgColor,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <button
        type="button"
        onClick={() => router.push('/')}
        aria-label="홈으로"
        className="flex items-center"
        style={{ gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
      >
        <span className="flex items-center" style={{ gap: '4px' }}>
          <img src="/home/fire.svg" alt="" style={{ width: '20px', height: '20px' }} />
          <MoaMoaWordmark fontSize="17px" color="#ffffff" top="1px" />
        </span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', margin: '0 2px' }}>x</span>
        <img
          src="/sajugpt-logo.svg"
          alt="사주GPT"
          style={{ height: '16px', width: 'auto', filter: 'brightness(0) invert(1)' }}
        />
      </button>
    </div>
  );
}
