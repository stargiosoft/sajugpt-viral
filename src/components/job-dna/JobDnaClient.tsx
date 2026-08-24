'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Gender } from '@/types/battle';
import TestTopNav from '@/components/TestTopNav';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import PressableButton from '@/components/PressableButton';
import ShareRow from '@/components/ShareRow';
import ResultFooterSections from '@/components/ResultFooterSections';

import JobDnaLanding from './JobDnaLanding';
import JobDnaInput from './JobDnaInput';
import JobDnaAnalyzing from './JobDnaAnalyzing';
import JobDnaResultCard from './JobDnaResultCard';

import { generateJobDnaResult, fetchJobDnaResultById } from '@/lib/jobDna';
import { trackEvent } from '@/lib/analytics';
import { incrementTestStat } from '@/lib/testStats';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { useShareActions } from '@/lib/useShareActions';
import { SAJUGPT_URL } from '@/constants/links';
import { trackSajuGPTClick } from '@/lib/analytics';
import useIsNarrow from '@/hooks/useIsNarrow';

type JobDnaStep = 'landing' | 'input' | 'analyzing' | 'result';

const THEME_YELLOW = '#ffab00';

export default function JobDnaClient({ resultId: propResultId, initialData }: { resultId?: string; initialData?: any }) {
  const router = useRouter();
  const isNarrow = useIsNarrow();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(true);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<JobDnaStep>(initialData ? 'result' : 'landing');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(initialData || null);

  const resultCardRef = useRef<HTMLDivElement>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentResultId = result?.resultId || propResultId || '';
  const shareUrl = origin && currentResultId ? `${origin}/job-dna/${currentResultId}` : origin;

  const { saving, handleSave } = useShareActions({
    featureType: 'job_dna',
    resultId: currentResultId,
    getShareText: () => shareUrl,
    imageFilename: `직업운DNA_${currentResultId}.png`,
    onSave: () => incrementTestStat('job-dna', 'share'),
  });

  // 로컬 캐시에서 입력값 불러오기
  useEffect(() => {
    const cached = loadSelfSaju('job_dna_saju');
    if (cached) {
      if (cached.birthDate) setBirthDate(cached.birthDate);
      if (cached.birthTime) setBirthTime(cached.birthTime);
      if (cached.unknownTime !== undefined) setUnknownTime(cached.unknownTime);
      if (cached.gender) setGender(cached.gender);
    }
  }, []);

  // resultId가 존재하고 initialData가 없을 경우 서버/DB에서 결과 조회
  useEffect(() => {
    if (!propResultId || initialData) return;

    let isMounted = true;
    setStep('analyzing');

    fetchJobDnaResultById(propResultId)
      .then((data) => {
        if (isMounted && data) {
          setResult(data);
          setStep('result');
        } else if (isMounted) {
          setStep('landing');
        }
      })
      .catch((err) => {
        console.error('직업운 DNA 결과 조회 실패:', err);
        if (isMounted) setStep('landing');
      });

    return () => {
      isMounted = false;
    };
  }, [propResultId, initialData]);

  // 입력값 변경 시 로컬 캐시 저장
  useEffect(() => {
    saveSelfSaju('job_dna_saju', { birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);

  // 폼 검증 로직
  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const parts = birthDate.split('-');
    if (parts.length !== 3) return false;
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
    if (!birthTime && !unknownTime) return false;
    return true;
  }, [birthDate, birthTime, unknownTime]);

  const handleTimeSelect = useCallback((displayTime: string, isUnknown: boolean) => {
    setUnknownTime(isUnknown);
    setBirthTime(displayTime);
  }, []);

  // 제출 핸들러 (분석 실행)
  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const hasValidTime = birthTime.includes('오전') || birthTime.includes('오후');
    const effectiveUnknownTime = unknownTime || !hasValidTime;
    if (effectiveUnknownTime && !unknownTime) {
      setUnknownTime(true);
      setBirthTime('오후 12:00');
    }

    trackEvent('job_dna_input_start');
    setStep('analyzing');
    setError(null);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const [generated] = await Promise.all([
        generateJobDnaResult(
          birthDate,
          effectiveUnknownTime ? '오후 12:00' : birthTime,
          effectiveUnknownTime,
          gender
        ),
        minDelay,
      ]);

      if (!generated || !generated.payload) {
        throw new Error('올바른 결과를 받아오지 못했습니다.');
      }

      setResult(generated);
      trackEvent('job_dna_result', {
        sipseongGroup: generated.payload.page1?.groupKey || 'unknown',
        ohaengElement: generated.payload.page2?.elementKey || 'unknown',
      });
      setStep('result');

      if (generated.resultId) {
        window.history.pushState({}, '', `/job-dna/${generated.resultId}`);
      }
    } catch (err) {
      console.error('직업운 DNA 분석 실패:', err);
      setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep('input');
    window.history.pushState({}, '', '/job-dna');
  };

  // 통계 증가 트래킹
  useEffect(() => {
    if (propResultId) return;
    if (step !== 'result' || !result) return;
    incrementTestStat('job-dna', 'play');
  }, [step, result, propResultId]);

  return (
    <div 
      className="h-dvh flex justify-center" 
      style={{ backgroundColor: '#fffbf0', color: '#1e1409' }}
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GabiaSolmee.woff');

        @font-face {
            font-family: 'GabiaSolmi';
            src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GabiaSolmee.woff') format('woff');
            font-weight: normal;
            font-display: swap;
        }

        /* 결과 화면 영역에만 커스텀 폰트 적용 */
        .job-dna-result-wrapper,
        .job-dna-result-wrapper * {
          font-family: 'GabiaSolmi', cursive, sans-serif !important;
        }
      `}</style>

      <div className="w-full h-full flex flex-col max-w-110 md:max-w-150">
        <div className="flex-1 overflow-auto w-full">
          {/* 상단 네비게이션바 (기존 폰트 유지) */}
          <TestTopNav bgColor="#fffbf0" logoColor={THEME_YELLOW} xColor="#1e1409" />

          <AnimatePresence mode="wait">
            {step === 'landing' && <JobDnaLanding key="landing" onStart={() => setStep('input')} />}

            {step === 'input' && (
              <JobDnaInput
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

            {step === 'analyzing' && <JobDnaAnalyzing key="analyzing" />}

            {step === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col job-dna-result-wrapper"
                style={{ padding: isNarrow ? '0px 8px 48px' : '0px 12px 48px', gap: '16px' }}
              >
                <JobDnaResultCard 
                  ref={resultCardRef} 
                  page1={result.payload.page1} 
                  page2={result.payload.page2} 
                />

                {/* 액션 버튼 그룹 및 하단 영역 */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  {/* 1. 다시하기 & 이미지 저장 버튼 그룹 */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <PressableButton
                      onClick={handleReset}
                      label="다시하기"
                      style={{ flex: 1, height: '48px' }}
                      bgStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2d9ce' }}
                      textStyle={{ color: THEME_YELLOW, fontSize: '15px', fontWeight: 700 }}
                    />
                    <PressableButton
                      onClick={() => handleSave(resultCardRef)}
                      label={saving ? '저장 중...' : '이미지 저장'}
                      disabled={saving}
                      style={{ flex: 1, height: '48px' }}
                      bgStyle={{ backgroundColor: THEME_YELLOW, borderRadius: '12px', border: 'none' }}
                      hoverBackground="#e09600"
                      textStyle={{ color: '#1e1409', fontSize: '15px', fontWeight: 700 }}
                    />
                  </div>

                  {/* 2. 사주GPT 링크 배너 */}
                  <OutlineBoxButton
                    onClick={() => {
                      trackSajuGPTClick('job_dna', currentResultId);
                      window.open(SAJUGPT_URL, '_blank');
                    }}
                    height="48px"
                    color={THEME_YELLOW}
                    background="#ffffff"
                    border="1px solid #e2d9ce"
                    borderRadius="12px"
                  >
                    <span style={{ fontSize: '13px', letterSpacing: '-0.3px', fontWeight: 700, color: '#1e1409' }}>
                      내 사주 고민, 사주GPT에게 물어보기
                    </span>
                  </OutlineBoxButton>

                  {/* 3. 소셜 공유 영역 (ShareRow) */}
                  <div style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                    <ShareRow
                      shareContent={{
                        featureType: 'job_dna',
                        title: `✨ 나의 사주 직업운 DNA 결과는?`,
                        description: `나의 직업 DNA는 '${result.payload.page1?.group || '전문가'} × ${result.payload.page2?.element || ''}'! 지금 확인해보세요.`,
                        shareUrl,
                        imageUrl: origin ? `${origin}/job-dna/og-share.png` : '/job-dna/og-share.png',
                        testId: 'job-dna',
                      }}
                      copyColor={THEME_YELLOW}
                      copyHoverColor="#e09600"
                      copyIconColor="#1e1409"
                    />
                  </div>
                </motion.div>

                {/* 4. 하단 커뮤니티 및 댓글 섹션 */}
                <div style={{ marginTop: '8px' }}>
                  <ResultFooterSections
                    excludeId="job-dna"
                    titleStyle={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.9px', color: '#1e1409', paddingLeft: '2px' }}
                    cardBg="#fffdfa"
                    cardTitleColor="#1e1409"
                    featureType="job_dna"
                    resultId={currentResultId}
                    storageKey="job_dna_liked_comments"
                    placeholder="내 직업운에 대해 이야기해봐요 :)"
                    themeColor={THEME_YELLOW}
                    inputBg="#ffffff"
                    disabledBg="#e2d9ce"
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