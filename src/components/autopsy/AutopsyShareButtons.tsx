'use client';

import { useCallback } from 'react';
import { shareKakao } from '@/lib/share';
import { trackEvent, trackShare } from '@/lib/analytics';
import { useShareActions } from '@/lib/useShareActions';

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
      {/* 메인 CTA — 카카오톡으로 도발 공유 */}
      <button
        onClick={handleKakaoShare}
        style={{
          ...btnStyle,
          flex: 'unset',
          width: '100%',
          backgroundColor: '#FEE500',
          color: '#191919',
          fontSize: '16px',
        }}
      >
        💬 친구한테 보내기
      </button>

      {/* 보조 공유 행 */}
      <div className="flex gap-3">
        <button
          onClick={() => handleSave(cardRef)}
          style={{
            ...btnStyle,
            backgroundColor: '#F7F2FA',
            color: '#7A38D8',
          }}
        >
          {saving ? '저장 중...' : '💾 이미지 저장'}
        </button>
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
      </div>
    </div>
  );
}
