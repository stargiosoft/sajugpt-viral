'use client';

import { useState } from 'react';
import { captureCardImage, copyToClipboard, saveImage } from '@/lib/share';
import { trackEvent } from '@/lib/analytics';

interface Props {
  label: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
  courtId: string;
  crimeLabel: string;
  sentence: number;
}

export default function CourtShareButtons({ label, cardRef, courtId, crimeLabel, sentence }: Props) {
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);

  const getShareText = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `⚖️ 사주 법정 — ${crimeLabel}\n징역 ${sentence}년 선고 💰\n넌 뭐 나올지 해봐 ㅋㅋ\n👉 ${baseUrl}/court`;
  };

  const handleCopy = async () => {
    setCopying(true);
    await copyToClipboard(getShareText());
    trackEvent('saju_court_share_clipboard');
    setTimeout(() => setCopying(false), 2000);
  };

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      await saveImage(cardRef.current, `사주법정_${crimeLabel}.png`);
      trackEvent('saju_court_share_image');
    } catch { /* noop */ }
    setSaving(false);
  };

  const handleNative = async () => {
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
    } catch {
      await handleCopy();
    }
  };

  const btnStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px 8px',
    borderRadius: '10px',
    border: '1px solid #E8DCF5',
    backgroundColor: '#F7F2FA',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    color: '#7A38D8',
    textAlign: 'center',
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleNative} style={btnStyle}>
        📱 {label}
      </button>
      <button onClick={handleCopy} style={btnStyle}>
        {copying ? '✅ 복사됨' : '🔗 링크 복사'}
      </button>
      <button onClick={handleSave} style={btnStyle}>
        {saving ? '저장 중...' : '💾 저장'}
      </button>
    </div>
  );
}
