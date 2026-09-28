'use client';

import { useState } from 'react';
import TestTopNav from '@/components/TestTopNav';
import FutureSpouseLanding from '@/components/future-spouse/FutureLanding';
import FutureSpouseClient from '@/components/future-spouse/FutureSpouseClient';

export default function FutureSpouseMain() {
  const [step, setStep] = useState<'landing' | 'form'>('landing');

  return (
    <div className="min-h-screen w-full bg-white flex justify-center">
      <div className="w-full max-w-110 min-h-screen bg-white relative flex flex-col">
        <TestTopNav bgColor="#FFFFFF" logoColor="#000000" xColor="#000000" />

        <div className="flex-1 w-full">
          {step === 'landing' && (
            <FutureSpouseLanding onStart={() => setStep('form')} />
          )}

          {step === 'form' && <FutureSpouseClient />}
        </div>
      </div>
    </div>
  );
}