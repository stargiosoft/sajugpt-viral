'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { MoneyTimelineStep, MoneyTimelineResult } from '@/types/money-timeline';
import TestTopNav from '@/components/TestTopNav';
import MoneyLanding from './MoneyLanding';
import MoneyInput from './MoneyInput';
import MoneyAnalyzing from './MoneyAnalyzing';
import MoneyResultCard from './MoneyResultCard';
import MoneyCTA from './MoneyCTA';
import ShareView from './ShareView';
import MoneyCommentBoard from './MoneyCommentBoard';
import RecommendSection from '@/components/RecommendSection';
import SajuGPTBanner from '@/components/SajuGPTBanner';
import { generateMoneyTimelineResult, fetchMoneyTimelineResultById } from '@/lib/moneyTimeline';
import { trackEvent } from '@/lib/analytics';
import { incrementTestStat } from '@/lib/testStats';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { MONEY_COLORS as C, FADE_UP } from '@/constants/moneyTimelineTheme';

interface Props {
  resultId?: string;
}

export default function MoneyClient({ resultId }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<MoneyTimelineStep>('landing');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MoneyTimelineResult | null>(null);

  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = loadSelfSaju();
    if (cached) {
      if (cached.birthDate) setBirthDate(cached.birthDate);
      if (cached.birthTime) setBirthTime(cached.birthTime);
      if (cached.unknownTime !== undefined) setUnknownTime(cached.unknownTime);
      if (cached.gender) setGender(cached.gender);
    }
  }, []);

  useEffect(() => {
    if (!resultId) return;

    let isMounted = true;
    setStep('analyzing');

    fetchMoneyTimelineResultById(resultId)
      .then((data) => {
        if (isMounted && data) {
          setResult(data);
          setStep('result');
        } else if (isMounted) {
          setStep('landing');
        }
      })
      .catch((err) => {
        console.error('결과 조회 실패:', err);
        if (isMounted) setStep('landing');
      });

    return () => {
      isMounted = false;
    };
  }, [resultId]);

  useEffect(() => {
    saveSelfSaju({ birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);

  const isFormValid = () => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const parts = birthDate.split('-');
    if (parts.length !== 3) return false;
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
    if (!birthTime && !unknownTime) return false;
    return true;
  };

  const handleTimeSelect = useCallback((displayTime: string, isUnknown: boolean) => {
    setUnknownTime(isUnknown);
    setBirthTime(displayTime);
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const hasValidTime = birthTime.includes('오전') || birthTime.includes('오후');
    const effectiveUnknownTime = unknownTime || !hasValidTime;
    if (effectiveUnknownTime && !unknownTime) {
      setUnknownTime(true);
      setBirthTime('오후 12:00');
    }

    trackEvent('money_timeline_input_start');
    setStep('analyzing');
    setError(null);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const [generated] = await Promise.all([
        generateMoneyTimelineResult(
          birthDate,
          effectiveUnknownTime ? '오후 12:00' : birthTime,
          effectiveUnknownTime,
          gender
        ),
        minDelay,
      ]);

      if (!generated || !generated.profile) {
        throw new Error('올바른 결과를 받아오지 못했습니다.');
      }

      setResult(generated);
      trackEvent('money_timeline_result', { overallScore: generated.profile.overallScore });
      setStep('result');
    } catch (err) {
      console.error('내 돈복 그래프 분석 실패:', err);
      setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep('landing');
  };

  // 플레이 카운트: 실제로 생년월일을 입력해 결과를 생성했을 때만 1회 기록
  // (resultId로 진입한 공유 링크 조회는 다른 사람의 결과를 "보는" 것일 뿐이라 제외)
  useEffect(() => {
    if (resultId) return;
    if (step !== 'result' || !result) return;
    incrementTestStat('money-timeline', 'play');
  }, [step, result, resultId]);

  return (
    <div className="h-dvh flex justify-center" style={{ backgroundColor: C.pageBg, fontFamily: "'Tmoney RoundWind', sans-serif" }}>
      <div className="w-full h-full flex flex-col max-w-[440px] md:max-w-[600px]">
        <div className="flex-1 overflow-auto w-full">
          <TestTopNav bgColor={C.pageBg} logoColor="#000000" xColor="#000000" />
          <AnimatePresence mode="wait">
            {step === 'landing' && <MoneyLanding key="landing" onStart={() => setStep('input')} />}

            {step === 'input' && (
              <MoneyInput
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

            {step === 'analyzing' && <MoneyAnalyzing key="analyzing" />}

            {step === 'result' && result && (
              <motion.div
                key="result"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                className="flex-1 flex flex-col"
                style={{ padding: '12px 12px 48px', gap: '16px' }}
              >
                <motion.div variants={FADE_UP}>
                  <MoneyResultCard ref={resultCardRef} profile={result.profile} />
                </motion.div>
                <motion.div variants={FADE_UP}>
                  <MoneyCTA resultId={result.resultId} />
                </motion.div>
                <motion.div variants={FADE_UP}>
                  <ShareView resultId={result.resultId} profile={result.profile} cardRef={resultCardRef} onReset={handleReset} />
                </motion.div>
                <motion.div variants={FADE_UP} style={{ marginTop: '8px' }}>
                  <RecommendSection
                    excludeId="money-timeline"
                    titleStyle={{
                      fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
                      fontSize: '16px',
                      fontWeight: 700,
                      color: C.text,
                      letterSpacing: '-0.5px',
                      paddingLeft: '4px',
                    }}
                    cardBg={C.panelBg}
                    cardTitleColor={C.text}
                  />
                </motion.div>
                <motion.div variants={FADE_UP} style={{ marginTop: '-8px' }}>
                  <SajuGPTBanner featureType="money_timeline" resultId={result.resultId} />
                </motion.div>
                <motion.div variants={FADE_UP} style={{ marginTop: '8px' }}>
                  <MoneyCommentBoard />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
