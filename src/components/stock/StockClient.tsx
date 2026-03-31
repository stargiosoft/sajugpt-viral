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
import { parseUTM, trackEvent, trackShare, trackSajuGPTClick } from '@/lib/analytics';
import { copyToClipboard, saveImage } from '@/lib/share';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';

// ─── 공유 버튼 (plan 단계용) ──────────────────────────────
function PlanShareButton({ type, stockId, currentPrice, cardRef }: {
  type: 'copy' | 'save';
  stockId: string;
  currentPrice?: number;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = async () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `📈 내 연애 주가: ${(currentPrice ?? 0).toLocaleString()}원\n주가 조작단이 분석한 내 작전 계획서\n👉 ${baseUrl}/stock/${stockId}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setActive(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setActive(false), 2000);
      trackShare('saju_stock', 'clipboard', stockId);
    }
  };

  const handleSave = async () => {
    if (!cardRef?.current || active) return;
    setActive(true);
    try {
      await saveImage(cardRef.current, '주가조작단_작전계획서.png');
      trackShare('saju_stock', 'image_save', stockId);
    } catch { /* noop */ }
    setActive(false);
  };

  const isCopy = type === 'copy';
  return (
    <button
      onClick={isCopy ? handleCopy : handleSave}
      disabled={!isCopy && active}
      style={{
        flex: 1,
        height: '52px',
        borderRadius: '14px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        backgroundColor: isCopy && active ? '#1a3a1a' : '#1a1a2e',
        color: isCopy && active ? '#4ADE80' : '#ccc',
        border: isCopy && active ? '1px solid #4ADE80' : '1px solid #2a2a3e',
        opacity: !isCopy && active ? 0.6 : 1,
      }}
    >
      {isCopy
        ? (active ? '✅ 복사됨' : '📋 링크 복사')
        : (active ? '저장 중...' : '📸 이미지 저장')}
    </button>
  );
}

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
    turn1: null, turn2: null, turn3: null,
  });

  const reportCardRef = useRef<HTMLDivElement>(null);
  const planCardRef = useRef<HTMLDivElement>(null);

  // 캐시 복원 (클라이언트 마운트 후)
  useEffect(() => {
    const cached = loadSelfSaju();
    if (cached) {
      if (cached.birthDate) setBirthDate(cached.birthDate);
      if (cached.birthTime) setBirthTime(cached.birthTime);
      if (cached.unknownTime !== undefined) setUnknownTime(cached.unknownTime);
      if (cached.gender) setGender(cached.gender);
    }
  }, []);

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

    trackEvent('stock_submit');
    setStep('analyzing');
    setError(null);
    setSubmitting(true);

    const numbers = birthDate.replace(/[^\d]/g, '');
    const hhmm = effectiveUnknownTime ? '1200' : convertTo24Hour(birthTime);
    const birthday = `${numbers}${hhmm}`;

    const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const [data] = await Promise.all([
        callEdgeFunction<StockAnalysisResult>('analyze-saju-stock', {
          birthday,
          gender,
          birthTimeUnknown: effectiveUnknownTime,
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
      turn3: 'plan',
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
    setUserChoices({ turn1: null, turn2: null, turn3: null });
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

          {/* ─── PLAN ─── */}
          {step === 'plan' && result && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
              style={{ minHeight: '100dvh', padding: '0 20px', paddingBottom: '40px' }}
            >
              <div style={{ height: '48px' }} />
              <StockPlanCard ref={planCardRef} plan={result.operationPlan} />

              <div className="flex flex-col gap-3" style={{ marginTop: '32px' }}>
                <a
                  href="https://www.sajugpt.co.kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSajuGPTClick('saju_stock')}
                  style={{
                    display: 'block',
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
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  3단계 작전 실행하기
                </a>

                <div className="flex gap-3">
                  <PlanShareButton
                    type="copy"
                    stockId={result.id}
                    currentPrice={result.stockReport.currentPrice}
                  />
                  <PlanShareButton
                    type="save"
                    cardRef={planCardRef}
                    stockId={result.id}
                  />
                </div>

                <button
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: '#1a1a2e',
                    color: '#999',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: '1px solid #2a2a3e',
                    cursor: 'pointer',
                  }}
                >
                  다시 해보기
                </button>

                <a
                  href="/"
                  style={{
                    color: '#555',
                    fontSize: '13px',
                    fontWeight: 500,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    textAlign: 'center',
                    marginTop: '4px',
                  }}
                >
                  다른 테스트도 해보기
                </a>
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
