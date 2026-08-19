'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Gender } from '@/types/battle';
import type { ShinsalStep, ShinsalGeniusResult } from '@/types/shinsal-series';
import { generateGeniusResult } from '@/lib/shinsal-series/shinsalGenius';
import { GENIUS_COLORS as C, FADE_UP } from '@/constants/shinsalGeniusTheme';
import { SAJUGPT_URL } from '@/constants/links';
import { trackSajuGPTClick } from '@/lib/analytics';

import TestTopNav from '@/components/TestTopNav';
import ResultFooterSections from '@/components/ResultFooterSections';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import PressableButton from '@/components/PressableButton';
import ShareRow from '@/components/ShareRow';
import { useShareActions } from '@/lib/useShareActions';
import { incrementTestStat } from '@/lib/testStats';

import GeniusLanding from './GeniusLanding';
import GeniusInput from './GeniusInput';
import GeniusAnalyzing from './GeniusAnalyzing';
import GeniusResultCard from './GeniusResultCard';

export default function GeniusClient() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(true);
  const [timeSelected, setTimeSelected] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<ShinsalStep>('landing');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShinsalGeniusResult | null>(null);

  const resultCardRef = useRef<HTMLDivElement>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const resultId = result?.resultId || '';
  const shareUrl = origin && resultId ? `${origin}/shinsal-genius/${resultId}` : origin;

  const { saving, handleSave } = useShareActions({
    featureType: 'shinsal_genius',
    resultId,
    getShareText: () => shareUrl,
    imageFilename: `사주GPT_천재지수_${resultId}.png`,
    onSave: () => incrementTestStat('shinsal-genius', 'share'),
  });

  // 1. 컴포넌트 마운트 시 localStorage에 저장된 입력값 복원
  useEffect(() => {
    const savedData = localStorage.getItem('genius_user_input');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.birthDate) setBirthDate(parsed.birthDate);
        if (parsed.birthTime) setBirthTime(parsed.birthTime);
        if (parsed.unknownTime !== undefined) setUnknownTime(parsed.unknownTime);
        if (parsed.timeSelected !== undefined) setTimeSelected(parsed.timeSelected);
        if (parsed.gender) setGender(parsed.gender);
      } catch (e) {
        console.error('Failed to parse saved input', e);
      }
    }
  }, []);

  // 2. 입력값이 바뀔 때마다 localStorage에 자동 저장
  useEffect(() => {
    if (birthDate || timeSelected) {
      const dataToSave = {
        birthDate,
        birthTime,
        unknownTime,
        timeSelected,
        gender,
      };
      localStorage.setItem('genius_user_input', JSON.stringify(dataToSave));
    }
  }, [birthDate, birthTime, unknownTime, timeSelected, gender]);

  const isFormValid = () => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    if (!timeSelected) return false;
    return true;
  };

  const handleTimeSelect = useCallback((displayTime: string, isUnknown: boolean) => {
    setTimeSelected(true);
    setUnknownTime(isUnknown);
    setBirthTime(displayTime);
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setStep('analyzing');
    setError(null);

    const effectiveTime = unknownTime ? '모름' : birthTime;

    try {
      const generated = await generateGeniusResult(birthDate, effectiveTime, gender);
      setResult(generated);
      setStep('result');
    } catch (err) {
      console.error(err);
      setError('분석 중 오류가 발생했습니다.');
      setStep('input');
    }
  };

  const handleRestart = () => {
    setStep('input');
    setResult(null);
  };

  return (
    <div className="h-dvh flex justify-center" style={{ backgroundColor: C.pageBg, color: C.text, fontFamily: "'Pretendard Variable', sans-serif" }}>
      <div className="w-full h-full flex flex-col max-w-110 md:max-w-150">
        <div className="flex-1 overflow-auto w-full">
          <TestTopNav bgColor={C.pageBg} logoColor="#FFFFFF" xColor="#FFFFFF" />
          
          <AnimatePresence mode="wait">
            {step === 'landing' && <GeniusLanding key="landing" onStart={() => setStep('input')} />}

            {step === 'input' && (
              <GeniusInput
                key="input"
                birthDate={birthDate} 
                onBirthDateChange={setBirthDate}
                birthTime={birthTime} 
                unknownTime={unknownTime} 
                onTimeSelect={handleTimeSelect}
                gender={gender} 
                onGenderChange={setGender}
                isValid={isFormValid()} 
                error={error} 
                onSubmit={handleSubmit}
              />
            )}

            {step === 'analyzing' && <GeniusAnalyzing key="analyzing" />}

            {step === 'result' && result && (
              <motion.div
                key="result"
                initial="hidden" animate="visible" exit={{ opacity: 0 }}
                variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                className="flex-1 flex flex-col"
                style={{ padding: '12px 12px 48px' }}
              >
                <motion.div variants={FADE_UP}>
                  <GeniusResultCard ref={resultCardRef} result={result} />
                </motion.div>
                
                {/* 액션 버튼 그룹 및 하단 영역 전체 적용 */}
                <motion.div variants={FADE_UP} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* 1. 다시하기 & 이미지 저장 버튼 그룹 */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <PressableButton
                      onClick={handleRestart}
                      label="다시하기"
                      style={{ flex: 1, height: '48px' }}
                      bgStyle={{ backgroundColor: C.panelBg, borderRadius: '12px', border: `1px solid ${C.border}` }}
                      textStyle={{
                        color: C.text,
                        fontSize: '14px',
                        fontWeight: 700,
                      }}
                    />
                    <PressableButton
                      onClick={() => handleSave(resultCardRef)}
                      label={saving ? '저장 중...' : '이미지 저장'}
                      disabled={saving}
                      style={{ flex: 1, height: '48px' }}
                      bgStyle={{
                        backgroundColor: C.accent,
                        borderRadius: '12px',
                      }}
                      textStyle={{
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  {/* 2. 사주GPT 링크 배너 */}
                  <OutlineBoxButton
                    onClick={() => {
                      trackSajuGPTClick('shinsal_genius', resultId);
                      window.open(SAJUGPT_URL, '_blank');
                    }}
                    height="48px"
                    color={C.accent}
                    background={C.panelBg}
                    border={`1px solid ${C.border}`}
                    borderRadius="12px"
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        letterSpacing: '-0.3px',
                        fontWeight: 700,
                      }}
                    >
                      내 사주 고민, 사주GPT에게 물어보기
                    </span>
                  </OutlineBoxButton>

                  {/* 3. 소셜 공유 영역 (ShareRow) */}
                  <div style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                    <ShareRow
                      shareContent={{
                        featureType: 'shinsal_genius',
                        title: `✨ 나의 사주GPT 천재성 결과는?`,
                        description: '내 천재 지수를 확인해보세요!',
                        shareUrl,
                        imageUrl: origin ? `${origin}/shinsal-genius/og-share.png` : '/shinsal-genius/og-share.png',
                        testId: 'shinsal-genius',
                      }}
                      copyColor={C.accent}
                      copyHoverColor={C.accentHover}
                      copyIconColor="#FFFFFF"
                    />
                  </div>
                </motion.div>

                {/* 4. 하단 커뮤니티 및 댓글 섹션 (ResultFooterSections) */}
                <div style={{ marginTop: '8px' }}>
                  <ResultFooterSections
                    excludeId="analyze-shinsal-genius"
                    titleStyle={{ fontSize: '16px', fontWeight: 700, color: C.text }}
                    cardBg={C.panelBg}
                    cardTitleColor={C.text}
                    featureType="shinsal_genius"
                    resultId={result.resultId}
                    storageKey="genius_liked_comments"
                    placeholder="내 천재 지수는 몇 퍼센트인가요?"
                    themeColor={C.accent}
                    inputBg={C.cardBg}
                    disabledBg="#333"
                    shareToRecommendGap={24}
                    dark={true}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}