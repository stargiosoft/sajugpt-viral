'use client';

import { useCallback, useRef, useState } from 'react';

import GhostIconButton from './GhostIconButton';
import { copyToClipboard, shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';
import { GHOST_BRUSH_FONT, GHOST_PALETTE } from '@/lib/ghost-tarot/theme';

const DEFAULT_SHARE_TEXT = '👻 귀신 타로 — 당신에게 붙은 존재가 이번 달 운세를 속삭입니다.\n봉인된 카드를 열어보세요';

interface Props {
  shareText?: string;
  shareLink?: string;
  resultId?: string;
}

export default function GhostShareRow({
  shareText = DEFAULT_SHARE_TEXT,
  shareLink,
  resultId,
}: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const getLink = useCallback(() => shareLink ?? `${window.location.origin}/ghost-tarot`, [shareLink]);

  // 링크 복사는 URL만 복사 — 설명 문구가 같이 복사되면 주소창에 그대로 붙여넣기가 안 됨
  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(getLink());
    if (ok) {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('ghost_tarot_share_test_clipboard');
      trackShare('ghost_tarot', 'clipboard', resultId);
    }
  }, [getLink, resultId]);

  const handleKakaoShare = useCallback(() => {
    const ok = shareKakao({
      title: '👻 귀신 타로',
      description: '당신에게 붙은 존재가 이번 달 운세를 속삭입니다',
      link: getLink(),
      buttonText: '나도 카드 열어보기',
    });
    if (ok) {
      trackEvent('ghost_tarot_share_test_kakao');
      trackShare('ghost_tarot', 'kakao', resultId);
    }
  }, [getLink, resultId]);

  const handleXShare = useCallback(() => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(getLink());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    trackEvent('ghost_tarot_share_test_x');
    trackShare('ghost_tarot', 'x', resultId);
  }, [shareText, getLink, resultId]);

  return (
    <div className="flex flex-col items-center" style={{ marginTop: 40 }}>
      <span style={{ fontFamily: GHOST_BRUSH_FONT, fontSize: 21, color: 'rgb(166 166 166)', letterSpacing: '1px' }}>
        공유하기
      </span>

      <div className="flex items-center" style={{ gap: 16, marginTop: 18 }}>
        <GhostIconButton ariaLabel="카카오톡 공유" onClick={handleKakaoShare}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3C6.477 3 2 6.477 2 10.667c0 2.7 1.828 5.07 4.59 6.42-.203.75-.735 2.7-.843 3.12-.132.523.192.516.404.375.166-.11 2.64-1.8 3.71-2.53.694.1 1.41.152 2.14.152 5.523 0 10-3.477 10-7.537C22 6.477 17.523 3 12 3z"
              fill={GHOST_PALETTE.ink}
            />
          </svg>
        </GhostIconButton>

        <GhostIconButton ariaLabel="X에 공유" onClick={handleXShare}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M13.6 10.6 20.9 2h-1.7l-6.3 7.5L7.8 2H2l7.7 11.2L2 22h1.7l6.7-8 5.4 8H22l-8-11.4Zm-2.4 2.8-.8-1.1L4 3.3h2.6l5 7.2.8 1.1 6.6 9.4h-2.6l-5.2-7.6Z"
              fill={GHOST_PALETTE.ink}
            />
          </svg>
        </GhostIconButton>

        <GhostIconButton ariaLabel="링크 복사" onClick={handleCopy}>
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke={'rgb(179,47,23)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" stroke={GHOST_PALETTE.ink} strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </GhostIconButton>
      </div>

      {copied && (
        <p style={{ fontSize: 12, color: 'rgb(179,47,23)', fontWeight: 600, marginTop: 12 }}>
          링크가 복사됐어요!
        </p>
      )}
    </div>
  );
}
