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

const CHOICE_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  bold: { label: '직진', emoji: '💘', color: '#FF3D7F', bg: '#FFF0F3' },
  witty: { label: '위트', emoji: '✨', color: '#7A38D8', bg: '#F7F2FA' },
  safe: { label: '안전', emoji: '🤍', color: '#4488FF', bg: '#F0F5FF' },
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
      const score = Math.round(((raw + 10) / 22 * 9 + 1) * 10) / 10;
      return Math.max(1, Math.min(10, score));
    };
    const charm = normalize(rawCharm);
    const conversation = normalize(rawConversation);
    const sense = normalize(rawSense);
    const addiction = normalize(rawAddiction);
    const weights = character?.scoreWeights ?? { charm: 0.25, conversation: 0.25, sense: 0.25, addiction: 0.25 };
    const total = Math.round(
      (charm * weights.charm + conversation * weights.conversation +
       sense * weights.sense + addiction * weights.addiction) * 10
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
    setShowReaction(true);

    setTimeout(() => {
      if (newAffection <= earlyExitThreshold && currentTurn < conversationTree.turns.length - 1) {
        const scores = calculateScoreTable(allChoices);
        onComplete(allChoices, newAffection, scores, newAffection >= conversationTree.successThreshold, turn.turnNumber);
        return;
      }
      if (currentTurn >= conversationTree.turns.length - 1) {
        const scores = calculateScoreTable(allChoices);
        onComplete(allChoices, newAffection, scores, newAffection >= conversationTree.successThreshold);
        return;
      }
      setTransitioning(true);
      setSelectedChoiceId(null);
      setShowReaction(false);
      setTimeout(() => {
        setCurrentTurn(prev => prev + 1);
        setTransitioning(false);
      }, 400);
    }, 1800);
  }, [selectedChoiceId, transitioning, affection, turn, selectedChoices, currentTurn, conversationTree, earlyExitThreshold, calculateScoreTable, onComplete]);

  if (!turn) return null;

  const affectionPercent = Math.min(100, Math.max(0, affection));
  const gaugeColor = affectionPercent >= 60 ? '#7A38D8' : affectionPercent >= 30 ? '#4488FF' : '#FF3D7F';

  return (
    <div
      className="fixed inset-0 flex justify-center"
      style={{ backgroundColor: '#FAF8FC' }}
    >
      <div className="w-full max-w-[440px] h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>

        {/* ─── 헤더 (shrink-0) ─── */}
        <div
          className="shrink-0"
          style={{
            padding: '16px 20px 12px',
            borderBottom: '1px solid #f3f3f3',
            backgroundColor: '#ffffff',
          }}
        >
          {/* 캐릭터 + 턴 */}
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div className="flex items-center" style={{ gap: '10px' }}>
              <div
                className="overflow-hidden"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px',
                  border: '2px solid #7A38D8',
                  flexShrink: 0,
                }}
              >
                <img
                  src={character?.thumbnail ?? ''}
                  alt={character?.name ?? ''}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div>
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '16px',
                  fontWeight: 600,
                  lineHeight: '22px',
                  letterSpacing: '-0.32px',
                  color: '#151515',
                }}>
                  {character?.name ?? '캐릭터'}
                </p>
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '16px',
                  letterSpacing: '-0.24px',
                  color: '#848484',
                }}>
                  {character?.archetype ?? ''}
                </p>
              </div>
            </div>

            {/* 턴 표시 */}
            <div
              className="flex items-center justify-center"
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: '#F7F2FA',
              }}
            >
              <span style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '-0.24px',
                color: '#7A38D8',
              }}>
                {turn.turnNumber} / {conversationTree.turns.length}
              </span>
            </div>
          </div>

          {/* 호감도 게이지 */}
          <div
            className="w-full overflow-hidden"
            style={{ height: '6px', borderRadius: '9999px', backgroundColor: '#EDE5F7' }}
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: gaugeColor, borderRadius: '9999px' }}
              animate={{ width: `${affectionPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* ─── 대화 콘텐츠 (flex-1 overflow-auto) ─── */}
        <div
          className="flex-1 overflow-auto"
          style={{ padding: '20px 20px 0' }}
        >
        {!transitioning && (
          <>
          {/* 상황 뱃지 */}
          <div className="flex justify-center" style={{ marginBottom: '20px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`sit-${turn.turnNumber}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center"
                style={{
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: '#F7F2FA',
                  border: '1px solid #EDE5F7',
                }}
              >
                <span style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '-0.24px',
                  color: '#7A38D8',
                }}>
                  {turn.situation}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 캐릭터 대사 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`line-${turn.turnNumber}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start"
              style={{ gap: '10px', marginBottom: '8px' }}
            >
              <div
                className="overflow-hidden flex-shrink-0"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px',
                  backgroundColor: '#EDE5F7',
                }}
              >
                <img
                  src={character?.thumbnail ?? ''}
                  alt={character?.name ?? ''}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div>
                <p style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '16px',
                  letterSpacing: '-0.24px',
                  color: '#848484',
                  marginBottom: '4px',
                }}>
                  {character?.name}
                </p>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '4px 16px 16px 16px',
                    backgroundColor: '#F7F2FA',
                  }}
                >
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    letterSpacing: '-0.45px',
                    color: '#151515',
                  }}>
                    {turn.characterLine}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 선택된 유저 대사 (선택 후 우측 말풍선) */}
          <AnimatePresence>
            {selectedChoiceId && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
                style={{ marginBottom: '16px' }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '16px 4px 16px 16px',
                    backgroundColor: '#7A38D8',
                    maxWidth: '260px',
                  }}
                >
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    letterSpacing: '-0.45px',
                    color: '#ffffff',
                  }}>
                    {turn.choices.find(c => c.id === selectedChoiceId)?.text ?? ''}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 캐릭터 반응 (유저 선택 후) */}
          <AnimatePresence>
            {showReaction && selectedChoiceId && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start"
                style={{ gap: '10px', marginBottom: '16px' }}
              >
                <div
                  className="overflow-hidden flex-shrink-0"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9999px',
                    backgroundColor: '#EDE5F7',
                  }}
                >
                  <img
                    src={character?.thumbnail ?? ''}
                    alt={character?.name ?? ''}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '4px 16px 16px 16px',
                    backgroundColor: '#EDE5F7',
                  }}
                >
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '22px',
                    letterSpacing: '-0.42px',
                    color: '#525252',
                  }}>
                    {turn.characterReactions[selectedChoiceId] ?? '...'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
        )}
        </div>

        {/* ─── 선택지 하단 고정 (shrink-0) ─── */}
        <div
          className="shrink-0"
          style={{
            padding: '12px 20px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            backgroundColor: '#ffffff',
            boxShadow: '0px -8px 16px 0px rgba(255, 255, 255, 0.76)',
            borderTop: '1px solid #f3f3f3',
          }}
        >
          {!selectedChoiceId && !transitioning && (
            <div className="flex flex-col" style={{ gap: '8px' }}>
              {turn.choices.map((choice, i) => {
                const config = CHOICE_CONFIG[choice.type] ?? CHOICE_CONFIG.safe;

                return (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                    onClick={() => handleChoiceSelect(choice)}
                    className="w-full flex items-center cursor-pointer"
                    style={{
                      height: '56px',
                      borderRadius: '16px',
                      padding: '0 16px',
                      backgroundColor: '#ffffff',
                      border: `1.5px solid #e7e7e7`,
                      transition: 'all 0.15s ease',
                      gap: '12px',
                    }}
                    onPointerDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.99)';
                      e.currentTarget.style.borderColor = config.color;
                      e.currentTarget.style.backgroundColor = config.bg;
                    }}
                    onPointerUp={(e) => {
                      e.currentTarget.style.transform = '';
                    }}
                    onPointerLeave={(e) => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.borderColor = '#e7e7e7';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{config.emoji}</span>
                    <span style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '15px',
                      fontWeight: 400,
                      lineHeight: '20px',
                      letterSpacing: '-0.45px',
                      color: '#151515',
                      flex: 1,
                      textAlign: 'left',
                    }}>
                      {choice.text}
                    </span>
                    <span
                      style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: config.color,
                        backgroundColor: config.bg,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      {config.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* 선택 후 다음 턴 로딩 표시 */}
          {selectedChoiceId && (
            <div className="flex items-center justify-center" style={{ height: '56px' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
                style={{ gap: '6px' }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '9999px',
                      backgroundColor: '#7A38D8',
                    }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
