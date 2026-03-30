'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gender, StockStep, StockAnalysisResult, RelationshipStatus, UserChoice, UserChoices } from '@/types/stock';
import StockLanding from '@/components/stock/StockLanding';
import StockInput from '@/components/stock/StockInput';
import StockAnalyzing from '@/components/stock/StockAnalyzing';
import StockReportCard from '@/components/stock/StockReportCard';
import StockBriefing from '@/components/stock/StockBriefing';
import StockTurn from '@/components/stock/StockTurn';
import StockPlanCard from '@/components/stock/StockPlanCard';
import StockResult from '@/components/stock/StockResult';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { parseUTM, trackEvent } from '@/lib/analytics';

interface Props {
  stockId?: string;
}

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

export default function StockClient({ stockId }: Props) {
  // 입력 상태
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<Gender>('female');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>('single');

  // 플로우 상태
  const [step, setStep] = useState<StockStep>('landing');
  const [result, setResult] = useState<StockAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 턴제 유저 선택
  const [userChoices, setUserChoices] = useState<UserChoices>({
    turn1: null, turn2: null, turn3: null, turn4: null,
  });

  const reportCardRef = useRef<HTMLDivElement>(null);
  const planCardRef = useRef<HTMLDivElement>(null);

  // UTM 자동입력
  useEffect(() => {
    const utm = parseUTM();
    if (utm.birthday && utm.birthday.length >= 8) {
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
        setUnknownTime(false);
      }
      trackEvent('stock_land_utm');
      setStep('input');
    }
    if (utm.gender) {
      setGender(utm.gender === 'male' ? 'male' : 'female');
    }
  }, []);

  // 유효성 검증
  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const [year, month, day] = birthDate.split('-').map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    if (!unknownTime) {
      if (!birthTime.includes('오전') && !birthTime.includes('오후')) return false;
    }
    return true;
  }, [birthDate, unknownTime, birthTime]);

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

    trackEvent('stock_submit');
    setStep('analyzing');
    setError(null);
    setSubmitting(true);

    const numbers = birthDate.replace(/[^\d]/g, '');
    const hhmm = unknownTime ? '0000' : convertTo24Hour(birthTime);
    const birthday = `${numbers}${hhmm}`;

    const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const [data] = await Promise.all([
        callEdgeFunction<StockAnalysisResult>('analyze-saju-stock', {
          birthday,
          gender,
          birthTimeUnknown: unknownTime,
          relationshipStatus,
        }),
        minDelay,
      ]);

      setResult(data);
      trackEvent('stock_result', {
        currentPrice: data.stockReport.currentPrice,
        opinion: data.stockReport.investmentOpinion,
      });
      setStep('report');
    } catch (err) {
      console.error('주가 조작단 분석 실패:', err);
      setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    } finally {
      setSubmitting(false);
    }
  }, [isFormValid, submitting, birthDate, unknownTime, birthTime, gender, relationshipStatus]);

  // 턴 선택 핸들러
  const handleTurnChoice = useCallback((turn: keyof UserChoices, choice: UserChoice) => {
    setUserChoices(prev => ({ ...prev, [turn]: choice }));

    const nextSteps: Record<string, StockStep> = {
      turn1: 'turn2',
      turn2: 'turn3',
      turn3: 'turn4',
      turn4: 'plan',
    };
    // 약간의 딜레이 후 다음 턴으로
    setTimeout(() => setStep(nextSteps[turn] as StockStep), 600);
  }, []);

  // 다시하기
  const handleReset = useCallback(() => {
    setStep('landing');
    setResult(null);
    setError(null);
    setBirthDate('');
    setBirthTime('');
    setUnknownTime(false);
    setGender('female');
    setRelationshipStatus('single');
    setSubmitting(false);
    setUserChoices({ turn1: null, turn2: null, turn3: null, turn4: null });
  }, []);

  return (
    <div className="flex justify-center" style={{ minHeight: '100dvh', backgroundColor: '#0a0a14' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <AnimatePresence mode="wait">

          {/* ─── LANDING ─── */}
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StockLanding onStart={() => setStep('input')} />
            </motion.div>
          )}

          {/* ─── INPUT ─── */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StockInput
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                birthTime={birthTime}
                setBirthTime={setBirthTime}
                unknownTime={unknownTime}
                onUnknownTimeToggle={handleUnknownTimeToggle}
                gender={gender}
                setGender={setGender}
                relationshipStatus={relationshipStatus}
                setRelationshipStatus={setRelationshipStatus}
                isFormValid={isFormValid()}
                submitting={submitting}
                error={error}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}

          {/* ─── ANALYZING ─── */}
          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StockAnalyzing />
            </motion.div>
          )}

          {/* ─── REPORT ─── */}
          {step === 'report' && result && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
              style={{ minHeight: '100dvh', padding: '0 20px', paddingBottom: '120px' }}
            >
              <div style={{ height: '48px' }} />
              <StockReportCard ref={reportCardRef} report={result.stockReport} />

              {/* 하단 버튼 */}
              <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '440px',
                padding: '16px 20px',
                paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                background: 'linear-gradient(transparent, #0a0a14 30%)',
              }}>
                <button
                  onClick={() => setStep('briefing')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    backgroundColor: '#7A38D8',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '-0.32px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  이 주가, 이대로 두실 겁니까?
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── BRIEFING ─── */}
          {step === 'briefing' && result && (
            <motion.div
              key="briefing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StockBriefing
                briefing={result.discussion.briefing}
                onStart={() => setStep('turn1')}
              />
            </motion.div>
          )}

          {/* ─── TURN 1 ─── */}
          {step === 'turn1' && result && (
            <motion.div
              key="turn1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <StockTurn
                turnData={result.discussion.turn1}
                onChoice={(choice) => handleTurnChoice('turn1', choice)}
              />
            </motion.div>
          )}

          {/* ─── TURN 2 ─── */}
          {step === 'turn2' && result && userChoices.turn1 && (
            <motion.div
              key="turn2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <StockTurn
                turnData={result.discussion.turn2[userChoices.turn1]}
                onChoice={(choice) => handleTurnChoice('turn2', choice)}
              />
            </motion.div>
          )}

          {/* ─── TURN 3 ─── */}
          {step === 'turn3' && result && (
            <motion.div
              key="turn3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <StockTurn
                turnData={result.discussion.turn3}
                onChoice={(choice) => handleTurnChoice('turn3', choice)}
              />
            </motion.div>
          )}

          {/* ─── TURN 4 ─── */}
          {step === 'turn4' && result && (
            <motion.div
              key="turn4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <StockTurn
                turnData={result.discussion.turn4}
                onChoice={(choice) => handleTurnChoice('turn4', choice)}
              />
            </motion.div>
          )}

          {/* ─── PLAN ─── */}
          {step === 'plan' && result && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
              style={{ minHeight: '100dvh', padding: '0 20px', paddingBottom: '120px' }}
            >
              <div style={{ height: '48px' }} />
              <StockPlanCard ref={planCardRef} plan={result.operationPlan} />

              <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '440px',
                padding: '16px 20px',
                paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                background: 'linear-gradient(transparent, #0a0a14 30%)',
              }}>
                <button
                  onClick={() => setStep('result')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    backgroundColor: '#7A38D8',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '-0.32px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  공유하기
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── RESULT ─── */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StockResult
                result={result}
                reportCardRef={reportCardRef}
                onReset={handleReset}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
