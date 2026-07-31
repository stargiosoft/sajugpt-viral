'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useShareActions } from '@/lib/useShareActions';
import ShareRow from '@/components/ShareRow';
import ElementDistribution from './ElementDistribution';
import CommentBoard from '@/components/CommentBoard';
import RecommendSection from '@/components/RecommendSection';
import SajuGPTBanner from '@/components/SajuGPTBanner';
import { AnimalIllustration } from './icons';
import PressableButton from '@/components/PressableButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import { OHENG_COLORS as C } from '@/constants/ohengTheme';
import type { OhengPrescription } from '@/types/oheng';

const TITLE_IMAGES: Partial<Record<string, string>> = {
  '확장 본능 폭주 리더': '/oheng/results/rabbit-expansion-instinct.jpg',
  '성장형 크리에이터': '/oheng/results/rabbit-growth-creator.jpg',
  '잔잔한 새싹 마인드': '/oheng/results/rabbit-calm-sprout.jpg',
  '열정 과다 도파민 리더': '/oheng/results/fox-passion-dopamine.jpg',
  '뜨거운 실행력 파이터': '/oheng/results/fox-hot-executor.jpg',
  '책임감 과부하 살림꾼': '/oheng/results/bear-overload-caretaker.jpg',
  '믿음직한 안정형 리더': '/oheng/results/bear-stable-leader.jpg',
  '은근한 중재자': '/oheng/results/bear-quiet-mediator.jpg',
  '완벽주의 스틸 메탈': '/oheng/results/tiger-perfectionist-steel.jpg',
  '칼같은 원칙주의자': '/oheng/results/tiger-strict-principle.jpg',
  '차분한 판단러': '/oheng/results/tiger-calm-judge.jpg',
  '고요한 심층 몰입러': '/oheng/results/turtle-deep-focus.jpg',
  '유연한 공감형 전략가': '/oheng/results/turtle-empathetic-strategist.jpg',
  '잔잔한 관찰자': '/oheng/results/turtle-quiet-observer.jpg',
};

const ANIMAL_IMAGES: Partial<Record<string, string>> = {
  토끼: '/oheng/animals/rabbit.png',
  여우: '/oheng/animals/fox.png',
  호랑이: '/oheng/animals/tiger.png',
};

export default function ResultCard({ result, onRestart }: { result: OhengPrescription; onRestart: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageSrc = TITLE_IMAGES[result.diagnosisTitle] ?? ANIMAL_IMAGES[result.animal];

  const { saving, handleSave } = useShareActions({
    featureType: 'oheng',
    resultId: result.resultId,
    getShareText: () => `${result.diagnosisTitle}\n${typeof window !== 'undefined' ? window.location.href : ''}`,
    imageFilename: `내오행처방전_${result.name}.png`,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{ minHeight: 'calc(100vh - 52px)', padding: '12px 20px 48px', backgroundColor: '#FFFFFF' }}>
      <div ref={cardRef} style={{ backgroundColor: '#FFFFFF', padding: '4px' }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: C.panelBg, borderRadius: '24px', padding: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                {imageSrc ? (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      overflow: 'hidden',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={result.animal}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '180px',
                      height: '180px',
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AnimalIllustration animal={result.animal} size={150} />
                  </div>
                )}
              </div>

              <p style={{ paddingTop: '4px', paddingLeft: '2px', fontSize: '20px', fontWeight: 800, color: C.text, letterSpacing: '-0.3px' }}>
                {result.diagnosisTitle}
              </p>

              <p style={{ marginTop: '8px', paddingLeft: '3px', fontSize: '14.5px', lineHeight: 1.7, color: C.textSecondary }}>
                {result.diagnosisDescription}
              </p>

              <p style={{ marginTop: '32px', fontSize: '15px', fontWeight: 700, color: C.text, letterSpacing: '-0.3px', marginBottom: '14px', paddingLeft: '2px' }}>
                오행 분석 결과
              </p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Chip label="대표 기운" value={result.dominantElementName} />
                <Chip label="부족한 기운" value={result.weakElementName} />
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <Chip label="추천 루틴" value={result.routine} />
                <Chip label="럭키 아이템" value={result.luckyItem} />
              </div>

              <div style={{ marginTop: '36px' }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: C.text, letterSpacing: '-0.3px', marginBottom: '14px', paddingLeft: '2px' }}>
                  오행 분포
                </p>
                <ElementDistribution distribution={result.distribution} />
              </div>

              <div style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <SajuGPTLinkButton featureType="oheng" color={C.textTertiary} hoverColor={C.blue} label="사주GPT" />
              </div>
            </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
        <PressableButton
          onClick={onRestart}
          label="다시하기"
          style={{ flex: 1, height: '54px' }}
          bgStyle={{ backgroundColor: C.panelBg, borderRadius: '16px' }}
          hoverBackground="#E8EBEF"
          textStyle={{ color: C.textSecondary, fontSize: '15px', fontWeight: 600 }}
        />
        <PressableButton
          onClick={() => handleSave(cardRef)}
          label={saving ? '저장 중...' : '이미지 저장하기'}
          style={{ flex: 2, height: '54px' }}
          bgStyle={{ backgroundColor: C.blue, borderRadius: '16px' }}
          hoverBackground={C.blueHover}
          textStyle={{ color: C.textOnBlue, fontSize: '15px', fontWeight: 700 }}
        />
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <ShareRow
          shareContent={{
            featureType: 'oheng',
            resultId: result.resultId,
            title: result.diagnosisTitle,
            description: `대표 기운은 ${result.dominantElementName}! 나의 오행 처방전은?`,
            shareUrl: typeof window !== 'undefined' ? window.location.href : '',
            imageUrl: typeof window !== 'undefined' ? `${window.location.origin}/oheng/og-share.jpg` : '/oheng/og-share.jpg',
            testId: 'oheng',
          }}
          copyColor={C.blue}
          copyHoverColor={C.blueHover}
          copyIconColor={C.textOnBlue}
        />
      </div>

      <div style={{ marginTop: '32px' }}>
        <RecommendSection
          excludeId="oheng"
          titleStyle={{ fontSize: '16px', fontWeight: 700, color: C.text, letterSpacing: '-0.3px', paddingLeft: '2px' }}
          cardBg={C.panelBg}
          cardTitleColor={C.text}
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <SajuGPTBanner featureType="oheng" resultId={result.resultId} />
      </div>

      <div style={{ marginTop: '48px', marginBottom: '200px' }}>
        <CommentBoard
          featureType="oheng"
          storageKey="oheng_liked_comments"
          placeholder="여러분의 대표 오행은 무엇인가요?"
          themeColor={C.blue}
        />
      </div>
    </motion.div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '14px 10px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: '11px', fontWeight: 500, color: C.textTertiary, marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{value}</p>
    </div>
  );
}
