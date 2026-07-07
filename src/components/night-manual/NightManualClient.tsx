'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { NightManualStep, NightManualResult, ServantType, InterventionChoice } from '@/types/night-manual';
import { getCompatibility } from '@/constants/night-manual';
import TestTopNav from '@/components/TestTopNav';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { supabase } from '@/lib/supabase';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { parseKoreanTimeTo24Hour } from '@/lib/koreanTime';
import NightLanding from './NightLanding';
import NightBirthInput from './NightBirthInput';
import NightAnalyzing from './NightAnalyzing';
import ConstitutionCard from './ConstitutionCard';
import DebatePhase from './DebatePhase';
import ServantSelection from './ServantSelection';
import NightResultCard from './NightResultCard';

interface Props {
  nightManualId?: string;
}

export default function NightManualClient({ nightManualId }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<NightManualStep>(nightManualId ? 'input' : 'landing');
  const [result, setResult] = useState<NightManualResult | null>(null);
  const [interventionChoice, setInterventionChoice] = useState<InterventionChoice | null>(null);
  const [selectedServant, setSelectedServant] = useState<ServantType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // 캐시 복원 (클라이언트 마운트 후)
  useEffect(() => {
    const cached = loadSelfSaju();
    if (cached) {
      if (cached.birthDate) setBirthDate(cached.birthDate);
      if (cached.birthTime) setBirthTime(cached.birthTime);
      if (cached.unknownTime !== undefined) setUnknownTime(cached.unknownTime);
      if (cached.gender) setGender(cached.gender);
    }
  }, []);

  // UTM 자동입력
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const birthdayParam = params.get('birthday');
    const genderParam = params.get('gender');
    let hasUTM = false;

    if (birthdayParam && birthdayParam.length >= 8) {
      hasUTM = true;
      const y = birthdayParam.slice(0, 4);
      const m = birthdayParam.slice(4, 6);
      const d = birthdayParam.slice(6, 8);
      setBirthDate(`${y}-${m}-${d}`);
      if (birthdayParam.length >= 12) {
        const h = Number(birthdayParam.slice(8, 10));
        const mi = birthdayParam.slice(10, 12);
        const period = h < 12 ? '오전' : '오후';
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        setBirthTime(`${period} ${String(displayHour).padStart(2, '0')}:${mi}`);
      }
    }
    if (genderParam) {
      hasUTM = true;
      setGender(genderParam === 'male' ? 'male' : 'female');
    }
    if (hasUTM && step === 'landing') {
      setStep('input');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const [year, month, day] = birthDate.split('-').map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
    if (!birthTime && !unknownTime) return false;
    return true;
  }, [birthDate, birthTime, unknownTime]);

  const handleSubmit = useCallback(async () => {
    if (!isFormValid() || submitting) return;

    // 태어난 시간 미입력 시 자동으로 '모르겠어요' 처리 → 오후 12:00
    const hasValidTime = birthTime.includes('오전') || birthTime.includes('오후');
    const effectiveUnknownTime = unknownTime || !hasValidTime;
    if (effectiveUnknownTime && !unknownTime) {
      setUnknownTime(true);
      setBirthTime('오후 12:00');
    }

    setSubmitting(true);
    setError(null);

    saveSelfSaju({ birthDate, birthTime: effectiveUnknownTime ? '오후 12:00' : birthTime, unknownTime: effectiveUnknownTime, gender });

    const numbers = birthDate.replace(/[^\d]/g, '');
    const timePart = effectiveUnknownTime ? '1200' : parseKoreanTimeTo24Hour(birthTime);
    const birthday = numbers + timePart;

    setStep('analyzing');

    try {
      const [response] = await Promise.all([
        callEdgeFunction<NightManualResult>('analyze-night-manual', {
          birthday,
          gender,
          birthTimeUnknown: effectiveUnknownTime,
        }),
        new Promise(r => setTimeout(r, 3000)), // 최소 3초 로딩
      ]);

      setResult(response);
      setStep('constitution');
    } catch (err) {
      console.error('분석 실패:', err);
      setError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      setStep('input');
    } finally {
      setSubmitting(false);
    }
  }, [isFormValid, birthDate, birthTime, unknownTime, gender, submitting]);

  const handleServantSelect = useCallback(async (servant: ServantType) => {
    if (!result) return;
    setSelectedServant(servant);

    const compatibility = getCompatibility(result.stats, servant);

    // DB 업데이트
    try {
      await supabase
        .from('night_manuals')
        .update({
          selected_servant: servant,
          compatibility_grade: compatibility.grade,
          updated_at: new Date().toISOString(),
        })
        .eq('id', result.nightManualId);
    } catch (err) {
      console.error('시종 선택 DB 업데이트 실패:', err);
    }

    setStep('result');
  }, [result]);

  const handleReset = useCallback(() => {
    setResult(null);
    setInterventionChoice(null);
    setSelectedServant(null);
    setStep('landing');
  }, []);

  const canSubmit = isFormValid() && !submitting;

  return (
    <div
      className="fixed inset-0 flex justify-center"
      style={{
        background: step === 'landing'
          ? 'linear-gradient(180deg, #050b16 0%, #0a1a2e 30%, #0d2440 60%, #050b16 100%)'
          : '#050b16',
      }}
    >
      <div className="w-full max-w-[768px] h-full flex flex-col">
        <div className="flex-1 overflow-auto w-full">
        <TestTopNav bgColor={step === 'landing' ? 'rgba(5, 11, 22, 0.55)' : '#050b16'} />
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <NightLanding key="landing" onStart={() => setStep('input')} />
          )}

          {step === 'input' && (
            <NightBirthInput
              key="input"
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              birthTime={birthTime}
              setBirthTime={setBirthTime}
              unknownTime={unknownTime}
              setUnknownTime={setUnknownTime}
              gender={gender}
              setGender={setGender}
              canSubmit={canSubmit}
              onSubmit={handleSubmit}
              error={error}
            />
          )}

          {step === 'analyzing' && (
            <NightAnalyzing key="analyzing" />
          )}

          {step === 'constitution' && result && (
            <ConstitutionCard
              key="constitution"
              result={result}
              onContinue={() => setStep('debate')}
            />
          )}

          {step === 'debate' && result && (
            <DebatePhase
              key="debate"
              result={result}
              interventionChoice={interventionChoice}
              onIntervene={setInterventionChoice}
              onComplete={() => setStep('selection')}
            />
          )}

          {step === 'selection' && result && (
            <ServantSelection
              key="selection"
              result={result}
              onSelect={handleServantSelect}
            />
          )}

          {step === 'result' && result && selectedServant && (
            <NightResultCard
              key="result"
              result={result}
              selectedServant={selectedServant}
              interventionChoice={interventionChoice}
              cardRef={cardRef}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
