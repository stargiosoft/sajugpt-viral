'use client';

import Image from 'next/image';
import PressableButton from '@/components/PressableButton';
import { trackEvent, trackSajuGPTClick } from '@/lib/analytics';
import DeangOutlineBox from './DeangOutlineBox';
import useIsNarrow from '@/hooks/useIsNarrow';

interface Props {
  resultId: string;
  breedName: string;
}

export default function DeangCTA({ resultId, breedName }: Props) {
  const isNarrow = useIsNarrow();
  return (
    <DeangOutlineBox
      radius={20}
      strokeWidth={2.3}
      stitch
      stitchColor="rgb(202, 230, 218)"
      backgroundColor="rgb(247, 250, 245)"
      style={{
        padding: '40px 36px 36px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '17px', color: 'rgb(52, 52, 52)', lineHeight: '1.65', marginBottom: '8px' }}>
        {breedName}는 시작일 뿐이에요
      </p>
      <p style={{ fontFamily: 'Cafe24 Dongdong, sans-serif', fontSize: '23px', color: '#000000', WebkitTextStroke: '0.2px #000000', marginBottom: '24px' }}>
        {isNarrow ? (
          <>내 진짜 사주,<br />심층 분석 받아보기</>
        ) : (
          '내 진짜 사주, 심층 분석 받아보기'
        )}
      </p>
      <PressableButton
        href="https://www.sajugpt.co.kr/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent('deang_saju_cta_click', { breedName });
          trackSajuGPTClick('deang_saju', resultId);
        }}
        label={
          <span className="flex items-center justify-center" style={{ gap: '6px' }}>
            사주GPT로 더 알아보기
            <Image src="/deang-saju/icons/arrow.svg" alt="" width={16} height={16} style={{ position: 'relative', top: '-1px' }} />
          </span>
        }
        style={{ height: '54px' }}
        bgStyle={{ backgroundColor: '#58B889', borderRadius: '16px', border: 'none' }}
        hoverBackground="#4ba679"
        textStyle={{ color: '#FFFFFF', fontWeight: 500, fontSize: '17px', WebkitTextStroke: '0.3px #FFFFFF' }}
      />
    </DeangOutlineBox>
  );
}
