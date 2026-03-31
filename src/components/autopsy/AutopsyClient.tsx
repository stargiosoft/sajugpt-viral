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
import MorgueView from '@/components/autopsy/MorgueView';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { supabase } from '@/lib/supabase';
import { parseUTM, trackEvent } from '@/lib/analytics';
import { loadTargetSaju, saveTargetSaju } from '@/lib/sajuCache';

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
  const [unknownTime, setUnknownTime] = useState(false);
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

  // 캐시 복원 (클라이언트 마운트 후)
  useEffect(() => {
    const cached = loadTargetSaju();
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

  // 입력값 변경 시 상대 사주 캐시에 저장
  useEffect(() => {
    saveTargetSaju({ birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);

  // 유효성 검증 — 태어난 시간은 선택사항
  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const [year, month, day] = birthDate.split('-').map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    if (!causeInput || !duration || !coronerId) return false;
    return true;
  }, [birthDate, causeInput, duration, coronerId]);

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

    trackEvent('autopsy_submit');
    setStep('analyzing');
    setError(null);
    setSubmitting(true);

    const numbers = birthDate.replace(/[^\d]/g, '');
    const hhmm = effectiveUnknownTime ? '1200' : convertTo24Hour(birthTime);
    const birthday = `${numbers}${hhmm}`;

    const minDelay = new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const [data] = await Promise.all([
        callEdgeFunction<AutopsyResult>('analyze-saju-autopsy', {
          birthday,
          gender,
          birthTimeUnknown: effectiveUnknownTime,
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
    setUnknownTime(false);
    setGender('male');
    setCauseInput(null);
    setDuration(null);
    setCoronerId(null);
    setSubmitting(false);
  }, []);

  // 전전남친 리플레이 — 입력 초기화 후 바로 input으로
  const handleReplay = useCallback(() => {
    trackEvent('autopsy_replay');
    setResult(null);
    setError(null);
    setBirthDate('');
    setBirthTime('');
    setUnknownTime(false);
    setGender('male');
    setCauseInput(null);
    setDuration(null);
    setCoronerId(null);
    setStep('input');
  }, []);

  // 영안실 안치
  const handleArchive = useCallback(async () => {
    if (!result) return;
    trackEvent('autopsy_archive', { autopsyId: result.autopsyId, targetSajuType: result.targetSajuType });
    try {
      await supabase
        .from('saju_autopsies')
        .update({ is_archived: true })
        .eq('id', result.autopsyId);
    } catch (err) {
      console.error('안치 실패:', err);
    }
    setStep('morgue');
  }, [result]);

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
              className="flex flex-col"
              style={{ minHeight: '100dvh', padding: '0 20px', paddingBottom: '120px' }}
            >
              {/* 상단 여백 */}
              <div style={{ height: '64px' }} />

              {/* 감정 훅 — 헤드라인 */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                style={{ marginBottom: '8px' }}
              >
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#7A38D8',
                  letterSpacing: '-0.28px',
                  marginBottom: '12px',
                }}>
                  전남친 사주 부검실
                </p>
                <h1 style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#151515',
                  lineHeight: '38px',
                  letterSpacing: '-0.52px',
                }}>
                  그 놈이 널 못 알아본 건<br />
                  네 탓이 아니야
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#6d6d6d',
                  lineHeight: '24px',
                  letterSpacing: '-0.45px',
                  marginBottom: '32px',
                }}
              >
                사주로 증명해 줄게. 생년월일만 넣어봐.
              </motion.p>

              {/* 히어로 비주얼 — 사망진단서 미리보기 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  position: 'relative',
                  marginBottom: '32px',
                }}
              >
                {/* 뒤 그림자 카드 (깊이감) */}
                <div className="transform-gpu" style={{
                  position: 'absolute',
                  top: '8px',
                  left: '12px',
                  right: '12px',
                  bottom: '-4px',
                  borderRadius: '16px',
                  backgroundColor: '#EDE5F7',
                  transform: 'rotate(2deg)',
                }} />

                {/* 메인 사망진단서 카드 */}
                <div className="relative transform-gpu" style={{
                  backgroundColor: '#FFFDF7',
                  borderRadius: '16px',
                  border: '1px solid #E8E0D0',
                  padding: '24px 20px 20px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}>
                  {/* 문서 헤더 */}
                  <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 500, color: '#C4B896', letterSpacing: '1px' }}>
                        사주 부검실
                      </p>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#151515', letterSpacing: '-0.32px', marginTop: '2px' }}>
                        연애 사망진단서
                      </p>
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 500, color: '#b7b7b7' }}>
                      제2026-0330호
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div style={{ height: '1px', background: 'linear-gradient(90deg, #E8E0D0, transparent)', marginBottom: '16px' }} />

                  {/* 판정 내용 */}
                  <div className="flex flex-col gap-3">
                    {/* 사망 원인 — 강조 */}
                    <div style={{
                      backgroundColor: '#FAF8FC',
                      borderRadius: '12px',
                      padding: '14px 16px',
                    }}>
                      <p style={{ fontSize: '11px', fontWeight: 500, color: '#848484', marginBottom: '4px' }}>사망 원인</p>
                      <p style={{ fontSize: '20px', fontWeight: 700, color: '#151515', letterSpacing: '-0.4px' }}>안목 사망</p>
                    </div>

                    {/* 수치 2개 */}
                    <div className="flex gap-3">
                      <div style={{
                        flex: 1,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '12px',
                        padding: '12px 14px',
                      }}>
                        <p style={{ fontSize: '11px', fontWeight: 500, color: '#848484', marginBottom: '4px' }}>매력 감별</p>
                        <div className="flex items-baseline gap-1">
                          <p style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', letterSpacing: '-0.48px' }}>F</p>
                          <p style={{ fontSize: '12px', fontWeight: 500, color: '#DC2626' }}>등급</p>
                        </div>
                      </div>
                      <div style={{
                        flex: 1,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '12px',
                        padding: '12px 14px',
                      }}>
                        <p style={{ fontSize: '11px', fontWeight: 500, color: '#848484', marginBottom: '4px' }}>후회 확률</p>
                        <div className="flex items-baseline gap-1">
                          <p style={{ fontSize: '24px', fontWeight: 800, color: '#7A38D8', letterSpacing: '-0.48px' }}>94.7</p>
                          <p style={{ fontSize: '12px', fontWeight: 500, color: '#7A38D8' }}>%</p>
                        </div>
                      </div>
                    </div>

                    {/* 소견 */}
                    <div style={{
                      borderTop: '1px dashed #E8E0D0',
                      paddingTop: '12px',
                    }}>
                      <p style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#525252',
                        lineHeight: '20px',
                        letterSpacing: '-0.26px',
                        fontStyle: 'italic',
                      }}>
                        &ldquo;이런 놈 때문에 울었다고? 화난다 진짜.&rdquo;
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#7A38D8', marginTop: '6px' }}>
                        — 윤태산 검시관
                      </p>
                    </div>
                  </div>

                  {/* 도장 */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    border: '2px solid #DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(-12deg)',
                    opacity: 0.7,
                  }}>
                    <p style={{ fontSize: '18px', fontWeight: 900, color: '#DC2626', fontFamily: 'serif' }}>F</p>
                  </div>
                </div>
              </motion.div>

              {/* 검시관 선택 티저 */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="flex gap-3"
                style={{ marginBottom: '28px' }}
              >
                {[
                  { name: '윤태산', tone: '분노형', quote: '이런 놈 때문에 울었다고?', img: '/characters/yoon-taesan.webp' },
                  { name: '서휘윤', tone: '치유형', quote: '당신 탓이 아니에요', img: '/characters/seo-hwiyoon.webp' },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="flex-1"
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '14px',
                      border: '1px solid #f0f0f0',
                      padding: '14px',
                      boxShadow: '4px 4px 14px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                      <div className="overflow-hidden transform-gpu" style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid #f0f0f0',
                      }}>
                        <img
                          src={c.img}
                          alt={c.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#151515', letterSpacing: '-0.26px' }}>{c.name}</p>
                        <p style={{ fontSize: '11px', fontWeight: 500, color: '#7A38D8' }}>{c.tone}</p>
                      </div>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#848484',
                      lineHeight: '17px',
                      letterSpacing: '-0.24px',
                    }}>
                      &ldquo;{c.quote}&rdquo;
                    </p>
                  </div>
                ))}
              </motion.div>

              {/* 안내 문구 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#b7b7b7',
                  lineHeight: '18px',
                  letterSpacing: '-0.24px',
                  textAlign: 'center',
                }}
              >
                재미로 보는 사주 콘텐츠이며, 실제 심리 진단이 아닙니다
              </motion.p>

              {/* 하단 고정 CTA */}
              <div
                className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-10 pointer-events-auto"
                style={{
                  maxWidth: '440px',
                  backgroundColor: '#fff',
                  boxShadow: '0px -8px 16px 0px rgba(255,255,255,0.76)',
                  paddingBottom: 'env(safe-area-inset-bottom)',
                }}
              >
                <div style={{ padding: '12px 20px' }}>
                  <div
                    onClick={() => {
                      trackEvent('autopsy_land');
                      setStep('input');
                    }}
                    className="transform-gpu cursor-pointer"
                    style={{
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: '#7A38D8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.98)';
                      e.currentTarget.style.backgroundColor = '#5E28AB';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#7A38D8';
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.98)';
                      e.currentTarget.style.backgroundColor = '#5E28AB';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#7A38D8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#7A38D8';
                    }}
                  >
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: '25px',
                      letterSpacing: '-0.32px',
                      color: '#fff',
                    }}>
                      부검 시작하기
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── INPUT ─── */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '48px 20px 120px' }}
            >
              {/* 헤더 */}
              <div className="flex flex-col items-center" style={{ marginBottom: '36px' }}>
                <span style={{ fontSize: '36px', marginBottom: '8px' }}>🔬</span>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#222', textAlign: 'center', letterSpacing: '-0.5px' }}>
                  그 놈의 사주를 넣어봐
                </h1>
                <p style={{ fontSize: '14px', color: '#888', marginTop: '4px', textAlign: 'center', lineHeight: '22px' }}>
                  너를 못 알아본 전남친/전여친의 생년월일을 입력하세요
                </p>
              </div>

              {/* 안내 배너 */}
              <div style={{
                backgroundColor: '#FEF3C7',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#92400E',
                  lineHeight: '19px',
                  letterSpacing: '-0.26px',
                }}>
                  본인이 아닌 <strong>상대방(전남친/전여친)</strong>의 정보를 입력하세요
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
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', padding: '0 4px' }}>그 놈의 성별</p>
                  <GenderSelect value={gender} onChange={setGender} />
                </motion.div>

                {/* 생년월일 */}
                <motion.div
                  className="flex flex-col gap-1 w-full"
                  style={{ marginTop: '28px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', padding: '0 4px' }}>
                    그 놈의 생년월일 (양력 기준)
                  </p>
                  <BirthInput
                    value={birthDate}
                    onChange={setBirthDate}
                    onEnter={handleSubmit}
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
                  <p style={{ fontSize: '12px', fontWeight: 400, color: '#848484', padding: '0 4px' }}>그 놈이 태어난 시간</p>
                  <BirthTimeInput
                    value={birthTime}
                    onChange={setBirthTime}
                    unknownTime={unknownTime}
                    onUnknownTimeToggle={handleUnknownTimeToggle}
                    onEnter={handleSubmit}
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

              {/* 영안실 + 리플레이 + 다른 테스트 */}
              <div className="flex flex-col gap-3" style={{ padding: '0 20px', marginTop: '12px' }}>
                {/* 영안실 안치 */}
                <button
                  onClick={handleArchive}
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
                  🏥 영안실에 안치하기
                </button>

                {/* 전전남친 리플레이 */}
                <button
                  onClick={handleReplay}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#fff',
                    color: '#7A38D8',
                    fontSize: '15px',
                    fontWeight: 700,
                    border: '1px solid #EDE5F7',
                    cursor: 'pointer',
                  }}
                >
                  전전남친도 부검하기
                </button>

                {/* 다른 테스트 */}
                <a
                  href="/"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '48px',
                    borderRadius: '16px',
                    backgroundColor: 'transparent',
                    color: '#999',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: '1px solid #e7e7e7',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  다른 테스트 해보기
                </a>
              </div>
            </motion.div>
          )}
          {/* ─── MORGUE ─── */}
          {step === 'morgue' && result && (
            <MorgueView
              key="morgue"
              targetSajuType={result.targetSajuType}
              autopsyId={result.autopsyId}
              onBack={() => setStep('result')}
              onReplay={handleReplay}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
