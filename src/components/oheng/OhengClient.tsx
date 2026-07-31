'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TestTopNav from '@/components/TestTopNav';
import Landing from './Landing';
import InputForm from './InputForm';
import AnalyzingScreen from './AnalyzingScreen';
import ResultCard from './ResultCard';
import { supabase } from '@/lib/supabase';
import { fetchOhengResultById } from '@/lib/oheng';
import { OHENG_COLORS as C } from '@/constants/ohengTheme';
import type { OhengFormState, OhengPrescription } from '@/types/oheng';

type Step = 'loading' | 'landing' | 'input' | 'analyzing' | 'result' | 'error';

const INITIAL_FORM: OhengFormState = {
  gender: null,
  birthday: '',
  birthTime: '',
  birthTimeUnknown: true,
};

export default function OhengClient({ resultId }: { resultId?: string }) {
  const [step, setStep] = useState<Step>(resultId ? 'loading' : 'landing');
  const [form, setForm] = useState<OhengFormState>(INITIAL_FORM);
  const [result, setResult] = useState<OhengPrescription | null>(null);

  useEffect(() => {
    if (!resultId) return;
    fetchOhengResultById(resultId).then(saved => {
      if (saved) {
        setResult(saved);
        setStep('result');
      } else {
        setStep('error');
      }
    });
  }, [resultId]);

  const handleFormChange = useCallback((patch: Partial<OhengFormState>) => {
    setForm(prev => ({ ...prev, ...patch }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setStep('analyzing');
    try {
      const minDelay = new Promise(resolve => setTimeout(resolve, 2200));
      const [{ data, error }] = await Promise.all([
        supabase.functions.invoke('analyze-oheng-prescription', {
          body: {
            name: '당신',
            birthday: form.birthday,
            birthTime: form.birthTimeUnknown ? '모름' : form.birthTime,
            gender: form.gender,
            calendarType: 'solar',
          },
        }),
        minDelay,
      ]);
      if (error || !data?.success) throw new Error(error?.message || '분석 실패');
      const prescription = data as OhengPrescription;
      setResult(prescription);
      setStep('result');
      if (prescription.resultId && typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/oheng/${prescription.resultId}`);
      }
    } catch {
      setStep('error');
    }
  }, [form]);

  const handleRestart = useCallback(() => {
    setForm(INITIAL_FORM);
    setResult(null);
    setStep('landing');
    window.scrollTo(0, 0);
  }, []);

  const handleBack = useCallback(() => {
    setStep(step === 'input' ? 'landing' : 'input');
  }, [step]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }}>
      <div
        className="w-full max-w-[440px] md:max-w-[600px]"
        style={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          boxShadow: '0 0 40px rgba(0,0,0,0.08)',
        }}
      >
        <motion.div
          animate={{ opacity: step === 'analyzing' ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{ pointerEvents: step === 'analyzing' ? 'none' : 'auto' }}
        >
          <TestTopNav
            bgColor="#FFFFFF"
            logoColor={C.text}
            xColor={C.text}
            onBack={step === 'input' || step === 'error' ? handleBack : undefined}
          />
        </motion.div>
        {step === 'loading' && (
          <div style={{ padding: '120px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: C.textSecondary }}>결과를 불러오는 중...</p>
          </div>
        )}
        {step === 'landing' && <Landing onStart={() => setStep('input')} thumbnailSrc="/oheng/landing-thumbnail.png" />}
        {step === 'input' && <InputForm form={form} onChange={handleFormChange} onSubmit={handleSubmit} />}
        {step === 'analyzing' && <AnalyzingScreen />}
        {step === 'result' && result && <ResultCard result={result} onRestart={handleRestart} />}
        {step === 'error' && (
          <div style={{ padding: '12px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: C.text, marginBottom: '20px' }}>분석 중 문제가 발생했어요. 다시 시도해 주세요.</p>
            <button
              type="button"
              onClick={handleRestart}
              style={{ height: '52px', padding: '0 24px', borderRadius: '16px', backgroundColor: C.blue, color: C.textOnBlue, border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
            >
              처음으로
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
