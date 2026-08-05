'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import ResultHero from './ResultHero';
import ShareRow from '@/components/ShareRow';
import PressableButton from '@/components/PressableButton';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import ResultFooterSections from '@/components/ResultFooterSections';
import { useShareActions } from '@/lib/useShareActions';
import { trackSajuGPTClick } from '@/lib/analytics';
import { SAJUGPT_URL } from '@/constants/links';
import { SOLO_COLORS as C } from '@/constants/soloGuideTheme';
import { RESULT_GAPS } from '@/constants/layoutGaps';
import type { SoloGuideResult as SoloGuideResultData } from '@/types/solo-guide';

interface Props {
  result: SoloGuideResultData;
  onRestart: () => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

function SectionCard({ children, isMobile }: { children: ReactNode; isMobile: boolean }) {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: `1.5px solid ${C.frameBorder}`,
        padding: `26px 18px ${isMobile ? '10px' : '26px'}`,
        margin: '0 -2px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '6px',
          borderRadius: '19px',
          border: '1.2px dashed #FFC2D6',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
}

const TITLE_POINT_COLOR = 'rgb(235, 70, 127)';

function SectionHeader({
  number,
  numberImage,
  label,
  isMobile,
}: {
  number?: string;
  numberImage?: string;
  label: string;
  isMobile: boolean;
}) {
  const heartSize = isMobile ? '32px' : '36px';
  return (
    <div className="flex items-center" style={{ gap: '8px', marginBottom: isMobile ? '2px' : '4px' }}>
      {numberImage ? (
        <img src={numberImage} alt="" style={{ width: heartSize, height: heartSize, flexShrink: 0 }} />
      ) : (
        number && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '21px',
              padding: '0 9px',
              borderRadius: '11px',
              backgroundColor: C.primary,
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
            }}
          >
            {number}
          </span>
        )
      )}
      <p style={{ fontSize: isMobile ? '18.5px' : '19.5px', fontWeight: 800, color: TITLE_POINT_COLOR, letterSpacing: '-0.6px' }}>{label}</p>
    </div>
  );
}

function BulletBlock({
  number,
  numberImage,
  index,
  items,
  isMobile,
}: {
  number: string;
  numberImage?: string;
  index: string;
  items: string[];
  isMobile: boolean;
}) {
  const heartSize = isMobile ? '32px' : '36px';
  return (
    <div>
      <div className="flex items-center" style={{ gap: '8px', marginBottom: isMobile ? '0px' : '2px' }}>
        {numberImage ? (
          <img src={numberImage} alt="" style={{ width: heartSize, height: heartSize, flexShrink: 0 }} />
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              height: '21px',
              padding: '0 9px',
              borderRadius: '11px',
              backgroundColor: C.primary,
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
            }}
          >
            {number}
          </span>
        )}
        <p style={{ fontSize: isMobile ? '18.5px' : '19.5px', fontWeight: 800, color: TITLE_POINT_COLOR, letterSpacing: '-0.6px', wordBreak: 'keep-all' }}>{index}</p>
      </div>
      <div className="flex flex-col" style={{ gap: '3px', paddingLeft: '46px' }}>
        {items.map((line, i) => (
          <p key={i} style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: isMobile ? 1.4 : 1.55, color: 'rgb(48 48 48)', letterSpacing: '-0.7px' }}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default function SoloResult({ result, onRestart }: Props) {
  const { content } = result;
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = origin ? `${origin}/solo-guide/${result.resultId}` : '';

  const { saving, handleSave } = useShareActions({
    featureType: 'solo_guide',
    resultId: result.resultId,
    getShareText: () => shareUrl,
    imageFilename: `내연애유형_${content.title}.png`,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ padding: '12px 8px 48px', backgroundColor: C.frameBg }}
    >
      <div ref={cardRef}>
        <div
          style={{
            position: 'relative',
            backgroundColor: C.frameBg,
            border: `2.5px solid ${C.frameBorder}`,
            borderRadius: '28px',
            padding: '16px 18px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/solo-guide/card-bg-notepaper.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: 'scale(1.15)',
              opacity: 0.5,
            }}
          />
          <div style={{ position: 'relative' }}>
          <img
            src="/solo-guide/result-title.png"
            alt=""
            style={{ display: 'block', width: '90%', maxWidth: '520px', margin: '0 auto 8px', paddingTop: '12px', paddingBottom: '12px', paddingRight: '4px' }}
          />

          <div
            style={{
              position: 'relative',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: `1.5px solid ${C.frameBorder}`,
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '6px',
                borderRadius: '9px',
                border: '1.2px dashed #FFC2D6',
                pointerEvents: 'none',
              }}
            />
            <img
              src="/solo-guide/tape-check-pink.png"
              alt=""
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-24px',
                width: '90px',
                transform: 'rotate(45deg)',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
              }}
            />
            <img
              src="/solo-guide/tape-check-pink.png"
              alt=""
              style={{
                position: 'absolute',
                top: '-8px',
                left: '-24px',
                width: '90px',
                transform: 'rotate(-45deg)',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
              }}
            />
            <ResultHero title={content.title} isMobile={isMobile} />
          </div>

          <div style={{ marginTop: '6px' }}>
            <SectionCard isMobile={isMobile}>
              <BulletBlock
                number="01"
                numberImage="/solo-guide/number-heart-1.png"
                index="내가 솔로인 이유"
                items={[content.reasonSolo]}
                isMobile={isMobile}
              />

              <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed rgba(255,194,214,0.5)' }}>
                <BulletBlock
                  number="02"
                  numberImage="/solo-guide/number-heart-2.png"
                  index="나의 반전 매력"
                  items={[content.charmPoint]}
                  isMobile={isMobile}
                />
              </div>

              <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed rgba(255,194,214,0.5)' }}>
                <BulletBlock
                  number="03"
                  numberImage="/solo-guide/number-heart-3.png"
                  index="잘 맞는 사람"
                  items={[content.compatibility]}
                  isMobile={isMobile}
                />
              </div>

              <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed rgba(255,194,214,0.5)' }}>
                <SectionHeader number="04" numberImage="/solo-guide/number-heart-4.png" label="솔로 탈출 한 줄 처방" isMobile={isMobile} />
                <div style={{ paddingLeft: '46px' }}>
                  <p
                    style={{
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: 500,
                      lineHeight: isMobile ? 1.4 : 1.55,
                      color: 'rgb(48 48 48)',
                      letterSpacing: '-0.7px',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {content.tip}
                  </p>
                </div>
              </div>

              <div
                style={{
                  marginTop: isMobile ? '6px' : '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundImage: 'url(/solo-guide/cta-tag-bg.png)',
                  backgroundSize: '100% auto',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  padding: '22px 16px',
                }}
              >
                <p
                  style={{
                    fontSize: isMobile ? '15.5px' : '17.5px',
                    fontWeight: 500,
                    lineHeight: 1.55,
                    color: TITLE_POINT_COLOR,
                    letterSpacing: '-0.7px',
                    WebkitTextStroke: `0.3px ${TITLE_POINT_COLOR}`,
                  }}
                >
                  당신의 연애를 응원할게요!
                </p>
              </div>
            </SectionCard>
          </div>

          <div
            style={{
              marginTop: '6px',
              paddingTop: '10px',
              paddingBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'url(/solo-guide/sajugpt-tape.png)',
              backgroundSize: '120px auto',
              backgroundPosition: 'center calc(50% + 6.5px)',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div style={{ marginTop: '-10px' }}>
              <SajuGPTLinkButton featureType="solo_guide" color="#FFFFFF" hoverColor="rgb(246 79 135)" label="사주GPT" />
            </div>
          </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: RESULT_GAPS.imageToActions }}>
        <OutlineBoxButton
          href={SAJUGPT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSajuGPTClick('solo_guide', result.resultId)}
          color={C.primary}
          background="#FFFFFF"
          border={`1.5px solid ${C.primary}`}
          height="50px"
          borderRadius="18px"
          fontSize="15px"
          fontWeight={700}
        >
          사주GPT에서 연애상담하기
        </OutlineBoxButton>
      </div>

      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        <PressableButton
          onClick={onRestart}
          label="다시하기"
          style={{ flex: 1, height: '54px' }}
          bgStyle={{ backgroundColor: 'rgb(255, 229, 237)', borderRadius: '18px' }}
          hoverBackground="rgba(252, 181, 209, 0.64)"
          textStyle={{ color: 'rgb(248, 71, 132)', fontSize: '15px', fontWeight: 600, paddingTop: '2px' }}
        />
        <PressableButton
          onClick={() => handleSave(cardRef)}
          label={saving ? '저장 중...' : '이미지 저장하기'}
          style={{ flex: 2, height: '54px' }}
          bgStyle={{ backgroundColor: C.primary, borderRadius: '18px' }}
          hoverBackground={C.primaryHover}
          textStyle={{ color: C.textOnPrimary, fontSize: '15px', fontWeight: 700, paddingTop: '2px' }}
        />
      </div>

      <div style={{ marginTop: RESULT_GAPS.actionsToShare, textAlign: 'center' }}>
        <ShareRow
          shareContent={{
            featureType: 'solo_guide',
            resultId: result.resultId,
            title: `💕 ${content.title}`,
            description: content.tip,
            shareUrl,
            imageUrl: origin ? `${origin}/solo-guide/og-share.jpg` : '/solo-guide/og-share.jpg',
            testId: 'solo-guide',
          }}
          copyColor={C.primary}
          copyHoverColor={C.primaryHover}
          copyIconColor={C.textOnPrimary}
        />
      </div>

      <div style={{ marginBottom: '120px' }}>
        <ResultFooterSections
          excludeId="solo-guide"
          titleStyle={{
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: C.text,
            letterSpacing: '-0.3px',
            paddingLeft: '2px',
          }}
          cardBg={C.panelBg}
          cardTitleColor={C.text}
          featureType="solo_guide"
          resultId={result.resultId}
          storageKey="solo_guide_liked_comments"
          placeholder="나의 연애 유형은 어땠나요?"
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
