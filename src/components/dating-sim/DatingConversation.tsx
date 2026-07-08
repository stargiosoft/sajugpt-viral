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
  witty: { label: '위트', emoji: '✨', color: '#9B51E0', bg: '#F6EFFC' },
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
  const gaugeColor = '#FF4D8D';

  return (
    <div
      className="fixed inset-0 flex justify-center"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="w-full max-w-[768px] h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>

        {/* ─── 헤더 (shrink-0) ─── */}
        <div
          className="shrink-0"
          style={{
            padding: '16px 12px 12px',
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
                  border: '2px solid #FF4D8D',
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
                backgroundColor: '#F5F5F5',
              }}
            >
              <span style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '-0.24px',
                color: '#767676',
              }}>
                {turn.turnNumber} / {conversationTree.turns.length}
              </span>
            </div>
          </div>

          {/* 호감도 게이지 */}
          <div
            className="w-full overflow-hidden"
            style={{ height: '6px', borderRadius: '9999px', backgroundColor: '#EEEEEE' }}
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
          style={{ padding: '20px 12px 0' }}
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
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  backgroundColor: '#FFF0F5',
                }}
              >
                <span style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  letterSpacing: '-0.24px',
                  color: '#FF4D8D',
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
              style={{ gap: '10px', marginBottom: '12px' }}
            >
              <div
                className="overflow-hidden flex-shrink-0"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9999px',
                  backgroundColor: '#FCE4EC',
                  border: '2px solid rgba(255, 77, 141, 0.3)',
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
                  fontWeight: 600,
                  lineHeight: '16px',
                  letterSpacing: '-0.24px',
                  color: '#767676',
                  marginBottom: '6px',
                }}>
                  {character?.name}
                </p>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '6px 18px 18px 18px',
                    backgroundColor: '#FFF0F5',
                  }}
                >
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '25px',
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
                    padding: '12px 14px',
                    borderRadius: '18px 6px 18px 18px',
                    backgroundColor: '#FF4D8D',
                    maxWidth: 'min(80%, 420px)',
                  }}
                >
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: '25px',
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
                    width: '38px',
                    height: '38px',
                    borderRadius: '9999px',
                    backgroundColor: '#FCE4EC',
                    border: '2px solid rgba(255, 77, 141, 0.3)',
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
                    padding: '12px 14px',
                    borderRadius: '6px 18px 18px 18px',
                    backgroundColor: '#FFF0F5',
                  }}
                >
                  <p style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: '25px',
                    letterSpacing: '-0.45px',
                    color: '#151515',
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
            padding: '12px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            backgroundColor: '#ffffff',
            boxShadow: '0px -8px 16px 0px rgba(255, 255, 255, 0.76)',
          }}
        >
          {!selectedChoiceId && !transitioning && (
            <div style={{ backgroundColor: '#F7F7F7', borderRadius: '20px', padding: '16px' }}>
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
                    className="group relative w-full flex flex-col items-stretch cursor-pointer bg-white border border-[#F2F2F2] hover:bg-[#ffedf3] hover:border-[#FFA9C7] transition-colors duration-150"
                    style={{
                      minHeight: '56px',
                      borderRadius: '16px',
                      paddingTop: '20px',
                      paddingBottom: '21px',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
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
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                  >
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center shrink-0"
                      style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" style={{ transform: 'scaleX(-1)' }}>
                        <path
                          fill="#b0b0b0"
                          d="m 15.970695,3.001955 a 1.0000999,1.0000999 0 0 0 -0.6875,0.30274 l -7.9902299,7.98828 a 1.0000999,1.0000999 0 0 0 0,1.41406 l 7.9902299,7.98828 a 1.0000999,1.0000999 0 1 0 1.41407,-1.41406 l -7.2832099,-7.28125 7.2832099,-7.28125 a 1.0000999,1.0000999 0 0 0 -0.72657,-1.7168 z"
                        />
                      </svg>
                    </span>

                    <span
                      style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: config.color,
                        backgroundColor: config.bg,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        marginBottom: '4px',
                        width: 'fit-content',
                      }}
                    >
                      {config.label}
                    </span>
                    <div className="w-full" style={{ paddingRight: '20px', paddingLeft: '2px', textAlign: 'left' }}>
                      <span style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        letterSpacing: '-0.45px',
                        color: '#151515',
                        textAlign: 'left',
                      }}>
                        {choice.text}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
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
                      backgroundColor: '#FF4D8D',
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
