'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Gender } from '@/types/battle';
import type {
  GisaengStep,
  GisaengAnalyzeResponse,
  SeonbiState,
  SeonbiType,
  GisaengStats,
  RoundResult,
  GisaengTier,
  SimulationResult,
  GisaengSaveResponse,
} from '@/types/gisaeng';
import BirthInput from '@/components/BirthInput';
import TestTopNav from '@/components/TestTopNav';
import GenderSelect from '@/components/GenderSelect';
import TimeSelectSheet from '@/components/TimeSelectSheet';
import StickyCTAButton from '@/components/StickyCTAButton';
import TextLinkButton from '@/components/TextLinkButton';
import OutlineBoxButton from '@/components/OutlineBoxButton';
import FieldLabel from '@/components/FieldLabel';
import GisaengLanding from './GisaengLanding';
import GisaengAnalyzing from './GisaengAnalyzing';
import GisaengCardView from './GisaengCardView';
import RoundScreen from './RoundScreen';
import GisaengCalculating from './GisaengCalculating';
import GisaengResultCard from './GisaengResultCard';
import GisaengShareButtons from './GisaengShareButtons';
import GisaengCTA from './GisaengCTA';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { parseUTM, trackEvent } from '@/lib/analytics';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { parseKoreanTimeTo24Hour } from '@/lib/koreanTime';
import {
  judgeChoice,
  getAdjustedChoices,
  applyEffects,
  getMostSuspiciousSeonbi,
  isAllDead,
  judgeTier,
  calculateSalary,
} from '@/lib/gisaengSimulation';
import {
  ROUND1_SCENARIO,
  ROUND2_SCENARIOS,
  ROUND3_SCENARIO,
  TIER_INFO,
  FALLBACK_TIER_NARRATIVES,
  FALLBACK_SEONBI_COMMENTS,
} from '@/constants/gisaeng';

interface Props {
  resultId?: string;
}


export default function GisaengClient({ resultId: _resultId }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  const [step, setStep] = useState<GisaengStep>('landing');
  const [error, setError] = useState<string | null>(null);

  // 1차 응답
  const [analyzeData, setAnalyzeData] = useState<GisaengAnalyzeResponse | null>(null);

  // 시뮬 상태
  const [seonbi, setSeonbi] = useState<Record<SeonbiType, SeonbiState> | null>(null);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);

  // 최종 결과
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const resultCardRef = useRef<HTMLDivElement>(null);

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

  // 캐시 저장
  useEffect(() => {
    saveSelfSaju({ birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);

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
    if (utm.gender) setGender(utm.gender === 'male' ? 'male' : 'female');
    if (hasUTM && step === 'landing') setStep('input');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 유효성 검증 — 생년월일 완전 입력 + 태어난 시간 명시적 선택 필요
  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const parts = birthDate.split('-');
    if (parts.length !== 3) return false;
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
    if (!birthTime && !unknownTime) return false;
    return true;
  }, [birthDate, birthTime, unknownTime]);

  // 태어난 시간 선택 (시진 드롭다운)
  const handleTimeSelect = useCallback((displayTime: string, isUnknown: boolean) => {
    setUnknownTime(isUnknown);
    setBirthTime(displayTime);
  }, []);

  // 제출 → 기생 카드 생성
  const handleSubmit = async () => {
    if (!isFormValid()) return;

    // 태어난 시간 미입력 시 자동으로 '모르겠어요' 처리 → 오후 12:00
    const hasValidTime = birthTime.includes('오전') || birthTime.includes('오후');
    const effectiveUnknownTime = unknownTime || !hasValidTime;
    if (effectiveUnknownTime && !unknownTime) {
      setUnknownTime(true);
      setBirthTime('오후 12:00');
    }

    trackEvent('gisaeng_input_start');
    setStep('analyzing');
    setError(null);

    const numbers = birthDate.replace(/[^\d]/g, '');
    const hhmm = effectiveUnknownTime ? '1200' : parseKoreanTimeTo24Hour(birthTime);
    const birthday = `${numbers}${hhmm}`;

    const utm = parseUTM();
    const minDelay = new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const [data] = await Promise.all([
        callEdgeFunction<GisaengAnalyzeResponse>('analyze-gisaeng', {
          birthday,
          gender,
          birthTimeUnknown: effectiveUnknownTime,
          calendarType: 'solar',
          utmSource: utm.utmSource,
          utmMedium: utm.utmMedium,
          utmCampaign: utm.utmCampaign,
        }),
        minDelay,
      ]);

      setAnalyzeData(data);
      setSeonbi(data.seonbi as Record<SeonbiType, SeonbiState>);
      trackEvent('gisaeng_card_generated', { type: data.gisaengCard.type });
      setStep('gisaeng-card');
    } catch {
      setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setStep('input');
    }
  };

  // 라운드 선택 처리
  const handleRoundChoice = (round: 1 | 2 | 3, choiceIdx: number) => {
    if (!analyzeData || !seonbi) return;
    const stats = analyzeData.gisaengCard.stats;

    let scenario;
    if (round === 1) {
      scenario = ROUND1_SCENARIO;
    } else if (round === 2) {
      const suspiciousType = getMostSuspiciousSeonbi(seonbi);
      if (!suspiciousType) {
        goToCalculating();
        return;
      }
      scenario = ROUND2_SCENARIOS[suspiciousType];
    } else {
      scenario = ROUND3_SCENARIO;
    }

    const adjustedChoices = getAdjustedChoices(scenario.choices, stats);
    const choice = adjustedChoices[choiceIdx];
    const success = judgeChoice(choice, stats);
    const effects = success ? choice.successEffects : choice.failEffects;
    const nextSeonbi = applyEffects(seonbi, effects);

    const roundResult: RoundResult = {
      round,
      choiceId: choice.id,
      success,
      seonbiAfter: {
        kwonryeok: { loyalty: nextSeonbi.kwonryeok.loyalty, suspicion: nextSeonbi.kwonryeok.suspicion, alive: nextSeonbi.kwonryeok.alive },
        romantic: { loyalty: nextSeonbi.romantic.loyalty, suspicion: nextSeonbi.romantic.suspicion, alive: nextSeonbi.romantic.alive },
        jealousy: { loyalty: nextSeonbi.jealousy.loyalty, suspicion: nextSeonbi.jealousy.suspicion, alive: nextSeonbi.jealousy.alive },
      },
    };

    setSeonbi(nextSeonbi);
    setRoundResults(prev => [...prev, roundResult]);

    return { success, nextSeonbi };
  };

  const advanceRound = (currentRound: 1 | 2 | 3) => {
    if (!seonbi) return;

    if (isAllDead(seonbi)) {
      goToCalculating();
      return;
    }

    if (currentRound === 1) setStep('round2');
    else if (currentRound === 2) setStep('round3');
    else goToCalculating();
  };

  // 결산
  const goToCalculating = async () => {
    if (!analyzeData || !seonbi) return;
    setStep('calculating');

    const tier = judgeTier(seonbi);
    const successCount = roundResults.filter(r => r.success).length;
    const { monthlySalary, modernValue } = calculateSalary(
      analyzeData.gisaengCard.totalCharm,
      seonbi,
      tier,
      successCount,
    );

    // 라운드 3 C 선택 성공 시 바람끼력 +50 보너스
    const charmBonus = roundResults.some(r => r.round === 3 && r.choiceId === 'C' && r.success) ? 50 : 0;
    const totalCharmAfter = analyzeData.gisaengCard.totalCharm + charmBonus;

    const simResult: Omit<SimulationResult, 'finalNarrative' | 'seonbiComments'> = {
      rounds: roundResults,
      finalSeonbi: {
        kwonryeok: { ...seonbi.kwonryeok },
        romantic: { ...seonbi.romantic },
        jealousy: { ...seonbi.jealousy },
      },
      tier,
      tierLabel: TIER_INFO[tier].label,
      monthlySalary,
      modernValue,
      totalCharmAfter,
    };

    const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const [saveResp] = await Promise.all([
        callEdgeFunction<GisaengSaveResponse>('save-gisaeng-result', {
          resultId: analyzeData.resultId,
          simulationResult: simResult,
        }),
        minDelay,
      ]);

      setSimulationResult({
        ...simResult,
        finalNarrative: saveResp.finalNarrative,
        seonbiComments: saveResp.seonbiComments,
      });
    } catch {
      // 폴백 서사 사용
      setSimulationResult({
        ...simResult,
        finalNarrative: FALLBACK_TIER_NARRATIVES[tier],
        seonbiComments: {
          kwonryeok: seonbi.kwonryeok.alive
            ? FALLBACK_SEONBI_COMMENTS.kwonryeok.alive
            : FALLBACK_SEONBI_COMMENTS.kwonryeok.dead,
          romantic: seonbi.romantic.alive
            ? FALLBACK_SEONBI_COMMENTS.romantic.alive
            : FALLBACK_SEONBI_COMMENTS.romantic.dead,
          jealousy: seonbi.jealousy.alive
            ? FALLBACK_SEONBI_COMMENTS.jealousy.alive
            : FALLBACK_SEONBI_COMMENTS.jealousy.dead,
        },
      });
    }

    trackEvent('gisaeng_result', { tier, monthlySalary });
    setStep('result');
  };

  // 다시하기
  const handleReset = () => {
    setAnalyzeData(null);
    setSeonbi(null);
    setRoundResults([]);
    setSimulationResult(null);
    setError(null);
    setStep('landing');
  };

  // 현재 라운드 시나리오 계산
  const getCurrentRound2Scenario = () => {
    if (!seonbi) return ROUND2_SCENARIOS.kwonryeok;
    const suspiciousType = getMostSuspiciousSeonbi(seonbi);
    return suspiciousType ? ROUND2_SCENARIOS[suspiciousType] : ROUND2_SCENARIOS.kwonryeok;
  };

  return (
    <div className="fixed inset-0 flex justify-center" style={{ backgroundColor: '#F5F0E8', fontFamily: 'Pretendard Variable, sans-serif' }}>
      <div className="w-full max-w-[768px] h-full flex flex-col">
        <div className="flex-1 overflow-auto w-full">
        <TestTopNav />
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <GisaengLanding key="landing" onStart={() => setStep('input')} />
          )}

          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ padding: '48px 12px 120px' }}
            >
              {/* 헤더 — 색기 배틀 동일 패턴 */}
              <div className="flex flex-col items-center" style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '40px', marginBottom: '8px' }}>🏮</span>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1A1715', marginBottom: '8px', textAlign: 'center', letterSpacing: '-0.56px' }}>
                  기생 시뮬레이션
                </h1>
                <p style={{ fontSize: '15px', color: '#6B5F56', fontWeight: 500, textAlign: 'center', lineHeight: '1.6', letterSpacing: '-0.45px' }}>
                  조선시대 기생이었다면<br />넌 밤새 얼마를 벌었을까?
                </p>
              </div>

              {/* 입력 폼 — 색기 배틀 동일 패턴 */}
              <motion.div
                className="flex flex-col"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {/* 성별 */}
                <motion.div
                  className="flex flex-col w-full"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <FieldLabel color="#A69A8E">성별</FieldLabel>
                  <GenderSelect value={gender} onChange={setGender} accentColor="#B8423A" />
                </motion.div>

                {/* 생년월일 */}
                <motion.div
                  className="flex flex-col w-full"
                  style={{ marginTop: '36px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <FieldLabel color="#A69A8E">생년월일 (양력 기준으로 입력해 주세요)</FieldLabel>
                  <BirthInput value={birthDate} onChange={setBirthDate} accentColor="#B8423A" onEnter={handleSubmit} />
                </motion.div>

                {/* 태어난 시간 */}
                <motion.div
                  className="flex flex-col w-full"
                  style={{ marginTop: '36px' }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
                >
                  <FieldLabel color="#A69A8E">태어난 시간</FieldLabel>
                  <TimeSelectSheet
                    value={birthTime}
                    unknownTime={unknownTime}
                    onSelect={handleTimeSelect}
                    accentColor="#B8423A"
                    bgColor="#fff"
                    borderColor="1.5px solid #e7e7e7"
                    textColor="#151515"
                    placeholderColor="#A69A8E"
                  />
                </motion.div>

                {/* 에러 — 색기 배틀 동일 패턴 */}
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

              {/* 하단 고정 CTA — 색기 배틀 동일 패턴 */}
              <StickyCTAButton
                isValid={isFormValid()}
                onClick={handleSubmit}
                label="기방 문 열기 🏮"
                containerBackground="#F5F0E8"
                containerBoxShadow="0px -8px 16px 0px rgba(245,240,232,0.76)"
                activeBackground="#B8423A"
                inactiveBackground="#EDE6D8"
                inactiveTextColor="#A69A8E"
              />
            </motion.div>
          )}

          {step === 'analyzing' && (
            <GisaengAnalyzing key="analyzing" type="analyzing" />
          )}

          {step === 'gisaeng-card' && analyzeData && (
            <GisaengCardView
              key="gisaeng-card"
              gisaengCard={analyzeData.gisaengCard}
              onNext={() => setStep('round1')}
            />
          )}

          {step === 'round1' && seonbi && analyzeData && (
            <RoundScreen
              key="round1"
              scenario={ROUND1_SCENARIO}
              seonbi={seonbi}
              stats={analyzeData.gisaengCard.stats}
              onChoice={(idx) => {
                const result = handleRoundChoice(1, idx);
                return result ?? { success: false, nextSeonbi: seonbi };
              }}
              onNext={() => advanceRound(1)}
            />
          )}

          {step === 'round2' && seonbi && analyzeData && (
            <RoundScreen
              key="round2"
              scenario={getCurrentRound2Scenario()}
              seonbi={seonbi}
              stats={analyzeData.gisaengCard.stats}
              onChoice={(idx) => {
                const result = handleRoundChoice(2, idx);
                return result ?? { success: false, nextSeonbi: seonbi };
              }}
              onNext={() => advanceRound(2)}
            />
          )}

          {step === 'round3' && seonbi && analyzeData && (
            <RoundScreen
              key="round3"
              scenario={ROUND3_SCENARIO}
              seonbi={seonbi}
              stats={analyzeData.gisaengCard.stats}
              onChoice={(idx) => {
                const result = handleRoundChoice(3, idx);
                return result ?? { success: false, nextSeonbi: seonbi };
              }}
              onNext={() => advanceRound(3)}
            />
          )}

          {step === 'calculating' && (
            <GisaengCalculating key="calculating" />
          )}

          {step === 'result' && simulationResult && analyzeData && (
            <div key="result" className="flex-1 flex flex-col gap-5" style={{ padding: '32px 12px 48px' }}>
              <GisaengResultCard
                ref={resultCardRef}
                gisaengCard={analyzeData.gisaengCard}
                simulation={simulationResult}
              />
              <GisaengShareButtons
                cardRef={resultCardRef}
                resultId={analyzeData.resultId}
                tier={simulationResult.tier}
                monthlySalary={simulationResult.monthlySalary}
                gisaengName={analyzeData.gisaengCard.gisaengName}
              />
              <GisaengCTA
                seonbi={simulationResult.finalSeonbi}
                tier={simulationResult.tier}
              />
              <OutlineBoxButton
                onClick={handleReset}
                height="56px"
                borderRadius="16px"
                fontSize="16px"
                color="#6B5F56"
              >
                다시 도전하기
              </OutlineBoxButton>
              <TextLinkButton
                href="/"
                color="#999"
                layoutStyle={{ display: 'block', width: '100%', lineHeight: '56px', textAlign: 'center' }}
              >
                다른 테스트도 해보기
              </TextLinkButton>
            </div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
