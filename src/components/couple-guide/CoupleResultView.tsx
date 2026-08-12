'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import TestTopNav from '@/components/TestTopNav';
import LandingCTAButton from '@/components/LandingCTAButton';
import ShareRow from '@/components/ShareRow';
import PressableButton from '@/components/PressableButton';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import ResultFooterSections from '@/components/ResultFooterSections';
import RelationshipTitle from './RelationshipTitle';
import ChemiStatBar from './ChemistatBar';

import { loadCoupleGuideResult, mapToCoupleResult } from '@/lib/coupleGuide';
import { useShareActions } from '@/lib/useShareActions';
import { trackSajuGPTClick } from '@/lib/analytics';
import { SAJUGPT_URL } from '@/constants/links';
import { RESULT_GAPS } from '@/constants/layoutGaps';
import { COUPLE_COLORS as C } from '@/constants/coupleGuideTheme';
import type { CoupleGuideResult } from '@/types/couple-guide';

type Status = 'loading' | 'found' | 'notFound';

interface CoupleResultViewProps {
  resultId: string;
}

export default function CoupleResultView({ resultId }: CoupleResultViewProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [result, setResult] = useState<CoupleGuideResult | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = useMemo(() => (origin ? `${origin}/couple-guide/${resultId}` : ''), [origin, resultId]);
  const getShareText = useCallback(() => shareUrl, [shareUrl]);

  const { saving, handleSave } = useShareActions({
    featureType: 'couple_guide',
    resultId,
    getShareText,
    imageFilename: `우리사이_궁합결과_${result?.relationshipTitle || ''}.png`,
  });

  useEffect(() => {
    const stored = loadCoupleGuideResult(resultId);

    if (!stored) {
      setStatus('notFound');
      return;
    }

    setResult(mapToCoupleResult(stored));
    setStatus('found');
  }, [resultId]);

  const handleRestart = () => {
    router.push('/couple-guide');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }}>
      <div
        className="w-full max-w-110 md:max-w-150"
        style={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          fontFamily: 'Cafe24 Dongdong, sans-serif',
        }}
      >
        <TestTopNav bgColor="#FFFFFF" logoColor="#000000" xColor="#000000" />

        {status === 'loading' && (
          <div style={{ padding: '120px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: C.textSecondary }}>결과를 불러오는 중이에요...</p>
          </div>
        )}

        {status === 'notFound' && (
          <div style={{ padding: '120px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>결과를 찾을 수 없어요</p>
            <p style={{ fontSize: '14px', color: C.textSecondary, marginBottom: '28px', lineHeight: 1.6 }}>
              다른 기기에서 열었거나 브라우저 데이터가 지워졌을 수 있어요.
            </p>
            <div style={{ width: '100%', maxWidth: '240px' }}>
              <LandingCTAButton
                onClick={handleRestart}
                label="새로 분석하기"
                background={C.primary}
                color={C.textOnPrimary}
                hoverBackground={C.primaryHover}
                height="52px"
              />
            </div>
          </div>
        )}

        {status === 'found' && result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{ padding: '12px 8px 48px', backgroundColor: '#FFFFFF' }}
          >
            {/* 결과 카드 영역 (이미지 저장 영역) */}
            <div ref={cardRef}>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: C.frameBg,
                  border: `2.5px solid ${C.frameBorder}`,
                  borderRadius: '28px',
                  padding: '14px',
                  overflow: 'hidden',
                }}
              >
                {/* 배경 필름 액센트 */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(/couple-guide/card-bg-hearts-result.png)',
                    backgroundSize: '160px auto',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat',
                    opacity: 0.85,
                  }}
                />

                <div style={{ position: 'relative' }}>

                  {/* 스코어 & 대표 특징 헤더 카드 (원형 그래프 제거 및 캐릭터 중심 배치 + 점수 텍스트화) */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '24px',
                      backgroundColor: '#FFFFFF',
                      border: `1.5px solid ${C.frameBorder}`,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                      padding: '20px 16px 22px',
                      marginTop: '0px',
                      textAlign: 'center',
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
                    {/* 캐릭터 일러스트 중앙 집중 배치 */}
                    <div className="flex justify-center mb-3">
                      <div className="w-62.5 md:w-72.5">
                        <img
                          src={`/couple-guide/char-${result.maxScore ?? 100}.png`}
                          alt={result.relationshipTitle}
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/couple-guide/char-100.jpg';
                          }}
                        />
                      </div>
                    </div>

                    {/* 2. 궁합 점수 텍스트 */}
                      <div className="flex flex-col items-center">
                        <div
                          className="flex items-center justify-center"
                          style={{ gap: '8px', backgroundColor: C.primary, borderRadius: '12px', padding: '4px 16px' }}
                        >
                          <img src="/couple-guide/icon-heart.svg" alt="" style={{ width: '14px', height: '14px', filter: 'brightness(0) invert(1)', transform: 'rotate(-20deg)' }} />
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>궁합 점수</span>
                          <img src="/couple-guide/icon-heart.svg" alt="" style={{ width: '14px', height: '14px', filter: 'brightness(0) invert(1)', transform: 'rotate(20deg)' }} />
                        </div>
                        <span className="cg-score-num font-black tracking-tighter" style={{ color: C.primary, fontSize: '62px' }}>
                          {result.totalScore}점
                        </span>
                        <style>{`
                          @media (max-width: 599px) {
                            .cg-score-num { font-size: 60px !important; }
                          }
                        `}</style>
                      </div>

                      {/* 3. 타이틀 및 부제목 (국대급 복식조 커플 등) */}
                      <RelationshipTitle
                        title={result.relationshipTitle}
                        subtitle={result.relationshipDescription || result.summary}
                      />

                      {/* 4. 해시태그 목록 */}
                      {result.hashtags && result.hashtags.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center" style={{ gap: '4px', marginTop: '10px' }}>
                          {result.hashtags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#FFF5F8',
                                border: `1px solid ${C.frameBorder}`,
                                borderRadius: '12px',
                                padding: '4px 10px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                color: C.primary,
                              }}
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 5. 궁합 지수 그래프 */}
                      <div
                        style={{
                          position: 'relative',
                          marginTop: '20px',
                          padding: '28px 24px',
                          textAlign: 'left',
                          backgroundColor: 'rgb(255 252 253)',
                          border: '2px solid #FFD6E4',
                          borderRadius: '20px',
                          overflow: 'hidden',
                        }}
                      >
                        {/* 코너 장식 */}
                        <svg viewBox="0 0 64 64" style={{ position: 'absolute', top: '10px', left: '14px', width: '14px', height: '14px' }}>
                          <path fill="#FFC2D6" d="m44,5c-4.65,0-8.96,1.97-12,5.44-3.04-3.47-7.35-5.44-12-5.44-8.82,0-16,7.18-16,16,0,22.37,26.44,35.36,27.57,35.9.14.07.29.1.43.1s.3-.03.43-.1c1.13-.54,27.57-13.53,27.57-35.9,0-8.82-7.18-16-16-16Z" />
                        </svg>
                        <svg viewBox="0 0 64 64" style={{ position: 'absolute', bottom: '10px', right: '14px', width: '14px', height: '14px' }}>
                          <path fill="#FFC2D6" d="m44,5c-4.65,0-8.96,1.97-12,5.44-3.04-3.47-7.35-5.44-12-5.44-8.82,0-16,7.18-16,16,0,22.37,26.44,35.36,27.57,35.9.14.07.29.1.43.1s.3-.03.43-.1c1.13-.54,27.57-13.53,27.57-35.9,0-8.82-7.18-16-16-16Z" />
                        </svg>

                        <div className="flex items-center justify-center" style={{ position: 'relative', marginBottom: '16px' }}>
                          <div
                            className="flex items-center justify-center"
                            style={{ gap: '8px', backgroundColor: C.primary, borderRadius: '12px', padding: '4px 16px' }}
                          >
                            <img src="/couple-guide/icon-heart.svg" alt="" style={{ width: '14px', height: '14px', filter: 'brightness(0) invert(1)', transform: 'rotate(-20deg)' }} />
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>우리 사이 궁합 지수</span>
                            <img src="/couple-guide/icon-heart.svg" alt="" style={{ width: '14px', height: '14px', filter: 'brightness(0) invert(1)', transform: 'rotate(20deg)' }} />
                          </div>
                        </div>
                        <div className="flex flex-col" style={{ position: 'relative', gap: '20px' }}>
                          {result.stats.map((stat, index) => (
                            <ChemiStatBar
                              key={stat.label}
                              {...stat}
                              delay={index * 0.15}
                              barEndIcon={index === 1 ? '/couple-guide/icon-thunder.svg' : undefined}
                              barEndIconSize={index === 1 ? '20px' : undefined}
                              color={index === 1 ? '#FF9E45' : stat.color}
                            />
                          ))}
                        </div>
                      </div>

                      {/* 사주GPT 링크 버튼 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SajuGPTLinkButton
                          featureType="couple_guide"
                          color={C.primary}
                          hoverColor={C.primaryHover}
                          label="사주GPT"
                          fontFamily="Cafe24 Dongdong, sans-serif"
                          marginTop="16px"
                          fontSize="17px"
                          letterSpacing="-0.5px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* 외부 링크 CTA */}
            <div style={{ marginTop: 20 }}>
              <OutlineBoxButton
                href={SAJUGPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSajuGPTClick('couple_guide', resultId)}
                color={C.primary}
                background="#FFFFFF"
                border={`1.5px solid ${C.primary}`}
                height="50px"
                borderRadius="18px"
                fontSize="15px"
                fontWeight={700}
              >
                사주GPT에서 커플 궁합 심층 상담하기
              </OutlineBoxButton>
            </div>

            {/* 메인 조작 액션 (다시하기 / 이미지 저장) */}
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <PressableButton
                onClick={handleRestart}
                label="다시하기"
                style={{ flex: 1, height: '54px' }}
                bgStyle={{ backgroundColor: 'rgba(255, 194, 207, 0.32)', borderRadius: '18px' }}
                hoverBackground="rgba(255, 107, 129, 0.25)"
                textStyle={{ color: C.primary, fontSize: '15px', fontWeight: 600, paddingTop: '2px' }}
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

            {/* 소셜 및 링크 공유 */}
            <div style={{ marginTop: RESULT_GAPS.actionsToShare, textAlign: 'center' }}>
              <ShareRow
                shareContent={{
                  featureType: 'couple_guide',
                  resultId,
                  title: '우리 궁합, 같이 볼래? 💕',
                  description: '궁합 결과를 공유하고 서로의 케미를 확인해보세요.',
                  shareUrl,
                  imageUrl: origin ? `${origin}/couple-guide/og-share.jpg` : '/couple-guide/og-share.jpg',
                  testId: 'couple-guide',
                }}
                copyColor={C.primary}
                copyHoverColor={C.primaryHover}
                copyIconColor={C.textOnPrimary}
              />
            </div>

            {/* 댓글 및 후속 테스트 추천 */}
            <div style={{ marginBottom: '120px' }}>
              <ResultFooterSections
                excludeId="couple-guide"
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
                featureType="couple_guide"
                resultId={resultId}
                storageKey="couple_guide_liked_comments"
                placeholder="우리 커플의 궁합 결과는 어땠나요?"
                themeColor={C.primary}
                inputBg="rgb(244, 246, 247)"
                disabledBg="rgb(235 236 236)"
                emptyStateColor="rgb(124 124 124)"
                metaColor="rgb(126 126 126)"
                heartIdleColor="rgb(190 190 190)"
                moreButtonFontSize="12.5px"
                moreButtonHoverBg="rgba(255, 194, 207, 0.32)"
                submitButtonHoverBg={C.primaryHover}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}