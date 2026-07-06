'use client';

import type { RefObject } from 'react';
import { useCallback } from 'react';
import type { GisaengTier } from '@/types/gisaeng';
import { TIER_INFO } from '@/constants/gisaeng';
import { trackEvent } from '@/lib/analytics';
import { useShareActions } from '@/lib/useShareActions';

interface Props {
  cardRef: RefObject<HTMLDivElement | null>;
  resultId: string;
  tier: GisaengTier;
  monthlySalary: number;
  gisaengName: string;
}

export default function GisaengShareButtons({ cardRef, resultId, tier, monthlySalary, gisaengName }: Props) {
  const tierLabel = TIER_INFO[tier].label;

  const { copied, handleCopy, handleSave, handleNativeShare: shareNative } = useShareActions({
    featureType: 'gisaeng',
    resultId,
    getShareText: () => {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      return `🏮 기생 시뮬 — ${tier}티어 ${tierLabel}\n${gisaengName} | 월 ${monthlySalary.toLocaleString()}냥\n넌 몇 냥이야? ㅋㅋ\n👉 ${baseUrl}/gisaeng/${resultId}`;
    },
    imageFilename: `기생시뮬_${tier}티어.png`,
    metadata: { tier, monthlySalary },
    onCopy: () => trackEvent('gisaeng_share_copy'),
    onSave: () => trackEvent('gisaeng_share_save'),
    onNative: () => trackEvent('gisaeng_share_native'),
  });

  const handleNativeShare = useCallback(
    () => shareNative(cardRef, { title: `🏮 기생 시뮬 — ${tier}티어 ${tierLabel}`, text: `${gisaengName} | 월 ${monthlySalary.toLocaleString()}냥\n넌 몇 냥이야? ㅋㅋ` }),
    [shareNative, cardRef, tier, tierLabel, gisaengName, monthlySalary]
  );

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
          onClick={() => handleSave(cardRef)}
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
