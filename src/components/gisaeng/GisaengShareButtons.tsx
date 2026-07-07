'use client';

import type { RefObject } from 'react';
import { useCallback } from 'react';
import type { GisaengTier } from '@/types/gisaeng';
import { TIER_INFO } from '@/constants/gisaeng';
import { trackEvent } from '@/lib/analytics';
import { useShareActions } from '@/lib/useShareActions';
import PressableButton from '@/components/PressableButton';
import OutlineBoxButton from '@/components/OutlineBoxButton';

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
      <PressableButton
        onClick={handleNativeShare}
        label="🏮 친구도 기생 시켜보기"
        bgStyle={{ backgroundColor: '#B8423A', borderRadius: '16px' }}
        textStyle={{ color: '#ffffff' }}
      />

      <div className="flex gap-3">
        <OutlineBoxButton
          onClick={handleCopy}
          background="#fff"
          border="1px solid #DDD5C8"
          color="#3D3530"
        >
          {copied ? '복사됨!' : '🔗 링크 복사'}
        </OutlineBoxButton>
        <OutlineBoxButton
          onClick={() => handleSave(cardRef)}
          background="#fff"
          border="1px solid #DDD5C8"
          color="#3D3530"
        >
          💾 이미지 저장
        </OutlineBoxButton>
      </div>
    </div>
  );
}
