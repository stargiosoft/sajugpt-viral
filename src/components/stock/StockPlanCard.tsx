'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { OperationPlan } from '@/types/stock';

interface Props {
  plan: OperationPlan;
}

const StockPlanCard = React.forwardRef<HTMLDivElement, Props>(
  ({ plan }, ref) => {
    const phases = [
      { data: plan.phase1, locked: false },
      { data: plan.phase2, locked: false },
      { data: plan.phase3, locked: true },
    ];

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: '#111125',
          borderRadius: '16px',
          border: '1px solid #2a2a3e',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid #2a2a3e',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#7A38D8',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            OPERATION PLAN
          </p>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.4px',
              marginBottom: '16px',
            }}
          >
            주가 상승 작전 계획서
          </h2>

          {/* Big number: current → target */}
          <p
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.5px',
              marginBottom: '4px',
            }}
          >
            {plan.currentToTarget}
          </p>

          {/* Growth rate */}
          <p
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#4ADE80',
              letterSpacing: '-0.6px',
            }}
          >
            {plan.growthRate}
          </p>
        </div>

        {/* Roadmap */}
        <div style={{ padding: '20px' }}>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#888',
              marginBottom: '16px',
            }}
          >
            작전 로드맵
          </p>

          <div className="flex flex-col gap-4">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2, duration: 0.4 }}
              >
                {/* Phase label */}
                <div
                  className="flex items-center gap-2"
                  style={{ marginBottom: '8px' }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: phase.locked ? '#666' : '#7A38D8',
                    }}
                  >
                    {phase.data.month}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: phase.locked ? '#555' : '#ccc',
                    }}
                  >
                    {phase.data.title}
                  </span>
                  {phase.locked && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#CA8A04',
                        backgroundColor: 'rgba(202, 138, 4, 0.12)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        marginLeft: 'auto',
                      }}
                    >
                      🔒 잠금
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: phase.locked ? '#1a1a2e' : 'rgba(122, 56, 216, 0.15)',
                    overflow: 'hidden',
                  }}
                >
                  {phase.locked ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#333',
                        borderRadius: '4px',
                        background: 'repeating-linear-gradient(45deg, #222, #222 4px, #333 4px, #333 8px)',
                      }}
                    />
                  ) : (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: i === 0 ? '100%' : '70%' }}
                      transition={{ delay: 0.4 + i * 0.2, duration: 0.6 }}
                      style={{
                        height: '100%',
                        borderRadius: '4px',
                        backgroundColor: '#7A38D8',
                      }}
                    />
                  )}
                </div>

                {/* Summary or teaser */}
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: phase.locked ? '#555' : '#888',
                    marginTop: '6px',
                    lineHeight: '18px',
                  }}
                >
                  {phase.locked
                    ? (plan.phase3 as { teaser: string }).teaser
                    : (phase.data as { summary: string }).summary}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Crew comment */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #2a2a3e',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#aaa',
              lineHeight: '22px',
              letterSpacing: '-0.3px',
            }}
          >
            &ldquo;{plan.crewComment}&rdquo;
          </p>
        </div>

        {/* Lock notice */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'rgba(202, 138, 4, 0.06)',
            borderTop: '1px solid rgba(202, 138, 4, 0.15)',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#CA8A04',
              textAlign: 'center',
              letterSpacing: '-0.2px',
            }}
          >
            🔒 3단계 작전은 1:1로만 공개됩니다
          </p>
        </div>

        {/* Footer watermark */}
        <div style={{ padding: '12px 20px 16px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#444',
              letterSpacing: '0.5px',
            }}
          >
            sajugpt.co.kr
          </p>
        </div>
      </div>
    );
  },
);

StockPlanCard.displayName = 'StockPlanCard';

export default StockPlanCard;
