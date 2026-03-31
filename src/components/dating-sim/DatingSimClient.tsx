'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  Gender,
  DatingStep,
  SajuIndicators,
  CharacterRecommendation,
  ConversationTree,
  SelectedChoice,
  ScoreTable,
  FinalizeDatingResultResponse,
  AnalyzeDatingSimResponse,
  GenerateConversationResponse,
} from '@/types/dating';
import { callEdgeFunction } from '@/lib/fetchWithRetry';
import { parseUTM } from '@/lib/analytics';
import { loadSelfSaju, saveSelfSaju } from '@/lib/sajuCache';
import { EARLY_EXIT_THRESHOLD } from '@/constants/dating-characters';
import DatingLanding from './DatingLanding';
import DatingInput from './DatingInput';
import DatingAnalyzing from './DatingAnalyzing';
import CharacterRecommendation_ from './CharacterRecommendation';
import DatingConversation from './DatingConversation';
import DatingResult from './DatingResult';

interface Props {
  sharedResultId?: string;
}

export default function DatingSimClient({ sharedResultId }: Props) {
  // ─── 입력 상태 ──────────────────────────────────────
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<Gender>('female');

  // ─── 플로우 상태 ────────────────────────────────────
  const [step, setStep] = useState<DatingStep>('landing');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ─── 분석 결과 ──────────────────────────────────────
  const [resultId, setResultId] = useState<string | null>(null);
  const [sajuIndicators, setSajuIndicators] = useState<SajuIndicators | null>(null);
  const [ilganDescription, setIlganDescription] = useState('');
  const [recommendations, setRecommendations] = useState<CharacterRecommendation[]>([]);

  // ─── 시뮬레이션 상태 ────────────────────────────────
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [conversationTree, setConversationTree] = useState<ConversationTree | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<SelectedChoice[]>([]);
  const [finalAffection, setFinalAffection] = useState(0);
  const [scoreTable, setScoreTable] = useState<ScoreTable | null>(null);
  const [success, setSuccess] = useState(false);
  const [earlyExitTurn, setEarlyExitTurn] = useState<number | undefined>(undefined);

  // ─── 결과 상태 ──────────────────────────────────────
  const [finalResult, setFinalResult] = useState<FinalizeDatingResultResponse | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);

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

  // 입력값 변경 시 공통 캐시에 저장
  useEffect(() => {
    saveSelfSaju({ birthDate, birthTime, unknownTime, gender });
  }, [birthDate, birthTime, unknownTime, gender]);

  // ─── UTM 자동입력 ──────────────────────────────────
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
        const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
        setBirthTime(`${period} ${String(displayH).padStart(2, '0')}:${mi}`);
      }
    }
    if (utm.gender) {
      hasUTM = true;
      setGender(utm.gender === 'male' ? 'male' : 'female');
    }
    if (hasUTM && !sharedResultId) {
      setStep('input');
    }
  }, [sharedResultId]);

  // 공유 링크로 들어온 경우 → 입력 폼으로
  useEffect(() => {
    if (sharedResultId) {
      setStep('input');
    }
  }, [sharedResultId]);

  // ─── Step 1→2: 사주 분석 제출 ──────────────────────
  const handleSubmit = useCallback(async () => {
    if (!birthDate || submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const utm = parseUTM();
      const data = await callEdgeFunction<AnalyzeDatingSimResponse>('analyze-dating-sim', {
        birthday: birthDate,
        birthTime: unknownTime ? '모름' : birthTime || '모름',
        gender,
        calendarType: 'solar',
        utmSource: utm.utmSource ?? undefined,
        utmMedium: utm.utmMedium ?? undefined,
      });

      setResultId(data.resultId);
      setSajuIndicators(data.sajuIndicators);
      setIlganDescription(data.ilganDescription);
      setRecommendations(data.recommendations);
      setStep('recommendation');
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      setStep('input');
    } finally {
      setSubmitting(false);
    }
  }, [birthDate, birthTime, unknownTime, gender, submitting]);

  // ─── Step 2→3: 캐릭터 선택 후 대화 생성 ──────────────
  const handleCharacterSelect = useCallback(async (characterId: string) => {
    if (!resultId || !sajuIndicators || submitting) return;
    setSelectedCharacterId(characterId);
    setSubmitting(true);
    setStep('preparing');

    const rec = recommendations.find(r => r.characterId === characterId);
    const compatibility = rec?.compatibility ?? 50;

    try {
      const data = await callEdgeFunction<GenerateConversationResponse>(
        'generate-dating-conversation',
        {
          resultId,
          characterId,
          sajuIndicators,
          ilganDescription,
          compatibility,
          gender,
        },
        { timeoutMs: 90000 },
      );

      setConversationTree(data.conversationTree);
      setSelectedChoices([]);
      setFinalAffection(Math.round(compatibility / 5));
      setStep('conversation');
    } catch (err) {
      setError(err instanceof Error ? err.message : '대화 생성 중 오류가 발생했습니다.');
      setStep('recommendation');
    } finally {
      setSubmitting(false);
    }
  }, [resultId, sajuIndicators, ilganDescription, recommendations, gender, submitting]);

  // ─── Step 3→4: 대화 완료 → 결과 계산 ─────────────────
  const handleConversationComplete = useCallback(async (
    choices: SelectedChoice[],
    affection: number,
    scores: ScoreTable,
    isSuccess: boolean,
    exitTurn?: number,
  ) => {
    if (!resultId || !selectedCharacterId || submitting) return;
    setSelectedChoices(choices);
    setFinalAffection(affection);
    setScoreTable(scores);
    setSuccess(isSuccess);
    setEarlyExitTurn(exitTurn);
    setSubmitting(true);
    setStep('calculating');

    try {
      const data = await callEdgeFunction<FinalizeDatingResultResponse>(
        'finalize-dating-result',
        {
          resultId,
          characterId: selectedCharacterId,
          selectedChoices: choices.map(c => ({
            turnNumber: c.turnNumber,
            choiceId: c.choiceId,
            choiceType: c.choiceType,
          })),
          finalAffection: affection,
          scoreTable: scores,
          success: isSuccess,
          earlyExitTurn: exitTurn,
        },
      );

      setFinalResult(data);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '결과 계산 중 오류가 발생했습니다.');
      setStep('result');
      // 에러여도 로컬 점수로 결과 표시
      setFinalResult({
        userRank: 1,
        totalCount: 1,
        percentile: 50,
        badgeType: '수련이 필요합니다',
        sameIlganAvg: scores.total,
        sameIlganCount: 0,
        verdict: {
          oneLineVerdict: isSuccess
            ? `${scores.total}점... 인정.`
            : `${scores.total}점... 다음엔 좀 더 노력해봐.`,
          sajuAnalysis: '사주 분석 데이터를 불러오지 못했습니다.',
          patterns: [],
          rankComment: '',
        },
        shareUrl: `/dating-sim/${resultId}`,
      });
    } finally {
      setSubmitting(false);
    }
  }, [resultId, selectedCharacterId, submitting]);

  // ─── 재도전 ────────────────────────────────────────
  const handleRetry = useCallback((sameCharacter: boolean) => {
    setAttemptNumber(prev => prev + 1);
    if (sameCharacter && selectedCharacterId) {
      handleCharacterSelect(selectedCharacterId);
    } else {
      setStep('recommendation');
    }
  }, [selectedCharacterId, handleCharacterSelect]);

  // ─── 렌더링 ────────────────────────────────────────
  return (
    <div className="fixed inset-0 flex justify-center" style={{ backgroundColor: '#fff' }}>
      <div className="w-full max-w-[440px] h-full flex flex-col">
        <div className="flex-1 overflow-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DatingLanding
                onStart={() => setStep('input')}
              />
            </motion.div>
          )}

          {step === 'input' && (
            <DatingInput
              key="input"
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              birthTime={birthTime}
              setBirthTime={setBirthTime}
              unknownTime={unknownTime}
              setUnknownTime={setUnknownTime}
              gender={gender}
              setGender={setGender}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
            />
          )}

          {(step === 'preparing' || step === 'calculating') && (
            <DatingAnalyzing
              key="analyzing"
              phase={step}
            />
          )}

          {step === 'recommendation' && (
            <CharacterRecommendation_
              key="recommendation"
              recommendations={recommendations}
              onSelect={handleCharacterSelect}
              submitting={submitting}
            />
          )}

          {step === 'conversation' && conversationTree && selectedCharacterId && (
            <DatingConversation
              key="conversation"
              conversationTree={conversationTree}
              characterId={selectedCharacterId}
              initialAffection={finalAffection}
              earlyExitThreshold={EARLY_EXIT_THRESHOLD}
              onComplete={handleConversationComplete}
            />
          )}

          {step === 'result' && scoreTable && selectedCharacterId && (
            <DatingResult
              key="result"
              characterId={selectedCharacterId}
              scoreTable={scoreTable}
              success={success}
              finalResult={finalResult}
              earlyExitTurn={earlyExitTurn}
              attemptNumber={attemptNumber}
              resultId={resultId ?? ''}
              onRetry={handleRetry}
            />
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
