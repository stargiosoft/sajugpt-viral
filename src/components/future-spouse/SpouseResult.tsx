'use client';

import { useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import TestTopNav from '@/components/TestTopNav';
import ShareRow from '@/components/ShareRow';
import PressableButton from '@/components/PressableButton';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import ResultFooterSections from '@/components/ResultFooterSections';

import { useShareActions } from '@/lib/useShareActions';
import { trackSajuGPTClick } from '@/lib/analytics';
import { SAJUGPT_URL } from '@/constants/links';
import { RESULT_GAPS } from '@/constants/layoutGaps';
import type { SpouseResult as SpouseResultType } from '@/types/spouse';

/* =========================================================
 * DESIGN TOKENS
 * ======================================================= */
const SPOUSE_COLORS = {
  primary: 'rgb(190, 93, 116)',
  primaryHover: 'rgb(169, 73, 96)',
  gold: 'rgb(190, 148, 82)',
  goldLight: 'rgb(239, 221, 184)',
  text: 'rgb(58, 51, 52)',
  textSecondary: 'rgb(112, 102, 104)',
  textTertiary: 'rgb(157, 148, 150)',
  frameBg: 'linear-gradient(145deg, rgb(255, 249, 246) 0%, rgb(255, 245, 248) 100%)',
  frameBorder: 'rgb(225, 190, 164)',
  panelBg: 'rgb(250, 249, 248)',
  cardBg: 'rgba(255,255,255,0.96)',
  softRose: 'rgb(255, 247, 248)',
  softGold: 'rgb(255, 250, 241)',
  textOnPrimary: '#FFFFFF',
};

/* =========================================================
 * TYPES
 * ======================================================= */
interface Props {
  result: SpouseResultType;
  resultId?: string;
}

/* =========================================================
 * COMPONENT
 * ======================================================= */
export default function SpouseResult({ result, resultId = '' }: Props) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const shareUrl = useMemo(
    () => (origin ? `${origin}/future-spouse/${resultId}` : ''),
    [origin, resultId]
  );

  const getShareText = useCallback(() => shareUrl, [shareUrl]);

  const { saving, handleSave } = useShareActions({
    featureType: 'future_spouse',
    resultId,
    getShareText,
    imageFilename: `미래배우자_결과_${result.summary || ''}.png`,
  });

  const handleRestart = () => {
    router.push('/future-spouse');
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: 'linear-gradient(180deg, rgb(255,250,248) 0%, #FFFFFF 55%)' }}
    >
      <div
        className="w-full max-w-110 min-h-screen relative flex flex-col"
        style={{ background: 'linear-gradient(180deg, rgb(255,250,248) 0%, #FFFFFF 360px)' }}
      >
        <TestTopNav
          bgColor="transparent"
          logoColor={SPOUSE_COLORS.text}
          xColor={SPOUSE_COLORS.text}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full px-3 pt-3 pb-12"
        >
          {/* RESULT CARD */}
          <div ref={cardRef}>
            <div
              style={{
                position: 'relative',
                background: SPOUSE_COLORS.frameBg,
                border: `1px solid ${SPOUSE_COLORS.frameBorder}`,
                borderRadius: '30px',
                padding: '12px',
                overflow: 'hidden',
                boxShadow: '0 14px 40px rgba(153, 90, 99, 0.09)',
              }}
            >
              {/* BACKGROUND */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'url(/future-spouse/card-bg-hearts-result.webp)',
                  backgroundSize: '150px auto',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'repeat',
                  opacity: 0.09,
                  pointerEvents: 'none',
                }}
              />

              {/* 상단 골드 빛 */}
              <div
                style={{
                  position: 'absolute',
                  width: '240px',
                  height: '240px',
                  top: '-150px',
                  right: '-80px',
                  borderRadius: '999px',
                  background: 'radial-gradient(circle, rgba(239,221,184,0.40) 0%, rgba(239,221,184,0) 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* 하단 로즈 빛 */}
              <div
                style={{
                  position: 'absolute',
                  width: '220px',
                  height: '220px',
                  bottom: '-130px',
                  left: '-100px',
                  borderRadius: '999px',
                  background: 'radial-gradient(circle, rgba(235,185,198,0.24) 0%, rgba(235,185,198,0) 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* HERO RESULT HEADER */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.4 }}
                  style={{
                    position: 'relative',
                    borderRadius: '25px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,251,248,0.96) 100%)',
                    border: '1px solid rgba(225,190,164,0.78)',
                    padding: '25px 17px 22px',
                    textAlign: 'center',
                    boxShadow: '0 6px 20px rgba(147,88,96,0.055)',
                  }}
                >
                  {/* 내부 골드 라인 */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '6px',
                      borderRadius: '20px',
                      border: '1px solid rgba(239,221,184,0.70)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* BADGE */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      padding: '6px 13px',
                      marginBottom: '13px',
                      borderRadius: '999px',
                      background: 'linear-gradient(135deg, rgb(194,96,119), rgb(177,78,101))',
                      boxShadow: '0 4px 12px rgba(177,78,101,0.18)',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#FFFFFF' }}>♡</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.25px' }}>
                      미래 배우자 리포트
                    </span>
                    <span style={{ fontSize: '11px', color: '#FFFFFF' }}>♡</span>
                  </div>

                  {/* RESULT SUMMARY */}
                  <h1
                    style={{
                      position: 'relative',
                      margin: 0,
                      color: SPOUSE_COLORS.text,
                      fontSize: '23px',
                      lineHeight: 1.4,
                      fontWeight: 800,
                      letterSpacing: '-0.9px',
                      fontFamily: "'PyeongchangPeace', sans-serif",
                    }}
                  >
                    {result.summary}
                  </h1>

                  {/* PERSONALITY */}
                  <p
                    style={{
                      position: 'relative',
                      margin: '10px 0 0',
                      color: SPOUSE_COLORS.textSecondary,
                      fontSize: '13px',
                      lineHeight: 1.7,
                      letterSpacing: '-0.3px',
                    }}
                  >
                    {result.personality}
                  </p>

                  {/* DIVIDER */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '9px',
                      marginTop: '17px',
                    }}
                  >
                    <span
                      style={{
                        width: '38px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(190,148,82,0.55))',
                      }}
                    />
                    <span style={{ color: SPOUSE_COLORS.gold, fontSize: '11px' }}>♡</span>
                    <span
                      style={{
                        width: '38px',
                        height: '1px',
                        background: 'linear-gradient(90deg, rgba(190,148,82,0.55), transparent)',
                      }}
                    />
                  </div>

                  {/* DETAIL SECTIONS */}
                  <div className="flex flex-col gap-3" style={{ marginTop: '18px' }}>
                    {/* CAREER */}
                    <div
                      style={{
                        background: SPOUSE_COLORS.softGold,
                        border: '1px solid rgba(225,190,164,0.48)',
                        borderRadius: '18px',
                        padding: '15px 15px 16px',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '25px',
                            height: '25px',
                            borderRadius: '8px',
                            background: 'rgba(190,148,82,0.13)',
                            fontSize: '13px',
                          }}
                        >
                          💼
                        </span>
                        <p
                          style={{
                            margin: 0,
                            color: SPOUSE_COLORS.gold,
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '-0.2px',
                          }}
                        >
                          직업 에너지
                        </p>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: SPOUSE_COLORS.text,
                          fontSize: '13px',
                          lineHeight: 1.6,
                          fontWeight: 600,
                          letterSpacing: '-0.25px',
                        }}
                      >
                        {result.career}
                      </p>
                    </div>

                    {/* APPEARANCE */}
                    <div
                      style={{
                        background: SPOUSE_COLORS.softRose,
                        border: '1px solid rgba(225,190,164,0.48)',
                        borderRadius: '18px',
                        padding: '15px 15px 16px',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '25px',
                            height: '25px',
                            borderRadius: '8px',
                            background: 'rgba(190,93,116,0.10)',
                            fontSize: '13px',
                          }}
                        >
                          ✨
                        </span>
                        <p
                          style={{
                            margin: 0,
                            color: SPOUSE_COLORS.primary,
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '-0.2px',
                          }}
                        >
                          첫인상 & 분위기
                        </p>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: SPOUSE_COLORS.text,
                          fontSize: '13px',
                          lineHeight: 1.6,
                          fontWeight: 600,
                          letterSpacing: '-0.25px',
                        }}
                      >
                        {result.appearance}
                      </p>
                    </div>

                    {/* RELATIONSHIP */}
                    <div
                      style={{
                        background: 'rgb(255,252,250)',
                        border: '1px solid rgba(225,190,164,0.48)',
                        borderRadius: '18px',
                        padding: '15px 15px 16px',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '25px',
                            height: '25px',
                            borderRadius: '8px',
                            background: 'rgba(190,93,116,0.10)',
                            fontSize: '13px',
                          }}
                        >
                          💕
                        </span>
                        <p
                          style={{
                            margin: 0,
                            color: SPOUSE_COLORS.primary,
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '-0.2px',
                          }}
                        >
                          두 사람의 관계
                        </p>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: SPOUSE_COLORS.text,
                          fontSize: '13px',
                          lineHeight: 1.7,
                          letterSpacing: '-0.25px',
                        }}
                      >
                        {result.relationship}
                      </p>
                    </div>

                    {/* MEETING */}
                    <div
                      style={{
                        background: 'rgb(255,250,247)',
                        border: '1px solid rgba(225,190,164,0.48)',
                        borderRadius: '18px',
                        padding: '15px 15px 16px',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '25px',
                            height: '25px',
                            borderRadius: '8px',
                            background: 'rgba(190,148,82,0.13)',
                            fontSize: '13px',
                          }}
                        >
                          📍
                        </span>
                        <p
                          style={{
                            margin: 0,
                            color: SPOUSE_COLORS.gold,
                            fontSize: '11px',
                            fontWeight: 800,
                            letterSpacing: '-0.2px',
                          }}
                        >
                          만남의 예감
                        </p>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: SPOUSE_COLORS.text,
                          fontSize: '13px',
                          lineHeight: 1.7,
                          letterSpacing: '-0.25px',
                        }}
                      >
                        {result.meeting}
                      </p>
                    </div>
                  </div>

                  {/* SAJUGPT SMALL LINK */}
                  <div className="flex items-center justify-center" style={{ marginTop: '20px' }}>
                    <SajuGPTLinkButton
                      featureType="future_spouse"
                      color={SPOUSE_COLORS.primary}
                      hoverColor={SPOUSE_COLORS.primaryHover}
                      label="사주GPT"
                      marginTop="0px"
                      fontSize="15px"
                      letterSpacing="-0.5px"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* DEEP CONSULTING CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            style={{
              marginTop: '14px',
              padding: '15px 15px 14px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgb(255,250,247), rgb(255,246,248))',
              border: '1px solid rgba(225,190,164,0.62)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                marginBottom: '9px',
                color: SPOUSE_COLORS.text,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '-0.3px',
              }}
            >
              🔮 더 자세한 미래 배우자 이야기가 궁금하다면?
            </div>

            <OutlineBoxButton
              href={SAJUGPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSajuGPTClick('future_spouse', resultId)}
              color={SPOUSE_COLORS.primary}
              background="#FFFFFF"
              border={`1px solid ${SPOUSE_COLORS.primary}`}
              height="48px"
              borderRadius="15px"
              fontSize="14px"
              fontWeight={700}
            >
              사주GPT에서 미래 배우자 심층 상담하기
            </OutlineBoxButton>
          </motion.div>

          {/* ACTION BUTTONS */}
          <div style={{ marginTop: '9px', display: 'flex', gap: '8px' }}>
            <PressableButton
              onClick={handleRestart}
              label="다시 보기"
              style={{ flex: 1, height: '52px' }}
              bgStyle={{
                backgroundColor: 'rgb(255,246,247)',
                borderRadius: '16px',
                border: '1px solid rgba(225,190,164,0.48)',
              }}
              hoverBackground="rgb(252,237,240)"
              textStyle={{
                color: SPOUSE_COLORS.primary,
                fontSize: '14px',
                fontWeight: 600,
                paddingTop: '2px',
              }}
            />

            <PressableButton
              onClick={() => handleSave(cardRef)}
              label={saving ? '저장 중...' : '결과 이미지 저장'}
              style={{ flex: 2, height: '52px' }}
              bgStyle={{
                backgroundColor: SPOUSE_COLORS.primary,
                borderRadius: '16px',
                boxShadow: '0 5px 14px rgba(177,78,101,0.18)',
              }}
              hoverBackground={SPOUSE_COLORS.primaryHover}
              textStyle={{
                color: SPOUSE_COLORS.textOnPrimary,
                fontSize: '14px',
                fontWeight: 700,
                paddingTop: '2px',
              }}
            />
          </div>

          {/* SHARE */}
          <div style={{ marginTop: RESULT_GAPS.actionsToShare, textAlign: 'center' }}>
            <ShareRow
              shareContent={{
                featureType: 'future_spouse',
                resultId,
                title: '나의 미래 배우자 미리보기 💍',
                description: '내 미래 배우자의 성격, 직업, 첫인상 결과를 확인해보세요.',
                shareUrl,
                imageUrl: origin ? `${origin}/future-spouse/og-share.jpg` : '/future-spouse/og-share.jpg',
                testId: 'future-spouse',
              }}
              copyColor={SPOUSE_COLORS.primary}
              copyHoverColor={SPOUSE_COLORS.primaryHover}
              copyIconColor={SPOUSE_COLORS.textOnPrimary}
            />
          </div>

          {/* FOOTER / COMMENTS */}
          <div style={{ marginBottom: '120px' }}>
            <ResultFooterSections
              excludeId="future-spouse"
              titleStyle={{
                fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                color: SPOUSE_COLORS.text,
                letterSpacing: '-0.3px',
                paddingLeft: '2px',
              }}
              cardBg={SPOUSE_COLORS.panelBg}
              cardTitleColor={SPOUSE_COLORS.text}
              featureType="future_spouse"
              resultId={resultId}
              storageKey="future_spouse_liked_comments"
              placeholder="미래 배우자 분석 결과는 어땠나요?"
              themeColor={SPOUSE_COLORS.primary}
              inputBg="rgb(244, 246, 247)"
              disabledBg="rgb(235 236 236)"
              emptyStateColor="rgb(124 124 124)"
              metaColor="rgb(126 126 126)"
              heartIdleColor="rgb(190 190 190)"
              moreButtonFontSize="12.5px"
              moreButtonHoverBg="rgba(225,190,164,0.22)"
              submitButtonHoverBg={SPOUSE_COLORS.primaryHover}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}