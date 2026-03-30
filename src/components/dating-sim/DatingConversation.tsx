'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConversationTree, SelectedChoice, ScoreTable, DatingChoice } from '@/types/dating';
import { DATING_CHARACTERS } from '@/constants/dating-characters';

interface Props {
  conversationTree: ConversationTree;
  characterId: string;
  initialAffection: number;
  earlyExitThreshold: number;
  onComplete: (
    choices: SelectedChoice[],
    affection: number,
    scores: ScoreTable,
    success: boolean,
    earlyExitTurn?: number,
  ) => void;
}

const CHOICE_STYLE: Record<string, { border: string; bg: string }> = {
  bold: { border: '#FF6B6B', bg: '#FFF5F5' },
  witty: { border: '#7A38D8', bg: '#F7F2FA' },
  safe: { border: '#4488FF', bg: '#F0F5FF' },
};

export default function DatingConversation({
  conversationTree,
  characterId,
  initialAffection,
  earlyExitThreshold,
  onComplete,
}: Props) {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [affection, setAffection] = useState(initialAffection);
  const [selectedChoices, setSelectedChoices] = useState<SelectedChoice[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const character = DATING_CHARACTERS.find(c => c.id === characterId);
  const turn = conversationTree.turns[currentTurn];

  const calculateScoreTable = useCallback((choices: SelectedChoice[]): ScoreTable => {
    let rawCharm = 0, rawConversation = 0, rawSense = 0, rawAddiction = 0;
    for (const c of choices) {
      rawCharm += c.choice.scoreImpact.charm;
      rawConversation += c.choice.scoreImpact.conversation;
      rawSense += c.choice.scoreImpact.sense;
      rawAddiction += c.choice.scoreImpact.addiction;
    }

    const normalize = (raw: number) => {
      const score = Math.round(((raw + 10) / 28 * 9 + 1) * 10) / 10;
      return Math.max(1, Math.min(10, score));
    };

    const charm = normalize(rawCharm);
    const conversation = normalize(rawConversation);
    const sense = normalize(rawSense);
    const addiction = normalize(rawAddiction);

    const weights = character?.scoreWeights ?? { charm: 0.25, conversation: 0.25, sense: 0.25, addiction: 0.25 };
    const total = Math.round(
      (charm * weights.charm +
       conversation * weights.conversation +
       sense * weights.sense +
       addiction * weights.addiction) * 10
    ) / 10;

    const scores = { charm, conversation, sense, addiction };
    const lowestKey = (Object.entries(scores) as [keyof typeof scores, number][])
      .sort(([, a], [, b]) => a - b)[0][0];

    return { charm, conversation, sense, addiction, total, lowestKey };
  }, [character]);

  const handleChoiceSelect = useCallback((choice: DatingChoice) => {
    if (selectedChoiceId || transitioning) return;

    setSelectedChoiceId(choice.id);
    const newAffection = Math.max(0, Math.min(100, affection + choice.affectionDelta));
    setAffection(newAffection);

    const selected: SelectedChoice = {
      turnNumber: turn.turnNumber,
      choiceId: choice.id,
      choiceType: choice.type,
      choice,
    };
    const allChoices = [...selectedChoices, selected];
    setSelectedChoices(allChoices);

    // 반응 보여주기
    setShowReaction(true);

    setTimeout(() => {
      // 조기 종료 체크
      if (newAffection <= earlyExitThreshold && currentTurn < conversationTree.turns.length - 1) {
        const scores = calculateScoreTable(allChoices);
        const isSuccess = newAffection >= conversationTree.successThreshold;
        onComplete(allChoices, newAffection, scores, isSuccess, turn.turnNumber);
        return;
      }

      // 마지막 턴이면 완료
      if (currentTurn >= conversationTree.turns.length - 1) {
        const scores = calculateScoreTable(allChoices);
        const isSuccess = newAffection >= conversationTree.successThreshold;
        onComplete(allChoices, newAffection, scores, isSuccess);
        return;
      }

      // 다음 턴으로
      setTransitioning(true);
      setTimeout(() => {
        setCurrentTurn(prev => prev + 1);
        setSelectedChoiceId(null);
        setShowReaction(false);
        setTransitioning(false);
      }, 400);
    }, 1800);
  }, [
    selectedChoiceId, transitioning, affection, turn, selectedChoices,
    currentTurn, conversationTree, earlyExitThreshold, calculateScoreTable, onComplete,
  ]);

  if (!turn) return null;

  // 호감도 게이지 비율 (비공개이므로 대략적 시각화)
  const affectionPercent = Math.min(100, Math.max(0, affection));
  const gaugeColor = affectionPercent >= 60 ? '#7A38D8' : affectionPercent >= 30 ? '#4488FF' : '#FF6B6B';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col px-6 pt-6 pb-8"
    >
      {/* 헤더: 턴 표시 + 호감도 게이지 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#7A38D8',
            }}
          >
            Turn {turn.turnNumber} / {conversationTree.turns.length}
          </span>
          <span
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              color: '#848484',
            }}
          >
            {character?.name ?? '캐릭터'}의 관심도
          </span>
        </div>

        {/* 호감도 게이지 바 */}
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: '#EDE5F7' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: gaugeColor }}
            animate={{ width: `${affectionPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 상황 설명 */}
      <p
        className="mb-4 text-center"
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          color: '#b0b0b0',
          fontStyle: 'italic',
        }}
      >
        {turn.situation}
      </p>

      {/* 캐릭터 대사 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`char-${turn.turnNumber}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-start gap-3 mb-6"
        >
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: '#EDE5F7' }}
          >
            <img
              src={character?.thumbnail ?? ''}
              alt={character?.name ?? ''}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div
            className="flex-1 rounded-2xl rounded-tl-sm p-4"
            style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <p
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                lineHeight: '22px',
                color: '#1a1a1a',
              }}
            >
              {turn.characterLine}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 캐릭터 반응 (선택 후) */}
      <AnimatePresence>
        {showReaction && selectedChoiceId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 mb-6"
          >
            <div className="w-10 h-10 flex-shrink-0" />
            <div
              className="flex-1 rounded-2xl rounded-tl-sm p-4"
              style={{ backgroundColor: '#F7F2FA' }}
            >
              <p
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                  color: '#6d6d6d',
                }}
              >
                {turn.characterReactions[selectedChoiceId] ?? '...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 선택지 */}
      <div className="mt-auto flex flex-col gap-3">
        {turn.choices.map((choice, i) => {
          const style = CHOICE_STYLE[choice.type] ?? CHOICE_STYLE.safe;
          const isSelected = selectedChoiceId === choice.id;
          const isDisabled = !!selectedChoiceId;

          return (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleChoiceSelect(choice)}
              disabled={isDisabled}
              className="w-full rounded-xl p-4 text-left active:scale-[0.98] disabled:opacity-60"
              style={{
                backgroundColor: isSelected ? style.bg : '#ffffff',
                border: `1.5px solid ${isSelected ? style.border : '#e8e8e8'}`,
                transition: 'all 0.15s',
              }}
            >
              <p
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '15px',
                  fontWeight: isSelected ? 500 : 400,
                  lineHeight: '22px',
                  color: isSelected ? style.border : '#1a1a1a',
                }}
              >
                {choice.text}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
