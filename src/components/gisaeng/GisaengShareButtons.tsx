'use client';

import { useState, type RefObject } from 'react';
import type { GisaengTier } from '@/types/gisaeng';
import { TIER_INFO } from '@/constants/gisaeng';
import { captureCardImage, saveImage, copyToClipboard, shareNative } from '@/lib/share';
import { trackEvent } from '@/lib/analytics';

interface Props {
  cardRef: RefObject<HTMLDivElement | null>;
  resultId: string;
  tier: GisaengTier;
  monthlySalary: number;
  gisaengName: string;
}

export default function GisaengShareButtons({ cardRef, resultId, tier, monthlySalary, gisaengName }: Props) {
  const [copied, setCopied] = useState(false);

  const tierLabel = TIER_INFO[tier].label;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/gisaeng/${resultId}`;

  const shareText = `🏮 기생 시뮬 — ${tier}티어 ${tierLabel}\n${gisaengName} | 월 ${monthlySalary.toLocaleString()}냥\n넌 몇 냥이야? ㅋㅋ\n👉 ${shareUrl}`;

  const handleCopy = async () => {
    await copyToClipboard(shareText);
    setCopied(true);
    trackEvent('gisaeng_share_copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!cardRef.current) return;
    await saveImage(cardRef.current, `기생시뮬_${tier}티어.png`);
    trackEvent('gisaeng_share_save');
  };

  const handleNativeShare = async () => {
    if (!cardRef.current) return;
    const shared = await shareNative(cardRef.current, monthlySalary);
    if (!shared) {
      handleCopy();
    }
    trackEvent('gisaeng_share_native');
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleNativeShare}
        className="w-full py-3.5 rounded-xl active:scale-[0.98] transition-transform"
        style={{ backgroundColor: '#7A38D8', color: '#FFFFFF', fontSize: '15px', fontWeight: 700 }}
      >
        🏮 친구도 기생 시켜보기
      </button>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#D1D5DB', fontSize: '13px', fontWeight: 600 }}
        >
          {copied ? '복사됨!' : '🔗 링크 복사'}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#D1D5DB', fontSize: '13px', fontWeight: 600 }}
        >
          💾 이미지 저장
        </button>
      </div>
    </div>
  );
}
