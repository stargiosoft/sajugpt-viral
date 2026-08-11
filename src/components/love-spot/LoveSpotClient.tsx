'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TestTopNav from '@/components/TestTopNav';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import LoveSpotLanding from './LoveSpotLanding';
import LoveSpotInputForm from './LoveSpotInputForm';
import { analyzeLoveSpot, saveLoveSpotResult } from '@/lib/loveSpot';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { recolorLottie } from '@/lib/lottieRecolor';
import heartLottieRaw from '@/lottie/solo-guide-heart.json';
import { LOVE_SPOT_COLORS as C } from '@/constants/loveSpotTheme';
import type { LoveSpotFormState } from '@/types/love-spot';

const CARD_FONT_FAMILY = '"Dongle", sans-serif';

type Step = 'landing' | 'input' | 'analyzing';

const INITIAL_FORM: LoveSpotFormState = {
  gender: null,
  birthday: '',
  birthTime: '',
  birthTimeUnknown: true,
};

const ANALYZING_MESSAGES = ['인연을 찾는 중..'];
const ANALYZING_LOTTIE = recolorLottie(heartLottieRaw, C.primary);
const MIN_ANALYZING_MS = 1200;

export default function LoveSpotClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('landing');
  const [form, setForm] = useState<LoveSpotFormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = loadSelfSaju('love_spot');
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
    saveSelfSaju('love_spot', {
      birthDate: form.birthday,
      birthTime: form.birthTime,
      unknownTime: form.birthTimeUnknown,
      gender: form.gender,
    });
  }, [form]);

  const handleFormChange = useCallback((patch: Partial<LoveSpotFormState>) => {
    setForm(prev => ({ ...prev, ...patch }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.gender) return;
    setStep('analyzing');
    setError(null);

    const minDelay = new Promise(resolve => setTimeout(resolve, MIN_ANALYZING_MS));

    try {
      const [result] = await Promise.all([
        analyzeLoveSpot({
          birthDate: form.birthday,
          birthTime: form.birthTime,
          unknownTime: form.birthTimeUnknown,
          gender: form.gender,
        }),
        minDelay,
      ]);

      saveLoveSpotResult(result);
      router.push(`/love-spot/${result.resultId}`);
    } catch (err) {
      console.error('[love-spot] 분석 실패:', err);
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
        style={{ minHeight: '100vh', backgroundColor: C.frameBg, position: 'relative', fontFamily: 'Pretendard, sans-serif' }}
      >
        <motion.div
          animate={{ opacity: step === 'analyzing' ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{ pointerEvents: step === 'analyzing' ? 'none' : 'auto' }}
        >
          <TestTopNav bgColor={C.frameBg} logoColor={C.text} xColor={C.text} onBack={step === 'input' ? handleBack : undefined} />
        </motion.div>

        {step === 'landing' && <LoveSpotLanding onStart={() => setStep('input')} />}
        {step === 'input' && (
          <LoveSpotInputForm form={form} onChange={handleFormChange} onSubmit={handleSubmit} errorMessage={error} />
        )}
        {step === 'analyzing' && (
          <div 
            style={{ fontFamily: CARD_FONT_FAMILY }}
            className="**:font-['Dongle']!"
          >
            <AnalyzingScreen
              messages={ANALYZING_MESSAGES}
              animationData={ANALYZING_LOTTIE}
              messageColor={C.primary}
              messageFontSize="36px"
              messageFontWeight={700}
              waveText
            />
          </div>
        )}
      </div>
    </div>
  );
}