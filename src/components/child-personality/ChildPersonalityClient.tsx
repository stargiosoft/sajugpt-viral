'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import TestTopNav from '@/components/TestTopNav';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import PressableButton from '@/components/PressableButton';
import ShareRow from '@/components/ShareRow';
import ResultFooterSections from '@/components/ResultFooterSections';

import ChildPersonalityLanding from './ChildPersonalityLanding';
import ChildBirthInput from './ChildBirthInput';
import ChildAnalyzing from './ChildAnalyzing';
import ChildResultCard from './ChildResultCard';

import {
  analyzeChild,
} from '@/lib/child-personality/analyzeChild';

import type {
  ChildGender,
  ChildPersonalityResult,
} from '@/types/child-personality';

import { trackEvent } from '@/lib/analytics';
import { incrementTestStat } from '@/lib/testStats';
import {
  loadSelfSaju,
  saveSelfSaju,
} from '@/lib/sajuCache';
import { useShareActions } from '@/lib/useShareActions';
import { SAJUGPT_URL } from '@/constants/links';
import { trackSajuGPTClick } from '@/lib/analytics';
import useIsNarrow from '@/hooks/useIsNarrow';

// =========================================================
// TYPES
// =========================================================

type ChildPersonalityStep =
  | 'landing'
  | 'input'
  | 'analyzing'
  | 'result';

interface ChildPersonalityClientProps {
  initialData?: ChildPersonalityResult | null;
}

const THEME_COLOR = '#E98C72';
const PAGE_BG = '#FFF9F2';
const TEXT_COLOR = '#493C35';
const BORDER_COLOR = '#F0E5DB';
const CARD_BG = '#FFFFFF';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const EDGE_FUNCTION_NAME =
  'analyze-child-personality';

// =========================================================
// EDGE FUNCTION URL
// =========================================================

function getEdgeFunctionUrl() {
  if (!SUPABASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.',
    );
  }

  return `${SUPABASE_URL}/functions/v1/${EDGE_FUNCTION_NAME}`;
}

// =========================================================
// COMPONENT
// =========================================================

export default function ChildPersonalityClient({
  initialData,
}: ChildPersonalityClientProps) {
  const isNarrow = useIsNarrow();

  // -------------------------------------------------------
  // INPUT
  // -------------------------------------------------------

  const [birthDate, setBirthDate] =
    useState('');

  const [birthTime, setBirthTime] =
    useState('');

  const [unknownTime, setUnknownTime] =
    useState(true);

  const [gender, setGender] =
    useState<ChildGender>('female');

  // -------------------------------------------------------
  // RESULT
  // -------------------------------------------------------

  const [step, setStep] =
    useState<ChildPersonalityStep>(
      initialData ? 'result' : 'landing',
    );

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<ChildPersonalityResult | null>(
      initialData ?? null,
    );

  const resultCardRef =
    useRef<HTMLDivElement>(null);

  // -------------------------------------------------------
  // URL
  // -------------------------------------------------------

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : '';

  const shareUrl = origin;

  // -------------------------------------------------------
  // SHARE
  // -------------------------------------------------------

  const {
    saving,
    handleSave,
  } = useShareActions({
    featureType: 'child_personality',
    resultId: '',
    getShareText: () => shareUrl,
    imageFilename: '우리아이사용설명서_결과.png',
    onSave: () =>
      incrementTestStat(
        'child-personality',
        'share',
      ),
  });

  // =======================================================
  // LOCAL CACHE
  // =======================================================

  useEffect(() => {
    const cached =
      loadSelfSaju(
        'child_personality_saju',
      );

    if (!cached) return;

    if (typeof cached.birthDate === 'string') {
      setBirthDate(cached.birthDate);
    }

    if (typeof cached.birthTime === 'string') {
      setBirthTime(cached.birthTime);
    }

    if (
      cached.unknownTime !== undefined
    ) {
      setUnknownTime(
        cached.unknownTime,
      );
    }

    if (
      cached.gender === 'female' ||
      cached.gender === 'male'
    ) {
      setGender(cached.gender);
    }
  }, []);

  // =======================================================
  // SAVE INPUT CACHE
  // =======================================================

  useEffect(() => {
    saveSelfSaju(
      'child_personality_saju',
      {
        birthDate,
        birthTime,
        unknownTime,
        gender,
      },
    );
  }, [
    birthDate,
    birthTime,
    unknownTime,
    gender,
  ]);

  // =======================================================
  // FORM VALIDATION
  // =======================================================

  const isFormValid =
    useCallback(() => {
      const numbers =
        birthDate.replace(
          /[^\d]/g,
          '',
        );

      if (numbers.length !== 8) {
        return false;
      }

      const parts =
        birthDate.split('-');

      if (parts.length !== 3) {
        return false;
      }

      const [
        year,
        month,
        day,
      ] = parts.map(Number);

      if (
        !year ||
        !month ||
        !day
      ) {
        return false;
      }

      if (
        year < 1900 ||
        year > 2100 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) {
        return false;
      }

      const date =
        new Date(
          year,
          month - 1,
          day,
        );

      if (
        date.getFullYear() !== year ||
        date.getMonth() !==
          month - 1 ||
        date.getDate() !== day
      ) {
        return false;
      }

      if (
        !birthTime &&
        !unknownTime
      ) {
        return false;
      }

      return true;
    }, [
      birthDate,
      birthTime,
      unknownTime,
    ]);

  // =======================================================
  // TIME SELECT
  // =======================================================

  const handleTimeSelect =
    useCallback(
      (
        displayTime: string,
        isUnknown: boolean,
      ) => {
        setUnknownTime(
          isUnknown,
        );

        setBirthTime(
          displayTime,
        );
      },
      [],
    );

  // =======================================================
  // ANALYZE
  // =======================================================

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    const hasValidTime =
      birthTime.includes('오전') ||
      birthTime.includes('오후');

    const effectiveUnknownTime =
      unknownTime || !hasValidTime;

    if (effectiveUnknownTime && !unknownTime) {
      setUnknownTime(true);
      setBirthTime('오후 12:00');
    }

    trackEvent('child_personality_input_start');

    setStep('analyzing');
    setError(null);

    const minDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, 1800),
    );

    try {
      const analyzePromise = fetch(getEdgeFunctionUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(SUPABASE_ANON_KEY
            ? {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              }
            : {}),
        },
        body: JSON.stringify({
          mode: 'analyze',
          birthday: birthDate.replace(/[^\d]/g, ''),
          birthTime: effectiveUnknownTime
            ? '오후 12:00'
            : birthTime,
          birthTimeUnknown: effectiveUnknownTime,
          gender,
          calendarType: 'solar',
        }),
      });

      const [response] = await Promise.all([
        analyzePromise,
        minDelay,
      ]);

      const analyzeData = await response.json();

      if (!response.ok || !analyzeData.success) {
        throw new Error(
          analyzeData.error || '사주 분석에 실패했습니다.',
        );
      }

      if (
        !analyzeData.sajuData ||
        typeof analyzeData.sajuData !== 'object'
      ) {
        throw new Error(
          '사주 데이터를 받아오지 못했습니다.',
        );
      }

      const rawProfile = analyzeChild(analyzeData.sajuData);

      if (!rawProfile) {
        throw new Error(
          '아이 성향 분석 결과를 생성하지 못했습니다.',
        );
      }

      setResult(rawProfile);

      trackEvent('child_personality_result', {
        title: 'unknown',
      });

      setStep('result');
    } catch (err) {
      console.error('우리 아이 성향 분석 실패:', err);

      setError(
        err instanceof Error
          ? err.message
          : '분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      );

      setStep('input');
    }
  };

  // =======================================================
  // RESET
  // =======================================================

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep('input');
  };

  // =======================================================
  // TEST STAT
  // =======================================================

  useEffect(() => {
    if (
      step !== 'result' ||
      !result
    ) {
      return;
    }

    incrementTestStat(
      'child-personality',
      'play',
    );
  }, [
    step,
    result,
  ]);

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className="h-dvh flex justify-center"
      style={{
        backgroundColor: PAGE_BG,
        color: TEXT_COLOR,
      }}
    >
      <div className="w-full h-full flex flex-col max-w-110 md:max-w-150">
        <div className="flex-1 overflow-auto w-full">

          {/* 상단 네비게이션 */}

          <TestTopNav
            bgColor={PAGE_BG}
            logoColor={THEME_COLOR}
            xColor={TEXT_COLOR}
          />

          <AnimatePresence mode="wait">

            {/* LANDING */}
            {step === 'landing' && (
              <ChildPersonalityLanding
                key="landing"
                onStart={() =>
                  setStep('input')
                }
              />
            )}

            {/* INPUT */}
            {step === 'input' && (
              <ChildBirthInput
                key="input"
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
              />
            )}

            {/* ANALYZING */}
            {step === 'analyzing' && (
              <ChildAnalyzing
                key="analyzing"
              />
            )}

            {/* RESULT */}
            {step === 'result' &&
              result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: isNarrow ? '0px 8px 48px' : '0px 12px 48px',
                    gap: '16px',
                  }}
                >
                  {/* 결과 카드 */}
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '430px' }}>
                      <ChildResultCard
                        imageUrl="/child-personality/images/baby_bear.png"
                        ref={resultCardRef}
                        result={result}
                      />
                    </div>
                  </div>

                  {/* 액션 영역 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    style={{
                      width: '100%',
                      maxWidth: '430px',
                      margin: '0 auto', 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <PressableButton
                        onClick={handleReset}
                        label="다시하기"
                        style={{ flex: 1, height: '48px' }}
                        bgStyle={{
                          backgroundColor: CARD_BG,
                          borderRadius: '12px',
                          border: `1.5px solid ${BORDER_COLOR}`,
                        }}
                        textStyle={{
                          color: THEME_COLOR,
                          fontSize: '15px',
                          fontWeight: 700,
                        }}
                      />

                      <PressableButton
                        onClick={() => handleSave(resultCardRef)}
                        label={saving ? '저장 중...' : '이미지 저장'}
                        disabled={saving}
                        style={{ flex: 1, height: '48px' }}
                        bgStyle={{
                          backgroundColor: THEME_COLOR,
                          borderRadius: '12px',
                          border: 'none',
                        }}
                        hoverBackground="#d87b61"
                        textStyle={{
                          color: '#ffffff',
                          fontSize: '15px',
                          fontWeight: 700,
                        }}
                      />
                    </div>

                    <OutlineBoxButton
                      onClick={() => {
                        trackSajuGPTClick('child_personality', '');
                        window.open(SAJUGPT_URL, '_blank');
                      }}
                      height="48px"
                      color={THEME_COLOR}
                      background={CARD_BG}
                      border={`1.5px solid ${BORDER_COLOR}`}
                      borderRadius="12px"
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          letterSpacing: '-0.3px',
                          fontWeight: 700,
                          color: TEXT_COLOR,
                        }}
                      >
                        내 사주 고민, 사주GPT에게 물어보기
                      </span>
                    </OutlineBoxButton>

                    <div style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                      <ShareRow
                        shareContent={{
                          featureType: 'child_personality',
                          title: '🧸 우리 아이 사용설명서 결과는?',
                          description: '우리 아이의 본질적인 성향과 맞춤형 소통법을 확인해보세요!',
                          shareUrl,
                          imageUrl: origin ? `${origin}/child-personality/og-share.png` : '/child-personality/og-share.png',
                          testId: 'child-personality',
                        }}
                        copyColor={THEME_COLOR}
                        copyHoverColor="#d87b61"
                        copyIconColor="#ffffff"
                      />
                    </div>
                  </motion.div>

                  {/* 하단 커뮤니티 */}
                  <div style={{ marginTop: '8px' }}>
                    <ResultFooterSections
                      excludeId="child-personality"
                      titleStyle={{
                        fontSize: '16px',
                        fontWeight: 700,
                        letterSpacing: '-0.9px',
                        color: TEXT_COLOR,
                        paddingLeft: '2px',
                      }}
                      cardBg="#fffdfa"
                      cardTitleColor={TEXT_COLOR}
                      featureType="child_personality"
                      resultId=""
                      storageKey="child_personality_liked_comments"
                      placeholder="우리 아이 양육 팁에 대해 이야기해봐요 :)"
                      themeColor={THEME_COLOR}
                      inputBg={CARD_BG}
                      disabledBg={BORDER_COLOR}
                      shareToRecommendGap={24}
                      dark={false}
                    />
                  </div>
                </motion.div>
              )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}