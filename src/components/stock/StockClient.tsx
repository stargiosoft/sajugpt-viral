'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gender, StockStep, StockAnalysisResult, RelationshipStatus, UserChoice, UserChoices } from '@/types/stock';
import TestTopNav from '@/components/TestTopNav';
import PressableButton from '@/components/PressableButton';
import ShareButton from '@/components/ShareButton';
import TextLinkButton from '@/components/TextLinkButton';
import StockLanding from '@/components/stock/StockLanding';
import StockInput from '@/components/stock/StockInput';
import StockAnalyzing from '@/components/stock/StockAnalyzing';
import StockReportCard from '@/components/stock/StockReportCard';
import StockBriefing from '@/components/stock/StockBriefing';
import StockTurn from '@/components/stock/StockTurn';
import StockPlanCard from '@/components/stock/StockPlanCard';
import StockResult from '@/components/stock/StockResult';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { parseUTM, trackEvent, trackShare } from '@/lib/analytics';
import { saveImage } from '@/lib/share';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { parseKoreanTimeTo24Hour } from '@/lib/koreanTime';

// ─── 이미지 저장 버튼 (plan 단계용) — 색기배틀 ShareButtons와 동일한 PressableButton 스타일 ──────────
function PlanSaveImageButton({ stockId, cardRef }: {
  stockId: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      await saveImage(cardRef.current, '주가조작단_작전계획서.png');
      trackShare('saju_stock', 'image_save', stockId);
    } catch { /* noop */ }
    setSaving(false);
  };

  return (
    <PressableButton
      onClick={handleSave}
      disabled={saving}
      label={saving ? '저장 중...' : '이미지 저장'}
      style={{ height: '52px' }}
      bgStyle={{ borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.06)' }}
      hoverBackground="rgba(255,255,255,0.12)"
      textStyle={{ color: '#D1D5DB', fontSize: '14px' }}
    />
  );
}

interface Props {
  stockId?: string;
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

  // 유효성 검증 — 태어난 시간은 명시적으로 선택(모름 포함)해야 함
  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const [year, month, day] = birthDate.split('-').map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    if (!birthTime && !unknownTime) return false;
    return true;
  }, [birthDate, birthTime, unknownTime]);

  // 태어난 시간 선택 (시진 드롭다운)
  const handleTimeSelect = useCallback((displayTime: string, isUnknown: boolean) => {
    setUnknownTime(isUnknown);
    setBirthTime(displayTime);
  }, []);

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
    const hhmm = effectiveUnknownTime ? '1200' : parseKoreanTimeTo24Hour(birthTime);
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
    <div className="fixed inset-0 flex justify-center" style={{ backgroundColor: '#191F28' }}>
      <div className="w-full max-w-[768px] h-full flex flex-col">
        <div className="flex-1 overflow-auto w-full">
        <TestTopNav bgColor="#191F28" />
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
                unknownTime={unknownTime}
                onTimeSelect={handleTimeSelect}
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
              style={{ minHeight: '100dvh', backgroundColor: '#191F28', padding: '0 12px', paddingBottom: '120px' }}
            >
              <div style={{ height: '20px' }} />
              <StockReportCard ref={reportCardRef} report={result.stockReport} />

              {/* 하단 버튼 */}
              <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '768px',
                padding: '16px 12px',
                paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                backgroundColor: '#191F28',
              }}>
                <motion.button
                  onClick={() => setStep('briefing')}
                  whileHover={{ filter: 'brightness(1.08)', transition: { duration: 0.15, ease: 'easeOut' } }}
                  whileTap={{ filter: 'brightness(0.92)', scale: 0.995, transition: { duration: 0.15, ease: 'easeOut' } }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
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
                </motion.button>
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
              style={{ minHeight: '100dvh', padding: '0 12px', paddingBottom: '40px' }}
            >
              <div style={{ height: '20px' }} />
              <StockPlanCard ref={planCardRef} plan={result.operationPlan} />

              <div className="flex flex-col gap-3" style={{ marginTop: '32px' }}>
                <ShareButton
                  featureType="saju_stock"
                  resultId={result.id}
                  title="내 연애 주가 작전 계획서"
                  description="저평가된 내 연애 주가, 조작단이 세운 작전을 확인해보세요"
                  shareUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/stock/${result.id}`}
                  imageUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/home/thumbnails/stock.jpg`}
                  label="친구 주가도 조작하기"
                  activeBackground="rgba(255,255,255,0.06)"
                  hoverBackground="rgba(255,255,255,0.12)"
                  textColor="#D1D5DB"
                  style={{ height: '52px' }}
                />

                <PlanSaveImageButton cardRef={planCardRef} stockId={result.id} />

                <TextLinkButton
                  href="/"
                  color="rgba(255,255,255,0.4)"
                  hoverColor="rgba(255,255,255,0.6)"
                  layoutStyle={{ display: 'block', textAlign: 'center', marginTop: '4px' }}
                >
                  다른 테스트도 해보기
                </TextLinkButton>
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
    </div>
  );
}
