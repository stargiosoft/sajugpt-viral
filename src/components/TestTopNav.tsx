'use client';

import { useRouter } from 'next/navigation';
import MoaMoaWordmark from '@/components/MoaMoaWordmark';

interface Props {
  bgColor?: string;
  logoColor?: string;
}

// 모든 테스트 상단에 고정 노출되는 모아모아 x 사주GPT 크로스 브랜딩 네비
export default function TestTopNav({ bgColor = '#0d0d0d', logoColor = '#ffffff' }: Props) {
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
          <MoaMoaWordmark fontSize="17px" color={logoColor} top="1px" />
        </span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: logoColor, margin: '0 2px' }}>x</span>
        <span
          role="img"
          aria-label="사주GPT"
          style={{
            display: 'inline-block',
            height: '16px',
            width: '53px',
            backgroundColor: logoColor,
            WebkitMaskImage: 'url(/sajugpt-logo.svg)',
            maskImage: 'url(/sajugpt-logo.svg)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'left center',
            maskPosition: 'left center',
          }}
        />
      </button>
    </div>
  );
}
