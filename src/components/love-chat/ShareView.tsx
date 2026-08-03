'use client';

import type { RefObject } from 'react';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import PressableButton from '@/components/PressableButton';
import ShareRow from '@/components/ShareRow';
import { useShareActions } from '@/lib/useShareActions';
import { incrementTestStat } from '@/lib/testStats';
import type { LoveChatCharacter } from '@/types/love-chat';

interface Props {
  character: LoveChatCharacter;
  cardRef: RefObject<HTMLDivElement | null>;
  onReset: () => void;
}

export default function ShareView({ character, cardRef, onReset }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/love-chat/${character.id}`;

  const { saving, handleSave } = useShareActions({
    featureType: 'love_chat',
    resultId: character.id,
    getShareText: () => shareUrl,
    imageFilename: `카톡연애도감_${character.name}.png`,
    onSave: () => incrementTestStat('love-chat', 'share'),
  });

  return (
    <div className="flex flex-col" style={{ gap: '16px' }}>
      <div className="flex" style={{ gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <OutlineBoxButton color="#333333" background="#fff" border="1px solid #F2F2F2" height="50px" fontWeight={500} fontSize="17px" onClick={onReset}>
            <span style={{ paddingTop: '4px' }}>다시하기</span>
          </OutlineBoxButton>
        </div>
        <PressableButton
          label={saving ? '저장 중...' : '이미지 저장'}
          onClick={() => handleSave(cardRef)}
          disabled={saving}
          style={{ height: '50px', flex: 1 }}
          bgStyle={{ background: '#FEE500', borderRadius: '12px' }}
          textStyle={{ fontSize: '17px', fontWeight: 500, color: '#333333', paddingTop: '4px' }}
        />
      </div>

      <div style={{ paddingTop: '16px', paddingBottom: '12px' }}>
        <ShareRow
          shareContent={{
            featureType: 'love_chat',
            testId: 'love-chat',
            resultId: character.id,
            title: `💌 나의 카톡 연애 캐릭터는 "${character.name}"`,
            description: character.oneLiner,
            shareUrl,
            imageUrl: `${origin}/love-chat/og-share.png`,
          }}
          copyColor="#3D6FE0"
          copyHoverColor="#2F58B8"
        />
      </div>
    </div>
  );
}
