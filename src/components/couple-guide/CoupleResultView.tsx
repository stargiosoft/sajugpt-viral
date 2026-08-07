'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
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
import type { CoupleGuideResult } from '@/types/couple-guide';

// 테마 컬러 정의 (커플 가이드용 핑크 테마)
const COUPLE_COLORS = {
  frameBg: '#FFF5F8',
  frameBorder: '#FFD1E0',
  primary: 'rgb(248, 71, 132)',
  primaryHover: 'rgb(230, 50, 110)',
  textOnPrimary: '#FFFFFF',
  text: '#2D2D2D',
  textSecondary: '#666666',
  panelBg: '#FFFFFF',
};

const TITLE_POINT_COLOR = 'rgb(235, 70, 127)';

type Status = 'loading' | 'found' | 'notFound';

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
        border: `1.5px solid ${COUPLE_COLORS.frameBorder}`,
        padding: `26px 18px ${isMobile ? '16px' : '26px'}`,
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

interface CoupleResultViewProps {
  resultId: string;
}

export default function CoupleResultView({ resultId }: CoupleResultViewProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [result, setResult] = useState<any | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = origin ? `${origin}/couple-guide/${resultId}` : '';

  const { saving, handleSave } = useShareActions({
    featureType: 'couple_guide',
    resultId,
    getShareText: () => shareUrl,
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
    <div style={{ minHeight: '100vh', backgroundColor: COUPLE_COLORS.frameBg, display: 'flex', justifyContent: 'center' }}>
      <div
        className="w-full max-w-110 md:max-w-150"
        style={{
          minHeight: '100vh',
          backgroundColor: COUPLE_COLORS.frameBg,
          position: 'relative',
          fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
        }}
      >
        <TestTopNav bgColor={COUPLE_COLORS.frameBg} logoColor={COUPLE_COLORS.text} xColor={COUPLE_COLORS.text} />

        {status === 'loading' && (
          <div style={{ padding: '120px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: COUPLE_COLORS.textSecondary }}>결과를 불러오는 중이에요...</p>
          </div>
        )}

        {status === 'notFound' && (
          <div style={{ padding: '120px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</p>
            <p style={{ fontSize: '16px', fontWeight: 700, color: COUPLE_COLORS.text, marginBottom: '8px' }}>결과를 찾을 수 없어요</p>
            <p style={{ fontSize: '14px', color: COUPLE_COLORS.textSecondary, marginBottom: '28px', lineHeight: 1.6 }}>
              다른 기기에서 열었거나 브라우저 데이터가 지워졌을 수 있어요.
            </p>
            <div style={{ width: '100%', maxWidth: '240px' }}>
              <LandingCTAButton
                onClick={handleRestart}
                label="새로 분석하기"
                background={COUPLE_COLORS.primary}
                color={COUPLE_COLORS.textOnPrimary}
                hoverBackground={COUPLE_COLORS.primaryHover}
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
            style={{ padding: '12px 8px 48px', backgroundColor: COUPLE_COLORS.frameBg }}
          >
            {/* 결과 카드 영역 (이미지 저장 영역) */}
            <div ref={cardRef}>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: COUPLE_COLORS.frameBg,
                  border: `2.5px solid ${COUPLE_COLORS.frameBorder}`,
                  borderRadius: '28px',
                  padding: '16px 18px',
                  overflow: 'hidden',
                }}
              >
                {/* 배경 필름 액센트 */}
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
                  {/* 상단 타이틀 그래픽 */}
                  <div className="text-center pt-3 pb-2">
                    <p className="text-xs text-pink-500 font-bold mb-1">✨ 사주 기반 연애 궁합 분석</p>
                    <h1 className="text-2xl font-black tracking-tight text-gray-800">우리 사이, 얼마나 잘 맞을까?</h1>
                  </div>

                  {/* 스코어 & 대표 특징 헤더 카드 (원형 그래프 제거 및 캐릭터 중심 배치 + 점수 텍스트화) */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '14px',
                      backgroundColor: '#FFFFFF',
                      border: `1.5px solid ${COUPLE_COLORS.frameBorder}`,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                      padding: '24px 16px',
                      marginTop: '8px',
                      textAlign: 'center',
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

                    {/* 캐릭터 일러스트 중앙 집중 배치 */}
                    <div className="flex justify-center mb-3">
                      <div className="w-62.5 md:w-72.5">
                        <img 
                          src={`/couple-guide/char-${result.maxScore ?? 100}.png`}
                          alt={result.relationshipTitle} 
                          className="w-full h-auto object-contain"
                          onError={(e) => {
                            console.error(`이미지를 찾을 수 없음: char-${result.maxScore}.png`);
                            (e.target as HTMLImageElement).src = '/couple-guide/char-100.png';
                          }}
                        />
                      </div>
                    </div>

                    {/* 2. 궁합 점수 텍스트 */}
                      <div className="flex items-baseline justify-center gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-400 tracking-wide">궁합 점수</span>
                        <span className="text-3xl font-black tracking-tighter" style={{ color: COUPLE_COLORS.primary }}>
                          {result.totalScore}점
                        </span>
                      </div>

                      {/* 구분선 (선택사항: 필요에 따라 은은한 경계선을 줄 수 있습니다) */}
                      <div className="w-12 h-0.5 bg-pink-100 mx-auto mb-4" />
                      
                      {/* 3. 타이틀 및 부제목 (국대급 복식조 커플 등) */}
                      <RelationshipTitle
                        title={result.relationshipTitle}
                        subtitle={result.relationshipDescription || result.summary}
                      />

                      {/* 4. 해시태그 목록 */}
                      {result.hashtags && result.hashtags.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                          {result.hashtags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                display: 'inline-block',
                                backgroundColor: '#FFF5F8',
                                border: `1px solid ${COUPLE_COLORS.frameBorder}`,
                                borderRadius: '20px',
                                padding: '5px 12px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                color: COUPLE_COLORS.primary,
                              }}
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  {/* 세부 분석 세션 (케미 스탯) */}
                  <div style={{ marginTop: '16px' }}>
                    <SectionCard isMobile={isMobile}>
                      {/* 스탯 스펙트럼 */}
                      <div style={{ paddingTop: '4px' }}>
                        <div className="flex flex-col gap-4 mt-1">
                          {result.stats.map((stat: { label: string; score: number; description?: string }, index: number) => (
                              <ChemiStatBar
                              key={index}
                              label={stat.label}
                              value={stat.score}
                              caption={stat.description}
                              delay={index * 0.15}
                            />
                          ))}
                        </div>
                      </div>

                      {/* 응원 태그 banner */}
                      <div
                        style={{
                          marginTop: isMobile ? '20px' : '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
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
                          두 사람의 예쁜 사랑을 응원합니다! 💕
                        </p>
                      </div>
                    </SectionCard>
                  </div>

                  {/* 사주GPT 테이프 링크 버튼 */}
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
                      <SajuGPTLinkButton featureType="couple_guide" color="#FFFFFF" hoverColor="rgb(246 79 135)" label="사주GPT" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 외부 링크 CTA */}
            <div style={{ marginTop: RESULT_GAPS.imageToActions }}>
              <OutlineBoxButton
                href={SAJUGPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSajuGPTClick('couple_guide', resultId)}
                color={COUPLE_COLORS.primary}
                background="#FFFFFF"
                border={`1.5px solid ${COUPLE_COLORS.primary}`}
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
                bgStyle={{ backgroundColor: 'rgb(255, 229, 237)', borderRadius: '18px' }}
                hoverBackground="rgba(252, 181, 209, 0.64)"
                textStyle={{ color: 'rgb(248, 71, 132)', fontSize: '15px', fontWeight: 600, paddingTop: '2px' }}
              />
              <PressableButton
                onClick={() => handleSave(cardRef)}
                label={saving ? '저장 중...' : '이미지 저장하기'}
                style={{ flex: 2, height: '54px' }}
                bgStyle={{ backgroundColor: COUPLE_COLORS.primary, borderRadius: '18px' }}
                hoverBackground={COUPLE_COLORS.primaryHover}
                textStyle={{ color: COUPLE_COLORS.textOnPrimary, fontSize: '15px', fontWeight: 700, paddingTop: '2px' }}
              />
            </div>

            {/* 소셜 및 링크 공유 */}
            <div style={{ marginTop: RESULT_GAPS.actionsToShare, textAlign: 'center' }}>
              <ShareRow
                shareContent={{
                  featureType: 'couple_guide',
                  resultId,
                  title: `💕 ${result.relationshipTitle}`,
                  description: result.summary,
                  shareUrl,
                  imageUrl: origin ? `${origin}/couple-guide/og-share.jpg` : '/couple-guide/og-share.jpg',
                  testId: 'couple-guide',
                }}
                copyColor={COUPLE_COLORS.primary}
                copyHoverColor={COUPLE_COLORS.primaryHover}
                copyIconColor={COUPLE_COLORS.textOnPrimary}
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
                  color: COUPLE_COLORS.text,
                  letterSpacing: '-0.3px',
                  paddingLeft: '2px',
                }}
                cardBg={COUPLE_COLORS.panelBg}
                cardTitleColor={COUPLE_COLORS.text}
                featureType="couple_guide"
                resultId={resultId}
                storageKey="couple_guide_liked_comments"
                placeholder="우리 커플의 궁합 결과는 어땠나요?"
                themeColor={COUPLE_COLORS.primary}
                inputBg="#FFFFFF"
                disabledBg="rgb(237 237 237)"
                emptyStateColor="rgb(124 124 124)"
                metaColor="rgb(126 126 126)"
                heartIdleColor="rgb(190 190 190)"
                moreButtonFontSize="12.5px"
                moreButtonHoverBg="rgba(252, 181, 209, 0.64)"
                submitButtonHoverBg={COUPLE_COLORS.primaryHover}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}