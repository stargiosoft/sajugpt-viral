'use client';

import { useCallback } from 'react';
import { shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';
import { useShareActions } from '@/lib/useShareActions';
import PressableButton from '@/components/PressableButton';
import OutlineBoxButton from '@/components/OutlineBoxButton';

interface Props {
  causeOfDeathLabel: string;
  autopsyId: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function AutopsyShareButtons({ causeOfDeathLabel, autopsyId, cardRef }: Props) {
  const getShareText = useCallback(
    () => `🔬 사주 부검 결과 — "${causeOfDeathLabel}" 판정\n너도 전남친 부검해봐 ㅋㅋ\n👉 ${typeof window !== 'undefined' ? window.location.origin : ''}/autopsy/${autopsyId}`,
    [causeOfDeathLabel, autopsyId]
  );

  const { copied, saving, handleCopy, handleSave, handleNativeShare: shareNative } = useShareActions({
    featureType: 'saju_autopsy',
    resultId: autopsyId,
    getShareText,
    imageFilename: '사주부검_사망진단서.png',
    onCopy: () => trackEvent('autopsy_share_clipboard', { causeOfDeathLabel, autopsyId }),
    onSave: () => trackEvent('autopsy_share_save', { causeOfDeathLabel, autopsyId }),
    onNative: () => trackEvent('autopsy_share_native', { causeOfDeathLabel, autopsyId }),
  });

  const handleNativeShare = useCallback(
    () => shareNative(cardRef, { title: `사주 부검 결과 — ${causeOfDeathLabel}`, text: '너도 전남친 부검해봐 ㅋㅋ' }),
    [shareNative, cardRef, causeOfDeathLabel]
  );

  const handleKakaoShare = useCallback(() => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/autopsy/${autopsyId}`;
    const ok = shareKakao({
      title: `🔬 사주 부검 결과 — "${causeOfDeathLabel}" 판정`,
      description: '너도 전남친 부검해봐 ㅋㅋ',
      link,
      buttonText: '나도 부검하기',
    });
    if (ok) {
      trackEvent('autopsy_share_kakao', { causeOfDeathLabel, autopsyId });
      trackShare('saju_autopsy', 'kakao', autopsyId);
    }
  }, [causeOfDeathLabel, autopsyId]);

  return (
    <div className="flex flex-col gap-3" style={{ padding: '0 20px' }}>
      {/* 메인 CTA — 카카오톡으로 도발 공유 */}
      <PressableButton
        onClick={handleKakaoShare}
        label="💬 친구한테 보내기"
        bgStyle={{ backgroundColor: '#FEE500', borderRadius: '16px' }}
        textStyle={{ color: '#191919' }}
      />

      {/* 보조 공유 행 */}
      <div className="flex gap-3">
        <OutlineBoxButton
          onClick={() => handleSave(cardRef)}
          height="56px"
          fontSize="15px"
          background="#F7F2FA"
          color="#7A38D8"
        >
          {saving ? '저장 중...' : '💾 이미지 저장'}
        </OutlineBoxButton>
        <OutlineBoxButton
          onClick={handleCopy}
          height="56px"
          fontSize="15px"
          background={copied ? '#E8D5F5' : '#F7F2FA'}
          color="#7A38D8"
        >
          {copied ? '복사 완료!' : '🔗 링크 복사'}
        </OutlineBoxButton>
      </div>
    </div>
  );
}
