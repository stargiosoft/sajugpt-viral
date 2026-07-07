'use client';

import { useCallback } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useShareActions } from '@/lib/useShareActions';
import OutlineBoxButton from '@/components/OutlineBoxButton';

interface Props {
  label?: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
  courtId: string;
  crimeLabel: string;
  sentence: number;
}

export default function CourtShareButtons({ cardRef, courtId, crimeLabel, sentence }: Props) {
  const getShareText = useCallback(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `⚖️ 사주 법정 — ${crimeLabel}\n징역 ${sentence}년 선고 💰\n넌 뭐 나올지 해봐 ㅋㅋ\n👉 ${baseUrl}/court/${courtId}`;
  }, [crimeLabel, sentence, courtId]);

  const { copied, saving, handleCopy, handleSave, handleNativeShare } = useShareActions({
    featureType: 'saju_court',
    resultId: courtId,
    getShareText,
    imageFilename: `사주법정_${crimeLabel}.png`,
    metadata: { crimeLabel, sentence },
    onCopy: () => trackEvent('saju_court_share_clipboard'),
    onSave: () => trackEvent('saju_court_share_image'),
    onNative: () => trackEvent('saju_court_share_native'),
  });

  const handleNative = useCallback(
    () => handleNativeShare(cardRef, { title: `⚖️ ${crimeLabel} — 징역 ${sentence}년` }),
    [handleNativeShare, cardRef, crimeLabel, sentence]
  );

  return (
    <div className="flex gap-3">
      <OutlineBoxButton
        onClick={handleCopy}
        height="56px"
        fontSize="15px"
        background={copied ? '#44BB44' : '#f0f0f0'}
        color={copied ? '#fff' : '#333'}
      >
        {copied ? '복사 완료!' : '📋 링크 복사'}
      </OutlineBoxButton>

      <OutlineBoxButton
        onClick={() => handleSave(cardRef)}
        height="56px"
        fontSize="15px"
        background="#f0f0f0"
        color="#333"
      >
        {saving ? '저장 중...' : '📸 이미지 저장'}
      </OutlineBoxButton>
    </div>
  );
}
