'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { NightManualStep, NightManualResult, ServantType, InterventionChoice } from '@/types/night-manual';
import { getCompatibility } from '@/constants/night-manual';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { supabase } from '@/lib/supabase';
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

function convertTo24Hour(time: string): string {
  const match = time.match(/^(오전|오후)\s(\d{2}):(\d{2})$/);
  if (!match) return '0000';
  const period = match[1];
  let hour = Number(match[2]);
  const minute = match[3];
  if (period === '오전') { if (hour === 12) hour = 0; }
  else { if (hour !== 12) hour += 12; }
  return `${String(hour).padStart(2, '0')}${minute}`;
}

const CACHE_KEY = 'night_manual_input';

function loadCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveCache(data: { birthDate: string; birthTime: string; unknownTime: boolean; gender: Gender }) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* noop */ }
}

export default function NightManualClient({ nightManualId }: Props) {
  const cached = typeof window !== 'undefined' ? loadCache() : null;
  const [birthDate, setBirthDate] = useState(cached?.birthDate ?? '');
  const [birthTime, setBirthTime] = useState(cached?.birthTime ?? '');
  const [unknownTime, setUnknownTime] = useState(cached?.unknownTime ?? false);
  const [gender, setGender] = useState<Gender>(cached?.gender ?? 'female');

  const [step, setStep] = useState<NightManualStep>(nightManualId ? 'input' : 'landing');
  const [result, setResult] = useState<NightManualResult | null>(null);
  const [interventionChoice, setInterventionChoice] = useState<InterventionChoice | null>(null);
  const [selectedServant, setSelectedServant] = useState<ServantType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    saveCache({ birthDate, birthTime, unknownTime, gender });

    const numbers = birthDate.replace(/[^\d]/g, '');
    const timePart = unknownTime ? '0000' : convertTo24Hour(birthTime);
    const birthday = numbers + timePart;

    setStep('analyzing');

    try {
      const [response] = await Promise.all([
        callEdgeFunction<NightManualResult>('analyze-night-manual', {
          birthday,
          gender,
          birthTimeUnknown: unknownTime,
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
  }, [birthDate, birthTime, unknownTime, gender, submitting]);

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

  const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(birthDate);
  const isTimeValid = unknownTime || (birthTime.includes('오전') || birthTime.includes('오후'));
  const canSubmit = isDateValid && isTimeValid && !submitting;

  return (
    <div
      className="flex flex-col items-center min-h-dvh"
      style={{ backgroundColor: '#0d0d1a' }}
    >
      <div className="w-full" style={{ maxWidth: '440px' }}>
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
  );
}
