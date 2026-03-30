'use client';

import { motion } from 'framer-motion';
import { CREW_MEMBERS } from '@/constants/stock';

interface Props {
  briefing: { headline: string; subtext: string };
  onStart: () => void;
}

const crewEntries = [
  {
    member: CREW_MEMBERS.kang,
    line: '상폐 직전이라고? 종목 정보 줘.',
  },
  {
    member: CREW_MEMBERS.yoon,
    line: '원국부터 보겠습니다.',
  },
  {
    member: CREW_MEMBERS.cha,
    line: '대운·세운 차트 띄워주세요.',
  },
];

export default function StockBriefing({ briefing, onStart }: Props) {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0a0a14',
        padding: '0 20px',
        paddingBottom: '120px',
      }}
    >
      {/* Red accent border at top */}
      <div style={{ height: '3px', backgroundColor: '#DC2626', margin: '0 -20px' }} />

      {/* Header */}
      <div style={{ paddingTop: '48px', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
          transition={{
            opacity: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
            scale: { duration: 0.4 },
          }}
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#DC2626',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          긴급 소집
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#888',
            letterSpacing: '-0.3px',
            marginBottom: '24px',
          }}
        >
          사주증권 특별 보고
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.6px',
            lineHeight: '34px',
            marginBottom: '12px',
          }}
        >
          {briefing.headline}
        </motion.h1>

        {/* Subtext in red */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#DC2626',
            lineHeight: '24px',
            letterSpacing: '-0.3px',
            marginBottom: '16px',
          }}
        >
          {briefing.subtext}
        </motion.p>

        {/* Warning text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#888',
            lineHeight: '22px',
            marginBottom: '8px',
          }}
        >
          이대로 두면 관리종목 지정, 최악의 경우 상폐 가능성.
        </motion.p>

        {/* Dramatic line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#ccc',
            lineHeight: '22px',
          }}
        >
          주가 조작단을 소집합니다.
        </motion.p>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.0, duration: 0.4 }}
        style={{
          height: '1px',
          backgroundColor: '#2a2a3e',
          marginBottom: '24px',
          transformOrigin: 'left',
        }}
      />

      {/* Crew member entries */}
      <div className="flex flex-col gap-4">
        {crewEntries.map((entry, i) => (
          <motion.div
            key={entry.member.id}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.3 + i * 0.5, duration: 0.5 }}
            className="flex items-start gap-3"
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="overflow-hidden transform-gpu shrink-0" style={{
              width: '44px', height: '44px', borderRadius: '50%',
              border: `2px solid ${entry.member.color}`,
            }}>
              <img src={entry.member.image} alt={entry.member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: entry.member.color,
                  marginBottom: '4px',
                }}
              >
                {entry.member.name}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#666',
                    marginLeft: '6px',
                  }}
                >
                  {entry.member.position}
                </span>
              </p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#ddd',
                  lineHeight: '22px',
                }}
              >
                &ldquo;{entry.line}&rdquo;
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '440px',
          padding: '16px 20px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(transparent, #0a0a14 30%)',
        }}
      >
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.8, duration: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            backgroundColor: '#7A38D8',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '-0.32px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          작전 회의 시작하기 →
        </motion.button>
      </div>
    </div>
  );
}
