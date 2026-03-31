'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GisaengStats, SeonbiState, SeonbiType, RoundScenario } from '@/types/gisaeng';
import { STAT_LABELS } from '@/constants/gisaeng';
import SeonbiGauge from './SeonbiGauge';

const C = {
  hanji: '#F5F0E8',
  ink: '#1A1715',
  inkSoft: '#3D3530',
  inkMuted: '#6B5F56',
  inkFaint: '#A69A8E',
  vermillion: '#B8423A',
  vermillionDark: '#9C342E',
  gold: '#C9A96E',
  border: '#DDD5C8',
};

interface ChoiceResult {
  success: boolean;
  nextSeonbi: Record<SeonbiType, SeonbiState>;
}

interface Props {
  scenario: RoundScenario;
  seonbi: Record<SeonbiType, SeonbiState>;
  stats: GisaengStats;
  onChoice: (idx: number) => ChoiceResult;
  onNext: () => void;
}

export default function RoundScreen({ scenario, seonbi, stats, onChoice, onNext }: Props) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<ChoiceResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (idx: number) => {
    if (chosen !== null) return;
    setChosen(idx);
    const choiceResult = onChoice(idx);
    setResult(choiceResult);
    setTimeout(() => setShowResult(true), 600);
  };

  return (
    <motion.div
      className="flex-1 flex flex-col relative"
      style={{ paddingBottom: '140px', backgroundColor: C.hanji, minHeight: '100dvh' }}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ padding: '32px 20px 0' }}>
        {/* 라운드 헤더 */}
        <div className="text-center" style={{ marginBottom: '24px' }}>
          <span
            className="inline-block px-3 py-1 rounded"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: C.vermillion,
              backgroundColor: `${C.vermillion}12`,
              letterSpacing: '2px',
              marginBottom: '8px',
            }}
          >
            ROUND {scenario.round}
          </span>
          <h2 style={{ fontSize: '22px', color: C.ink, fontWeight: 800, letterSpacing: '-0.44px' }}>
            {scenario.title}
          </h2>
        </div>

        {/* 선비 게이지 */}
        <SeonbiGauge seonbi={result?.nextSeonbi ?? seonbi} />

        {/* 상황 설명 */}
        <div
          className="rounded-2xl"
          style={{
            marginTop: '20px',
            padding: '16px 18px',
            backgroundColor: '#fff',
            border: `1px solid ${C.border}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{ fontSize: '14px', color: C.inkSoft, lineHeight: 1.8, letterSpacing: '-0.28px' }}>
            {scenario.narration}
          </p>
        </div>

        {/* 선택지 or 결과 */}
        {!showResult ? (
          <div className="flex flex-col gap-3" style={{ marginTop: '16px' }}>
            {scenario.choices.map((choice, idx) => {
              const isChosen = chosen === idx;
              const isDisabled = chosen !== null && !isChosen;

              return (
                <motion.button
                  key={choice.id}
                  onClick={() => handleChoice(idx)}
                  disabled={chosen !== null}
                  className="w-full text-left rounded-2xl overflow-hidden transition-all"
                  animate={isChosen ? { scale: [1, 1.02, 1] } : isDisabled ? { opacity: 0.25 } : {}}
                  style={{
                    backgroundColor: isChosen ? `${C.vermillion}08` : '#fff',
                    border: isChosen
                      ? `2px solid ${C.vermillion}`
                      : `1px solid ${C.border}`,
                    boxShadow: isChosen ? `0 0 0 1px ${C.vermillion}30` : '0 2px 8px rgba(0,0,0,0.06)',
                    padding: '14px 16px',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: isChosen ? C.vermillion : `${C.vermillion}14`,
                        color: isChosen ? '#fff' : C.vermillion,
                        fontSize: '13px',
                        fontWeight: 800,
                      }}
                    >
                      {choice.id}
                    </span>
                    <div>
                      <p style={{ fontSize: '14px', color: C.ink, fontWeight: 600, lineHeight: 1.5, letterSpacing: '-0.28px' }}>
                        {choice.label}
                      </p>
                      <p style={{ fontSize: '11px', color: C.inkFaint, marginTop: '4px', letterSpacing: '-0.22px' }}>
                        필요: {STAT_LABELS[choice.requiredStat]} {choice.threshold}+
                        {choice.secondaryStat && ` + ${STAT_LABELS[choice.secondaryStat]} ${choice.secondaryThreshold}+`}
                        {' '}(내 수치: {stats[choice.requiredStat]})
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '16px' }}
          >
            <div
              className="rounded-2xl text-center"
              style={{
                padding: '20px 18px',
                backgroundColor: '#fff',
                border: `1px solid ${result?.success ? `${C.gold}50` : `${C.vermillion}30`}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
                <p style={{
                  fontSize: '22px',
                  color: result?.success ? C.gold : C.vermillion,
                  fontWeight: 800,
                  letterSpacing: '-0.44px',
                }}>
                  {result?.success ? '성공!' : '실패...'}
                </p>
                <p style={{ fontSize: '13px', color: C.inkMuted, marginTop: '8px', lineHeight: 1.6, letterSpacing: '-0.26px' }}>
                  {result?.success
                    ? '위기를 넘겼다. 선비들은 아직 아무것도 모른다.'
                    : '실수했다. 선비의 의심이 깊어진다.'}
                </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 하단 고정 CTA */}
      {showResult && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-start w-full z-10"
          style={{
            maxWidth: '440px',
            backgroundColor: C.hanji,
            boxShadow: `0px -8px 16px 0px ${C.hanji}c2`,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div style={{ padding: '12px 20px', width: '100%' }}>
            <motion.div
              onClick={onNext}
              className="transform-gpu"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
              style={{
                height: '56px',
                borderRadius: '16px',
                backgroundColor: C.vermillion,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p style={{
                fontSize: '16px', fontWeight: 600, lineHeight: '25px',
                letterSpacing: '-0.32px', color: '#fff', whiteSpace: 'nowrap',
              }}>
                {scenario.round === 3 ? '결산 보기' : '다음 밤으로 →'}
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
