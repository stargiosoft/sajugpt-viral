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

const MIN_ANALYZING_MS = 1200;

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
