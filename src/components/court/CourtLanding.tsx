'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onStart: () => void;
}

// ── Design Tokens ──
const C = {
  // Brand purple
  primary: '#7A38D8',
  primaryDark: '#6B2FC2',
  primaryPressed: '#5E28AB',
  primaryLight: '#F7F2FA',
  primaryTint: '#EDE5F7',
  primarySurface: '#FAF8FC',
  // Sub-color: Prosecution (warm rose)
  prosecute: '#D4556B',
  prosecuteLight: '#FDF2F4',
  prosecuteTint: '#FAE8EB',
  // Sub-color: Defense (cool teal-blue)
  defend: '#3A8C89',
  defendLight: '#EEF7F7',
  defendTint: '#E0F0F0',
  // Neutrals
  textPrimary: '#151515',
  textTertiary: '#6d6d6d',
  textCaption: '#848484',
  textDisabled: '#b7b7b7',
  surface: '#ffffff',
  surfaceSecondary: '#f9f9f9',
  borderDivider: '#f0f0f0',
} as const;

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
  { grade: '극형', label: '도화살 낭비죄', range: '13년+', color: C.prosecute, bg: C.prosecuteLight },
  { grade: '강력범', label: '매력 은닉죄', range: '8~12년', color: C.primaryDark, bg: C.primaryLight },
  { grade: '중범죄', label: '연애 태만죄', range: '4~7년', color: C.primary, bg: C.primarySurface },
  { grade: '경범죄', label: '초범', range: '~3년', color: C.textCaption, bg: C.surfaceSecondary },
];

const COURT_CHARACTERS = [
  {
    id: 'yoon-taesan',
    name: '윤태산',
    role: '검사',
    desc: '팩폭 기소',
    thumbnail: '/characters/yoon-taesan.webp',
    accent: C.prosecute,
    accentBg: C.prosecuteLight,
    accentTint: C.prosecuteTint,
    quote: '당신보다 못생긴 사람도\n지금 연애하고 있습니다.',
    quoteHighlight: '연애하고 있습니다.',
  },
  {
    id: 'seo-hwiyoon',
    name: '서휘윤',
    role: '변호사',
    desc: '다정한 변론',
    thumbnail: '/characters/seo-hwiyoon.webp',
    accent: C.defend,
    accentBg: C.defendLight,
    accentTint: C.defendTint,
    quote: '거울이 보여주지 못하는 매력이\n사주에는 있습니다.',
    quoteHighlight: '사주에는 있습니다.',
  },
];

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const } },
};

// ── Crime Rotator ──
function CrimeRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_CRIMES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ height: '30px', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_CRIMES[index]}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          style={{
            fontSize: '21px',
            fontWeight: 700,
            color: C.primary,
            letterSpacing: '-0.42px',
            display: 'block',
            textAlign: 'center',
          }}
        >
          {ROTATING_CRIMES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ── Character Card ──
function CharacterCard({ char, index }: { char: typeof COURT_CHARACTERS[number]; index: number }) {
  const quoteParts = char.quote.split(char.quoteHighlight);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: index * 0.1 } },
      }}
      style={{
        backgroundColor: char.accentBg,
        borderRadius: '20px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 상단: 캐릭터 정보 */}
      <div className="flex items-center gap-3">
        <div
          className="overflow-hidden transform-gpu shrink-0"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            border: `2px solid ${char.accent}20`,
          }}
        >
          <img
            src={char.thumbnail}
            alt={char.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="eager"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              color: C.textPrimary,
              letterSpacing: '-0.3px',
            }}>
              {char.name}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: char.accent,
              letterSpacing: '-0.22px',
              padding: '2px 8px',
              borderRadius: '20px',
              backgroundColor: `${char.accent}15`,
            }}>
              {char.role}
            </span>
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: 400,
            color: C.textCaption,
            letterSpacing: '-0.24px',
            marginTop: '2px',
            display: 'block',
          }}>
            {char.desc}
          </span>
        </div>
      </div>

      {/* 대사 */}
      <div style={{
        marginTop: '14px',
        padding: '14px 16px',
        borderRadius: '14px',
        backgroundColor: C.surface,
      }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 500,
          color: C.textTertiary,
          lineHeight: '22px',
          letterSpacing: '-0.28px',
          whiteSpace: 'pre-line',
        }}>
          &ldquo;{quoteParts[0]}
          <span style={{ fontWeight: 700, color: char.accent }}>{char.quoteHighlight}</span>
          {quoteParts[1]}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}

// ── Step Item ──
function StepItem({ step, index }: {
  step: { title: string; desc: string };
  index: number;
}) {
  return (
    <motion.div
      className="flex gap-3 items-start"
      variants={fadeUp}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: C.primaryTint,
        }}
      >
        <span style={{
          fontSize: '13px',
          fontWeight: 700,
          color: C.primary,
          letterSpacing: '-0.26px',
        }}>
          {index + 1}
        </span>
      </div>
      <div style={{ paddingTop: '2px' }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 600,
          color: C.textPrimary,
          letterSpacing: '-0.28px',
          marginBottom: '4px',
        }}>
          {step.title}
        </p>
        <p style={{
          fontSize: '13px',
          fontWeight: 400,
          color: C.textCaption,
          lineHeight: '19px',
          letterSpacing: '-0.26px',
        }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main ──
export default function CourtLanding({ onStart }: Props) {
  return (
    <div
      className="relative flex flex-col items-center overflow-x-hidden"
      style={{
        minHeight: '100dvh',
        backgroundColor: C.surface,
        paddingBottom: '100px',
      }}
    >
      {/* ── Hero ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ paddingTop: '52px', paddingBottom: '28px', paddingLeft: '20px', paddingRight: '20px' }}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* 카테고리 뱃지 */}
        <motion.div
          variants={fadeUp}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: C.primaryLight,
            marginBottom: '16px',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18" /><path d="M2 7l4-4 4 4" /><path d="M14 7l4-4 4 4" /><path d="M2 7h8" /><path d="M14 7h8" />
            <circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 600, color: C.primary, letterSpacing: '-0.24px' }}>
            사주 연애 법정
          </span>
        </motion.div>

        {/* 헤드라인 */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: C.textPrimary,
            textAlign: 'center',
            lineHeight: '36px',
            letterSpacing: '-0.52px',
          }}
        >
          연애 못한 죄,<br />
          징역 몇 년?
        </motion.h1>

        {/* 서브카피 */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: C.textCaption,
            textAlign: 'center',
            marginTop: '12px',
            lineHeight: '22px',
            letterSpacing: '-0.28px',
          }}
        >
          사주로 당신의 연애 죄목을 기소하고<br />
          검사와 변호사가 실시간 재판합니다
        </motion.p>
      </motion.div>

      {/* ── 죄목 롤링 카드 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '0 20px 24px' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        <div style={{
          width: '100%',
          borderRadius: '16px',
          border: `1.5px dashed ${C.primary}40`,
          backgroundColor: C.primaryLight,
          padding: '18px 20px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            color: C.textCaption,
            marginBottom: '8px',
            letterSpacing: '-0.22px',
          }}>
            당신의 죄목은?
          </p>
          <CrimeRotator />
        </div>
      </motion.div>

      {/* ── 캐릭터 카드 ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '0 20px', gap: '10px' }}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } } }}
      >
        {COURT_CHARACTERS.map((char, i) => (
          <CharacterCard key={char.id} char={char} index={i} />
        ))}
      </motion.div>

      {/* ── 진행 방식 ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '36px 20px 0', gap: '16px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: C.textCaption,
            letterSpacing: '-0.24px',
          }}
        >
          진행 방식
        </motion.p>

        {[
          { title: '생년월일만 입력', desc: '이름도 필요 없어요. 3초면 끝.' },
          { title: '사주로 죄목 확정', desc: '도화살, 편관, 식신 분석 후 기소장 발부.' },
          { title: '검사 vs 변호사 재판', desc: '팩폭 기소와 다정한 변론. 최종 형량 선고.' },
        ].map((step, i) => (
          <StepItem key={i} step={step} index={i} />
        ))}
      </motion.div>

      {/* ── 형량 체계 ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '36px 20px 0', gap: '8px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: C.textCaption,
            letterSpacing: '-0.24px',
            marginBottom: '4px',
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
              borderRadius: '14px',
              backgroundColor: g.bg,
            }}
          >
            <div className="flex items-center gap-3">
              <span style={{
                fontSize: '13px',
                fontWeight: 800,
                color: g.color,
                width: '48px',
                letterSpacing: '-0.26px',
              }}>
                {g.grade}
              </span>
              <span style={{
                fontSize: '13px',
                fontWeight: 500,
                color: C.textTertiary,
                letterSpacing: '-0.26px',
              }}>
                {g.label}
              </span>
            </div>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: g.color,
              letterSpacing: '-0.26px',
            }}>
              {g.range}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── 역설 인사이트 (밝은 톤) ── */}
      <motion.div
        className="w-full"
        style={{ padding: '20px 20px 0' }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        <div style={{
          padding: '16px 20px',
          borderRadius: '16px',
          backgroundColor: C.primaryLight,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '15px',
            fontWeight: 700,
            color: C.primaryDark,
            lineHeight: '24px',
            letterSpacing: '-0.3px',
          }}>
            형량이 높을수록 = 매력이 높다는 뜻
          </p>
          <p style={{
            fontSize: '12px',
            fontWeight: 400,
            color: C.textCaption,
            marginTop: '4px',
            letterSpacing: '-0.24px',
          }}>
            도화살 2개에 5년 썩히면 가중처벌
          </p>
        </div>
      </motion.div>

      {/* ── 소셜 프루프 ── */}
      <motion.div
        className="flex items-center justify-center gap-2 w-full"
        style={{ padding: '28px 20px 16px' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex" style={{ marginRight: '4px' }}>
          {COURT_CHARACTERS.map((char, i) => (
            <div
              key={char.id}
              className="overflow-hidden transform-gpu"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${C.surface}`,
                marginLeft: i > 0 ? '-8px' : '0',
                zIndex: 2 - i,
              }}
            >
              <img src={char.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: C.textCaption, letterSpacing: '-0.26px' }}>
          <span style={{ color: C.primary, fontWeight: 600 }}>87,342</span>명 기소 완료
        </p>
      </motion.div>

      {/* ── 면책 ── */}
      <p style={{
        fontSize: '11px',
        color: C.textDisabled,
        textAlign: 'center',
        padding: '0 20px 32px',
        lineHeight: '16px',
        letterSpacing: '-0.22px',
      }}>
        재미로 보는 사주 콘텐츠이며, 실제 심리 진단이 아닙니다.
      </p>

      {/* ── 하단 고정 CTA ── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] pointer-events-auto"
        style={{
          backgroundColor: C.surface,
          boxShadow: '0px -8px 16px 0px rgba(255, 255, 255, 0.76)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ padding: '12px 20px' }}>
          <div
            onClick={onStart}
            className="transform-gpu cursor-pointer"
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: C.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.99)';
              e.currentTarget.style.backgroundColor = C.primaryPressed;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = C.primary;
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.99)';
              e.currentTarget.style.backgroundColor = C.primaryPressed;
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = C.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = C.primary;
            }}
          >
            <p style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#ffffff',
              letterSpacing: '-0.32px',
              lineHeight: '25px',
            }}>
              출석하기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
