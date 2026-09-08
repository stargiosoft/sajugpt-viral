'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { Gender } from '@/types/battle';
import type {
  SkillStep,
  SkillAnalysisResult,
} from '@/types/shinsal-series/skill-item';

import { SKILL_ITEM_COLORS as C } from '@/constants/shinsalItemTheme';

import TestTopNav from '@/components/TestTopNav';

import SkillLanding from './SkillLanding';
import SkillInput from './SkillInput';
import SkillAnalyzing from './SkillAnalyzing';

export default function SkillClient() {
  const router = useRouter();

  // ─────────────────────────────────────────────
  // 입력 상태
  // ─────────────────────────────────────────────
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(true);
  const [timeSelected, setTimeSelected] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  // ─────────────────────────────────────────────
  // 화면 상태
  // ─────────────────────────────────────────────
  const [step, setStep] = useState<SkillStep>('landing');
  const [error, setError] = useState<string | null>(null);

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(
        'skill_item_user_input'
      );

      if (!savedData) return;

      const parsed = JSON.parse(savedData);

      if (parsed.birthDate) {
        setBirthDate(parsed.birthDate);
      }

      if (parsed.birthTime) {
        setBirthTime(parsed.birthTime);
      }

      if (parsed.unknownTime !== undefined) {
        setUnknownTime(parsed.unknownTime);
      }

      if (parsed.timeSelected !== undefined) {
        setTimeSelected(parsed.timeSelected);
      }

      if (parsed.gender) {
        setGender(parsed.gender);
      }
    } catch (error) {
      console.error(
        'Failed to restore saved skill item input:',
        error
      );
    }
  }, []);

  useEffect(() => {
    if (!birthDate && !timeSelected) return;

    const dataToSave = {
      birthDate,
      birthTime,
      unknownTime,
      timeSelected,
      gender,
    };

    try {
      localStorage.setItem(
        'skill_item_user_input',
        JSON.stringify(dataToSave)
      );
    } catch (error) {
      console.error(
        'Failed to save skill item input:',
        error
      );
    }
  }, [
    birthDate,
    birthTime,
    unknownTime,
    timeSelected,
    gender,
  ]);

  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) {
      return false;
    }
    if (!timeSelected) {
      return false;
    }
    return true;
  }, [birthDate, timeSelected]);

  const handleTimeSelect = useCallback(
    (displayTime: string, isUnknown: boolean) => {
      setTimeSelected(true);
      setUnknownTime(isUnknown);
      setBirthTime(displayTime);
    },
    []
  );

  // 분석시작
  const handleSubmit = useCallback(async () => {
    if (!isFormValid() || isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    setError(null);
    setStep('analyzing');

    let formattedTime = birthTime;

    if (!unknownTime && birthTime) {
      const timeParts = birthTime.match(
        /(\d{1,2}):(\d{2})/
      );

      if (
        timeParts &&
        !birthTime.includes('오전') &&
        !birthTime.includes('오후')
      ) {
        let hour = parseInt(timeParts[1], 10);
        const minute = timeParts[2];

        const period = hour >= 12 ? '오후' : '오전';

        if (hour > 12) {
          hour -= 12;
        }

        if (hour === 0) {
          hour = 12;
        }

        formattedTime = `${period} ${String(hour).padStart(
          2,
          '0'
        )}:${minute}`;
      }
    }

    const effectiveTime = unknownTime
      ? 'unknown'
      : formattedTime;

    try {
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL;

      const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          'Supabase 환경변수가 설정되지 않았습니다.'
        );
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/analyze-shinsal-skillitem`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            birthDate,
            birthTime: effectiveTime,
            gender,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          '분석 데이터를 가져오는데 실패했습니다.';

        try {
          const errorData = await response.json();

          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {}

        throw new Error(errorMessage);
      }

      const generated: SkillAnalysisResult =
        await response.json();

      if (!generated?.resultId) {
        throw new Error(
          '분석 결과 ID를 받아오지 못했습니다.'
        );
      }

      localStorage.setItem(
        `result_${generated.resultId}`,
        JSON.stringify(generated)
      );

      router.replace(
        `/shinsal-series/skill-item/${generated.resultId}`
      );
    } catch (error) {
      console.error(
        '12신살 분석 에러:',
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : '분석 중 오류가 발생했습니다.'
      );

      setStep('input');
      isSubmittingRef.current = false;
    }
  }, [
    birthDate,
    birthTime,
    gender,
    unknownTime,
    isFormValid,
    router,
  ]);

  const handleStart = useCallback(() => {
    setStep('input');
  }, []);

  return (
    <div
      className="w-full h-dvh flex justify-center overflow-hidden"
      style={{
        backgroundColor: C.panelBg,
        color: C.textPrimary,
        fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
      }}
    >
      <div className="w-full h-full flex flex-col max-w-110 md:max-w-150 relative shadow-2xl">
        {/* 상단 네비게이션 */}
        <header className="w-full shrink-0 z-50">
          <TestTopNav
            bgColor={C.navBg}
            logoColor={C.navText}
            xColor={C.navText}
          />
        </header>

        {/* 콘텐츠 */}
        <main className="flex-1 w-full overflow-y-auto flex flex-col relative">
          {step === 'landing' && (
            <SkillLanding onStart={handleStart} />
          )}

          {step === 'input' && (
            <SkillInput
              birthDate={birthDate}
              onBirthDateChange={setBirthDate}
              birthTime={birthTime}
              unknownTime={unknownTime}
              onTimeSelect={handleTimeSelect}
              gender={gender}
              onGenderChange={setGender}
              isValid={isFormValid()}
              error={error}
              onSubmit={handleSubmit}
              isSubmitting={isSubmittingRef.current}
            />
          )}

          {step === 'analyzing' && (
            <SkillAnalyzing />
          )}
        </main>
      </div>
    </div>
  );
}