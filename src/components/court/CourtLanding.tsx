'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onStart: () => void;
}

const ROTATING_CRIMES = [
  '짝사랑만 3년 죄',
  '"나 같은 게 뭐" 죄',
  '읽씹당하고 괜찮은 척한 죄',
  '거울 보고 한숨 쉰 죄',
  '좋아한다는 말 못 한 죄',
  '맨날 친구로만 남은 죄',
  '혼자 이별한 죄',
];

const SENTENCE_GRADES = [
  { grade: '극형', label: '도화살 낭비죄', range: '13년 이상', color: '#FFD700' },
  { grade: '강력범', label: '매력 은닉죄', range: '8~12년', color: '#FF4444' },
  { grade: '중범죄', label: '연애 태만죄', range: '4~7년', color: '#7A38D8' },
  { grade: '경범죄', label: '초범', range: '~3년', color: '#666' },
];

const CHARACTERS = [
  {
    id: 'yoon-taesan',
    name: '윤태산',
    role: '검사',
    roleColor: '#FF4444',
    thumbnail: '/characters/yoon-taesan.webp',
    line: '"못생겨서 못 만나는 거 아닙니다.\n못생겼다고 믿어서 못 만나는 겁니다."',
  },
  {
    id: 'seo-hwiyoon',
    name: '서휘윤',
    role: '변호사',
    roleColor: '#4488FF',
    thumbnail: '/characters/seo-hwiyoon.webp',
    line: '"그 믿음을 만든 건 피고인이 아닙니다.\n세상이 심어놓은 겁니다."',
  },
];

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

function CrimeRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_CRIMES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ height: '28px', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_CRIMES[index]}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#FF4444',
            letterSpacing: '-0.44px',
            display: 'block',
          }}
        >
          {ROTATING_CRIMES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function CourtLanding({ onStart }: Props) {
  return (
    <div
      className="relative flex flex-col items-center overflow-x-hidden"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #0a0a14 0%, #111128 40%, #1a1040 70%, #111128 100%)',
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
            color: '#FF6B6B',
            letterSpacing: '2px',
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
        >
          사주 연애 법정
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
          연애 못한 죄,<br />
          <span style={{ color: '#FF4444' }}>징역 몇 년</span>?
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
          사주로 당신의 연애 죄목을 기소하고<br />
          검사와 변호사가 실시간 재판합니다
        </motion.p>
      </motion.div>

      {/* ── Rotating Crime Preview ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ padding: '28px 28px 0' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '16px 20px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginBottom: '8px', letterSpacing: '1px' }}>
            당신의 죄목은?
          </p>
          <CrimeRotator />
        </div>
      </motion.div>

      {/* ── Character Showcase: 검사 vs 변호사 ── */}
      <motion.div
        className="flex items-center justify-center w-full"
        style={{ padding: '32px 20px 16px', gap: '16px' }}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.7 } } }}
      >
        {CHARACTERS.map((char, i) => (
          <motion.div
            key={char.id}
            className="flex flex-col items-center"
            style={{ flex: 1 }}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.7 },
              visible: {
                opacity: 1, y: 0, scale: 1,
                transition: { type: 'spring', bounce: 0.35, duration: 0.6 },
              },
            }}
          >
            <div
              className="overflow-hidden transform-gpu"
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: `3px solid ${char.roleColor}`,
                boxShadow: `0 0 20px ${char.roleColor}33`,
              }}
            >
              <img
                src={char.thumbnail}
                alt={char.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="eager"
              />
            </div>
            <p style={{
              fontSize: '10px', fontWeight: 600,
              color: char.roleColor, marginTop: '8px',
              letterSpacing: '0.5px',
            }}>
              {char.role}
            </p>
            <p style={{
              fontSize: '13px', fontWeight: 700,
              color: '#ffffff', marginTop: '2px',
              letterSpacing: '-0.26px',
            }}>
              {char.name}
            </p>
            {i === 0 && (
              <p style={{
                fontSize: '11px', fontWeight: 400,
                color: 'rgba(255,255,255,0.35)', marginTop: '4px',
                letterSpacing: '-0.22px',
              }}>
                팩폭 기소
              </p>
            )}
            {i === 1 && (
              <p style={{
                fontSize: '11px', fontWeight: 400,
                color: 'rgba(255,255,255,0.35)', marginTop: '4px',
                letterSpacing: '-0.22px',
              }}>
                다정한 변론
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ── VS Badge ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', bounce: 0.5 }}
        style={{
          position: 'relative',
          marginTop: '-90px',
          marginBottom: '24px',
          zIndex: 2,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#1a1040',
          border: '2px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFD700', letterSpacing: '1px' }}>VS</span>
      </motion.div>

      {/* ── Sample Lines ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '0 24px', gap: '8px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
      >
        {/* 검사 대사 */}
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-2"
        >
          <div
            className="overflow-hidden transform-gpu shrink-0"
            style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid #FF4444' }}
          >
            <img src="/characters/yoon-taesan.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            backgroundColor: 'rgba(255,68,68,0.08)',
            borderRadius: '4px 14px 14px 14px',
            padding: '10px 14px',
            flex: 1,
          }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', lineHeight: '1.6', letterSpacing: '-0.24px' }}>
              &ldquo;당신보다 못생긴 사람도 지금<br />
              <span style={{ fontWeight: 700, color: '#FF6B6B' }}>연애하고 있습니다.</span>&rdquo;
            </p>
          </div>
        </motion.div>

        {/* 변호사 대사 */}
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-2"
          style={{ flexDirection: 'row-reverse' }}
        >
          <div
            className="overflow-hidden transform-gpu shrink-0"
            style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid #4488FF' }}
          >
            <img src="/characters/seo-hwiyoon.webp" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            backgroundColor: 'rgba(68,136,255,0.08)',
            borderRadius: '14px 4px 14px 14px',
            padding: '10px 14px',
            flex: 1,
          }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', lineHeight: '1.6', letterSpacing: '-0.24px', textAlign: 'right' }}>
              &ldquo;거울이 보여주지 못하는 매력이<br />
              <span style={{ fontWeight: 700, color: '#6BA3FF' }}>사주에는 있습니다.</span>&rdquo;
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Divider ── */}
      <div
        style={{
          width: '40px',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          margin: '32px auto',
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
            emoji: '⚖️',
            title: '사주로 죄목 확정',
            desc: '도화살, 편관, 식신... 연애 운세를 정밀 분석해 죄목을 기소.',
          },
          {
            emoji: '🔨',
            title: '검사 vs 변호사 실시간 재판',
            desc: '팩폭 검사의 기소 vs 다정한 변호사의 변론. 최종 형량 확정.',
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
                backgroundColor: 'rgba(255,68,68,0.1)',
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.emoji}</span>
            </div>
            <div>
              <p style={{
                fontSize: '14px', fontWeight: 600,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '-0.28px', marginBottom: '4px',
              }}>
                {item.title}
              </p>
              <p style={{
                fontSize: '13px', fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
                lineHeight: '1.5', letterSpacing: '-0.26px',
              }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Sentence Grade Preview ── */}
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
          형량 체계
        </motion.p>

        {SENTENCE_GRADES.map((g) => (
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
              <span style={{
                fontSize: '13px', fontWeight: 800,
                color: g.color, width: '52px',
                letterSpacing: '-0.26px',
              }}>
                {g.grade}
              </span>
              <span style={{
                fontSize: '13px', fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '-0.26px',
              }}>
                {g.label}
              </span>
            </div>
            <span style={{
              fontSize: '13px', fontWeight: 600,
              color: g.color,
              letterSpacing: '-0.26px',
            }}>
              {g.range}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Paradox Card ── */}
      <motion.div
        className="w-full"
        style={{ padding: '28px 28px 0' }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <div style={{
          padding: '16px 20px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255,215,0,0.06)',
          border: '1px solid rgba(255,215,0,0.15)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '15px', fontWeight: 700,
            color: '#FFD700', lineHeight: '24px',
            letterSpacing: '-0.3px',
          }}>
            형량이 높을수록 = 매력이 높다는 뜻
          </p>
          <p style={{
            fontSize: '12px', fontWeight: 400,
            color: 'rgba(255,255,255,0.35)',
            marginTop: '4px', letterSpacing: '-0.24px',
          }}>
            도화살 2개에 5년 썩히면 가중처벌
          </p>
        </div>
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
        <div className="flex" style={{ marginRight: '4px' }}>
          {CHARACTERS.map((char, i) => (
            <div
              key={char.id}
              className="overflow-hidden transform-gpu"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid #111128',
                marginLeft: i > 0 ? '-8px' : '0',
                zIndex: 2 - i,
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
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '-0.26px',
        }}>
          <span style={{ color: '#FF6B6B', fontWeight: 600 }}>87,342</span>명
          기소 완료
        </p>
      </motion.div>

      {/* ── Disclaimer ── */}
      <p style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'center',
        padding: '0 28px 32px',
        lineHeight: '1.5',
      }}>
        재미로 보는 사주 콘텐츠이며,<br />
        실제 심리 진단이 아닙니다.
      </p>

      {/* ── Fixed Bottom CTA ── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-10"
        style={{
          maxWidth: '440px',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background:
            'linear-gradient(to top, #0a0a14 50%, rgba(10,10,20,0.8) 80%, transparent 100%)',
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
            <p style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '-0.32px',
              lineHeight: '25px',
            }}>
              출석하기
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
