'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CourtResult } from '@/types/court';
import { ACCOMPLICE_OPTIONS } from '@/constants/court';
import { copyToClipboard } from '@/lib/share';
import { trackEvent } from '@/lib/analytics';

interface Props {
  result: CourtResult;
  sentence: number;
  onSkip: () => void;
  onComplete: () => void;
}

export default function AccompliceScreen({ result, sentence, onSkip, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  const handleShare = async (accompliceLabel: string) => {
    setSelected(accompliceLabel);

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = `⚖️ [긴급] 공범 지목 통보

사주 법정에서 "${result.crimeLabel}"로 징역 ${sentence}년을 선고받았습니다.

그리고 당신을 "${accompliceLabel}"로 공범 지목했습니다.

출석하지 않으면 궐석재판이 진행됩니다.

👉 ${baseUrl}/court`;

    // 네이티브 공유 시도
    if (navigator.share) {
      try {
        await navigator.share({
          title: '⚖️ 사주 법정 — 공범 지목 통보',
          text: shareText,
        });
        setShared(true);
        trackEvent('saju_court_accomplice_share');
        onComplete();
        return;
      } catch { /* 사용자 취소 */ }
    }

    // fallback: 클립보드 복사
    await copyToClipboard(shareText);
    setShared(true);
    trackEvent('saju_court_accomplice_copy');
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="w-full" style={{ padding: '32px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col items-center" style={{ marginBottom: '24px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7A38D8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.7 }}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#E8E0F5', textAlign: 'center', marginBottom: '8px', whiteSpace: 'pre-line' }}>
            {'피고인의 죄에는\n공범이 있을 수 있습니다'}
          </h2>
          <p style={{ fontSize: '13px', color: '#6B5C85', textAlign: 'center' }}>
            해당하는 자를 지목하십시오
          </p>
        </div>

        <div className="flex flex-col gap-3" style={{ marginBottom: '24px' }}>
          {ACCOMPLICE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleShare(opt.label)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: `1px solid ${selected === opt.label ? 'rgba(122, 56, 216, 0.4)' : 'rgba(122, 56, 216, 0.15)'}`,
                backgroundColor: selected === opt.label ? 'rgba(122, 56, 216, 0.15)' : 'rgba(122, 56, 216, 0.06)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#B07AFF', marginBottom: '4px' }}>{opt.label}</p>
              <p style={{ fontSize: '13px', color: '#6B5C85' }}>{opt.subtext}</p>
            </button>
          ))}
        </div>

        {shared && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: '14px', color: '#7A38D8', textAlign: 'center', marginBottom: '16px', fontWeight: 600 }}
          >
            공범 기소장이 전송되었습니다
          </motion.p>
        )}

        <button
          onClick={onSkip}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid rgba(122, 56, 216, 0.10)',
            backgroundColor: 'rgba(122, 56, 216, 0.04)',
            color: '#6B5C85',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          건너뛰기
        </button>
      </motion.div>
    </div>
  );
}
