'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { CREW_MEMBERS } from '@/constants/stock';
import TriangleIcon from '@/components/stock/TriangleIcon';
import LandingCTAButton from '@/components/LandingCTAButton';

interface Props {
  briefing: { headline: string; subtext: string };
  onStart: () => void;
}

const COLOR_BG = '#191F28';
const COLOR_UP = '#F04452';
const COLOR_BRAND = '#7A38D8';
const COLOR_TEXT_PRIMARY = '#F2F3F5';
const COLOR_TEXT_SECONDARY = '#8B95A1';
const COLOR_TEXT_TERTIARY = '#4E5968';

// "▼"/"▲" 문자를 포함한 동적 텍스트를 아이콘 컴포넌트로 교체해서 렌더링
function renderWithTriangles(text: string, color: string) {
  return text.split(/([▼▲])/g).map((chunk, i) => {
    if (chunk === '▼' || chunk === '▲') {
      return (
        <span key={i} style={{ display: 'inline-flex', verticalAlign: '-2px' }}>
          <TriangleIcon color={color} up={chunk === '▲'} />
        </span>
      );
    }
    return <Fragment key={i}>{chunk}</Fragment>;
  });
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
        backgroundColor: COLOR_BG,
        padding: '0 12px',
        paddingBottom: '120px',
      }}
    >
      {/* Header */}
      <div style={{ paddingTop: '48px', paddingLeft: '6px', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0.6, 1, 0.6], scale: 1 }}
          transition={{
            opacity: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' },
            scale: { duration: 0.4 },
          }}
          className="inline-flex items-center"
          style={{
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: `${COLOR_UP}1F`,
            border: `1px solid ${COLOR_UP}55`,
            marginBottom: '20px',
          }}
        >
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: COLOR_UP,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            긴급 소집 · 사주증권 특별 보고
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: COLOR_TEXT_PRIMARY,
            letterSpacing: '-0.6px',
            lineHeight: '38px',
            marginBottom: '12px',
            paddingLeft: '3px',
          }}
        >
          {briefing.headline}
        </motion.h1>

        {/* Subtext in red */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: COLOR_UP,
            lineHeight: '24px',
            letterSpacing: '-0.3px',
            marginBottom: '10px',
            paddingLeft: '5px',
          }}
        >
          {renderWithTriangles(briefing.subtext, COLOR_UP)}
        </motion.p>

        {/* 소집 콜 — 경고와 드라마틱 라인을 한 줄로 압축 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: COLOR_TEXT_SECONDARY,
            lineHeight: '22px',
            paddingLeft: '6px',
          }}
        >
          지금 조작단을 소집하지 않으면, 상폐입니다.
        </motion.p>
      </div>

      {/* Crew member entries — 단체 대화방처럼 하나의 카드로 감싼 채팅 버블 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.4 }}
        className="flex flex-col"
        style={{
          gap: '24px',
          padding: '28px 24px',
          borderRadius: '18px',
          backgroundColor: 'rgba(255,255,255,0.03)',
        }}
      >
        {crewEntries.map((entry, i) => (
          <motion.div
            key={entry.member.id}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.0 + i * 0.5, duration: 0.5 }}
            className="flex items-start gap-3"
          >
            <div className="overflow-hidden transform-gpu shrink-0" style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: `2px solid rgba(255,255,255,0.15)`,
            }}>
              <img src={entry.member.image} alt={entry.member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="flex flex-col items-start" style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: COLOR_TEXT_PRIMARY,
                  marginBottom: '6px',
                }}
              >
                {entry.member.name}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: COLOR_TEXT_SECONDARY,
                    marginLeft: '6px',
                  }}
                >
                  {entry.member.position}
                </span>
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: COLOR_TEXT_PRIMARY,
                  lineHeight: '21px',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  borderTopLeftRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              >
                {entry.line}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '768px',
          padding: '16px 12px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: `linear-gradient(transparent, ${COLOR_BG} 30%)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.8, duration: 0.4 }}
        >
          <LandingCTAButton onClick={onStart} label="작전 회의 시작하기" background={COLOR_BRAND} />
        </motion.div>
      </div>
    </div>
  );
}
