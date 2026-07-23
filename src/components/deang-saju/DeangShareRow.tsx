'use client';

import { useCallback, useState } from 'react';
import GhostIconButton from '@/components/ghost-tarot/GhostIconButton';
import { copyToClipboard, shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';
import { DEANG_COLORS as C } from '@/constants/deangTheme';
import DeangOutlineBox from './DeangOutlineBox';

const KakaoIcon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3C6.477 3 2 6.477 2 10.667c0 2.7 1.828 5.07 4.59 6.42-.203.75-.735 2.7-.843 3.12-.132.523.192.516.404.375.166-.11 2.64-1.8 3.71-2.53.694.1 1.41.152 2.14.152 5.523 0 10-3.477 10-7.537C22 6.477 17.523 3 12 3z"
      fill={color}
    />
  </svg>
);

const XIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M13.6 10.6 20.9 2h-1.7l-6.3 7.5L7.8 2H2l7.7 11.2L2 22h1.7l6.7-8 5.4 8H22l-8-11.4Zm-2.4 2.8-.8-1.1L4 3.3h2.6l5 7.2.8 1.1 6.6 9.4h-2.6l-5.2-7.6Z"
      fill={color}
    />
  </svg>
);

const CopyIcon = ({ color, copied }: { color: string; copied: boolean }) =>
  copied ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

const ICON_STYLE = { width: 42, height: 42, background: '#FFFDF7', border: '1.8px solid rgb(235, 225, 203)' };

export default function DeangShareRow() {
  const [copied, setCopied] = useState(false);

  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/deang-saju` : '';
  const shareImage = typeof window !== 'undefined' ? `${window.location.origin}/deang-saju/og-share.png` : '';
  const shareText = '🐾 사주를 강아지로 번역해드립니다 — 나는 무슨 견종일까? 댕댕사주 해보기';

  const handleKakaoShare = useCallback(() => {
    const ok = shareKakao({
      title: '댕댕사주',
      description: '사주를 강아지로 번역해드립니다 🐾',
      imageUrl: shareImage,
      link: shareLink,
      buttonText: '나도 해보기',
    });
    if (ok) {
      trackEvent('deang_saju_share', { method: 'kakao' });
      trackShare('deang_saju', 'kakao');
    }
  }, [shareLink, shareImage]);

  const handleXShare = useCallback(() => {
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`;
    window.open(intent, '_blank', 'noopener,noreferrer');
    trackEvent('deang_saju_share', { method: 'x' });
    trackShare('deang_saju', 'x');
  }, [shareLink]);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(shareLink);
    if (ok) {
      setCopied(true);
      trackEvent('deang_saju_share', { method: 'clipboard' });
      trackShare('deang_saju', 'clipboard');
      setTimeout(() => setCopied(false), 1500);
    }
  }, [shareLink]);

  return (
    <div className="flex flex-col items-center w-full">
      <DeangOutlineBox
        radius={20}
        strokeWidth={0}
        backgroundColor="#FFFFFF"
        className="flex items-center justify-center w-full"
        style={{ padding: '12px 20px', gap: '20px' }}
      >
        <GhostIconButton ariaLabel="카카오톡 공유" onClick={handleKakaoShare} style={{ ...ICON_STYLE, background: '#FEE500', border: 'none' }} hoverBackground="#F0D900">
          <KakaoIcon color="#000000" />
        </GhostIconButton>
        <GhostIconButton ariaLabel="X에 공유" onClick={handleXShare} style={{ ...ICON_STYLE, background: '#000000', border: 'none' }} hoverBackground="#222222">
          <XIcon color="#FFFFFF" />
        </GhostIconButton>
        <GhostIconButton ariaLabel="링크 복사" onClick={handleCopy} style={{ ...ICON_STYLE, background: 'rgb(88, 184, 136)', border: 'none' }} hoverBackground="#4ba679">
          <CopyIcon color="#FFFFFF" copied={copied} />
        </GhostIconButton>
      </DeangOutlineBox>
      {copied && (
        <p style={{ fontSize: '12px', color: C.ink, fontWeight: 500, WebkitTextStroke: `0.3px ${C.ink}`, marginTop: '10px' }}>
          링크가 복사됐어요!
        </p>
      )}
    </div>
  );
}
