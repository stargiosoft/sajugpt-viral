'use client';

import ShareButton from '@/components/ShareButton';
import PressableButton from '@/components/PressableButton';
import { useShareActions } from '@/lib/useShareActions';

interface Props {
  headcount: number;
  battleId: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function ShareButtons({ headcount, battleId, cardRef }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const { saving, handleSave } = useShareActions({
    featureType: 'sexy_battle',
    resultId: battleId,
    getShareText: () => '',
    imageFilename: '색기배틀_결과.png',
    metadata: { headcount },
  });

  return (
    <div className="flex flex-col gap-3 mx-auto w-full max-w-[400px] md:max-w-[520px] lg:max-w-[620px]">
      {/* Primary: 네이티브 공유 시트 또는 폴백 모달(카카오/X/Facebook/링크복사) */}
      <ShareButton
        featureType="sexy_battle"
        resultId={battleId}
        title={`색기 배틀 — 나한테 꼬인 남자 ${headcount}명 🔥`}
        description="넌 몇 명이나 꼬이나 해봐 ㅋㅋ"
        shareUrl={`${origin}/sexy-battle/${battleId}`}
        imageUrl={`${origin}/home/thumbnails/sexy-battle.jpg`}
        label="공유하기"
        activeBackground="linear-gradient(135deg, #FF4438 0%, #E0201A 100%)"
      />

      {/* 이미지 저장 — 링크 공유와 별개인 카드 다운로드 기능이라 그대로 유지 */}
      <PressableButton
        onClick={() => handleSave(cardRef)}
        disabled={saving}
        label={saving ? '저장 중...' : '이미지 저장'}
        bgStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '16px' }}
        hoverBackground="rgba(255,255,255,0.14)"
        textStyle={{ color: '#fff' }}
      />
    </div>
  );
}
