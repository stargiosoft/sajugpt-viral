'use client';

import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { ShinsalStep, ShinsalGeniusResult } from '@/types/shinsal-series';
import { generateGeniusResult } from '@/lib/shinsal-series/shinsalGenius';
import { GENIUS_COLORS as C, FADE_UP } from '@/constants/shinsalGeniusTheme';

import TestTopNav from '@/components/TestTopNav';
import ResultFooterSections from '@/components/ResultFooterSections';

import GeniusLanding from './GeniusLanding';
import GeniusInput from './GeniusInput';
import GeniusAnalyzing from './GeniusAnalyzing';
import GeniusResultCard from './GeniusResultCard';

export default function GeniusClient() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(true);
  const [timeSelected, setTimeSelected] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<ShinsalStep>('landing');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShinsalGeniusResult | null>(null);

  const resultCardRef = useRef<HTMLDivElement>(null);

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
                birthDate={birthDate} onBirthDateChange={setBirthDate}
                birthTime={birthTime} unknownTime={unknownTime} onTimeSelect={handleTimeSelect}
                gender={gender} onGenderChange={setGender}
                isValid={isFormValid()} error={error} onSubmit={handleSubmit}
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
                
                {/* 엑박: CTA 배너 영역 */}
                <motion.div variants={FADE_UP} style={{ marginTop: '16px', height: '120px', backgroundColor: C.panelBg, borderRadius: '20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: C.textTertiary, fontSize: '14px' }}>[ 사주GPT CTA 배너 엑박 ]</span>
                </motion.div>

                <ResultFooterSections
                  excludeId="shinsal-genius"
                  titleStyle={{ fontSize: '16px', fontWeight: 700, color: C.text }}
                  cardBg={C.panelBg}
                  cardTitleColor={C.text}
                  featureType="shinsal_genius"
                  resultId={result.resultId}
                  storageKey="genius_liked_comments"
                  placeholder="내 똘끼 지수는 몇 퍼센트인가요?"
                  themeColor={C.accent}
                  inputBg={C.cardBg}
                  disabledBg="#333"
                  shareToRecommendGap={24}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}