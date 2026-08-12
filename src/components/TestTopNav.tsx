'use client';

import Link from 'next/link';
import MoaMoaWordmark from './MoaMoaWordmark';
import SajuGptLogoButton from './SajuGptLogoButton';

interface Props {
  bgColor?: string;
  logoColor?: string;
  xColor?: string;
  onBack?: () => void;
  /** true면 sticky 대신 완전 고정(position: fixed)으로 렌더링 — 콘텐츠 컨테이너에 네비 높이만큼 paddingTop 보정 필요 */
  fixed?: boolean;
}

// 모든 테스트 상단에 고정 노출되는 광필연구소 x 사주GPT 크로스 브랜딩 네비
// 광필연구소 로고 클릭 시 광필연구소 홈으로, 사주GPT 로고 클릭 시 사주GPT 본 사이트로 이동
export default function TestTopNav({ bgColor = '#0d0d0d', logoColor = '#ffffff', xColor, onBack, fixed = false }: Props) {
  return (
    <div
      className={
        fixed
          ? 'fixed top-0 z-20 flex items-center w-full max-w-110 md:max-w-150'
          : 'sticky top-0 z-20 flex items-center w-full'
      }
      style={{
        padding: '12px',
        backgroundColor: bgColor,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        ...(fixed ? { left: '50%', transform: 'translateX(-50%)' } : {}),
      }}
    >
      <div style={{ width: 32, display: 'flex', justifyContent: 'flex-start' }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="이전으로"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke={logoColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center" style={{ flex: 1, justifyContent: 'center', gap: '6px' }}>
        <Link
          href="/"
          aria-label="광필연구소 홈으로"
          className="flex items-center"
          style={{ padding: '4px' }}
        >
          <MoaMoaWordmark fontSize="21px" color={logoColor} />
        </Link>

        <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1, color: xColor ?? logoColor, opacity: 0.5, marginLeft: '-4px' }}>x</span>

        <SajuGptLogoButton height="20px" width="66px" color={logoColor} />
      </div>

      <div style={{ width: 32 }} />
    </div>
  );
}
