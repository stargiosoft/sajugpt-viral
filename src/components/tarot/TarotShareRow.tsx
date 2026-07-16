'use client';

import { useCallback, useRef, useState } from 'react';

import GhostIconButton from '@/components/ghost-tarot/GhostIconButton';
import { copyToClipboard, shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';
import { useIsDesktop, useIsNarrow } from '@/lib/ghost-tarot/useBreakpoint';
import type { TarotConfig } from '@/types/tarot';

interface Props {
  config: TarotConfig;
  shareText?: string;
  shareLink?: string;
  resultId?: string;
  /** 'boxed'는 config.copy.shareBox가 있을 때만 의미 있음 — 없으면 자동으로 simple로 폴백 */
  variant?: 'simple' | 'boxed';
}

const KakaoIcon = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
      <path d="M5 13l4 4L19 7" stroke={'rgb(179,47,23)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

export default function TarotShareRow({
  config,
  shareText,
  shareLink,
  resultId,
  variant = 'simple',
}: Props) {
  const { palette, brushFont, myungjoFont } = config.theme;
  const isDesktop = useIsDesktop();
  const isNarrow = useIsNarrow();
  const shareBox = config.copy.shareBox;
  const resolvedVariant = variant === 'boxed' && shareBox ? 'boxed' : 'simple';
  const resolvedShareText = shareText ?? config.copy.defaultShareText;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const getLink = useCallback(() => shareLink ?? `${window.location.origin}/${config.slug}`, [shareLink, config.slug]);

  // 링크 복사는 URL만 복사 — 설명 문구가 같이 복사되면 주소창에 그대로 붙여넣기가 안 됨
  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(getLink());
    if (ok) {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent(`${config.featureType}_share_test_clipboard`);
      trackShare(config.featureType, 'clipboard', resultId);
    }
  }, [getLink, resultId, config.featureType]);

  const handleKakaoShare = useCallback(() => {
    const ok = shareKakao({
      title: config.copy.kakaoTitle,
      description: config.copy.kakaoDescription,
      link: getLink(),
      buttonText: config.copy.kakaoButtonText,
    });
    if (ok) {
      trackEvent(`${config.featureType}_share_test_kakao`);
      trackShare(config.featureType, 'kakao', resultId);
    }
  }, [getLink, resultId, config.featureType, config.copy]);

  const handleXShare = useCallback(() => {
    const text = encodeURIComponent(resolvedShareText);
    const url = encodeURIComponent(getLink());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    trackEvent(`${config.featureType}_share_test_x`);
    trackShare(config.featureType, 'x', resultId);
  }, [resolvedShareText, getLink, resultId, config.featureType]);

  if (resolvedVariant === 'boxed' && shareBox) {
    const headlineHighlightIndex = shareBox.headlineHighlight ? shareBox.headline.indexOf(shareBox.headlineHighlight) : -1;
    const headlineBefore = headlineHighlightIndex >= 0 ? shareBox.headline.slice(0, headlineHighlightIndex) : shareBox.headline;
    const headlineAfter = headlineHighlightIndex >= 0 ? shareBox.headline.slice(headlineHighlightIndex + shareBox.headlineHighlight!.length) : '';
    const iconStyle = {
      background: 'rgba(58,16,8,0.6)',
      border: '1px solid rgba(179,47,23,0.55)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    };

    return (
      <div
        style={{
          position: 'relative',
          marginTop: 40,
          border: `1.5px solid rgba(179,47,23,0.5)`,
          borderRadius: 12,
          overflow: 'hidden',
          padding: '24px 20px 22px',
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          ...(config.assets.shareBoxBg
            ? {
                backgroundColor: '#000',
                backgroundImage: `url(${config.assets.shareBoxBg})`,
                backgroundSize: isDesktop ? 'contain' : 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }
            : { background: 'rgba(179,47,23,0.16)' }),
        }}
      >
        {/* 하단 좌우에서 은은하게 피어오르는 안개 — 콘텐츠보다 뒤(z-index) */}
        <span className="ghost-fog-layer ghost-fog-layer--left" style={{ zIndex: 0 }} aria-hidden="true" />
        <span className="ghost-fog-layer ghost-fog-layer--right" style={{ zIndex: 0 }} aria-hidden="true" />

        {/* 그룹 1: 타이틀 + 부제 — 한 메시지로 읽히도록 촘촘하게 */}
        <h3
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: isDesktop ? 64 : 60,
            fontFamily: myungjoFont,
            fontSize: isDesktop ? 28 : (isNarrow ? 22 : 24),
            lineHeight: 1.4,
            color: palette.ink,
            whiteSpace: 'pre-line',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 14px rgba(179,47,23,0.4)',
          }}
        >
          {headlineBefore}
          {headlineHighlightIndex >= 0 && (
            <span className="ghost-glow-text" style={{ color: 'rgb(179,47,23)' }}>{shareBox.headlineHighlight}</span>
          )}
          {headlineAfter}
        </h3>

        <p style={{ position: 'relative', zIndex: 1, marginTop: isDesktop ? 18 : 11, fontFamily: myungjoFont, fontSize: isDesktop ? 14 : (isNarrow ? 12 : 12.5), letterSpacing: '-0.1px', color: '#d8cdbe', lineHeight: 1.6, textShadow: '0 1px 4px rgba(0,0,0,0.9)', WebkitTextStroke: '0.1px rgb(228,225,220)' }}>
          {shareBox.subtextBefore}
          <span style={{ color: 'rgb(179,47,23)', fontWeight: 700, WebkitTextStroke: '0.2px rgb(179,47,23)' }}>{shareBox.subtextHighlight}</span>
          {shareBox.subtextAfter}
        </p>

        <div className="flex items-center justify-center" style={{ position: 'relative', zIndex: 1, marginTop: isDesktop ? 30 : 32, marginBottom: isDesktop ? 12 : 0, gap: 20 }}>
          <GhostIconButton ariaLabel="카카오톡 공유" onClick={handleKakaoShare} style={iconStyle} hoverBackground="rgba(179,47,23,0.34)">
            <KakaoIcon color={palette.ink} />
          </GhostIconButton>
          <GhostIconButton ariaLabel="X에 공유" onClick={handleXShare} style={iconStyle} hoverBackground="rgba(179,47,23,0.34)">
            <XIcon color={palette.ink} />
          </GhostIconButton>
          <GhostIconButton ariaLabel="링크 복사" onClick={handleCopy} style={iconStyle} hoverBackground="rgba(179,47,23,0.34)">
            <CopyIcon color={palette.ink} copied={copied} />
          </GhostIconButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center" style={{ marginTop: 40 }}>
      <span style={{ fontFamily: brushFont, fontSize: 21, color: 'rgb(166 166 166)', letterSpacing: '1px' }}>
        공유하기
      </span>

      <div className="flex items-center" style={{ gap: 16, marginTop: 18 }}>
        <GhostIconButton ariaLabel="카카오톡 공유" onClick={handleKakaoShare}>
          <KakaoIcon color={palette.ink} />
        </GhostIconButton>

        <GhostIconButton ariaLabel="X에 공유" onClick={handleXShare}>
          <XIcon color={palette.ink} />
        </GhostIconButton>

        <GhostIconButton ariaLabel="링크 복사" onClick={handleCopy}>
          <CopyIcon color={palette.ink} copied={copied} />
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
