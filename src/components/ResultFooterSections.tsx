'use client';

import type { CSSProperties } from 'react';
import RecommendSection from '@/components/RecommendSection';
import SajuGPTBanner from '@/components/SajuGPTBanner';
import CommentBoard from '@/components/CommentBoard';
import { RESULT_GAPS } from '@/constants/layoutGaps';
import type { FeatureType } from '@/lib/analytics';

interface Props {
  excludeId: string;
  titleStyle: CSSProperties;
  cardBg: string;
  cardTitleColor: string;
  featureType: FeatureType;
  resultId?: string;
  storageKey: string;
  placeholder: string;
  themeColor: string;
  inputBg?: string;
  disabledBg?: string;
  emptyStateColor?: string;
  metaColor?: string;
  heartIdleColor?: string;
  moreButtonFontSize?: string;
  moreButtonHoverBg?: string;
  submitButtonHoverBg?: string;
  dark?: boolean;
  shareToRecommendGap?: number;
}

export default function ResultFooterSections({
  excludeId,
  titleStyle,
  cardBg,
  cardTitleColor,
  featureType,
  resultId,
  storageKey,
  placeholder,
  themeColor,
  inputBg,
  disabledBg,
  emptyStateColor,
  metaColor,
  heartIdleColor,
  moreButtonFontSize,
  moreButtonHoverBg,
  submitButtonHoverBg,
  dark,
  shareToRecommendGap = RESULT_GAPS.shareToRecommend,
}: Props) {
  return (
    <>
      <div style={{ marginTop: shareToRecommendGap }}>
        <RecommendSection excludeId={excludeId} titleStyle={titleStyle} cardBg={cardBg} cardTitleColor={cardTitleColor} />
      </div>
      <div style={{ marginTop: RESULT_GAPS.recommendToBanner }}>
        <SajuGPTBanner featureType={featureType} resultId={resultId} />
      </div>
      <div style={{ marginTop: RESULT_GAPS.bannerToComment }}>
        <CommentBoard
          featureType={featureType}
          storageKey={storageKey}
          placeholder={placeholder}
          themeColor={themeColor}
          inputBg={inputBg}
          disabledBg={disabledBg}
          emptyStateColor={emptyStateColor}
          metaColor={metaColor}
          heartIdleColor={heartIdleColor}
          moreButtonFontSize={moreButtonFontSize}
          moreButtonHoverBg={moreButtonHoverBg}
          submitButtonHoverBg={submitButtonHoverBg}
          dark={dark}
        />
      </div>
    </>
  );
}
