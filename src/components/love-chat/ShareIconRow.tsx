'use client';

import Toast from '@/components/Toast';
import GhostIconButton from '@/components/ghost-tarot/GhostIconButton';
import { useShare, type ShareContent } from '@/lib/useShare';

// 댕댕사주 DeangShareRow와 동일한 아이콘/색상 — 카카오 💬(#FEE500), X(#000), 링크(파랑)
const ICON_STYLE = { width: 42, height: 42, border: 'none' };

function KakaoIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C6.477 3 2 6.477 2 10.667c0 2.7 1.828 5.07 4.59 6.42-.203.75-.735 2.7-.843 3.12-.132.523.192.516.404.375.166-.11 2.64-1.8 3.71-2.53.694.1 1.41.152 2.14.152 5.523 0 10-3.477 10-7.537C22 6.477 17.523 3 12 3z"
        fill={color}
      />
    </svg>
  );
}

function XIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M13.6 10.6 20.9 2h-1.7l-6.3 7.5L7.8 2H2l7.7 11.2L2 22h1.7l6.7-8 5.4 8H22l-8-11.4Zm-2.4 2.8-.8-1.1L4 3.3h2.6l5 7.2.8 1.1 6.6 9.4h-2.6l-5.2-7.6Z"
        fill={color}
      />
    </svg>
  );
}

function CopyIcon({ color, copied }: { color: string; copied: boolean }) {
  return copied ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface Props {
  shareContent: ShareContent;
}

// 카카오톡/X/링크복사 원형 아이콘 3종 — 시작화면과 결과화면이 공유하는 공용 컴포넌트
export default function ShareIconRow({ shareContent }: Props) {
  const { shareToKakao, shareToX, copyLink, copied, toastMessage } = useShare(shareContent);

  return (
    <div className="flex justify-center" style={{ gap: '20px' }}>
      <GhostIconButton ariaLabel="카카오톡 공유" onClick={shareToKakao} style={{ ...ICON_STYLE, background: '#FEE500' }} hoverBackground="#F0D900">
        <KakaoIcon color="#000000" />
      </GhostIconButton>
      <GhostIconButton ariaLabel="X 공유" onClick={shareToX} style={{ ...ICON_STYLE, background: '#000000' }} hoverBackground="#222222">
        <XIcon color="#FFFFFF" />
      </GhostIconButton>
      <GhostIconButton ariaLabel="링크 복사" onClick={copyLink} style={{ ...ICON_STYLE, background: '#3D6FE0' }} hoverBackground="#2F58B8">
        <CopyIcon color="#FFFFFF" copied={copied} />
      </GhostIconButton>
      <Toast message={toastMessage} paddingY="10px" />
    </div>
  );
}
