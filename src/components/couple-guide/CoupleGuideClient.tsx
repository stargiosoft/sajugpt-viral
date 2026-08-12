'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import TestTopNav from '@/components/TestTopNav';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import CoupleLanding from './CoupleLanding';
import CoupleInput from './CoupleInput';

import { analyzeCoupleGuide, saveCoupleGuideResult } from '@/lib/coupleGuide';
import { loadSelfSaju, saveSelfSaju, type SajuCacheData } from '@/lib/sajuCache';
import { recolorLottie } from '@/lib/lottieRecolor';
import heartLottieRaw from '@/lottie/solo-guide-heart.json';
import { COUPLE_COLORS as C } from '@/constants/coupleGuideTheme';
import type { Gender } from '@/types/battle';

import type {
  CoupleGuideFormState,
  PersonBirthInfo,
} from '@/types/couple-guide';

type Step = 'landing' | 'input' | 'analyzing';

const EMPTY_PERSON: PersonBirthInfo = {
  gender: null,
  birthday: '',
  birthTime: '',
  birthTimeUnknown: false,
};

const INITIAL_FORM: CoupleGuideFormState = {
  person1: { ...EMPTY_PERSON },
  person2: { ...EMPTY_PERSON },
  calendarType: 'solar',
};

/** 캐시에 저장된 사주 정보를 폼 상태에 병합. 캐시가 없으면 기존 값을 그대로 반환 (참조 유지 → 불필요한 재저장 방지) */
function mergeCachedPerson(cached: SajuCacheData | null, prev: PersonBirthInfo): PersonBirthInfo {
  if (!cached) return prev;
  return {
    ...prev,
    gender: cached.gender ?? prev.gender,
    birthday: cached.birthDate || prev.birthday,
    birthTime: cached.birthTime || prev.birthTime,
    birthTimeUnknown: cached.unknownTime ?? prev.birthTimeUnknown,
  };
}

/** person 정보가 바뀔 때마다 사주 캐시에 자동 저장 */
function useAutoSaveSaju(storageKey: string, person: PersonBirthInfo) {
  useEffect(() => {
    if (!person.gender && !person.birthday) return;
    saveSelfSaju(storageKey, {
      birthDate: person.birthday,
      birthTime: person.birthTime,
      unknownTime: person.birthTimeUnknown,
      gender: person.gender as Gender,
    });
  }, [storageKey, person]);
}

const ANALYZING_MESSAGES = ['두 사람의 사주 정보를 확인하고 있어요'];

// recolorLottie는 hex 색상만 파싱 가능 — COUPLE_COLORS.primary는 rgb() 표기라 그대로 넘기면
// NaN 파싱되어 검정으로 렌더링된다. C.primary('rgb(255 107 129)')와 동일한 색의 hex 값을 직접 지정.
const ANALYZING_LOTTIE = recolorLottie(heartLottieRaw, '#FF6B81');
const MIN_ANALYZING_MS = 1200;

export default function CoupleGuideClient() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('landing');
  const [form, setForm] = useState<CoupleGuideFormState>(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // person1, person2 사주 캐시 복원
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      person1: mergeCachedPerson(loadSelfSaju('couple_guide_person1'), prev.person1),
      person2: mergeCachedPerson(loadSelfSaju('couple_guide_person2'), prev.person2),
    }));
  }, []);

  // person1, person2 사주 데이터 변경 시 자동 저장
  useAutoSaveSaju('couple_guide_person1', form.person1);
  useAutoSaveSaju('couple_guide_person2', form.person2);

  const handleChange = useCallback((patch: Partial<CoupleGuideFormState>) => {
    setForm(prev => ({
      ...prev,
      ...patch,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setStep('analyzing');
    setErrorMessage(null);

    const minDelay = new Promise(resolve => setTimeout(resolve, MIN_ANALYZING_MS));

    try {
      const [result] = await Promise.all([
        analyzeCoupleGuide(form),
        minDelay,
      ]);

      if (!result || !result.resultId) {
        throw new Error('resultId가 존재하지 않습니다.');
      }

      saveCoupleGuideResult(result);
      router.push(`/couple-guide/${result.resultId}`);
    } catch (err: any) {
      console.error('[couple-guide] 분석 실패 상세:', err);
      await minDelay;
      setErrorMessage(err.message || '분석 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    }
  }, [form, router]);

  const handleBack = useCallback(() => {
    setStep('landing');
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }}>
      <div
        className="w-full max-w-110 md:max-w-150"
        style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', position: 'relative', paddingTop: '53px', fontFamily: 'Cafe24 Dongdong, sans-serif' }}
      >
        <div style={{ opacity: step === 'analyzing' ? 0 : 1, transition: 'opacity 0.25s', pointerEvents: step === 'analyzing' ? 'none' : 'auto' }}>
          <TestTopNav fixed bgColor="#FFFFFF" logoColor="#000000" xColor="#000000" onBack={step === 'input' ? handleBack : undefined} />
        </div>

        {step === 'landing' && <CoupleLanding onStart={() => setStep('input')} />}
        {step === 'input' && (
          <CoupleInput
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            errorMessage={errorMessage}
          />
        )}
        {step === 'analyzing' && (
          <AnalyzingScreen
            messages={ANALYZING_MESSAGES}
            animationData={ANALYZING_LOTTIE}
            messageColor={C.primary}
            messageFontSize="20px"
            messageFontWeight={500}
            messageTextStrokeWidth="0.3px"
            waveText
          />
        )}
      </div>
    </div>
  );
}