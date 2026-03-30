'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gender, AutopsyStep, AutopsyResult, CauseOfDeathInput, RelationshipDuration, CoronerId } from '@/types/autopsy';
import { CORONERS } from '@/constants/autopsy';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import BirthTimeInput from '@/components/BirthTimeInput';
import CauseOfDeathSelect from '@/components/autopsy/CauseOfDeathSelect';
import DurationSelect from '@/components/autopsy/DurationSelect';
import CoronerSelect from '@/components/autopsy/CoronerSelect';
import AnalyzingAutopsy from '@/components/autopsy/AnalyzingAutopsy';
import AutopsyCard from '@/components/autopsy/AutopsyCard';
import DeathCertificate from '@/components/autopsy/DeathCertificate';
import AutopsyShareButtons from '@/components/autopsy/AutopsyShareButtons';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { parseUTM, trackEvent } from '@/lib/analytics';

interface Props {
  autopsyId?: string;
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

export default function AutopsyClient({ autopsyId }: Props) {
  // 입력 상태
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(true);
  const [gender, setGender] = useState<Gender>('male');
  const [causeInput, setCauseInput] = useState<CauseOfDeathInput | null>(null);
  const [duration, setDuration] = useState<RelationshipDuration | null>(null);
  const [coronerId, setCoronerId] = useState<CoronerId | null>(null);

  // 플로우 상태
  const [step, setStep] = useState<AutopsyStep>(autopsyId ? 'input' : 'landing');
  const [result, setResult] = useState<AutopsyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const birthTimeRef = useRef<HTMLDivElement>(null);

  // UTM 자동입력
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
        setUnknownTime(false);
      }
    }
    if (utm.gender) {
      hasUTM = true;
      setGender(utm.gender === 'male' ? 'male' : 'female');
    }
    if (hasUTM) {
      setStep('input');
      trackEvent('autopsy_land_utm');
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
    if (!causeInput || !duration || !coronerId) return false;
    return true;
  }, [birthDate, unknownTime, birthTime, causeInput, duration, coronerId]);

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

    trackEvent('autopsy_submit');
    setStep('analyzing');
    setError(null);
    setSubmitting(true);

    const numbers = birthDate.replace(/[^\d]/g, '');
    const hhmm = unknownTime ? '0000' : convertTo24Hour(birthTime);
    const birthday = `${numbers}${hhmm}`;

    const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const [data] = await Promise.all([
        callEdgeFunction<AutopsyResult>('analyze-saju-autopsy', {
          birthday,
          gender,
          birthTimeUnknown: unknownTime,
          causeOfDeathInput: causeInput,
          relationshipDuration: duration,
          coronerId,
        }),
        minDelay,
      ]);

      setResult(data);
      trackEvent('autopsy_result', {
        causeOfDeath: data.causeOfDeath,
        grade: data.discernmentGrade,
      });
      setStep('card1');
    } catch (err) {
      console.error('부검 실패:', err);
      setError('부검 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    } finally {
      setSubmitting(false);
    }
  }, [isFormValid, submitting, birthDate, unknownTime, birthTime, gender, causeInput, duration, coronerId]);

  // 다시하기
  const handleReset = useCallback(() => {
    setStep('landing');
    setResult(null);
    setError(null);
    setBirthDate('');
    setBirthTime('');
    setUnknownTime(true);
    setGender('male');
    setCauseInput(null);
    setDuration(null);
    setCoronerId(null);
    setSubmitting(false);
  }, []);

  const coronerName = coronerId ? CORONERS.find(c => c.id === coronerId)?.name ?? '' : '';

  return (
    <div className="flex justify-center" style={{ minHeight: '100dvh', backgroundColor: '#fff' }}>
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
              className="flex flex-col items-center justify-center"
              style={{ minHeight: '100dvh', padding: '0 24px' }}
            >
              <span style={{ fontSize: '48px', marginBottom: '16px' }}>🔬</span>
              <h1 style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#222',
                textAlign: 'center',
                lineHeight: '1.4',
                letterSpacing: '-0.5px',
                marginBottom: '12px',
              }}>
                너를 못 알아본 놈,<br />사주로 부검합니다
              </h1>
              <p style={{
                fontSize: '15px',
                color: '#888',
                textAlign: 'center',
                lineHeight: '1.6',
                marginBottom: '48px',
              }}>
                전남친 사주를 넣으면<br />
                검시관이 왜 그 놈이 널 못 알아봤는지<br />
                사망진단서를 발급합니다
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  trackEvent('autopsy_land');
                  setStep('input');
                }}
                className="transform-gpu"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#7A38D8',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                부검 시작하기
              </motion.button>
            </motion.div>
          )}

          {/* ─── INPUT ─── */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ padding: '48px 20px 120px' }}
            >
              {/* 헤더 */}
              <div className="flex flex-col items-center" style={{ marginBottom: '36px' }}>
                <span style={{ fontSize: '36px', marginBottom: '8px' }}>🔬</span>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#222', textAlign: 'center', letterSpacing: '-0.5px' }}>
                  부검 대상 정보 입력
                </h1>
                <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
                  그 놈의 사주 정보를 입력하세요
                </p>
              </div>

              <motion.div
                className="flex flex-col"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              >
                {/* 성별 */}
                <motion.div
                  className="flex flex-col gap-1 w-full"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', padding: '0 4px' }}>성별</p>
                  <GenderSelect value={gender} onChange={setGender} />
                </motion.div>

                {/* 생년월일 */}
                <motion.div
                  className="flex flex-col gap-1 w-full"
                  style={{ marginTop: '28px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', padding: '0 4px' }}>
                    생년월일 (양력 기준)
                  </p>
                  <BirthInput
                    value={birthDate}
                    onChange={setBirthDate}
                    onComplete={() => {
                      const timeInput = birthTimeRef.current?.querySelector('input');
                      if (timeInput) setTimeout(() => timeInput.focus(), 100);
                    }}
                  />
                </motion.div>

                {/* 태어난 시간 */}
                <motion.div
                  ref={birthTimeRef}
                  className="flex flex-col gap-1 w-full"
                  style={{ marginTop: '28px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', padding: '0 4px' }}>태어난 시간</p>
                  <BirthTimeInput
                    value={birthTime}
                    onChange={setBirthTime}
                    unknownTime={unknownTime}
                    onUnknownTimeToggle={handleUnknownTimeToggle}
                  />
                </motion.div>

                {/* 사인 선택 */}
                <motion.div
                  style={{ marginTop: '32px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  <CauseOfDeathSelect value={causeInput} onChange={setCauseInput} />
                </motion.div>

                {/* 사귄 기간 */}
                <motion.div
                  style={{ marginTop: '28px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  <DurationSelect value={duration} onChange={setDuration} />
                </motion.div>

                {/* 검시관 선택 */}
                <motion.div
                  style={{ marginTop: '28px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  <CoronerSelect value={coronerId} onChange={setCoronerId} />
                </motion.div>

                {/* 에러 */}
                {error && (
                  <motion.div
                    className="flex gap-1 items-center"
                    style={{
                      marginTop: '20px',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                    }}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                  >
                    <p style={{ color: '#dc2626', fontSize: '13px' }}>{error}</p>
                  </motion.div>
                )}
              </motion.div>

              {/* 하단 고정 CTA */}
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
                      color: isFormValid() && !submitting ? '#fff' : '#b7b7b7',
                    }}>
                      {submitting ? '검시관 호출 중...' : '부검 시작'}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ANALYZING ─── */}
          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalyzingAutopsy coronerName={coronerName} />
            </motion.div>
          )}

          {/* ─── CARD 1 ─── */}
          {step === 'card1' && result && (
            <AutopsyCard
              key="card1"
              cardNumber={1}
              title="겉포장 분석"
              text={result.card1Text}
              coronerId={result.coronerId}
              onNext={() => setStep('card2')}
            />
          )}

          {/* ─── CARD 2 ─── */}
          {step === 'card2' && result && (
            <AutopsyCard
              key="card2"
              cardNumber={2}
              title="해부 소견"
              text={result.card2Text}
              coronerId={result.coronerId}
              onNext={() => setStep('card3')}
            />
          )}

          {/* ─── CARD 3 ─── */}
          {step === 'card3' && result && (
            <AutopsyCard
              key="card3"
              cardNumber={3}
              title="사망진단서"
              text={result.card3Verdict}
              coronerId={result.coronerId}
              onNext={() => setStep('result')}
              nextLabel="사망진단서 확인하기"
            />
          )}

          {/* ─── RESULT ─── */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ padding: '24px 20px 48px' }}
            >
              {/* 사망진단서 카드 */}
              <div className="flex justify-center" style={{ marginBottom: '24px' }}>
                <DeathCertificate ref={cardRef} result={result} />
              </div>

              {/* 공유 버튼 */}
              <AutopsyShareButtons
                causeOfDeathLabel={result.causeOfDeathLabel}
                autopsyId={result.autopsyId}
                cardRef={cardRef}
              />

              {/* 다시하기 + 전전남친 */}
              <div className="flex flex-col gap-3" style={{ padding: '0 20px', marginTop: '12px' }}>
                <button
                  onClick={() => {
                    trackEvent('autopsy_replay');
                    setResult(null);
                    setCauseInput(null);
                    setDuration(null);
                    setCoronerId(null);
                    setBirthDate('');
                    setBirthTime('');
                    setUnknownTime(true);
                    setGender('male');
                    setStep('input');
                  }}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#F7F2FA',
                    color: '#7A38D8',
                    fontSize: '15px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  전전남친도 부검하기
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '16px',
                    backgroundColor: 'transparent',
                    color: '#999',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: '1px solid #e7e7e7',
                    cursor: 'pointer',
                  }}
                >
                  처음으로
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
