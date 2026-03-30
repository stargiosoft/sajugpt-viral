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
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
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

const ROTATING_CRIMES = [
  '짝사랑만 3년 죄',
  '"나 같은 게 뭐" 죄',
  '읽씹당하고 괜찮은 척한 죄',
  '거울 보고 한숨 쉰 죄',
  '좋아한다는 말 못 한 죄',
  '맨날 친구로만 남은 죄',
  '혼자 이별한 죄',
];

function CourtCrimeRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_CRIMES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      backgroundColor: '#FAF8FC',
      borderRadius: '12px',
      padding: '14px 16px',
      overflow: 'hidden',
      position: 'relative',
      minHeight: '52px',
    }}>
      <p style={{ fontSize: '11px', fontWeight: 500, color: '#848484', marginBottom: '4px' }}>죄목</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={ROTATING_CRIMES[index]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          style={{ fontSize: '18px', fontWeight: 700, color: '#151515', letterSpacing: '-0.36px' }}
        >
          {ROTATING_CRIMES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function SajuCourtClient() {
  const cached = typeof window !== 'undefined' ? loadSelfSaju() : null;
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

  const handleSubmit = async () => {
    if (!isFormValid() || submitting) return;

    // 태어난 시간 미입력 시 자동으로 '모르겠어요' 처리 → 오후 12:00
    const hasValidTime = birthTime.includes('오전') || birthTime.includes('오후');
    const effectiveUnknownTime = unknownTime || !hasValidTime;
    if (effectiveUnknownTime && !unknownTime) {
      setUnknownTime(true);
      setBirthTime('오후 12:00');
    }

    setSubmitting(true);
    setError(null);
    setStep('analyzing');
    trackEvent('saju_court_submit');

    try {
      const numbers = birthDate.replace(/[^\d]/g, '');
      const time24 = effectiveUnknownTime ? '1200' : convertTo24Hour(birthTime);
      const result = await callEdgeFunction<CourtResult>('analyze-saju-court', {
        birthday: `${numbers}${time24}`,
        gender,
        birthTimeUnknown: effectiveUnknownTime,
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
            {/* ── 1. 소환장 히어로 ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              style={{
                margin: '40px 0 0',
                backgroundColor: '#FFFDF7',
                borderRadius: '20px',
                border: '1px solid #E8E0D0',
                padding: '28px 22px 24px',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              {/* 소환장 헤더 */}
              <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 600, color: '#C4B896', letterSpacing: '2px' }}>
                    긴급 소환장
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#151515', letterSpacing: '-0.4px', marginTop: '4px' }}>
                    피고인 소환 통보
                  </p>
                </div>
                {/* 도장 */}
                <div style={{
                  width: '50px', height: '50px', borderRadius: '4px',
                  border: '2.5px solid #DC2626',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: 'rotate(-12deg)', opacity: 0.65,
                }}>
                  <p style={{ fontSize: '14px', fontWeight: 900, color: '#DC2626' }}>기소</p>
                </div>
              </div>

              <div style={{ height: '1px', background: 'linear-gradient(90deg, #E8E0D0 60%, transparent)', marginBottom: '20px' }} />

              {/* 검사 질문 — 큰 타이포 */}
              <div style={{ marginBottom: '20px' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
                  <div className="overflow-hidden transform-gpu shrink-0" style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: '1.5px solid #FF4444',
                  }}>
                    <img src="/characters/yoon-taesan.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#FF4444', letterSpacing: '-0.24px' }}>검사 윤태산</p>
                </div>
                <p style={{
                  fontSize: '22px', fontWeight: 700, color: '#151515',
                  lineHeight: '32px', letterSpacing: '-0.44px',
                }}>
                  피고인,<br />좋아하는 사람 있죠?
                </p>
              </div>

              {/* 죄목 롤링 프리뷰 */}
              <CourtCrimeRotator />

              {/* 형량 프리뷰 수치 */}
              <div className="flex gap-2" style={{ marginTop: '16px' }}>
                <div style={{ flex: 1, backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', fontWeight: 500, color: '#848484', marginBottom: '2px' }}>형량</p>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: '#151515' }}>9<span style={{ fontSize: '11px', fontWeight: 500, color: '#6d6d6d' }}>년</span></p>
                </div>
                <div style={{ flex: 1, backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', fontWeight: 500, color: '#848484', marginBottom: '2px' }}>현상금</p>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: '#7A38D8' }}>4,500<span style={{ fontSize: '10px', fontWeight: 500 }}>만원</span></p>
                </div>
                <div style={{ flex: 1, backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '10px', fontWeight: 500, color: '#848484', marginBottom: '2px' }}>상위</p>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: '#DC2626' }}>7<span style={{ fontSize: '11px', fontWeight: 500 }}>%</span></p>
                </div>
              </div>

              {/* 소환장 하단 안내 */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #E8E0D0' }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#848484', lineHeight: '18px', letterSpacing: '-0.24px', textAlign: 'center' }}>
                  출석하지 않을 경우 궐석재판이 진행됩니다
                </p>
              </div>
            </motion.div>

            {/* ── 2. 검사 vs 변호사 공방 프리뷰 ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{ marginTop: '24px' }}
            >
              {/* 검사 팩폭 */}
              <div className="flex items-start gap-3" style={{ marginBottom: '8px' }}>
                <div className="overflow-hidden transform-gpu shrink-0" style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '2px solid #FF4444',
                }}>
                  <img src="/characters/yoon-taesan.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{
                  backgroundColor: 'rgba(255,68,68,0.06)', borderRadius: '4px 16px 16px 16px',
                  padding: '12px 16px', flex: 1,
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#FF4444', marginBottom: '4px' }}>검사 윤태산</p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#333', lineHeight: '22px', letterSpacing: '-0.28px' }}>
                    &ldquo;못생겨서 못 만나는 거 아닙니다.<br />못생겼다고 <span style={{ fontWeight: 700, color: '#151515' }}>믿어서</span> 못 만나는 겁니다.&rdquo;
                  </p>
                </div>
              </div>

              {/* 변호사 반박 */}
              <div className="flex items-start gap-3" style={{ flexDirection: 'row-reverse' }}>
                <div className="overflow-hidden transform-gpu shrink-0" style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '2px solid #4488FF',
                }}>
                  <img src="/characters/seo-hwiyoon.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{
                  backgroundColor: 'rgba(68,136,255,0.06)', borderRadius: '16px 4px 16px 16px',
                  padding: '12px 16px', flex: 1,
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#4488FF', marginBottom: '4px', textAlign: 'right' }}>변호사 서휘윤</p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#333', lineHeight: '22px', letterSpacing: '-0.28px' }}>
                    &ldquo;그 믿음을 만든 건 피고인이 아닙니다.<br /><span style={{ fontWeight: 700, color: '#151515' }}>세상이 심어놓은 겁니다.</span>&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── 3. 역설 카드 ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{
                marginTop: '24px',
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: '#151515',
              }}
            >
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', lineHeight: '24px', letterSpacing: '-0.3px', textAlign: 'center' }}>
                형량이 높을수록 = 매력이 높다는 뜻
              </p>
              <p style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginTop: '4px', letterSpacing: '-0.24px' }}>
                도화살 2개에 5년 썩히면 가중처벌
              </p>
            </motion.div>

            {/* ── 면책 ── */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{
                fontSize: '12px', fontWeight: 400, color: '#b7b7b7',
                lineHeight: '18px', letterSpacing: '-0.24px', textAlign: 'center',
                marginTop: '20px',
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
                    출석하기
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
                  onUnknownTimeToggle={() => {
                    const newVal = !unknownTime;
                    setUnknownTime(newVal);
                    if (newVal) setBirthTime('오후 12:00');
                    else setBirthTime('');
                  }}
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
