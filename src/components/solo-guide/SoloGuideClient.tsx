'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TestTopNav from '@/components/TestTopNav';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import SoloLanding from './SoloLanding';
import SoloGuideInputForm from './SoloGuideInputForm';
import { analyzeSoloGuide, saveSoloGuideResult } from '@/lib/soloGuide';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { recolorLottie } from '@/lib/lottieRecolor';
import heartLottieRaw from '@/lottie/solo-guide-heart.json';
import { SOLO_COLORS as C } from '@/constants/soloGuideTheme';
import type { SoloGuideFormState } from '@/types/solo-guide';

type Step = 'landing' | 'input' | 'analyzing';

const INITIAL_FORM: SoloGuideFormState = {
  gender: null,
  birthday: '',
  birthTime: '',
  birthTimeUnknown: true,
};

const ANALYZING_MESSAGES = ['분석중..'];
const ANALYZING_LOTTIE = recolorLottie(heartLottieRaw, C.primary);

const MIN_ANALYZING_MS = 1200; // analyze-solo-guide 응답이 너무 빨라도 로딩 연출이 순간 스치지 않도록 최소 노출 시간 보장

// 결과는 analyze-solo-guide Edge Function(Stargio + WhySolo API)에서 계산해 받아오고,
// 사용자별 결과 저장 테이블이 없어 공유 링크는 localStorage에 저장한다(같은 브라우저에서만 열림).
export default function SoloGuideClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('landing');
  const [form, setForm] = useState<SoloGuideFormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = loadSelfSaju('solo_guide');
    if (cached) {
      setForm(prev => ({
        gender: cached.gender ?? prev.gender,
        birthday: cached.birthDate || prev.birthday,
        birthTime: cached.birthTime || prev.birthTime,
        birthTimeUnknown: cached.unknownTime ?? prev.birthTimeUnknown,
      }));
    }
  }, []);

  useEffect(() => {
    if (!form.gender || !form.birthday) return;
    saveSelfSaju('solo_guide', {
      birthDate: form.birthday,
      birthTime: form.birthTime,
      unknownTime: form.birthTimeUnknown,
      gender: form.gender,
    });
  }, [form]);

  const handleFormChange = useCallback((patch: Partial<SoloGuideFormState>) => {
    setForm(prev => ({ ...prev, ...patch }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.gender) return;
    setStep('analyzing');
    setError(null);

    const minDelay = new Promise(resolve => setTimeout(resolve, MIN_ANALYZING_MS));

    try {
      const [result] = await Promise.all([
        analyzeSoloGuide({
          birthDate: form.birthday,
          birthTime: form.birthTime,
          unknownTime: form.birthTimeUnknown,
          gender: form.gender,
        }),
        minDelay,
      ]);

      saveSoloGuideResult(result);
      router.push(`/solo-guide/${result.resultId}`);
    } catch (err) {
      console.error('[solo-guide] 분석 실패:', err);
      await minDelay;
      setError('분석 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    }
  }, [form, router]);

  const handleBack = useCallback(() => {
    setStep('landing');
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.frameBg, display: 'flex', justifyContent: 'center' }}>
      <div
        className="w-full max-w-[440px] md:max-w-[600px]"
        style={{ minHeight: '100vh', backgroundColor: C.frameBg, position: 'relative', fontFamily: 'Cafe24 Dongdong, sans-serif' }}
      >
        <motion.div
          animate={{ opacity: step === 'analyzing' ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{ pointerEvents: step === 'analyzing' ? 'none' : 'auto' }}
        >
          <TestTopNav bgColor={C.frameBg} logoColor={C.text} xColor={C.text} onBack={step === 'input' ? handleBack : undefined} />
        </motion.div>

        {step === 'landing' && <SoloLanding onStart={() => setStep('input')} />}
        {step === 'input' && <SoloGuideInputForm form={form} onChange={handleFormChange} onSubmit={handleSubmit} errorMessage={error} />}
        {step === 'analyzing' && (
          <AnalyzingScreen
            messages={ANALYZING_MESSAGES}
            animationData={ANALYZING_LOTTIE}
            messageColor={C.primary}
            messageFontSize="23px"
            messageFontWeight={600}
            waveText
          />
        )}
      </div>
    </div>
  );
}
