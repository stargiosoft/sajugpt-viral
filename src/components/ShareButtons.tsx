'use client';

import { useState, useRef, useCallback } from 'react';
import { copyToClipboard, getShareText, saveImage, shareNative } from '@/lib/share';
import { trackEvent } from '@/lib/analytics';

interface Props {
  headcount: number;
  battleId: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function ShareButtons({ headcount, battleId, cardRef }: Props) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = useCallback(async () => {
    const text = getShareText(headcount, battleId);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      trackEvent('sexy_battle_share_clipboard', { headcount, battleId });
    }
  }, [headcount, battleId]);

  const handleSave = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      await saveImage(cardRef.current);
      trackEvent('sexy_battle_share_instagram', { headcount, battleId });
    } catch (err) {
      console.error('이미지 저장 실패:', err);
    } finally {
      setSaving(false);
    }
  }, [cardRef, headcount, battleId, saving]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    const shared = await shareNative(cardRef.current, headcount);
    if (!shared) {
      await handleCopy();
    }
  }, [cardRef, headcount, handleCopy]);

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
      {/* Primary: 친구에게 도발 */}
      <button
        onClick={handleShare}
        style={{
          ...btnStyle,
          backgroundColor: '#7A38D8',
          color: '#fff',
          flex: 'none',
          width: '100%',
        }}
      >
        🔥 내 친구 기강 잡으러 가기
      </button>

      <div className="flex gap-3">
        {/* 클립보드 복사 */}
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

        {/* 이미지 저장 */}
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
    </div>
  );
}
