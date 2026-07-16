'use client';

import { useCallback, useState } from 'react';
import TopNav from './TopNav';
import Landing from './Landing';
import InputForm from './InputForm';
import AnalyzingScreen from './AnalyzingScreen';
import ResultCard from './ResultCard';
import { supabase } from '@/lib/supabase';
import type { OhengFormState, OhengPrescription } from '@/types/oheng';

type Step = 'landing' | 'input' | 'analyzing' | 'result' | 'error';

const INITIAL_FORM: OhengFormState = {
  gender: null,
  birthday: '',
  birthTime: '',
  birthTimeUnknown: true,
};

export default function OhengClient() {
  const [step, setStep] = useState<Step>('landing');
  const [form, setForm] = useState<OhengFormState>(INITIAL_FORM);
  const [result, setResult] = useState<OhengPrescription | null>(null);

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
      setResult(data as OhengPrescription);
      setStep('result');
    } catch {
      setStep('error');
    }
  }, [form]);

  const handleRestart = useCallback(() => {
    setForm(INITIAL_FORM);
    setResult(null);
    setStep('landing');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'input') setStep('landing');
    else if (step === 'analyzing' || step === 'result' || step === 'error') setStep('input');
  }, [step]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E9E2CE', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          minHeight: '100vh',
          backgroundColor: '#F3E7C9',
          position: 'relative',
          boxShadow: '0 0 40px rgba(0,0,0,0.08)',
        }}
      >
        <TopNav onBack={step === 'landing' ? undefined : handleBack} />
        {step === 'landing' && <Landing onStart={() => setStep('input')} />}
        {step === 'input' && <InputForm form={form} onChange={handleFormChange} onSubmit={handleSubmit} />}
        {step === 'analyzing' && <AnalyzingScreen />}
        {step === 'result' && result && <ResultCard result={result} onRestart={handleRestart} />}
        {step === 'error' && (
          <div style={{ padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: '#2B2013', marginBottom: '20px' }}>분석 중 문제가 발생했어요. 다시 시도해 주세요.</p>
            <button
              type="button"
              onClick={handleRestart}
              style={{ height: '52px', padding: '0 24px', borderRadius: '16px', backgroundColor: '#2B2013', color: '#F3E7C9', border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
            >
              처음으로
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
