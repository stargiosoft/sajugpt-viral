'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
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
import GenderSelect from '@/components/GenderSelect';
import BirthTimeInput from '@/components/BirthTimeInput';
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
import {
  judgeChoice,
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

export default function GisaengClient({ resultId: _resultId }: Props) {
  const cached = typeof window !== 'undefined' ? loadSelfSaju() : null;
  const [birthDate, setBirthDate] = useState(cached?.birthDate ?? '');
  const [birthTime, setBirthTime] = useState(cached?.birthTime ?? '');
  const [unknownTime, setUnknownTime] = useState(cached?.unknownTime ?? false);
  const [gender, setGender] = useState<Gender>(cached?.gender ?? 'female');

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

  // 유효성 검증 — 태어난 시간은 선택사항
  const isFormValid = useCallback(() => {
    const numbers = birthDate.replace(/[^\d]/g, '');
    if (numbers.length !== 8) return false;
    const parts = birthDate.split('-');
    if (parts.length !== 3) return false;
    const [year, month, day] = parts.map(Number);
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    return true;
  }, [birthDate]);

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
    const hhmm = effectiveUnknownTime ? '1200' : convertTo24Hour(birthTime);
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

    const choice = scenario.choices[choiceIdx];
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
    const { monthlySalary, modernValue } = calculateSalary(
      analyzeData.gisaengCard.totalCharm,
      seonbi,
      tier,
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
    <div className="min-h-dvh flex flex-col items-center" style={{ backgroundColor: '#0D0B1A', fontFamily: 'Pretendard Variable, sans-serif' }}>
      <div className="w-full max-w-[440px] min-h-dvh flex flex-col">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <GisaengLanding key="landing" onStart={() => setStep('input')} />
          )}

          {step === 'input' && (
            <div key="input" className="flex-1 flex flex-col px-5 pt-12 pb-8">
              <div className="text-center mb-8">
                <p style={{ fontSize: '14px', color: '#A78BFA', fontWeight: 500 }}>🏮 기생 시뮬레이션</p>
                <h1 style={{ fontSize: '22px', color: '#FFFFFF', fontWeight: 700, marginTop: '8px', lineHeight: 1.4 }}>
                  조선시대 기생이었다면,<br />넌 밤새 얼마를 벌었을까?
                </h1>
              </div>

              <div className="flex flex-col gap-5 flex-1">
                <GenderSelect value={gender} onChange={setGender} />
                <BirthInput value={birthDate} onChange={setBirthDate} />
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

              {error && (
                <p className="text-center mt-4" style={{ fontSize: '13px', color: '#FF6B6B' }}>{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className="w-full py-4 rounded-2xl mt-6 transition-opacity disabled:opacity-40"
                style={{
                  backgroundColor: '#7A38D8',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                기방 문 열기 🏮
              </button>
            </div>
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
            <div key="result" className="flex-1 flex flex-col px-5 pt-8 pb-8 gap-6">
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
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl"
                style={{ backgroundColor: 'rgba(122, 56, 216, 0.15)', color: '#A78BFA', fontSize: '14px', fontWeight: 600 }}
              >
                다시 도전하기
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
