'use client';

import { SAJUGPT_URL } from '@/constants/links';

interface Props {
  height: string;
  width: string;
  color: string;
}

// 사주GPT 마스크 로고 버튼 — 광필연구소 브랜드 줄(네비/푸터)에서 공유하는 클릭형 로고
export default function SajuGptLogoButton({ height, width, color }: Props) {
  return (
    <button
      type="button"
      onClick={() => { window.open(SAJUGPT_URL, '_blank', 'noopener,noreferrer'); }}
      aria-label="사주GPT 홈으로"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
    >
      <span
        role="img"
        aria-label="사주GPT"
        style={{
          display: 'inline-block',
          height,
          width,
          backgroundColor: color,
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
  );
}
