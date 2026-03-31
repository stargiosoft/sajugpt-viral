'use client';

import { useState, useRef, useCallback } from 'react';
import { captureCardImage, copyToClipboard, saveImage } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';

interface Props {
  label?: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
  courtId: string;
  crimeLabel: string;
  sentence: number;
}

export default function CourtShareButtons({ cardRef, courtId, crimeLabel, sentence }: Props) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const getShareText = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `⚖️ 사주 법정 — ${crimeLabel}\n징역 ${sentence}년 선고 💰\n넌 뭐 나올지 해봐 ㅋㅋ\n👉 ${baseUrl}/court/${courtId}`;
  };

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(getShareText());
    if (ok) {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('saju_court_share_clipboard');
      trackShare('saju_court', 'clipboard', courtId, { crimeLabel, sentence });
    }
  }, [crimeLabel, sentence]);

  const handleSave = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      await saveImage(cardRef.current, `사주법정_${crimeLabel}.png`);
      trackEvent('saju_court_share_image');
      trackShare('saju_court', 'image_save', courtId);
    } catch { /* noop */ }
    setSaving(false);
  }, [cardRef, crimeLabel, saving]);

  const handleNative = useCallback(async () => {
    if (!navigator.share || !cardRef.current) {
      await handleCopy();
      return;
    }
    try {
      const blob = await captureCardImage(cardRef.current);
      const file = new File([blob], `사주법정_${crimeLabel}.png`, { type: 'image/png' });
      await navigator.share({
        title: `⚖️ ${crimeLabel} — 징역 ${sentence}년`,
        text: getShareText(),
        files: [file],
      });
      trackEvent('saju_court_share_native');
      trackShare('saju_court', 'native', courtId);
    } catch {
      await handleCopy();
    }
  }, [cardRef, crimeLabel, sentence, handleCopy]);

  const btnStyle: React.CSSProperties = {
    height: '56px',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    border: 'none',
    flex: 1,
  };

  return (
    <div className="flex gap-3">
        <button
          onClick={handleCopy}
          style={{
            ...btnStyle,
            backgroundColor: copied ? '#44BB44' : '#f0f0f0',
            color: copied ? '#fff' : '#333',
          }}
        >
          {copied ? '복사 완료!' : '📋 링크 복사'}
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            ...btnStyle,
            backgroundColor: '#f0f0f0',
            color: '#333',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? '저장 중...' : '📸 이미지 저장'}
        </button>
    </div>
  );
}
