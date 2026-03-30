'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gender, Step, BattleResult, ChallengerPreview } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import BirthTimeInput from '@/components/BirthTimeInput';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import ResultCard from '@/components/ResultCard';
import ShareButtons from '@/components/ShareButtons';
import BattleVSCard from '@/components/BattleVSCard';
import CutScene from '@/components/CutScene';
import OnboardingLanding from '@/components/OnboardingLanding';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { parseUTM, trackEvent } from '@/lib/analytics';
import { loadSelfSaju, saveSelfSaju, removeSelfSaju } from '@/lib/sajuCache';

interface Props {
  battleId?: string;
  challengerPreview?: ChallengerPreview | null;
}

/** 24시간 형식으로 변환: "오후 02:30" → "1430" */
function convertTo24Hour(time: string): string {
  const match = time.match(/^(오전|오후)\s(\d{2}):(\d{2})$/);
  if (!match) return '0000';
  const period = match[1];
  let hour = Number(match[2]);
  const minute = match[3];
  if (period === '오전') {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }
  return `${String(hour).padStart(2, '0')}${minute}`;
}

export default function SexyBattleClient({ battleId, challengerPreview }: Props) {
  const isBattleAccept = !!battleId && !!challengerPreview;
  // 입력 상태 — 공통 캐시 복원
  const cached = typeof window !== 'undefined' ? loadSelfSaju() : null;
  const [birthDate, setBirthDate] = useState(cached?.birthDate ?? '');
  const [birthTime, setBirthTime] = useState(cached?.birthTime ?? '');
  const [unknownTime, setUnknownTime] = useState(cached?.unknownTime ?? false);
  const [gender, setGender] = useState<Gender>(cached?.gender ?? 'female');

  // 플로우 상태 — UTM이나 배틀 수락이면 입력 폼으로 바로 진입
  const [step, setStep] = useState<Step>(battleId ? 'input' : 'landing');
  const [result, setResult] = useState<BattleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCutScene, setShowCutScene] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const vsCardRef = useRef<HTMLDivElement>(null);
  const birthTimeRef = useRef<HTMLDivElement>(null);

  // UTM 자동입력 — 파라미터 있으면 landing 스킵하고 입력폼 직행
  useEffect(() => {
    const utm = parseUTM();
    let hasUTM = false;
    if (utm.birthday && utm.birthday.length >= 8) {
      hasUTM = true;
      const y = utm.birthday.slice(0, 4);
      const m = utm.birthday.slice(4, 6);
      const d = utm.birthday.slice(6, 8);
      setBirthDate(`${y}-${m}-${d}`);
      if (utm.birthday.length >= 12) {
        const h = Number(utm.birthday.slice(8, 10));
        const mi = utm.birthday.slice(10, 12);
        const period = h < 12 ? '오전' : '오후';
        const displayH = h === 0 ? 12 : (h > 12 ? h - 12 : h);
        setBirthTime(`${period} ${String(displayH).padStart(2, '0')}:${mi}`);
      }
    }
    if (utm.gender) {
      hasUTM = true;
      setGender(utm.gender === 'male' ? 'male' : 'female');
    }
    if (hasUTM) {
      setStep('input');
      trackEvent('sexy_battle_land');
    }
  }, []);

  // 입력값 변경 시 공통 캐시에 저장
  useEffect(() => {
    saveSelfSaju({ birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);


  // 유효성 검증 — 태어난 시간은 선택사항
  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const [year, month, day] = birthDate.split('-').map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    return true;
  }, [birthDate]);

  // 모르겠어요 토글
  const handleUnknownTimeToggle = useCallback(() => {
    const newValue = !unknownTime;
    setUnknownTime(newValue);
    if (newValue) {
      setBirthTime('오후 12:00');
    } else {
      setBirthTime('');
    }
  }, [unknownTime]);

  // 분석 요청
  const handleSubmit = useCallback(async () => {
    if (!isFormValid() || submitting) return;

    // 태어난 시간 미입력 시 자동으로 '모르겠어요' 처리 → 오후 12:00
    const hasValidTime = birthTime.includes('오전') || birthTime.includes('오후');
    const effectiveUnknownTime = unknownTime || !hasValidTime;
    if (effectiveUnknownTime && !unknownTime) {
      setUnknownTime(true);
      setBirthTime('오후 12:00');
    }

    trackEvent('sexy_battle_input_start');
    setStep('analyzing');
    setError(null);
    setSubmitting(true);

    // birthday를 YYYYMMDDHHMM 형식으로
    const numbers = birthDate.replace(/[^\d]/g, '');
    const hhmm = effectiveUnknownTime ? '1200' : convertTo24Hour(birthTime);
    const birthday = `${numbers}${hhmm}`;

    const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const [data] = await Promise.all([
        callEdgeFunction<BattleResult>('analyze-sexy-battle', {
          birthday,
          gender,
          birthTimeUnknown: effectiveUnknownTime,
          battleId: battleId ?? null,
        }),
        minDelay,
      ]);

      setResult(data);
      trackEvent('sexy_battle_result', { headcount: data.headcount, grade: data.grade });

      if (data.battle) {
        trackEvent('sexy_battle_invite_accept', { headcount: data.headcount, grade: data.grade });
        setStep('battleResult');
      } else {
        if (data.headcount === 0) {
          setShowCutScene(true);
        }
        setStep('result');
      }
    } catch (err) {
      console.error('분석 실패:', err);
      setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    } finally {
      setSubmitting(false);
    }
  }, [isFormValid, submitting, birthDate, unknownTime, birthTime, gender, battleId]);

  // 다시하기
  const handleReset = useCallback(() => {
    setStep('landing');
    setResult(null);
    setError(null);
    setShowCutScene(false);
    setBirthDate('');
    setBirthTime('');
    setUnknownTime(false);
    setGender('female');
    setSubmitting(false);
    removeSelfSaju();
  }, []);

  return (
    <div className="flex justify-center" style={{ minHeight: '100dvh', backgroundColor: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <AnimatePresence mode="wait">
          {/* ─── LANDING STEP ─── */}
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OnboardingLanding
                onStart={() => {
                  trackEvent('sexy_battle_land');
                  setStep('input');
                }}
              />
            </motion.div>
          )}

          {/* ─── INPUT STEP ─── */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ padding: '48px 20px 120px' }}
            >
              {/* 헤더 */}
              <div className="flex flex-col items-center" style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '40px', marginBottom: '8px' }}>🔥</span>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#151515', marginBottom: '8px', textAlign: 'center', letterSpacing: '-0.56px' }}>
                  색기 배틀
                </h1>
                {isBattleAccept ? (
                  <div className="flex flex-col items-center" style={{ gap: '8px' }}>
                    <p style={{ fontSize: '15px', color: '#666', fontWeight: 500, textAlign: 'center', lineHeight: '1.6', letterSpacing: '-0.45px' }}>
                      친구한테 도발장이 날아왔어요
                    </p>
                    <div
                      style={{
                        padding: '12px 20px',
                        borderRadius: '12px',
                        backgroundColor: '#F7F2FA',
                        border: '1px solid #E8DCF5',
                      }}
                    >
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#7A38D8', textAlign: 'center', letterSpacing: '-0.32px' }}>
                        "나는 {challengerPreview!.headcount}명 꼬이는데, 넌?"
                      </p>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '15px', color: '#666', fontWeight: 500, textAlign: 'center', lineHeight: '1.6', letterSpacing: '-0.45px' }}>
                    얼굴 가리고<br />사주만으로 남자를 홀려보세요
                  </p>
                )}
              </div>

              {/* 입력 폼 — 나다운세 MansePage 스타일 */}
              <motion.div
                className="flex flex-col"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {/* 성별 */}
                <motion.div
                  className="flex flex-col gap-1 w-full"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', lineHeight: '16px', letterSpacing: '-0.24px', padding: '0 4px' }}>
                    성별
                  </p>
                  <GenderSelect value={gender} onChange={setGender} />
                </motion.div>

                {/* 생년월일 */}
                <motion.div
                  className="flex flex-col gap-1 w-full"
                  style={{ marginTop: '36px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', lineHeight: '16px', letterSpacing: '-0.24px', padding: '0 4px' }}>
                    생년월일 (양력 기준으로 입력해 주세요)
                  </p>
                  <BirthInput
                    value={birthDate}
                    onChange={setBirthDate}
                    onComplete={() => {
                      // 시간 입력으로 포커스 이동
                      const timeInput = birthTimeRef.current?.querySelector('input');
                      if (timeInput) setTimeout(() => timeInput.focus(), 100);
                    }}
                  />
                </motion.div>

                {/* 태어난 시간 */}
                <motion.div
                  ref={birthTimeRef}
                  className="flex flex-col gap-1 w-full"
                  style={{ marginTop: '36px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', lineHeight: '16px', letterSpacing: '-0.24px', padding: '0 4px' }}>
                    태어난 시간
                  </p>
                  <BirthTimeInput
                    value={birthTime}
                    onChange={setBirthTime}
                    unknownTime={unknownTime}
                    onUnknownTimeToggle={handleUnknownTimeToggle}
                  />
                </motion.div>

                {/* 에러 */}
                {error && (
                  <motion.div
                    className="flex gap-1 items-center"
                    style={{
                      marginTop: '24px',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                    }}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                  >
                    <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>
                  </motion.div>
                )}
              </motion.div>

              {/* 하단 고정 CTA 버튼 — 나다운세 패턴 */}
              <div
                className="fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-start w-full z-10"
                style={{
                  maxWidth: '440px',
                  backgroundColor: '#fff',
                  boxShadow: '0px -8px 16px 0px rgba(255,255,255,0.76)',
                  paddingBottom: 'env(safe-area-inset-bottom)',
                }}
              >
                <div style={{ padding: '12px 20px', width: '100%' }}>
                  <motion.div
                    onClick={handleSubmit}
                    className="transform-gpu"
                    whileTap={isFormValid() && !submitting ? { scale: 0.96 } : {}}
                    transition={{ duration: 0.1, ease: 'easeInOut' }}
                    style={{
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: isFormValid() && !submitting ? '#7A38D8' : '#f8f8f8',
                      cursor: isFormValid() && !submitting ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: '25px',
                      letterSpacing: '-0.32px',
                      color: isFormValid() && !submitting ? '#fff' : '#b7b7b7',
                      whiteSpace: 'nowrap',
                    }}>
                      {submitting ? '분석 중...' : isBattleAccept ? '배틀 도전하기' : '내 페로몬 등급 확인하기'}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ANALYZING STEP ─── */}
          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalyzingScreen />
            </motion.div>
          )}

          {/* ─── RESULT STEP ─── */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ padding: '24px 20px 48px' }}
            >
              {showCutScene && result.headcount === 0 ? (
                <CutScene onComplete={() => setShowCutScene(false)} />
              ) : (
                <>
                  <div className="flex justify-center" style={{ marginBottom: '24px' }}>
                    <ResultCard ref={cardRef} result={result} />
                  </div>
                  <ShareButtons headcount={result.headcount} battleId={result.battleId} cardRef={cardRef} />
                  <div style={{ padding: '0 20px', marginTop: '12px' }}>
                    <button
                      onClick={handleReset}
                      style={{
                        width: '100%',
                        height: '56px',
                        borderRadius: '16px',
                        backgroundColor: 'transparent',
                        color: '#999',
                        fontSize: '15px',
                        fontWeight: 700,
                        border: '1px solid #e7e7e7',
                        cursor: 'pointer',
                      }}
                    >
                      다시 해보기
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
          {/* ─── BATTLE RESULT STEP ─── */}
          {step === 'battleResult' && result?.battle && (
            <motion.div
              key="battleResult"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ padding: '24px 20px 48px' }}
            >
              {/* VS 비교 카드 */}
              <div className="flex justify-center" style={{ marginBottom: '24px' }}>
                <BattleVSCard ref={vsCardRef} battle={result.battle} />
              </div>

              {/* 내 개인 결과 카드 */}
              <div className="flex justify-center" style={{ marginBottom: '24px' }}>
                <ResultCard ref={cardRef} result={result} />
              </div>

              {/* 공유 버튼 */}
              <ShareButtons headcount={result.headcount} battleId={result.battleId} cardRef={vsCardRef} />

              <div style={{ padding: '0 20px', marginTop: '12px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'transparent',
                    color: '#999',
                    fontSize: '15px',
                    fontWeight: 700,
                    border: '1px solid #e7e7e7',
                    cursor: 'pointer',
                  }}
                >
                  다시 해보기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
