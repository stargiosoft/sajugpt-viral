'use client';

import { useState, useRef, useCallback } from 'react';
import { copyToClipboard, saveImage, captureCardImage } from '@/lib/share';
import { trackShare, type FeatureType } from '@/lib/analytics';

interface UseShareActionsOptions {
  featureType: FeatureType;
  resultId: string;
  getShareText: () => string;
  imageFilename: string;
  metadata?: Record<string, unknown>;
  onCopy?: () => void;
  onSave?: () => void;
  onNative?: () => void;
}

// 결과 카드 공유 3종(복사/이미지저장/네이티브 공유)의 copied·saving state + 타이머 리셋 보일러플레이트를 통합.
// 테스트별 trackEvent 호출은 onCopy/onSave/onNative 콜백으로 그대로 유지한다.
export function useShareActions({
  featureType,
  resultId,
  getShareText,
  imageFilename,
  metadata,
  onCopy,
  onSave,
  onNative,
}: UseShareActionsOptions) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(getShareText());
    if (ok) {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      trackShare(featureType, 'clipboard', resultId, metadata);
      onCopy?.();
    }
    return ok;
  }, [getShareText, featureType, resultId, metadata, onCopy]);

  const handleSave = useCallback(async (cardRef: React.RefObject<HTMLElement | null>) => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      await saveImage(cardRef.current, imageFilename);
      trackShare(featureType, 'image_save', resultId, metadata);
      onSave?.();
    } catch {
      /* noop */
    } finally {
      setSaving(false);
    }
  }, [saving, imageFilename, featureType, resultId, metadata, onSave]);

  const handleNativeShare = useCallback(async (
    cardRef: React.RefObject<HTMLElement | null>,
    nativeData: { title: string; text?: string }
  ) => {
    if (!cardRef.current || !navigator.share) {
      await handleCopy();
      return;
    }
    try {
      const blob = await captureCardImage(cardRef.current);
      const file = new File([blob], imageFilename, { type: 'image/png' });
      await navigator.share({ title: nativeData.title, text: nativeData.text ?? getShareText(), files: [file] });
      trackShare(featureType, 'native', resultId, metadata);
      onNative?.();
    } catch {
      await handleCopy();
    }
  }, [handleCopy, imageFilename, getShareText, featureType, resultId, metadata, onNative]);

  return { copied, saving, handleCopy, handleSave, handleNativeShare };
}
