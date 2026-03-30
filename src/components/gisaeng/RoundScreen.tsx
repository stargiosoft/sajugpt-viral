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
      className="flex-1 flex flex-col relative"
      style={{ paddingBottom: '140px' }}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 pt-8">
        {/* 라운드 헤더 */}
        <div className="text-center mb-4">
          <p style={{ fontSize: '12px', color: '#7A38D8', fontWeight: 600, letterSpacing: '1px' }}>
            ROUND {scenario.round}
          </p>
          <h2 style={{ fontSize: '20px', color: '#151515', fontWeight: 700, marginTop: '4px', letterSpacing: '-0.4px' }}>
            {scenario.title}
          </h2>
        </div>

        {/* 선비 게이지 */}
        <SeonbiGauge seonbi={result?.nextSeonbi ?? seonbi} />

        {/* 상황 설명 */}
        <div
          className="rounded-xl p-4 mt-4"
          style={{ backgroundColor: '#F7F2FA', border: '1px solid #EDE5F7' }}
        >
          <p style={{ fontSize: '14px', color: '#525252', lineHeight: 1.7, letterSpacing: '-0.28px' }}>
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
                    backgroundColor: isChosen ? '#F7F2FA' : '#f9f9f9',
                    border: isChosen
                      ? '1px solid #7A38D8'
                      : '1px solid #e7e7e7',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: '#EDE5F7', color: '#7A38D8', fontSize: '12px', fontWeight: 700 }}
                    >
                      {choice.id}
                    </span>
                    <div>
                      <p style={{ fontSize: '14px', color: '#151515', fontWeight: 500, lineHeight: 1.5, letterSpacing: '-0.28px' }}>
                        {choice.label}
                      </p>
                      <p style={{ fontSize: '11px', color: '#848484', marginTop: '4px', letterSpacing: '-0.22px' }}>
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
                backgroundColor: result?.success ? '#f0fdf4' : '#fef2f2',
                border: result?.success
                  ? '1px solid #bbf7d0'
                  : '1px solid #fecaca',
              }}
            >
              <p style={{
                fontSize: '20px',
                color: result?.success ? '#16a34a' : '#dc2626',
                fontWeight: 700,
                letterSpacing: '-0.4px',
              }}>
                {result?.success ? '성공! ✨' : '실패... 💔'}
              </p>
              <p style={{ fontSize: '13px', color: '#848484', marginTop: '8px', letterSpacing: '-0.26px' }}>
                {result?.success
                  ? '위기를 넘겼다. 선비들은 아직 아무것도 모른다.'
                  : '실수했다. 선비의 의심이 깊어진다.'}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 하단 고정 CTA (결과 표시 후) */}
      {showResult && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px]"
          style={{ backgroundColor: '#ffffff', boxShadow: '0px -8px 16px 0px rgba(255, 255, 255, 0.76)' }}
        >
          <div style={{ padding: '12px 20px' }}>
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center"
              style={{
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#7A38D8',
                border: 'none',
                transition: 'all 0.15s ease',
              }}
              onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
              onPointerUp={e => { e.currentTarget.style.transform = ''; }}
              onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              <span style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '25px',
                letterSpacing: '-0.32px',
                color: '#ffffff',
              }}>
                {scenario.round === 3 ? '결산 보기 💰' : '다음 밤으로 →'}
              </span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
