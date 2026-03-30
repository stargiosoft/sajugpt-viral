'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { CourtStep, CourtResult, PeriodInput } from '@/types/court';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import BirthTimeInput from '@/components/BirthTimeInput';
import CourtAnalyzing from '@/components/court/CourtAnalyzing';
import IndictmentCard from '@/components/court/IndictmentCard';
import TrialScreen from '@/components/court/TrialScreen';
import VerdictCard from '@/components/court/VerdictCard';
import AccompliceScreen from '@/components/court/AccompliceScreen';
import CourtShareButtons from '@/components/court/CourtShareButtons';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { parseUTM, trackEvent } from '@/lib/analytics';
import {
  getPeriodBonus,
  getSentenceGrade,
  calculateBounty,
  calculatePercentile,
  getJudgeComment,
  getCrimeInfo,
} from '@/constants/court';

function convertTo24Hour(time: string): string {
  const match = time.match(/^(오전|오후)\s(\d{2}):(\d{2})$/);
  if (!match) return '0000';
  const period = match[1];
  let hour = Number(match[2]);
  const minute = match[3];
  if (period === '오전') { if (hour === 12) hour = 0; }
  else { if (hour !== 12) hour += 12; }
  return `${String(hour).padStart(2, '0')}${minute}`;
}

const CACHE_KEY = 'saju_court_input';

function loadCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveCache(data: Record<string, unknown>) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* */ }
}

export default function SajuCourtClient() {
  const cached = typeof window !== 'undefined' ? loadCache() : null;
  const [birthDate, setBirthDate] = useState(cached?.birthDate ?? '');
  const [birthTime, setBirthTime] = useState(cached?.birthTime ?? '');
  const [unknownTime, setUnknownTime] = useState(cached?.unknownTime ?? false);
  const [gender, setGender] = useState<Gender>(cached?.gender ?? 'female');

  const [step, setStep] = useState<CourtStep>('landing');
  const [courtResult, setCourtResult] = useState<CourtResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 재판 중 수집
  const [trial1Choice, setTrial1Choice] = useState<number | null>(null);
  const [periodInput, setPeriodInput] = useState<PeriodInput | null>(null);
  const [trial3Choice, setTrial3Choice] = useState<number | null>(null);

  // 형량 계산 결과 (클라이언트)
  const [finalSentence, setFinalSentence] = useState<number | null>(null);

  const indictmentRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);

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
      }
    }
    if (utm.gender) {
      hasUTM = true;
      setGender(utm.gender === 'male' ? 'male' : 'female');
    }
    if (hasUTM) {
      setStep('input');
      trackEvent('saju_court_land');
    }
  }, []);

  useEffect(() => {
    saveCache({ birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);

  useEffect(() => {
    if (cached?.birthDate && step === 'landing') setStep('input');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [birthDate, birthTime, unknownTime]);

  const handleSubmit = async () => {
    if (!isFormValid() || submitting) return;
    setSubmitting(true);
    setError(null);
    setStep('analyzing');
    trackEvent('saju_court_submit');

    try {
      const numbers = birthDate.replace(/[^\d]/g, '');
      const time24 = unknownTime ? '0000' : convertTo24Hour(birthTime);
      const result = await callEdgeFunction<CourtResult>('analyze-saju-court', {
        birthday: `${numbers}${time24}`,
        gender,
        birthTimeUnknown: unknownTime,
      });
      setCourtResult(result);
      setStep('indictment');
    } catch (err) {
      setError((err as Error).message);
      setStep('input');
    } finally {
      setSubmitting(false);
    }
  };

  // 기간 선택 시 형량 확정
  const handlePeriodSelect = (period: PeriodInput) => {
    setPeriodInput(period);
    if (courtResult) {
      const bonus = getPeriodBonus(period);
      setFinalSentence(courtResult.baseSentence + bonus);
    }
  };

  const handleReset = () => {
    setCourtResult(null);
    setTrial1Choice(null);
    setPeriodInput(null);
    setTrial3Choice(null);
    setFinalSentence(null);
    setStep('input');
  };

  // 파생 데이터
  const sentence = finalSentence ?? courtResult?.baseSentence ?? 1;
  const sentenceGrade = getSentenceGrade(sentence);
  const bounty = calculateBounty(sentence);
  const percentile = calculatePercentile(sentence);
  const judgeComment = getJudgeComment(sentenceGrade.grade);

  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 700,
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{ maxWidth: '440px', margin: '0 auto', minHeight: '100dvh' }}
    >
      <AnimatePresence mode="wait">

        {/* ─── LANDING ──────────────────────────── */}
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full"
            style={{ minHeight: '100dvh', padding: '0 20px', paddingBottom: '120px' }}
          >
            {/* 상단 여백 */}
            <div style={{ height: '64px' }} />

            {/* ── 감정 훅 헤드라인 ── */}
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
                사주 법정
              </p>
              <h1 style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#151515',
                lineHeight: '38px',
                letterSpacing: '-0.52px',
              }}>
                연애 못한 진짜 이유,<br />
                사주로 기소합니다
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
              검사가 팩폭하고, 변호사가 뒤집어줍니다.
            </motion.p>

            {/* ── 히어로 비주얼 — 기소장 미리보기 ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              style={{ position: 'relative', marginBottom: '28px' }}
            >
              {/* 뒤 그림자 카드 */}
              <div className="transform-gpu" style={{
                position: 'absolute',
                top: '8px',
                left: '12px',
                right: '12px',
                bottom: '-4px',
                borderRadius: '16px',
                backgroundColor: '#EDE5F7',
                transform: 'rotate(1.5deg)',
              }} />

              {/* 메인 기소장 카드 */}
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
                      사주 법정
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#151515', letterSpacing: '-0.32px', marginTop: '2px' }}>
                      기소장
                    </p>
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 500, color: '#b7b7b7' }}>
                    제2026-0330호
                  </div>
                </div>

                {/* 구분선 */}
                <div style={{ height: '1px', background: 'linear-gradient(90deg, #E8E0D0, transparent)', marginBottom: '16px' }} />

                {/* 죄목 — 강조 */}
                <div style={{
                  backgroundColor: '#FAF8FC',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '12px',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: '#848484', marginBottom: '4px' }}>죄목</p>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#151515', letterSpacing: '-0.4px' }}>짝사랑만 3년 죄</p>
                </div>

                {/* 수치 3개 */}
                <div className="flex gap-2" style={{ marginBottom: '14px' }}>
                  <div style={{ flex: 1, backgroundColor: '#f9f9f9', borderRadius: '12px', padding: '12px 10px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: '#848484', marginBottom: '4px' }}>형량</p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#151515', letterSpacing: '-0.4px' }}>9<span style={{ fontSize: '12px', fontWeight: 500, color: '#6d6d6d' }}>년</span></p>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#f9f9f9', borderRadius: '12px', padding: '12px 10px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: '#848484', marginBottom: '4px' }}>현상금</p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#7A38D8', letterSpacing: '-0.4px' }}>4,500<span style={{ fontSize: '10px', fontWeight: 500, color: '#7A38D8' }}>만원</span></p>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#f9f9f9', borderRadius: '12px', padding: '12px 10px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: '#848484', marginBottom: '4px' }}>피고인</p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#DC2626', letterSpacing: '-0.4px' }}>7<span style={{ fontSize: '12px', fontWeight: 500, color: '#DC2626' }}>%</span></p>
                  </div>
                </div>

                {/* 검사 vs 변호사 한 줄 */}
                <div style={{ borderTop: '1px dashed #E8E0D0', paddingTop: '12px' }}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: '#FF4444', marginTop: '6px', flexShrink: 0,
                      }} />
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#525252', lineHeight: '20px', letterSpacing: '-0.26px' }}>
                        &ldquo;3년이면 사랑이 아니라 습관입니다.&rdquo;
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: '#4488FF', marginTop: '6px', flexShrink: 0,
                      }} />
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#525252', lineHeight: '20px', letterSpacing: '-0.26px' }}>
                        &ldquo;3년을 버틴 건 습관이 아니라 진심입니다.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* 유죄 도장 */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '56px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '4px',
                  border: '2.5px solid #DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-15deg)',
                  opacity: 0.6,
                }}>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#DC2626' }}>유죄</p>
                </div>
              </div>
            </motion.div>

            {/* ── 검사 vs 변호사 캐릭터 ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="flex gap-3"
              style={{ marginBottom: '32px' }}
            >
              {[
                { name: '윤태산', role: '검사', tone: '팩폭형', quote: '못생겨서 못 만나는 거 아닙니다', color: '#FF4444', img: '/characters/yoon-taesan.webp' },
                { name: '서휘윤', role: '변호사', tone: '위로형', quote: '당신의 잘못이 아닙니다', color: '#4488FF', img: '/characters/seo-hwiyoon.webp' },
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
                      width: '32px', height: '32px', borderRadius: '50%',
                      border: '1px solid #f0f0f0',
                    }}>
                      <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#151515', letterSpacing: '-0.26px' }}>{c.name}</p>
                      <p style={{ fontSize: '11px', fontWeight: 500, color: c.color }}>{c.role} · {c.tone}</p>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '12px', fontWeight: 400, color: '#848484',
                    lineHeight: '17px', letterSpacing: '-0.24px',
                  }}>
                    &ldquo;{c.quote}&rdquo;
                  </p>
                </div>
              ))}
            </motion.div>

            {/* ── 죄목 프리뷰 (호기심 유발) ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{ marginBottom: '32px' }}
            >
              <p style={{
                fontSize: '12px', fontWeight: 600, color: '#b7b7b7',
                letterSpacing: '0.5px', marginBottom: '12px',
              }}>
                10가지 죄목
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '짝사랑만 3년 죄', '좋아한다는 말 못 한 죄', '혼자 이별한 죄',
                  '"나 같은 게 뭐" 죄', '읽씹당하고 괜찮은 척한 죄',
                  '맨날 친구로만 남은 죄', '거울 보고 한숨 쉰 죄',
                ].map((crime) => (
                  <div key={crime} style={{
                    padding: '7px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#FAF8FC',
                    border: '1px solid #EDE5F7',
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: '#7A38D8', letterSpacing: '-0.24px', whiteSpace: 'nowrap' }}>
                      {crime}
                    </p>
                  </div>
                ))}
                <div style={{
                  padding: '7px 12px',
                  borderRadius: '20px',
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #f0f0f0',
                }}>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#b7b7b7', letterSpacing: '-0.24px' }}>
                    +3개 더
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── 진행 방식 ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{ marginBottom: '32px' }}
            >
              <p style={{
                fontSize: '12px', fontWeight: 600, color: '#b7b7b7',
                letterSpacing: '0.5px', marginBottom: '14px',
              }}>
                진행 방식
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { num: '01', title: '생년월일만 입력', desc: '3초면 기소장이 나와요' },
                  { num: '02', title: '검사가 팩폭, 변호사가 변론', desc: '4턴 재판에 직접 참여해요' },
                  { num: '03', title: '판결문 + 석방 예정일', desc: '형량이 높을수록 매력이 높다는 뜻' },
                ].map((item) => (
                  <div key={item.num} className="flex gap-3 items-start">
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      backgroundColor: '#FAF8FC',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#7A38D8' }}>{item.num}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#151515', letterSpacing: '-0.28px', marginBottom: '2px' }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: '13px', fontWeight: 400, color: '#848484', letterSpacing: '-0.26px' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── 면책 안내 ── */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              style={{
                fontSize: '12px', fontWeight: 400, color: '#b7b7b7',
                lineHeight: '18px', letterSpacing: '-0.24px', textAlign: 'center',
              }}
            >
              재미로 보는 사주 콘텐츠이며, 실제 심리 진단이 아닙니다
            </motion.p>

            {/* ── 하단 고정 CTA ── */}
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
                    trackEvent('saju_court_land');
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
                    fontSize: '16px', fontWeight: 500, lineHeight: '25px',
                    letterSpacing: '-0.32px', color: '#fff',
                  }}>
                    내 형량 확인하기
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── INPUT ────────────────────────────── */}
        {step === 'input' && (
          <div className="w-full" style={{ padding: '32px 24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#151515', marginBottom: '8px' }}>
              ⚖️ 사주 법정
            </h2>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '28px' }}>
              사주로 당신의 죄목과 형량을 판결합니다
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px', display: 'block' }}>성별</label>
                <GenderSelect value={gender} onChange={setGender} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px', display: 'block' }}>생년월일</label>
                <BirthInput value={birthDate} onChange={setBirthDate} />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '8px', display: 'block' }}>태어난 시간</label>
                <BirthTimeInput
                  value={birthTime}
                  onChange={setBirthTime}
                  unknownTime={unknownTime}
                  onUnknownTimeToggle={() => setUnknownTime((v: boolean) => !v)}
                />
              </div>
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#e53e3e', marginTop: '12px', textAlign: 'center' }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || submitting}
              style={{
                ...btnStyle,
                marginTop: '28px',
                backgroundColor: isFormValid() ? '#7A38D8' : '#ddd',
                color: isFormValid() ? '#fff' : '#aaa',
                transition: 'background-color 0.2s',
              }}
            >
              {submitting ? '분석 중...' : '기소장 받기'}
            </button>
          </div>
        )}

        {/* ─── ANALYZING ────────────────────────── */}
        {step === 'analyzing' && <CourtAnalyzing />}

        {/* ─── INDICTMENT (기소장) ──────────────── */}
        {step === 'indictment' && courtResult && (
          <div className="w-full" style={{ padding: '24px' }}>
            <IndictmentCard
              ref={indictmentRef}
              result={courtResult}
              sentence={sentence}
              bounty={bounty}
              percentile={percentile}
              sentenceGrade={sentenceGrade}
            />
            <div className="flex flex-col gap-3" style={{ marginTop: '20px' }}>
              <button
                onClick={() => setStep('trial_1')}
                style={{ ...btnStyle, backgroundColor: '#7A38D8', color: '#fff' }}
              >
                ⚖️ 재판 참여하기
              </button>
              <CourtShareButtons
                label="내 기소장 보내기"
                cardRef={indictmentRef}
                courtId={courtResult.courtId}
                crimeLabel={courtResult.crimeLabel}
                sentence={sentence}
              />
            </div>
          </div>
        )}

        {/* ─── TRIAL (재판 1~4턴) ──────────────── */}
        {(step === 'trial_1' || step === 'trial_2' || step === 'trial_3' || step === 'trial_4') && courtResult && (
          <TrialScreen
            step={step}
            result={courtResult}
            trial1Choice={trial1Choice}
            trial3Choice={trial3Choice}
            periodInput={periodInput}
            finalSentence={finalSentence}
            onTrial1Select={(choice) => { setTrial1Choice(choice); setStep('trial_2'); }}
            onPeriodSelect={(period) => { handlePeriodSelect(period); setStep('trial_3'); }}
            onTrial3Select={(choice) => { setTrial3Choice(choice); setStep('trial_4'); }}
            onTrialComplete={() => setStep('verdict')}
          />
        )}

        {/* ─── VERDICT (판결문) ─────────────────── */}
        {step === 'verdict' && courtResult && (
          <div className="w-full" style={{ padding: '24px' }}>
            <VerdictCard
              ref={verdictRef}
              result={courtResult}
              sentence={sentence}
              bounty={bounty}
              percentile={percentile}
              sentenceGrade={sentenceGrade}
              judgeComment={judgeComment}
            />
            <div className="flex flex-col gap-3" style={{ marginTop: '20px' }}>
              <button
                onClick={() => setStep('accomplice')}
                style={{ ...btnStyle, backgroundColor: '#7A38D8', color: '#fff' }}
              >
                🔗 공범 지목하기
              </button>
              <CourtShareButtons
                label="판결문 공유하기"
                cardRef={verdictRef}
                courtId={courtResult.courtId}
                crimeLabel={courtResult.crimeLabel}
                sentence={sentence}
              />
            </div>
          </div>
        )}

        {/* ─── ACCOMPLICE (공범 지목) ──────────── */}
        {step === 'accomplice' && courtResult && (
          <AccompliceScreen
            result={courtResult}
            sentence={sentence}
            onSkip={() => setStep('conversion')}
            onComplete={() => setStep('conversion')}
          />
        )}

        {/* ─── CONVERSION (항소 → 챗봇) ────────── */}
        {step === 'conversion' && courtResult && (
          <div className="flex flex-col items-center w-full" style={{ padding: '40px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#151515', textAlign: 'center', marginBottom: '8px' }}>
              석방까지 어떻게 준비하시겠습니까?
            </h2>
            <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '32px', lineHeight: '1.6' }}>
              석방 예정일: {courtResult.releaseDate.year}년 {courtResult.releaseDate.month}월
            </p>

            <div className="flex flex-col gap-3 w-full">
              <a
                href={`/chat/yoon-taesan?birthday=${encodeURIComponent(birthDate.replace(/[^\d]/g, ''))}${unknownTime ? '0000' : convertTo24Hour(birthTime)}&gender=${gender}`}
                style={{ ...btnStyle, backgroundColor: '#1a1a2e', color: '#fff', textAlign: 'center', textDecoration: 'none', display: 'block' }}
              >
                🔴 윤태산에게 항소하기
              </a>
              <a
                href={`/chat/seo-hwiyoon?birthday=${encodeURIComponent(birthDate.replace(/[^\d]/g, ''))}${unknownTime ? '0000' : convertTo24Hour(birthTime)}&gender=${gender}`}
                style={{ ...btnStyle, backgroundColor: '#F7F2FA', color: '#7A38D8', textAlign: 'center', textDecoration: 'none', display: 'block', border: '1px solid #E8DCF5' }}
              >
                🔵 서휘윤에게 상담받기
              </a>
              <button
                onClick={handleReset}
                style={{ ...btnStyle, backgroundColor: '#f5f5f5', color: '#666' }}
              >
                🔄 다른 사주로 해보기
              </button>
            </div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
