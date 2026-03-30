'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GisaengStats, SeonbiState, SeonbiType, RoundScenario } from '@/types/gisaeng';
import { STAT_LABELS } from '@/constants/gisaeng';
import SeonbiGauge from './SeonbiGauge';

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
      className="flex-1 flex flex-col px-5 pt-8 pb-8"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      {/* 라운드 헤더 */}
      <div className="text-center mb-4">
        <p style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 600, letterSpacing: '1px' }}>
          ROUND {scenario.round}
        </p>
        <h2 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 700, marginTop: '4px' }}>
          {scenario.title}
        </h2>
      </div>

      {/* 선비 게이지 */}
      <SeonbiGauge seonbi={result?.nextSeonbi ?? seonbi} />

      {/* 상황 설명 */}
      <div
        className="rounded-xl p-4 mt-4"
        style={{ backgroundColor: 'rgba(122, 56, 216, 0.1)', border: '1px solid rgba(122, 56, 216, 0.2)' }}
      >
        <p style={{ fontSize: '14px', color: '#E5E7EB', lineHeight: 1.7 }}>
          {scenario.narration}
        </p>
      </div>

      {/* 선택지 or 결과 */}
      {!showResult ? (
        <div className="flex flex-col gap-3 mt-5">
          {scenario.choices.map((choice, idx) => {
            const isChosen = chosen === idx;
            const isDisabled = chosen !== null && !isChosen;

            return (
              <motion.button
                key={choice.id}
                onClick={() => handleChoice(idx)}
                disabled={chosen !== null}
                className="w-full text-left rounded-xl p-4 transition-all"
                animate={isChosen ? { scale: [1, 1.02, 1] } : isDisabled ? { opacity: 0.3 } : {}}
                style={{
                  backgroundColor: isChosen
                    ? 'rgba(122, 56, 216, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isChosen
                    ? '1px solid #7A38D8'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(122, 56, 216, 0.3)', color: '#A78BFA', fontSize: '12px', fontWeight: 700 }}
                  >
                    {choice.id}
                  </span>
                  <div>
                    <p style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500, lineHeight: 1.5 }}>
                      {choice.label}
                    </p>
                    <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
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
          className="mt-5"
        >
          {/* 성공/실패 배너 */}
          <div
            className="rounded-xl p-4 text-center"
            style={{
              backgroundColor: result?.success
                ? 'rgba(34, 197, 94, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
              border: result?.success
                ? '1px solid rgba(34, 197, 94, 0.3)'
                : '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <p style={{
              fontSize: '20px',
              color: result?.success ? '#22C55E' : '#EF4444',
              fontWeight: 700,
            }}>
              {result?.success ? '성공! ✨' : '실패... 💔'}
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px' }}>
              {result?.success
                ? '위기를 넘겼다. 선비들은 아직 아무것도 모른다.'
                : '실수했다. 선비의 의심이 깊어진다.'}
            </p>
          </div>

          {/* 다음 라운드 버튼 */}
          <button
            onClick={onNext}
            className="w-full py-4 rounded-2xl mt-4 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: '#7A38D8', color: '#FFFFFF', fontSize: '15px', fontWeight: 700 }}
          >
            {scenario.round === 3 ? '결산 보기 💰' : '다음 밤으로 →'}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
