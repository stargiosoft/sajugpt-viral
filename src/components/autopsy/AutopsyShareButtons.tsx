'use client';

import { useState, useRef, useCallback } from 'react';
import { captureCardImage, copyToClipboard, saveImage } from '@/lib/share';
import { trackEvent } from '@/lib/analytics';

interface Props {
  causeOfDeathLabel: string;
  autopsyId: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function AutopsyShareButtons({ causeOfDeathLabel, autopsyId, cardRef }: Props) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const shareText = `🔬 사주 부검 결과 — "${causeOfDeathLabel}" 판정\n너도 전남친 부검해봐 ㅋㅋ\n👉 ${typeof window !== 'undefined' ? window.location.origin : ''}/autopsy/${autopsyId}`;

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(shareText);
    if (ok) {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('autopsy_share_clipboard', { causeOfDeathLabel, autopsyId });
    }
  }, [shareText, causeOfDeathLabel, autopsyId]);

  const handleSave = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      await saveImage(cardRef.current, '사주부검_사망진단서.png');
      trackEvent('autopsy_share_save', { causeOfDeathLabel, autopsyId });
    } catch (err) {
      console.error('이미지 저장 실패:', err);
    } finally {
      setSaving(false);
    }
  }, [cardRef, causeOfDeathLabel, autopsyId, saving]);

  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current || !navigator.share) {
      await handleCopy();
      return;
    }
    try {
      const blob = await captureCardImage(cardRef.current);
      const file = new File([blob], '사주부검_사망진단서.png', { type: 'image/png' });
      await navigator.share({
        title: `사주 부검 결과 — ${causeOfDeathLabel}`,
        text: '너도 전남친 부검해봐 ㅋㅋ',
        files: [file],
      });
      trackEvent('autopsy_share_native', { causeOfDeathLabel, autopsyId });
    } catch {
      await handleCopy();
    }
  }, [cardRef, causeOfDeathLabel, autopsyId, handleCopy]);

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
    <div className="flex flex-col gap-3" style={{ padding: '0 20px' }}>
      {/* 공유 버튼 행 */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          style={{
            ...btnStyle,
            backgroundColor: copied ? '#E8D5F5' : '#F7F2FA',
            color: '#7A38D8',
          }}
        >
          {copied ? '복사 완료!' : '🔗 링크 복사'}
        </button>
        <button
          onClick={handleSave}
          style={{
            ...btnStyle,
            backgroundColor: '#F7F2FA',
            color: '#7A38D8',
          }}
        >
          {saving ? '저장 중...' : '💾 이미지 저장'}
        </button>
      </div>

      {/* 도발형 공유 */}
      <button
        onClick={handleNativeShare}
        style={{
          ...btnStyle,
          flex: 'unset',
          width: '100%',
          backgroundColor: '#7A38D8',
          color: '#fff',
          fontSize: '16px',
        }}
      >
        🔬 너도 전남친 부검해봐
      </button>
    </div>
  );
}
