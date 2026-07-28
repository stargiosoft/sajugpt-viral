'use client';

import { forwardRef } from 'react';
import PressableButton from '@/components/PressableButton';
import type { LoveChatCharacter } from '@/types/love-chat';
import ResultContent from './ResultContent';
import ChatSimulation from './ChatSimulation';

interface Props {
  character: LoveChatCharacter;
}

const ResultCard = forwardRef<HTMLDivElement, Props>(function ResultCard({ character }, ref) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <div ref={ref} style={{ background: '#D1E0F5', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <ResultContent character={character} />
        <ChatSimulation character={character} />
      </div>

      <div
        style={{
          background: '#333333',
          borderRadius: '16px',
          padding: '20px',
          margin: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <p style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '18px', color: '#FFFFFF', lineHeight: 1.5, marginBottom: '6px' }}>
            {character.name}은 시작일 뿐이에요.
          </span>
          <span style={{ display: 'block', fontSize: '23px', color: '#FFFFFF', lineHeight: 1.5, marginBottom: '4px' }}>
            내 진짜 사주, 심층 분석 받아보기
          </span>
        </p>
        <PressableButton
          label="사주GPT로 더 알아보기 →"
          href="https://sajugpt.co.kr"
          target="_blank"
          rel="noopener noreferrer"
          style={{ height: '48px' }}
          bgStyle={{ background: '#FEE500', borderRadius: '12px' }}
          textStyle={{ fontSize: '17px', fontWeight: 500, color: '#333333', paddingTop: '2px' }}
        />
      </div>
    </div>
  );
});

export default ResultCard;
