'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TestTopNav from '@/components/TestTopNav';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import { LoveSeasonLanding } from './LoveSeasonLanding';
import { LoveSeasonResult } from './LoveSeasonResult';
import { LoveSeasonInputForm } from './LoveSeasonInputForm';
import { createLovingSeasonResult } from '@/lib/lovingSeason';
import { recolorLottie } from '@/lib/lottieRecolor';
import heartLottieRaw from '@/lottie/solo-guide-heart.json';
import { SOLO_COLORS as C } from '@/constants/soloGuideTheme';
import type { LovingSeasonInput, LovingSeasonRecord } from '@/types/loving-season';

type Step = 'input' | 'analyzing';

const INITIAL_FORM: LovingSeasonInput = {
  gender: 'female',
  birthday: '',
  birthTime: '모름',
};

const STORAGE_KEY = 'love_season_input_form';

const ANALYZING_MESSAGES = ['내 연애의 계절을 분석중..'];
const ANALYZING_LOTTIE = recolorLottie(heartLottieRaw, '#ff4b72');
const MIN_ANALYZING_MS = 1200;

interface LoveSeasonClientProps {
  result?: LovingSeasonRecord;
}

export function LoveSeasonClient({ result }: LoveSeasonClientProps) {
  const router = useRouter();
  const [started, setStarted] = useState<boolean>(!!result);
  const [step, setStep] = useState<Step>('input');
  
  // 로컬 스토리지에서 초기 폼 값 복원
  const [form, setForm] = useState<LovingSeasonInput>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('[loving-season] 로컬 스토리지 복원 실패:', e);
      }
    }
    return INITIAL_FORM;
  });

  const [error, setError] = useState<string | null>(null);

  // form 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      } catch (e) {
        console.error('[loving-season] 로컬 스토리지 저장 실패:', e);
      }
    }
  }, [form]);

  const handleFormChange = useCallback((patch: Partial<LovingSeasonInput>) => {
    setForm(prev => ({ ...prev, ...patch }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.birthday) return;
    setStep('analyzing');
    setError(null);

    const minDelay = new Promise(resolve => setTimeout(resolve, MIN_ANALYZING_MS));

    try {
      // API 응답 데이터 받기
      const [resData] = await Promise.all([
        createLovingSeasonResult(form),
        minDelay,
      ]);

      const resultId = resData.resultId || crypto.randomUUID();

      // DB 저장 없이 세션 스토리지에 결과 보관
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`loving_season_${resultId}`, JSON.stringify(resData));
      }

      router.push(`/loving-season/${resultId}`);
    } catch (err) {
      console.error('[loving-season] 분석 실패:', err);
      await minDelay;
      setError(err instanceof Error ? err.message : '분석 중 문제가 발생했어요.');
      setStep('input');
    }
  }, [form, router]);

  const handleRestart = () => {
    setStep('input');
    setStarted(false);
    router.push('/loving-season');
  };

  return (
    <>
      {/* 도트 폰트 로드 전역 설정 */}
      <style jsx global>{`
        @font-face {
          font-family: 'DungGeunMo';
          src: url('https://cdn.jsdelivr.net/gh/fontbee/font@main/Orioncactus/DungGeunMo.woff')
            format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'NeoDunggeunmo';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.3/NeoDunggeunmo.woff')
            format('woff');
          font-weight: normal;
          font-display: swap;
        }
      `}</style>

      {/* 1) 랜딩 화면 */}
      {!started && !result && (
        <div style={{ minHeight: '100vh', backgroundColor: C.frameBg, display: 'flex', justifyContent: 'center' }}>
          <div className="w-full max-w-110 md:max-w-150" style={{ minHeight: '100vh', backgroundColor: C.frameBg }}>
            <LoveSeasonLanding onStart={() => setStarted(true)} />
          </div>
        </div>
      )}

      {/* 2) 결과 화면 */}
      {result && (
        <div style={{ minHeight: '100vh', backgroundColor: C.frameBg, display: 'flex', justifyContent: 'center' }}>
          <div className="w-full max-w-110 md:max-w-150" style={{ minHeight: '100vh', backgroundColor: C.frameBg, position: 'relative' }}>
            <TestTopNav bgColor={C.frameBg} logoColor={C.text} xColor={C.text} />
            <LoveSeasonResult result={result} onRestart={handleRestart} />
          </div>
        </div>
      )}

      {/* 3) 입력 폼 및 분석 화면 */}
      {!started && result ? null : !started ? null : !result && (
        <div style={{ minHeight: '100vh', backgroundColor: C.frameBg, display: 'flex', justifyContent: 'center' }}>
          <div className="w-full max-w-110 md:max-w-150" style={{ minHeight: '100vh', backgroundColor: C.frameBg, position: 'relative' }}>
            <motion.div
              animate={{ opacity: step === 'analyzing' ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              style={{ pointerEvents: step === 'analyzing' ? 'none' : 'auto' }}
            >
              <TestTopNav bgColor={C.frameBg} logoColor={C.text} xColor={C.text} />
            </motion.div>

            {step === 'input' && (
              <LoveSeasonInputForm
                form={form}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                errorMessage={error}
              />
            )}

            {step === 'analyzing' && (
              <div style={{ fontFamily: "'DungGeunMo', monospace" }}>
                <AnalyzingScreen
                  messages={ANALYZING_MESSAGES}
                  animationData={ANALYZING_LOTTIE}
                  messageColor="#9C4767"
                  messageFontSize="18px"
                  messageFontWeight={700}
                  waveText
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}