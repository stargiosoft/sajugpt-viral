'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import TestTopNav from '@/components/TestTopNav';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { ZIWEI_PALETTE as C } from '@/lib/ziwei-chart/theme';
import { JamidusuEngine } from '@/lib/ziwei-chart/jamidusuEngine';

import ZiweiLanding from './ZiweiLanding';
import ZiweiInput from './ZiweiInput';
import ZiweiAnalyzing from './ZiweiAnalyzing';
import ZiweiGrid from './ZiweiGrid';

export default function ZiweiClient() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(true);
  const [timeSelected, setTimeSelected] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<'landing' | 'input' | 'analyzing' | 'result'>('landing');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const cached = loadSelfSaju('ziwei_chart');
    if (cached) {
      if (cached.birthDate) setBirthDate(cached.birthDate);
      if (cached.birthTime) { setBirthTime(cached.birthTime); setTimeSelected(true); }
      if (cached.unknownTime !== undefined) { setUnknownTime(cached.unknownTime); if (cached.unknownTime) setTimeSelected(true); }
      if (cached.gender) setGender(cached.gender);
    }
  }, []);

  useEffect(() => {
    saveSelfSaju('ziwei_chart', { birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);

  const isFormValid = () => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    if (!timeSelected) return false;
    return true;
  };

  const handleTimeSelect = useCallback((displayTime: string, isUnknown: boolean) => {
    setTimeSelected(true);
    setUnknownTime(isUnknown);
    setBirthTime(displayTime);
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    setStep('analyzing');
    setError(null);

    try {
      const [year, month, day] = birthDate.split('-').map(Number);
      let hours = 12, minutes = 0;

      if (!unknownTime && birthTime) {
        const isPM = birthTime.includes('오후');
        const timeMatch = birthTime.match(/(\d+):(\d+)/);
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10);
          const m = parseInt(timeMatch[2], 10);
          if (isPM && h < 12) h += 12;
          if (!isPM && h === 12) h = 0;
          hours = h;
          minutes = m;
        }
      }
      const dt = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      const sexInt = gender === 'male' ? 1 : 0;

      // 엔진 구동
      const engineResult = JamidusuEngine.makePurpleStarTable(dt, sexInt);

      // 로딩 딜레이
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('🔮 자미두수 명반 엔진 산출 결과', engineResult);
      
      setResult(engineResult);
      setStep('result');
      
    } catch (err) {
      console.error(err);
      setError('명반 분석 중 오류가 발생했습니다.');
      setStep('input');
    }
  };

  return (
    <div className="h-dvh flex justify-center" style={{ backgroundColor: C.bg, fontFamily: "'Pretendard Variable', sans-serif" }}>
      <div className="w-full h-full flex flex-col max-w-110 md:max-w-150">
        <div className="flex-1 overflow-auto w-full">
          <TestTopNav bgColor={C.bg} logoColor="#000000" xColor="#000000" />
          <AnimatePresence mode="wait">
            {step === 'landing' && <ZiweiLanding key="landing" onStart={() => setStep('input')} />}

            {step === 'input' && (
              <ZiweiInput
                key="input"
                birthDate={birthDate} onBirthDateChange={setBirthDate}
                birthTime={birthTime} unknownTime={unknownTime} onTimeSelect={handleTimeSelect}
                gender={gender} onGenderChange={setGender}
                isValid={isFormValid()} error={error} onSubmit={handleSubmit}
              />
            )}

            {step === 'analyzing' && <ZiweiAnalyzing key="analyzing" />}

            {step === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ padding: '8px', minWidth: '100%' }}
              >
                <ZiweiGrid chartData={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}