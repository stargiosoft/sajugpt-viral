'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { BattleComparison, Grade } from '@/types/battle';
import GradeBadge from '@/components/GradeBadge';

const GRADE_COLORS: Record<Grade, string> = {
  SSS: '#FFD700',
  SS: '#FF4444',
  S: '#7A38D8',
  A: '#4488FF',
  B: '#44BB44',
  CUT: '#888888',
};

interface Props {
  battle: BattleComparison;
}

function PlayerColumn({ label, headcount, grade, title, isWinner }: {
  label: string;
  headcount: number;
  grade: Grade;
  title: string;
  isWinner: boolean;
}) {
  const gradeColor = GRADE_COLORS[grade] ?? '#888';

  return (
    <div className="flex flex-col items-center" style={{ flex: 1, gap: '8px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '-0.26px' }}>
        {label}
      </p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center"
        style={{ gap: '6px' }}
      >
        <GradeBadge grade={grade} size="sm" />
        <p style={{ fontSize: '48px', fontWeight: 900, color: gradeColor, lineHeight: 1 }}>
          {headcount}
        </p>
        <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>명</p>
      </motion.div>
      <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '-0.26px' }}>
        「{title}」
      </p>
      {isWinner && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '20px',
            backgroundColor: '#FFD700',
            color: '#000',
            fontSize: '11px',
            fontWeight: 800,
          }}
        >
          🏆 승리
        </motion.span>
      )}
    </div>
  );
}

const BattleVSCard = forwardRef<HTMLDivElement, Props>(
  function BattleVSCard({ battle }, ref) {
    const { challenger, acceptor, winner, winType, winnerMessage } = battle;

    return (
      <div
        ref={ref}
        className="flex flex-col items-center"
        style={{
          width: '100%',
          minHeight: '480px',
          borderRadius: '20px',
          background: 'linear-gradient(180deg, #1A1025 0%, #0D0A14 100%)',
          padding: '32px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 상단 타이틀 */}
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '4px', letterSpacing: '-0.28px' }}>
          🔥 색기 배틀 결과
        </p>

        {/* 승패 결과 배지 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            backgroundColor: winType === '무승부' ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,0,0.15)',
            border: winType === '무승부' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,215,0,0.3)',
            marginBottom: '24px',
          }}
        >
          <p style={{
            fontSize: '13px',
            fontWeight: 700,
            color: winType === '무승부' ? 'rgba(255,255,255,0.7)' : '#FFD700',
            letterSpacing: '-0.26px',
          }}>
            {winType === '무승부' ? '⚔️ 무승부' : winType === '압승' ? '💀 압승' : '⚡ 신승'}
          </p>
        </motion.div>

        {/* VS 비교 영역 */}
        <div className="flex items-start w-full" style={{ gap: '12px', marginBottom: '24px' }}>
          <PlayerColumn
            label="도전자"
            headcount={challenger.headcount}
            grade={challenger.grade as Grade}
            title={challenger.title}
            isWinner={winner === 'challenger'}
          />

          {/* VS 디바이더 */}
          <div className="flex flex-col items-center justify-center" style={{ paddingTop: '40px' }}>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              VS
            </motion.p>
          </div>

          <PlayerColumn
            label="나"
            headcount={acceptor.headcount}
            grade={acceptor.grade as Grade}
            title={acceptor.title}
            isWinner={winner === 'acceptor'}
          />
        </div>

        {/* 구분선 */}
        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />

        {/* 승패 멘트 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            lineHeight: '1.6',
            letterSpacing: '-0.28px',
            padding: '0 8px',
          }}
        >
          "{winnerMessage}"
        </motion.p>

        {/* 워터마크 */}
        <a
          href="https://www.sajugpt.co.kr/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 'auto',
            paddingTop: '20px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#7A38D8',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          sajugpt.co.kr
        </a>
      </div>
    );
  }
);

export default BattleVSCard;
