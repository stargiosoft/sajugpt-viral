'use client';

import { motion } from 'framer-motion';
import type { NightManualResult } from '@/types/night-manual';
import { STAT_LABELS } from '@/constants/night-manual';

interface Props {
  result: NightManualResult;
  onContinue: () => void;
}

function StatBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <div className="flex items-center gap-3" style={{ marginBottom: '8px' }}>
      <span style={{ fontSize: '13px', color: '#c4b5d9', width: '48px', textAlign: 'right', fontWeight: 600 }}>
        {label}
      </span>
      <div className="flex-1" style={{ height: '8px', backgroundColor: '#2a2440', borderRadius: '4px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', backgroundColor: '#7A38D8', borderRadius: '4px' }}
        />
      </div>
      <span style={{ fontSize: '14px', color: '#f0e6ff', width: '32px', fontWeight: 700, textAlign: 'right' }}>
        {value}
      </span>
    </div>
  );
}

export default function ConstitutionCard({ result, onContinue }: Props) {
  const { constitution, stats, totalCharm, doHwaSal, hongYeomSal, constitutionNarrative } = result;

  const statEntries = Object.entries(stats) as [keyof typeof stats, number][];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '40px 24px 120px', minHeight: '100dvh' }}
    >
      {/* 헤더 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p style={{ fontSize: '13px', color: '#8b7aaa', letterSpacing: '2px', fontWeight: 500 }}>
          은밀한 체질 평가표
        </p>
      </motion.div>

      {/* 체질 카드 */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '20px',
          padding: '28px 24px',
          borderRadius: '20px',
          backgroundColor: '#1a1530',
          border: '1px solid #2a2440',
        }}
      >
        {/* 체질명 + 등급 */}
        <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f0e6ff' }}>
            {constitution.name}
          </h2>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: constitution.grade === 'S' ? '#FFD700' : constitution.grade === 'A' ? '#7A38D8' : '#8b7aaa',
              padding: '4px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(122, 56, 216, 0.15)',
            }}
          >
            {constitution.grade}
          </span>
        </div>
        <p style={{ fontSize: '14px', color: '#9990ad', marginBottom: '20px' }}>
          {constitution.concept}
        </p>

        {/* 능력치 바 */}
        {statEntries.map(([key, value], i) => (
          <StatBar
            key={key}
            label={STAT_LABELS[key]}
            value={value}
            delay={0.8 + i * 0.15}
          />
        ))}

        {/* 신살 표시 */}
        {(doHwaSal || hongYeomSal) && (
          <div className="flex gap-3" style={{ marginTop: '16px' }}>
            {doHwaSal && (
              <span style={{ fontSize: '13px', color: '#ff6b6b', fontWeight: 600 }}>
                🔥 도화살 보유
              </span>
            )}
            {hongYeomSal && (
              <span style={{ fontSize: '13px', color: '#ff4444', fontWeight: 600 }}>
                💀 홍염살 보유
              </span>
            )}
          </div>
        )}

        {/* 총 매혹력 */}
        <div
          className="text-center"
          style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(122, 56, 216, 0.1)',
            border: '1px solid rgba(122, 56, 216, 0.2)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#8b7aaa', marginBottom: '4px' }}>총 매혹력</p>
          <p style={{ fontSize: '28px', fontWeight: 800, color: '#f0e6ff' }}>
            {totalCharm} <span style={{ fontSize: '16px', color: '#6b6080' }}>/ 500</span>
          </p>
        </div>
      </motion.div>

      {/* 체질 서사 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          marginTop: '20px',
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: 'rgba(122, 56, 216, 0.08)',
          border: '1px solid rgba(122, 56, 216, 0.15)',
        }}
      >
        <p style={{
          fontSize: '14px',
          color: '#c4b5d9',
          lineHeight: '1.8',
          fontWeight: 500,
          wordBreak: 'keep-all',
        }}>
          "{constitutionNarrative}"
        </p>
      </motion.div>

      {/* 다음 버튼 */}
      <div
        className="fixed left-0 right-0 bottom-0 flex justify-center"
        style={{ padding: '16px 24px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onContinue}
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
            letterSpacing: '-0.3px',
            boxShadow: '0 4px 24px rgba(122, 56, 216, 0.4)',
          }}
        >
          시종들의 토론 엿듣기
        </motion.button>
      </div>
    </motion.div>
  );
}
