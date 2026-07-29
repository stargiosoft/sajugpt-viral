'use client';

import { useCallback, useRef, useState } from 'react';
import { copyToClipboard, shareFacebook, shareKakao, shareX } from '@/lib/share';
import { trackShare, type FeatureType } from '@/lib/analytics';
import { incrementTestStat } from '@/lib/testStats';

export interface ShareContent {
  featureType: FeatureType;
  resultId?: string;
  title: string;
  description: string;
  shareUrl: string;
  imageUrl?: string;
  // 홈 화면 "공유수" 배지의 test_stats 집계 대상 — testCatalog.ts의 id와 일치해야 함.
  // featureType(analytics용, 예: 'love_chat')과 다르게 하이픈 표기(예: 'love-chat')라 별도로 받는다.
  testId?: string;
}

// 결과 페이지 공유 CTA 공용 훅 — 테스트별로 title/description/shareUrl(/imageUrl)만 넘기면
// Web Share API 지원 여부에 따라 네이티브 공유 시트 또는 폴백 모달(카카오/X/페이스북/링크복사)을 처리한다.
export function useShare(content: ShareContent) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inFlightRef = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 2200);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const copyLink = useCallback(async () => {
    const ok = await copyToClipboard(content.shareUrl);
    if (ok) {
      setCopied(true);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
      showToast('링크가 복사되었습니다.');
      trackShare(content.featureType, 'clipboard', content.resultId);
      if (content.testId) incrementTestStat(content.testId, 'share');
    }
    return ok;
  }, [content, showToast]);

  const shareToKakao = useCallback(() => {
    const ok = shareKakao({
      title: content.title,
      description: content.description,
      imageUrl: content.imageUrl,
      link: content.shareUrl,
    });
    if (ok) {
      trackShare(content.featureType, 'kakao', content.resultId);
      if (content.testId) incrementTestStat(content.testId, 'share');
    }
    setIsModalOpen(false);
  }, [content]);

  const shareToX = useCallback(() => {
    shareX(`${content.title}\n${content.description}`, content.shareUrl);
    trackShare(content.featureType, 'x', content.resultId);
    if (content.testId) incrementTestStat(content.testId, 'share');
    setIsModalOpen(false);
  }, [content]);

  const shareToFacebook = useCallback(() => {
    shareFacebook(content.shareUrl);
    trackShare(content.featureType, 'facebook', content.resultId);
    if (content.testId) incrementTestStat(content.testId, 'share');
    setIsModalOpen(false);
  }, [content]);

  // 중복 클릭 방지 + 네이티브 공유 취소 시 에러 노출 안 함
  const share = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({ title: content.title, text: content.description, url: content.shareUrl });
          trackShare(content.featureType, 'native', content.resultId);
          if (content.testId) incrementTestStat(content.testId, 'share');
        } catch (err) {
          // AbortError = 사용자가 공유 시트를 취소한 경우 — 정상 흐름이므로 무시
          if (!(err instanceof Error) || err.name !== 'AbortError') {
            setIsModalOpen(true);
          }
        }
      } else {
        setIsModalOpen(true);
      }
    } finally {
      inFlightRef.current = false;
    }
  }, [content]);

  return {
    isModalOpen,
    closeModal,
    share,
    copyLink,
    copied,
    shareToKakao,
    shareToX,
    shareToFacebook,
    toastMessage,
  };
}
