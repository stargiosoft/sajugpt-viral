'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CourtResult, CourtStep, PeriodInput } from '@/types/court';
import { getCrimeInfo, PERIOD_OPTIONS } from '@/constants/court';

interface Props {
  step: CourtStep;
  result: CourtResult;
  trial1Choice: number | null;
  trial3Choice: number | null;
  periodInput: PeriodInput | null;
  finalSentence: number | null;
  onTrial1Select: (choice: number) => void;
  onPeriodSelect: (period: PeriodInput) => void;
  onTrial3Select: (choice: number) => void;
  onTrialComplete: () => void;
}

const msgAnim = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

function Bubble({ children, who, delay = 0 }: { children: React.ReactNode; who: 'prosecutor' | 'defender' | 'system'; delay?: number }) {
  const colors = {
    prosecutor: { bg: 'rgba(255, 68, 68, 0.08)', border: '#FF4444', label: '🔴 검사 윤태산', labelColor: '#FF4444' },
    defender: { bg: 'rgba(68, 136, 255, 0.08)', border: '#4488FF', label: '🔵 변호사 서휘윤', labelColor: '#4488FF' },
    system: { bg: 'rgba(122, 56, 216, 0.06)', border: '#7A38D8', label: '⚖️ 재판장', labelColor: '#7A38D8' },
  };
  const c = colors[who];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        padding: '14px 16px',
        borderRadius: '12px',
        backgroundColor: c.bg,
        borderLeft: `3px solid ${c.border}`,
        marginBottom: '12px',
      }}
    >
      <p style={{ fontSize: '11px', color: c.labelColor, fontWeight: 600, marginBottom: '6px' }}>{c.label}</p>
      <div style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', fontWeight: 500 }}>{children}</div>
    </motion.div>
  );
}

function ChoiceButtons({ choices, onSelect, delay = 0 }: { choices: { id: number; text: string }[]; onSelect: (id: number) => void; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex flex-col gap-2"
      style={{ marginTop: '8px', marginBottom: '16px' }}
    >
      {choices.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #E8DCF5',
            backgroundColor: '#F7F2FA',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: 500,
            color: '#7A38D8',
            transition: 'background-color 0.15s',
          }}
        >
          {c.text}
        </button>
      ))}
    </motion.div>
  );
}

export default function TrialScreen({
  step,
  result,
  trial1Choice,
  trial3Choice,
  periodInput,
  finalSentence,
  onTrial1Select,
  onPeriodSelect,
  onTrial3Select,
  onTrialComplete,
}: Props) {
  const crimeInfo = getCrimeInfo(result.crimeId);
  const [autoAdvance, setAutoAdvance] = useState(false);

  // trial_4 자동 전환 (3초)
  useEffect(() => {
    if (step === 'trial_4') {
      const timer = setTimeout(() => setAutoAdvance(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="w-full" style={{ padding: '24px', minHeight: '60vh' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '18px' }}>⚖️</span>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#151515' }}>재판 진행 중</span>
        <span style={{ fontSize: '12px', color: '#999', marginLeft: 'auto' }}>
          {step === 'trial_1' ? '1/4' : step === 'trial_2' ? '2/4' : step === 'trial_3' ? '3/4' : '4/4'}
        </span>
      </div>

      <AnimatePresence mode="wait">

        {/* ─── 1턴: 검사 기소 ─────────────────── */}
        {step === 'trial_1' && (
          <motion.div key="t1" {...msgAnim}>
            <Bubble who="prosecutor">
              {result.prosecutorOpening.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: i < result.prosecutorOpening.split('\n').length - 1 ? '6px' : 0 }}>{line}</p>
              ))}
            </Bubble>
            <ChoiceButtons choices={crimeInfo.trial1Choices} onSelect={onTrial1Select} delay={0.6} />
          </motion.div>
        )}

        {/* ─── 2턴: 검사 반박 + 기간 수집 ────── */}
        {step === 'trial_2' && (
          <motion.div key="t2" {...msgAnim}>
            <Bubble who="prosecutor">
              {trial1Choice === 0 ? (
                <p>거짓말. 피고인의 사주가 거짓말을 못 합니다. 피고인은 할 수 있어도.</p>
              ) : trial1Choice === 1 ? (
                <p>왜냐구요? 지금부터 알려드리겠습니다.</p>
              ) : (
                <p>솔직하시네. 좋습니다. 그럼 질문을 바꾸죠.</p>
              )}
            </Bubble>

            <Bubble who="prosecutor" delay={0.5}>
              <p>얼마나 됐습니까?</p>
              <p style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>(좋아한 기간 / 솔로인 기간)</p>
            </Bubble>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.3 }}
              className="flex flex-col gap-2"
              style={{ marginTop: '8px' }}
            >
              {PERIOD_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPeriodSelect(p.id)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid #E8DCF5',
                    backgroundColor: '#F7F2FA',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#7A38D8',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ─── 3턴: 변호사 반격 ──────────────── */}
        {step === 'trial_3' && (
          <motion.div key="t3" {...msgAnim}>
            {/* 기간 3년 이상이면 검사 격앙 */}
            {periodInput && ['3y_5y', 'over_5y'].includes(periodInput) && (
              <Bubble who="prosecutor">
                <p>…{periodInput === 'over_5y' ? '5년 이상' : '3년'}이요?</p>
                <p>피고인의 사주에 {result.sajuHighlights.doHwaSal ? '도화살이 있는 거' : '이런 매력이 있는 거'} 알고 계십니까?</p>
                <p style={{ fontWeight: 700 }}>가중처벌 대상입니다.</p>
              </Bubble>
            )}

            <Bubble who="defender" delay={periodInput && ['3y_5y', 'over_5y'].includes(periodInput) ? 0.6 : 0}>
              <p>피고인, 제가 대신 여쭤볼게요.</p>
              <p style={{ marginTop: '4px' }}>말 못 한 진짜 이유가 뭐예요?</p>
            </Bubble>

            <ChoiceButtons choices={crimeInfo.trial3Choices} onSelect={onTrial3Select} delay={0.8} />
          </motion.div>
        )}

        {/* ─── 4턴: 변호사 최후변론 + 검사 마무리 */}
        {step === 'trial_4' && (
          <motion.div key="t4" {...msgAnim}>
            <Bubble who="defender">
              {result.defenderClosing.split('\n').map((line, i) => (
                <p key={i} style={{ marginBottom: i < result.defenderClosing.split('\n').length - 1 ? '6px' : 0 }}>{line}</p>
              ))}
            </Bubble>

            <Bubble who="prosecutor" delay={1.2}>
              <p>마지막으로 하나만.</p>
              <p>그래서 그게 사랑이었습니까, 습관이었습니까.</p>
            </Bubble>

            <Bubble who="system" delay={2}>
              <p style={{ textAlign: 'center', fontWeight: 700 }}>판결을 선고합니다.</p>
            </Bubble>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              onClick={onTrialComplete}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 700,
                backgroundColor: '#7A38D8',
                color: '#fff',
                marginTop: '16px',
              }}
            >
              판결문 확인하기
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
