'use client';

import type { CSSProperties } from 'react';
import PressableButton from '@/components/PressableButton';
import ShareModal from '@/components/ShareModal';
import Toast from '@/components/Toast';
import { useShare, type ShareContent } from '@/lib/useShare';

interface Props extends ShareContent {
  label: string;
  activeBackground: string;
  textColor?: string;
  style?: CSSProperties;
  hoverBackground?: string;
}

// 결과 페이지 공유 CTA 공용 버튼 — title/description/shareUrl(/imageUrl)만 넘기면
// 네이티브 공유 시트 또는 폴백 모달(카카오/X/Facebook/링크복사) + 토스트까지 전부 처리한다.
export default function ShareButton({ label, activeBackground, textColor = '#fff', style, hoverBackground, ...content }: Props) {
  const {
    share,
    isModalOpen,
    closeModal,
    copyLink,
    copied,
    shareToKakao,
    shareToX,
    shareToFacebook,
    toastMessage,
  } = useShare(content);

  return (
    <>
      <PressableButton
        onClick={share}
        label={label}
        style={style}
        bgStyle={{ background: activeBackground, borderRadius: '16px' }}
        hoverBackground={hoverBackground}
        textStyle={{ color: textColor }}
      />
      <ShareModal
        open={isModalOpen}
        onClose={closeModal}
        onKakao={shareToKakao}
        onX={shareToX}
        onFacebook={shareToFacebook}
        onCopy={copyLink}
        copied={copied}
      />
      <Toast message={toastMessage} />
    </>
  );
}
