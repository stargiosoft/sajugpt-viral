'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NightManualResult, InterventionChoice, DebateSubStep, ServantType } from '@/types/night-manual';
import { SERVANTS, INTERVENTION_REACTIONS } from '@/constants/night-manual';

interface Props {
  result: NightManualResult;
  interventionChoice: InterventionChoice | null;
  onIntervene: (choice: InterventionChoice) => void;
  onComplete: () => void;
}

interface DialogueLine {
  speaker: string;
  type: ServantType | 'system';
  text: string;
}

function parseDialogue(script: string): DialogueLine[] {
  const lines: DialogueLine[] = [];
  const parts = script.split('\n\n').filter(Boolean);

  for (const part of parts) {
    const colonIdx = part.indexOf(':');
    if (colonIdx === -1) continue;
    const speaker = part.slice(0, colonIdx).trim();
    const text = part.slice(colonIdx + 1).trim().replace(/^[""]|[""]$/g, '');

    let type: ServantType | 'system' = 'system';
    if (speaker.includes('강해')) type = 'beast';
    else if (speaker.includes('윤서')) type = 'poet';
    else if (speaker.includes('도겸')) type = 'butler';

    lines.push({ speaker, type, text });
  }
  return lines;
}

const SERVANT_COLORS: Record<ServantType, string> = {
  beast: '#ff6b6b',
  poet: '#6bb5ff',
  butler: '#7ce08a',
};

function ChatBubble({ line, index }: { line: DialogueLine; index: number }) {
  const color = line.type !== 'system' ? SERVANT_COLORS[line.type] : '#888';
  const servant = line.type !== 'system' ? SERVANTS[line.type] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.8, duration: 0.4 }}
      style={{ marginBottom: '16px' }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
        {servant && (
          <span style={{ fontSize: '14px' }}>{servant.emoji}</span>
        )}
        <span style={{ fontSize: '13px', fontWeight: 700, color }}>
          {line.speaker}
        </span>
        {servant && (
          <span style={{ fontSize: '11px', color: '#6b6080' }}>
            {servant.label}
          </span>
        )}
      </div>
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '4px 16px 16px 16px',
          backgroundColor: '#1e1a2e',
          border: `1px solid ${color}22`,
        }}
      >
        <p style={{
          fontSize: '14px',
          color: '#ddd5ee',
          lineHeight: '1.7',
          wordBreak: 'keep-all',
        }}>
          {line.text}
        </p>
      </div>
    </motion.div>
  );
}

export default function DebatePhase({ result, interventionChoice, onIntervene, onComplete }: Props) {
  const [subStep, setSubStep] = useState<DebateSubStep>('eavesdrop');
  const [showInterventionButtons, setShowInterventionButtons] = useState(false);

  const phase1Lines = parseDialogue(result.phase1Script);

  // 엿듣기 대사 다 나오면 개입 선택지 표시
  useEffect(() => {
    if (subStep === 'eavesdrop') {
      const timer = setTimeout(() => {
        setShowInterventionButtons(true);
      }, phase1Lines.length * 800 + 1000);
      return () => clearTimeout(timer);
    }
  }, [subStep, phase1Lines.length]);

  const handleIntervene = useCallback((choice: InterventionChoice) => {
    onIntervene(choice);
    setSubStep('intervene');
  }, [onIntervene]);

  const interventionReactions = interventionChoice
    ? parseDialogue(result.phase2Reactions[interventionChoice])
    : [];

  const phase3Lines = [
    { speaker: `${SERVANTS.beast.emoji} ${SERVANTS.beast.name}`, type: 'beast' as ServantType, text: result.phase3Proposals.beast },
    { speaker: `${SERVANTS.poet.emoji} ${SERVANTS.poet.name}`, type: 'poet' as ServantType, text: result.phase3Proposals.poet },
    { speaker: `${SERVANTS.butler.emoji} ${SERVANTS.butler.name}`, type: 'butler' as ServantType, text: result.phase3Proposals.butler },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '40px 24px 120px', minHeight: '100dvh' }}
    >
      {/* 헤더 */}
      <div className="text-center" style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: '#8b7aaa', letterSpacing: '2px' }}>
          {subStep === 'eavesdrop' ? '병풍 뒤에서 엿듣는 중...' :
           subStep === 'intervene' ? '시종들이 반응하는 중...' :
           '시종별 최종 제안'}
        </p>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f0e6ff', marginTop: '8px' }}>
          {subStep === 'eavesdrop' ? '"오늘 밤 마마를 어떻게 모실 것인가"' :
           subStep === 'intervene' ? '시종들의 반응' :
           '각 시종의 최종 제안'}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {/* Phase 1: 엿듣기 */}
        {subStep === 'eavesdrop' && (
          <motion.div key="eavesdrop" exit={{ opacity: 0 }}>
            {phase1Lines.map((line, i) => (
              <ChatBubble key={i} line={line} index={i} />
            ))}

            {/* 개입 선택지 */}
            {showInterventionButtons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '24px',
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(122, 56, 216, 0.1)',
                  border: '1px solid rgba(122, 56, 216, 0.2)',
                }}
              >
                <p style={{ fontSize: '14px', color: '#c4b5d9', marginBottom: '16px', textAlign: 'center', fontWeight: 600 }}>
                  토론이 과열되고 있다. 어떻게 하겠는가?
                </p>
                {([
                  { choice: 'listen' as InterventionChoice, label: '가만히 더 듣는다', desc: '토론이 더 과격해진다' },
                  { choice: 'cough' as InterventionChoice, label: '헛기침으로 존재감을 알린다', desc: '시종들이 경악한다' },
                  { choice: 'interrupt' as InterventionChoice, label: '"뭐가 그리 시끄럽냐"', desc: '시종들이 즉시 무릎 꿇는다' },
                ]).map(({ choice, label, desc }) => (
                  <motion.button
                    key={choice}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleIntervene(choice)}
                    className="w-full text-left"
                    style={{
                      padding: '14px 16px',
                      marginBottom: '8px',
                      borderRadius: '12px',
                      backgroundColor: '#1e1a2e',
                      border: '1px solid #2a2440',
                      cursor: 'pointer',
                    }}
                  >
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#f0e6ff' }}>{label}</p>
                    <p style={{ fontSize: '12px', color: '#6b6080', marginTop: '2px' }}>{desc}</p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Phase 2: 개입 반응 → Phase 3 자동 전환 */}
        {subStep === 'intervene' && (
          <motion.div
            key="intervene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {interventionReactions.map((line, i) => (
              <ChatBubble key={`r-${i}`} line={line} index={i} />
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: interventionReactions.length * 0.8 + 0.5 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSubStep('proposals')}
              className="w-full"
              style={{
                marginTop: '24px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#7A38D8',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              시종들의 최종 제안 듣기
            </motion.button>
          </motion.div>
        )}

        {/* Phase 3: 최종 제안 */}
        {subStep === 'proposals' && (
          <motion.div
            key="proposals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {phase3Lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 1.2, duration: 0.5 }}
                style={{
                  marginBottom: '16px',
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: '#1e1a2e',
                  border: `1px solid ${SERVANT_COLORS[line.type]}33`,
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{SERVANTS[line.type].emoji}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: SERVANT_COLORS[line.type] }}>
                    {SERVANTS[line.type].name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b6080' }}>
                    {SERVANTS[line.type].label}의 제안
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#ddd5ee',
                  lineHeight: '1.8',
                  wordBreak: 'keep-all',
                }}>
                  {line.text}
                </p>
              </motion.div>
            ))}

            {/* 시종 선택으로 이동 */}
            <div
              className="fixed left-0 right-0 bottom-0 flex justify-center"
              style={{ padding: '16px 24px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.8 }}
                whileTap={{ scale: 0.96 }}
                onClick={onComplete}
                style={{
                  width: '100%',
                  maxWidth: '440px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#7A38D8',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#fff',
                  boxShadow: '0 4px 24px rgba(122, 56, 216, 0.4)',
                }}
              >
                오늘 밤, 시종을 선택하기
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
