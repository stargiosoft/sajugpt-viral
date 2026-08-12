'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SpotVisualCard from './SpotVisualCard';
import ShareRow from '@/components/ShareRow';
import PressableButton from '@/components/PressableButton';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import ResultFooterSections from '@/components/ResultFooterSections';
import { useShareActions } from '@/lib/useShareActions';
import { trackSajuGPTClick } from '@/lib/analytics';
import { SAJUGPT_URL } from '@/constants/links';
import { LOVE_SPOT_COLORS as C } from '@/constants/loveSpotTheme';
import { RESULT_GAPS } from '@/constants/layoutGaps';
import type { LoveSpotResult as LoveSpotResultData } from '@/types/love-spot';

interface Props {
  result: LoveSpotResultData;
  onRestart: () => void;
}

const PRETENDARD_FONT = "'Pretendard Variable', Pretendard, sans-serif";

export default function LoveSpotResult({ result, onRestart }: Props) {
  const { content } = result;
  const cardRef = useRef<HTMLDivElement>(null);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = origin ? `${origin}/love-spot/${result.resultId}` : '';

  const { saving, handleSave } = useShareActions({
    featureType: 'love_spot',
    resultId: result.resultId,
    getShareText: () => shareUrl,
    imageFilename: `내인연스팟_${content.contentKey}.png`,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ padding: '12px 8px 48px', fontFamily: PRETENDARD_FONT }}
    >
      {/* 캡처 대상 카드 */}
      <div ref={cardRef}>
        <div
          style={{
            position: 'relative',
            backgroundImage: 'url(/love-spot/heart-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '28px',
            padding: '24px 20px 20px',
            border: '2.5px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 16px 40px rgba(255, 150, 175, 0.2), inset 0 2px 6px rgba(255, 255, 255, 0.8)',
            overflow: 'hidden',
            fontFamily: PRETENDARD_FONT,
          }}
        >
          {/* 💖 상단 타이틀 영역 */}
          <div style={{ textAlign: 'center', padding: '8px 0 16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <Image
                src="/love-spot/love-spot-title.png"
                alt="내 반쪽은 어디에?"
                width={250}
                height={170}
                style={{ width: 'auto', height: 'auto', maxHeight: '120px', objectFit: 'contain' }}
                priority
              />
            </div>
            {/* 서브 타이틀 이미지 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
              <Image
                src="/love-spot/love-spot-subtitle.png"
                alt="설레는 만남이 시작되는 곳"
                width={180}
                height={30}
                style={{ width: 'auto', height: 'auto', maxHeight: '28px', objectFit: 'contain' }}
              />
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              borderRadius: '24px',
              padding: '20px 20px 18px',
              marginBottom: '14px',
              boxShadow: '0 10px 25px rgba(216, 90, 127, 0.08)',
              border: '1.5px solid #FFF0F3',
              fontFamily: PRETENDARD_FONT,
            }}
          >
            {/* 섹션 헤더: 당신의 인연이 기다리는 곳 */}
            <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFF0F3',
                  borderRadius: '10px',
                  fontSize: '13px',
                }}
              >
                📍
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 800,
                  color: C.accent,
                  letterSpacing: '-0.6px',
                  lineHeight: 1.3,
                  fontFamily: PRETENDARD_FONT,
                }}
              >
                당신의 인연이 기다리는 곳
              </h3>
            </div>

            {/* 추천 장소 비주얼 카드 */}
            <div style={{ fontFamily: PRETENDARD_FONT }}>
              <SpotVisualCard
                imageSlug={content.imageSlug}
                places={content.places}
                placeDesc={content.placeDesc}
              />
            </div>

            {/* 팁 하이라이트 박스 */}
            <div
              style={{
                marginTop: '14px',
                backgroundColor: 'rgba(255, 245, 247, 0.95)',
                padding: '14px 16px',
                borderRadius: '18px',
                border: '1.5px solid #FFD1DC',
                fontFamily: PRETENDARD_FONT,
              }}
            >
              <div className="flex items-center" style={{ gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px' }}>✨</span>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#D66A89',
                    letterSpacing: '-0.5px',
                    lineHeight: 1.3,
                    fontFamily: PRETENDARD_FONT,
                  }}
                >
                  이렇게 행동하세요
                </h4>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 500,
                  lineHeight: 1.55,
                  color: 'rgb(48 48 48)',
                  wordBreak: 'keep-all',
                  letterSpacing: '-0.7px',
                  fontFamily: PRETENDARD_FONT,
                }}
              >
                {content.tip}
              </p>
            </div>
          </div>

          {/* 감성 문구 */}
          <div
            style={{
              textAlign: 'center',
              padding: '6px 10px 2px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#A8526B',
              letterSpacing: '-0.5px',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
              lineHeight: 1.4,
              fontFamily: PRETENDARD_FONT,
            }}
          >
            💌 인연은 생각보다 가까운 곳에서 시작될지도 몰라요.
          </div>
        </div>
      </div>

      <div style={{ marginTop: RESULT_GAPS.imageToActions }}>
        <OutlineBoxButton
          href={SAJUGPT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSajuGPTClick('love_spot', result.resultId)}
          color={C.primary}
          background="#FFFFFF"
          border={`1.5px solid ${C.primary}`}
          height="50px"
          borderRadius="18px"
          fontSize="15px"
          fontWeight={700}
        >
          <span style={{ fontFamily: PRETENDARD_FONT, letterSpacing: '-0.4px' }}>
            사주GPT에서 연애상담하기
          </span>
        </OutlineBoxButton>
      </div>

      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        <PressableButton
          onClick={onRestart}
          label="다시하기"
          style={{ flex: 1, height: '54px' }}
          bgStyle={{ backgroundColor: 'rgb(255, 229, 237)', borderRadius: '18px' }}
          hoverBackground="rgba(252, 181, 209, 0.64)"
          textStyle={{
            color: 'rgb(248, 71, 132)',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: PRETENDARD_FONT,
            letterSpacing: '-0.4px',
            paddingTop: '2px',
          }}
        />
        <PressableButton
          onClick={() => handleSave(cardRef)}
          label={saving ? '저장 중...' : '이미지 저장하기'}
          style={{ flex: 2, height: '54px' }}
          bgStyle={{ backgroundColor: C.primary, borderRadius: '18px' }}
          hoverBackground={C.primaryHover}
          textStyle={{
            color: C.textOnPrimary,
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: PRETENDARD_FONT,
            letterSpacing: '-0.4px',
            paddingTop: '2px',
          }}
        />
      </div>

      <div style={{ marginTop: RESULT_GAPS.actionsToShare, textAlign: 'center' }}>
        <ShareRow
          shareContent={{
            featureType: 'love_spot',
            resultId: result.resultId,
            title: `💘 ${content.places}`,
            description: content.tip,
            shareUrl,
            imageUrl: origin ? `${origin}/love-spot/og-share.jpg` : '/love-spot/og-share.jpg',
            testId: 'love-spot',
          }}
          copyColor={C.primary}
          copyHoverColor={C.primaryHover}
          copyIconColor={C.textOnPrimary}
        />
      </div>

      <div style={{ marginBottom: '120px' }}>
        <ResultFooterSections
          excludeId="love-spot"
          titleStyle={{
            fontFamily: PRETENDARD_FONT,
            fontSize: '16px',
            fontWeight: 700,
            color: C.text,
            letterSpacing: '-0.3px',
            paddingLeft: '2px',
          }}
          cardBg={C.panelBg}
          cardTitleColor={C.text}
          featureType="love_spot"
          resultId={result.resultId}
          storageKey="love_spot_liked_comments"
          placeholder="내 인연 스팟은 어땠나요?"
          themeColor={C.primary}
          inputBg="#FFFFFF"
          disabledBg="rgb(237 237 237)"
          emptyStateColor="rgb(124 124 124)"
          metaColor="rgb(126 126 126)"
          heartIdleColor="rgb(190 190 190)"
          moreButtonFontSize="12.5px"
          moreButtonHoverBg="rgba(252, 181, 209, 0.64)"
          submitButtonHoverBg={C.primaryHover}
        />
      </div>
    </motion.div>
  );
}