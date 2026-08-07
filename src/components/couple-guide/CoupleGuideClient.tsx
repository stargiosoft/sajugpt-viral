'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import TestTopNav from '@/components/TestTopNav';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import CoupleLanding from './CoupleLanding';
import CoupleInput from './CoupleInput';

import { analyzeCoupleGuide, saveCoupleGuideResult } from '@/lib/coupleGuide';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { recolorLottie } from '@/lib/lottieRecolor';
import heartLottieRaw from '@/lottie/solo-guide-heart.json';
import { COUPLE_COLORS as C } from '@/constants/coupleGuideTheme';

import type {
  CoupleGuideFormState,
  PersonBirthInfo,
} from '@/types/couple-guide';

type Step = 'landing' | 'input' | 'analyzing';

const EMPTY_PERSON: PersonBirthInfo = {
  gender: '' as any,
  birthday: '',
  birthTime: '',
  birthTimeUnknown: false,
};

const INITIAL_FORM: CoupleGuideFormState = {
  person1: { ...EMPTY_PERSON },
  person2: { ...EMPTY_PERSON },
  calendarType: 'solar',
};

const ANALYZING_MESSAGES = [
  '두 사람의 사주 정보를 확인하고 있어요 🔮',
  '오행과 십성의 조화를 분석하고 있어요 ✨',
  '두 사람만의 관계 에너지를 계산하고 있어요 💕',
  '궁합 리포트를 작성하고 있어요 💌',
];

const ANALYZING_LOTTIE = recolorLottie(heartLottieRaw, C.primary);
const MIN_ANALYZING_MS = 1200;

export default function CoupleGuideClient() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('landing');
  const [form, setForm] = useState<CoupleGuideFormState>(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // person1, person2 사주 캐시 복원
  useEffect(() => {
    const cached1 = loadSelfSaju('couple_guide_person1');
    const cached2 = loadSelfSaju('couple_guide_person2');

    setForm(prev => ({
      ...prev,
      person1: cached1 ? {
        ...prev.person1,
        gender: cached1.gender ?? prev.person1.gender,
        birthday: cached1.birthDate || prev.person1.birthday,
        birthTime: cached1.birthTime || prev.person1.birthTime,
        birthTimeUnknown: cached1.unknownTime ?? prev.person1.birthTimeUnknown,
      } : prev.person1,
      person2: cached2 ? {
        ...prev.person2,
        gender: cached2.gender ?? prev.person2.gender,
        birthday: cached2.birthDate || prev.person2.birthday,
        birthTime: cached2.birthTime || prev.person2.birthTime,
        birthTimeUnknown: cached2.unknownTime ?? prev.person2.birthTimeUnknown,
      } : prev.person2,
    }));
  }, []);

  // person1 사주 데이터 변경 시 자동 저장
  useEffect(() => {
    if (!form.person1.gender && !form.person1.birthday) return;
    saveSelfSaju('couple_guide_person1', {
      birthDate: form.person1.birthday,
      birthTime: form.person1.birthTime,
      unknownTime: form.person1.birthTimeUnknown,
      gender: form.person1.gender,
    });
  }, [form.person1]);

  // person2 사주 데이터 변경 시 자동 저장 (추가됨)
  useEffect(() => {
    if (!form.person2.gender && !form.person2.birthday) return;
    saveSelfSaju('couple_guide_person2', {
      birthDate: form.person2.birthday,
      birthTime: form.person2.birthTime,
      unknownTime: form.person2.birthTimeUnknown,
      gender: form.person2.gender,
    });
  }, [form.person2]);

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
      console.log('=== 제출된 폼 데이터 ===', JSON.stringify(form));

      const [result] = await Promise.all([
        analyzeCoupleGuide(form),
        minDelay,
      ]);

      console.log('=== 수신된 분석 결과 ===', result);

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
    <div style={{ minHeight: '100vh', backgroundColor: C.frameBg, display: 'flex', justifyContent: 'center' }}>
      <div
        className="w-full max-w-110 md:max-w-150"
        style={{ minHeight: '100vh', backgroundColor: C.frameBg, position: 'relative', fontFamily: 'Cafe24 Dongdong, sans-serif' }}
      >
        <motion.div
          animate={{ opacity: step === 'analyzing' ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{ pointerEvents: step === 'analyzing' ? 'none' : 'auto' }}
        >
          <TestTopNav bgColor={C.frameBg} logoColor={C.text} xColor={C.text} onBack={step === 'input' ? handleBack : undefined} />
        </motion.div>

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
            messageFontWeight={600}
            waveText
          />
        )}
      </div>
    </div>
  );
}