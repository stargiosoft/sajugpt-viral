'use client';

import type { RefObject } from 'react';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import PressableButton from '@/components/PressableButton';
import ShareRow from '@/components/ShareRow';
import { useShareActions } from '@/lib/useShareActions';
import { incrementTestStat } from '@/lib/testStats';
import { MONEY_COLORS as C } from '@/constants/moneyTimelineTheme';
import type { MoneyTimelineProfile } from '@/types/money-timeline';

interface Props {
  resultId: string;
  profile: MoneyTimelineProfile;
  cardRef: RefObject<HTMLDivElement | null>;
  onReset: () => void;
}

export default function ShareView({ resultId, profile, cardRef, onReset }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/money-timeline/${resultId}?v=2`;

  const { saving, handleSave } = useShareActions({
    featureType: 'money_timeline',
    resultId,
    getShareText: () => shareUrl,
    imageFilename: `내돈복그래프_${profile.overallScore}점.png`,
    onSave: () => incrementTestStat('money-timeline', 'share'),
  });

  return (
    <div className="flex flex-col" style={{ gap: '16px' }}>
      <div className="flex" style={{ gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <OutlineBoxButton
            color="rgb(115, 94, 242)"
            background="rgb(221, 216, 255)"
            border="none"
            height="56px"
            borderRadius="16px"
            fontWeight={500}
            fontSize="16px"
            letterSpacing="-0.32px"
            hoverBackground="rgb(212, 206, 255)"
            onClick={onReset}
          >
            <span style={{ paddingTop: '4px', paddingBottom: '2px', WebkitTextStroke: '0.6px rgb(115, 94, 242)' }}>다시하기</span>
          </OutlineBoxButton>
        </div>
        <PressableButton
          label={saving ? '저장 중...' : '이미지 저장'}
          onClick={() => handleSave(cardRef)}
          disabled={saving}
          style={{ height: '56px', flex: 1 }}
          bgStyle={{ background: C.gold, borderRadius: '16px' }}
          hoverBackground={C.goldHover}
          textStyle={{ fontSize: '16px', fontWeight: 500, letterSpacing: '-0.32px', color: C.textOnGold, paddingTop: '4px', paddingBottom: '2px', WebkitTextStroke: `0.6px ${C.textOnGold}` }}
        />
      </div>

      <div style={{ paddingTop: '16px', paddingBottom: '12px' }}>
        <ShareRow
          shareContent={{
            featureType: 'money_timeline',
            testId: 'money-timeline',
            resultId,
            title: '💰 내 돈복 테스트 💰',
            description: '내 사주 속 돈의 흐름을 분석해 드려요.',
            shareUrl,
            imageUrl: `${origin}/money-timeline/og-share.png?v=2`,
          }}
          copyColor={C.gold}
          copyHoverColor="rgb(95, 74, 220)"
          copyIconColor={C.textOnGold}
        />
      </div>
    </div>
  );
}
