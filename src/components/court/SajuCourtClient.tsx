'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type { CourtStep, CourtResult, PeriodInput } from '@/types/court';
import BirthInput from '@/components/BirthInput';
import GenderSelect from '@/components/GenderSelect';
import BirthTimeInput from '@/components/BirthTimeInput';
import CourtLanding from '@/components/court/CourtLanding';
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
            className="w-full"
          >
            <CourtLanding onStart={() => {
              trackEvent('saju_court_land');
              setStep('input');
            }} />
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
