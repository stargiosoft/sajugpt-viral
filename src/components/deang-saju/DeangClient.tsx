'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { DeangStep, DeangResult } from '@/types/deang-saju';
import TestTopNav from '@/components/TestTopNav';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import DeangLanding from './DeangLanding';
import DeangInput from './DeangInput';
import DeangAnalyzing from './DeangAnalyzing';
import DeangResultCard from './DeangResultCard';
import DeangShareButtons from './DeangShareButtons';
import DeangShareRow from './DeangShareRow';
import DeangCTA from './DeangCTA';
import DeangCommentSection from './DeangCommentSection';
import { generateDeangResult } from '@/lib/deangSaju';
import { trackEvent } from '@/lib/analytics';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { DEANG_COLORS as C } from '@/constants/deangTheme';
import useIsNarrow from '@/hooks/useIsNarrow';

interface Props {
  resultId?: string;
}

export default function DeangClient({ resultId: _resultId }: Props) {
  const isNarrow = useIsNarrow();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<DeangStep>('landing');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeangResult | null>(null);

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
    saveSelfSaju({ birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);

  const isFormValid = useCallback(() => {
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
  }, [birthDate, birthTime, unknownTime]);

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

    trackEvent('deang_saju_input_start');
    setStep('analyzing');
    setError(null);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const [generated] = await Promise.all([
        Promise.resolve(
          generateDeangResult(birthDate, effectiveUnknownTime ? '오후 12:00' : birthTime, effectiveUnknownTime, gender),
        ),
        minDelay,
      ]);

      setResult(generated);
      trackEvent('deang_saju_result', { breed: generated.profile.breed.breedName });
      setStep('result');
    } catch {
      setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep('landing');
  };

  return (
    <div className="h-dvh flex justify-center" style={{ backgroundColor: C.pageBg, fontFamily: 'Cafe24 Dongdong, sans-serif' }}>
      <div className="w-full h-full flex flex-col max-w-[440px] md:max-w-[600px]">
        <div className="flex-1 overflow-auto w-full">
          <TestTopNav bgColor={C.pageBg} logoColor={C.borderInk} />
          <AnimatePresence mode="wait">
            {step === 'landing' && <DeangLanding key="landing" onStart={() => setStep('input')} />}

            {step === 'input' && (
              <DeangInput
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

            {step === 'analyzing' && <DeangAnalyzing key="analyzing" />}

            {step === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
                style={{ padding: isNarrow ? '0px 8px 48px' : '0px 0px 48px', gap: '20px' }}
              >
                <DeangResultCard ref={resultCardRef} profile={result.profile} />
                <div className="flex flex-col" style={{ gap: '20px', padding: isNarrow ? '0px' : '0px 12px' }}>
                  <div style={{ marginTop: isNarrow ? '-20px' : '-24px' }}>
                    <DeangCTA resultId={result.resultId} breedName={result.profile.breed.breedName} />
                  </div>
                  <div className="flex" style={{ gap: '10px' }}>
                    <div className="flex-1">
                      <OutlineBoxButton onClick={handleReset} height="54px" borderRadius="16px" fontSize="17px" fontWeight={500} color="rgb(55, 141, 99)" background="rgb(232, 246, 239)" border="none" hoverBackground="rgb(219, 243, 231)">
                        <span style={{ WebkitTextStroke: '0.3px rgb(55, 141, 99)' }}>다시하기</span>
                      </OutlineBoxButton>
                    </div>
                    <div className="flex-1">
                      <DeangShareButtons cardRef={resultCardRef} resultId={result.resultId} breedName={result.profile.breed.breedName} />
                    </div>
                  </div>
                  <DeangShareRow />
                  <DeangCommentSection />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
