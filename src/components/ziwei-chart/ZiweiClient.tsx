'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import TestTopNav from '@/components/TestTopNav';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { ZIWEI_PALETTE as C } from '@/lib/ziwei-chart/theme';

import ZiweiLanding from './ZiweiLanding';
import ZiweiInput from './ZiweiInput';
import ZiweiAnalyzing from './ZiweiAnalyzing';
import ZiweiGrid from './ZiweiGrid';
import { JamidusuEngine } from '@/lib/ziwei-chart/jamidusuEngine';

export default function ZiweiClient() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(true);
  const [timeSelected, setTimeSelected] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<'landing' | 'input' | 'analyzing' | 'result'>('landing');
  const [error, setError] = useState<string | null>(null);

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
      // 1. 생년월일과 시간(오전/오후)을 실제 Date 객체로 변환
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

      // 2. 엔진을 돌려 명반 JSON 데이터 산출
      const engineResult = JamidusuEngine.makePurpleStarTable(dt, sexInt);

      await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 연출
      
      // 3. 디버깅용 콘솔 출력 및 클립보드 복사
      console.log('%c🔮 자미두수 명반 엔진 산출 결과', 'color: #6B2FC2; font-size: 16px; font-weight: bold;');
      console.dir(engineResult, { depth: null });
      
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const jsonString = JSON.stringify(engineResult, null, 2);
        navigator.clipboard.writeText(jsonString)
          .then(() => alert('✅ 명반 JSON 데이터가 클립보드에 복사되었습니다! (Ctrl+V로 확인)'))
          .catch(err => console.error('클립보드 복사 실패:', err));
      }

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

            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ padding: '16px 16px 48px' }}
              >
                {/* 1단계에서 만든 자미두수 표 렌더링 */}
                <ZiweiGrid />
                
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <p style={{ color: C.textSub, fontSize: '14px' }}>결과 해석 영역 및 하단 CTA 버튼 엑박</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}