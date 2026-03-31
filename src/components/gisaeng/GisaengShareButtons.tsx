'use client';

import { useState, type RefObject } from 'react';
import type { GisaengTier } from '@/types/gisaeng';
import { TIER_INFO } from '@/constants/gisaeng';
import { captureCardImage, saveImage, copyToClipboard, shareNative } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';

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
    trackShare('gisaeng', 'clipboard', resultId, { tier, monthlySalary });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!cardRef.current) return;
    await saveImage(cardRef.current, `기생시뮬_${tier}티어.png`);
    trackEvent('gisaeng_share_save');
    trackShare('gisaeng', 'image_save', resultId, { tier });
  };

  const handleNativeShare = async () => {
    if (!cardRef.current) return;
    const shared = await shareNative(cardRef.current, monthlySalary);
    if (!shared) {
      handleCopy();
    }
    trackEvent('gisaeng_share_native');
    trackShare('gisaeng', 'native', resultId, { tier });
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleNativeShare}
        className="w-full flex items-center justify-center"
        style={{
          height: '56px',
          borderRadius: '16px',
          backgroundColor: '#B8423A',
          border: 'none',
          transition: 'all 0.15s ease',
        }}
        onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
        onPointerUp={e => { e.currentTarget.style.transform = ''; }}
        onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
      >
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '25px',
          letterSpacing: '-0.32px',
          color: '#ffffff',
        }}>
          🏮 친구도 기생 시켜보기
        </span>
      </button>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center"
          style={{
            height: '48px',
            borderRadius: '16px',
            backgroundColor: '#fff',
            border: '1px solid #DDD5C8',
            fontSize: '13px',
            fontWeight: 600,
            color: '#3D3530',
            letterSpacing: '-0.26px',
            transition: 'all 0.15s ease',
          }}
          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
          onPointerUp={e => { e.currentTarget.style.transform = ''; }}
          onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
        >
          {copied ? '복사됨!' : '🔗 링크 복사'}
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center"
          style={{
            height: '48px',
            borderRadius: '16px',
            backgroundColor: '#fff',
            border: '1px solid #DDD5C8',
            fontSize: '13px',
            fontWeight: 600,
            color: '#3D3530',
            letterSpacing: '-0.26px',
            transition: 'all 0.15s ease',
          }}
          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
          onPointerUp={e => { e.currentTarget.style.transform = ''; }}
          onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
        >
          💾 이미지 저장
        </button>
      </div>
    </div>
  );
}
