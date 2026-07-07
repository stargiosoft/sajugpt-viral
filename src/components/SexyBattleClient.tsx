// deno-lint-ignore-file no-sloppy-imports
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Gender, Step, BattleResult, ChallengerPreview } from '@/types/battle';
import BirthInput from '@/components/BirthInput';
import TestTopNav from '@/components/TestTopNav';
import StickyCTAButton from '@/components/StickyCTAButton';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import AnalyzingScreen from '@/components/AnalyzingScreen';
import ResultCard from '@/components/ResultCard';
import SajuAnalysisCard from '@/components/SajuAnalysisCard';
import ShareButtons from '@/components/ShareButtons';
import BattleVSCard from '@/components/BattleVSCard';
import CutScene from '@/components/CutScene';
import OnboardingLanding from '@/components/OnboardingLanding';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { parseUTM, trackEvent } from '@/lib/analytics';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { formatKoreanTime, parseKoreanTimeTo24Hour } from '@/lib/koreanTime';

const OTHER_TEST_LINK_HOVER = {
  whileHover: { color: 'rgba(255,255,255,0.8)' },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15, ease: 'easeOut' as const },
};

interface Props {
  battleId?: string;
  challengerPreview?: ChallengerPreview | null;
}

export default function SexyBattleClient({ battleId, challengerPreview }: Props) {
  const isBattleAccept = !!battleId && !!challengerPreview;
  // 입력 상태
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  // 플로우 상태 — UTM이나 배틀 수락이면 입력 폼으로 바로 진입
  const [step, setStep] = useState<Step>(battleId ? 'input' : 'landing');
  const [result, setResult] = useState<BattleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCutScene, setShowCutScene] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const vsCardRef = useRef<HTMLDivElement>(null);
  const birthTimeRef = useRef<HTMLDivElement>(null);

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
        const mi = Number(utm.birthday.slice(10, 12));
        setBirthTime(formatKoreanTime(h, mi));
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

    trackEvent('sexy_battle_input_start');
    setStep('analyzing');
    setError(null);
    setSubmitting(true);

    // birthday를 YYYYMMDDHHMM 형식으로
    const numbers = birthDate.replace(/[^\d]/g, '');
    const hhmm = effectiveUnknownTime ? '1200' : parseKoreanTimeTo24Hour(birthTime);
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


  return (
    <div className="fixed inset-0 flex justify-center" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="w-full max-w-[768px] h-full flex flex-col">
        <div className="flex-1 overflow-auto w-full">
        <TestTopNav />
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '48px 20px 120px', minHeight: '100%', backgroundColor: '#0d0d0d' }}
            >
              {/* 헤더 */}
              <div className="flex flex-col items-center" style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', marginBottom: '8px', textAlign: 'center', letterSpacing: '-0.56px' }}>
                  얼굴 말고, 사주부터 불어
                </h1>
                {isBattleAccept && (
                  <div className="flex flex-col items-center" style={{ gap: '6px', marginBottom: '16px', width: '100%', maxWidth: '340px' }}>
                    <p style={{ fontSize: '12px', color: '#FF4438', fontWeight: 700, textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      ⚠️ 친구한테 도발장이 날아왔어요 ⚠️
                    </p>
                    <div
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(255,68,56,0.15) 0%, rgba(255,68,56,0.05) 100%)',
                        border: '1px solid #FF4438',
                        boxShadow: '0 0 15px rgba(255,68,56,0.2)',
                      }}
                    >
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#FF5B4D', textAlign: 'center', letterSpacing: '-0.32px' }}>
                        "나는 {challengerPreview!.headcount}명 꼬이는데, 넌?"
                      </p>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, textAlign: 'center', letterSpacing: '-0.24px', marginTop: '6px' }}>
                  입력한 정보는 저장 없이 바로 사라져요
                </p>
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
                  className="flex flex-col w-full"
                  style={{ gap: '8px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.45)', lineHeight: '16px', letterSpacing: '-0.24px', padding: '0 4px' }}>
                    성별
                  </p>
                  <GenderSelect value={gender} onChange={setGender} accentColor="#FF4438" bgColor="rgba(255,255,255,0.06)" unselectedColor="rgba(255,255,255,0.28)" />
                </motion.div>

                {/* 생년월일 */}
                <motion.div
                  className="flex flex-col w-full"
                  style={{ marginTop: '36px', gap: '8px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.45)', lineHeight: '16px', letterSpacing: '-0.24px', padding: '0 4px' }}>
                    생년월일 (양력 기준으로 입력해 주세요)
                  </p>
                  <BirthInput
                    value={birthDate}
                    onChange={setBirthDate}
                    onEnter={handleSubmit}
                    accentColor="#FF4438"
                    bgColor="rgba(255,255,255,0.06)"
                    textColor="#ffffff"
                    borderColor="transparent"
                    errorColor="#FF4438"
                    errorGap="8px"
                    errorOverlay
                    errorFontSize="12px"
                    errorIconSize={14}
                  />
                </motion.div>

                {/* 태어난 시간 */}
                <motion.div
                  ref={birthTimeRef}
                  className="flex flex-col w-full"
                  style={{ marginTop: '36px', gap: '8px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.45)', lineHeight: '16px', letterSpacing: '-0.24px', padding: '0 4px' }}>
                    태어난 시간
                  </p>
                  <TimeSelectSheet
                    value={birthTime}
                    unknownTime={unknownTime}
                    onSelect={handleTimeSelect}
                    accentColor="#FF4438"
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
                      backgroundColor: 'rgba(255,68,56,0.12)',
                      border: '1px solid rgba(255,68,56,0.3)',
                    }}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                  >
                    <p style={{ color: '#FF8A80', fontSize: '13px' }}>{error}</p>
                  </motion.div>
                )}
              </motion.div>

              {/* 하단 고정 CTA 버튼 */}
              <StickyCTAButton
                isValid={isFormValid() && !submitting}
                onClick={handleSubmit}
                label={submitting ? '분석 중...' : isBattleAccept ? '배틀 도전하기' : '내 페로몬 등급 확인하기'}
                containerBackground="#0d0d0d"
                containerBoxShadow="0px -8px 16px 0px rgba(13,13,13,0.76)"
                activeBackground="linear-gradient(135deg, #FF4438 0%, #E0201A 100%)"
                inactiveBackground="rgba(255,255,255,0.08)"
                inactiveTextColor="rgba(255,255,255,0.35)"
                fontWeight={600}
                lineHeight="25px"
                letterSpacing="-0.32px"
              />
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
              <AnalyzingScreen
                messages={[
                  'AI 짐승남들이 사주를 감별하고 있습니다...',
                  '도화살 검출 중...',
                  '페로몬 등급 산출 중...',
                  '꼬여든 짐승남 수 계산 중...',
                ]}
                lottieColor="#FF4438"
              />
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
                  <div className="flex justify-center" style={{ marginBottom: '20px' }}>
                    <ResultCard result={result} />
                  </div>
                  <div className="flex justify-center" style={{ marginBottom: '24px' }}>
                    <SajuAnalysisCard result={result} />
                  </div>
                  <ShareButtons headcount={result.headcount} battleId={result.battleId} cardRef={cardRef} />
                  <motion.a
                    href="/"
                    className="mx-auto w-full max-w-[400px] md:max-w-[520px] lg:max-w-[620px]"
                    {...OTHER_TEST_LINK_HOVER}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '18px 0 0',
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    다른 테스트도 해보기
                  </motion.a>

                  {/* 이미지 저장용 숨김 카드 — 데스크탑 화면폭과 무관하게 항상 모바일 크기로 캡처 */}
                  <div style={{ position: 'absolute', top: 0, left: '-9999px', width: '400px', pointerEvents: 'none' }} aria-hidden="true">
                    <ResultCard ref={cardRef} result={result} />
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
                <BattleVSCard battle={result.battle} />
              </div>

              {/* 내 개인 결과 카드 */}
              <div className="flex justify-center" style={{ marginBottom: '20px' }}>
                <ResultCard result={result} />
              </div>

              {/* 사주 풀이 카드 */}
              <div className="flex justify-center" style={{ marginBottom: '24px' }}>
                <SajuAnalysisCard result={result} />
              </div>

              {/* 공유 버튼 — VS 카드 기준으로 캡처 */}
              <ShareButtons headcount={result.headcount} battleId={result.battleId} cardRef={vsCardRef} />

              <motion.a
                href="/"
                className="mx-auto w-full max-w-[400px] md:max-w-[520px] lg:max-w-[620px]"
                {...OTHER_TEST_LINK_HOVER}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '18px 0 0',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                다른 테스트도 해보기
              </motion.a>

              {/* 이미지 저장용 숨김 카드 — 데스크탑 화면폭과 무관하게 항상 모바일 크기로 캡처 */}
              <div style={{ position: 'absolute', top: 0, left: '-9999px', width: '400px', pointerEvents: 'none' }} aria-hidden="true">
                <BattleVSCard ref={vsCardRef} battle={result.battle} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
