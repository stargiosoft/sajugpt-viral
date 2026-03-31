'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '@/constants/characters';

interface Props {
  onStart: () => void;
}

const GRADE_PREVIEW = [
  { grade: 'SSS', title: '만인의 정복자', count: '5명', color: '#FFD700' },
  { grade: 'SS', title: '치명적 요부', count: '4명', color: '#FF4444' },
  { grade: 'S', title: '은밀한 사냥꾼', count: '3명', color: '#7A38D8' },
  { grade: 'A', title: '늦깎이 매력폭발', count: '2명', color: '#4488FF' },
  { grade: 'B', title: '원픽 집착남 보유', count: '1명', color: '#44BB44' },
  { grade: 'CUT', title: '입구컷', count: '0명', color: '#666' },
];

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function OnboardingLanding({ onStart }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative flex flex-col items-center overflow-x-hidden"
      style={{
        minHeight: '100%',
        background: 'linear-gradient(180deg, #0f0a1a 0%, #1c1035 40%, #2a1548 70%, #1c1035 100%)',
        paddingBottom: '100px',
      }}
    >
      {/* ── Hero Section ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ paddingTop: '72px', paddingBottom: '8px' }}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#a78bfa',
            letterSpacing: '2px',
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
        >
          페로몬 등급 판정
        </motion.p>

        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: '30px',
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '1.35',
            letterSpacing: '-0.6px',
          }}
        >
          당신의 사주에<br />
          <span style={{ color: '#c084fc' }}>발정 난 남자</span>는<br />
          몇 명?
        </motion.h1>

        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            marginTop: '16px',
            lineHeight: '1.7',
            letterSpacing: '-0.28px',
          }}
        >
          얼굴 가리고, 사주만으로<br />
          AI 짐승남을 홀려보세요
        </motion.p>
      </motion.div>

      {/* ── Character Showcase ── */}
      <motion.div
        className="flex justify-center items-end w-full"
        style={{ padding: '32px 20px 16px', gap: '4px' }}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } } }}
      >
        {CHARACTERS.map((char, i) => {
          const isCenter = i === 0;
          const size = isCenter ? 76 : 58;
          return (
            <motion.div
              key={char.id}
              className="flex flex-col items-center"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.7 },
                visible: {
                  opacity: 1,
                  y: isCenter ? 0 : 8,
                  scale: 1,
                  transition: { type: 'spring', bounce: 0.35, duration: 0.6 },
                },
              }}
            >
              <div
                className="overflow-hidden transform-gpu"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  border: isCenter
                    ? '3px solid #FFD700'
                    : '2px solid rgba(255,255,255,0.2)',
                  boxShadow: isCenter
                    ? '0 0 20px rgba(255,215,0,0.3)'
                    : 'none',
                }}
              >
                <img
                  src={char.thumbnail}
                  alt={char.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="eager"
                />
              </div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: isCenter ? 700 : 400,
                  color: isCenter ? '#FFD700' : 'rgba(255,255,255,0.45)',
                  marginTop: '8px',
                  letterSpacing: '-0.22px',
                }}
              >
                {char.name}
              </p>
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.25)',
                  marginTop: '2px',
                  letterSpacing: '-0.2px',
                }}
              >
                {char.archetype}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Divider ── */}
      <div
        style={{
          width: '40px',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          margin: '24px auto',
        }}
      />

      {/* ── How it works ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '0 28px', gap: '20px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1.5px',
            marginBottom: '4px',
          }}
        >
          진행 방식
        </motion.p>

        {[
          {
            emoji: '📋',
            title: '생년월일만 입력',
            desc: '이름도 필요 없어요. 3초면 끝.',
          },
          {
            emoji: '🔍',
            title: 'AI 짐승남들이 사주를 심사',
            desc: '도화살, 홍염살, 편관... 당신의 색기 요소를 정밀 분석.',
          },
          {
            emoji: '🏆',
            title: '페로몬 등급 판정',
            desc: '몇 명이 꼬이는지, 누가 꼬이는지 결과 카드로 확인.',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="flex gap-3 items-start"
            variants={fadeUp}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(122,56,216,0.15)',
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.emoji}</span>
            </div>
            <div>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '-0.28px',
                  marginBottom: '4px',
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: '1.5',
                  letterSpacing: '-0.26px',
                }}
              >
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Grade Preview ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '40px 28px 0', gap: '10px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1.5px',
            marginBottom: '8px',
          }}
        >
          등급 체계
        </motion.p>

        {GRADE_PREVIEW.map((g) => (
          <motion.div
            key={g.grade}
            className="flex items-center justify-between"
            variants={fadeUp}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: g.color,
                  width: '36px',
                  letterSpacing: '-0.28px',
                }}
              >
                {g.grade}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '-0.26px',
                }}
              >
                {g.title}
              </span>
            </div>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: g.color,
                letterSpacing: '-0.26px',
              }}
            >
              {g.count}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Social Proof ── */}
      <motion.div
        className="flex items-center justify-center gap-2 w-full"
        style={{ padding: '36px 28px 24px' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Stacked mini avatars */}
        <div className="flex" style={{ marginRight: '4px' }}>
          {CHARACTERS.slice(0, 3).map((char, i) => (
            <div
              key={char.id}
              className="overflow-hidden transform-gpu"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid #1c1035',
                marginLeft: i > 0 ? '-8px' : '0',
                zIndex: 3 - i,
              }}
            >
              <img
                src={char.thumbnail}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '-0.26px',
          }}
        >
          <span style={{ color: '#c084fc', fontWeight: 600 }}>142,847</span>명
          진단 완료
        </p>
      </motion.div>

      {/* ── Disclaimer ── */}
      <p
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          padding: '0 28px 32px',
          lineHeight: '1.5',
        }}
      >
        본 테스트는 재미로 보는 콘텐츠이며,
        <br />
        실제 운세·심리 진단이 아닙니다.
      </p>

      {/* ── Fixed Bottom CTA ── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-10"
        style={{
          maxWidth: '440px',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background:
            'linear-gradient(to top, #0f0a1a 50%, rgba(15,10,26,0.8) 80%, transparent 100%)',
        }}
      >
        <div style={{ padding: '12px 20px 24px' }}>
          <motion.div
            onClick={onStart}
            className="transform-gpu"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#7A38D8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 24px rgba(122,56,216,0.4)',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '-0.32px',
                lineHeight: '25px',
              }}
            >
              내 페로몬 등급 확인하기
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
