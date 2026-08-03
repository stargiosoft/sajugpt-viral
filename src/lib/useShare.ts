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
  testId?: string;
}

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
