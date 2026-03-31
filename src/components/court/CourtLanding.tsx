'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onStart: () => void;
}

// ── Design Tokens (Dark Court Theme) ──
const C = {
  // Dark base
  bgDeep: '#0C0914',
  bgCard: '#160F24',
  bgCardHover: '#1C1430',
  bgSurface: '#1E1632',
  bgGlow: 'rgba(122, 56, 216, 0.06)',
  // Brand purple
  primary: '#7A38D8',
  primaryDark: '#6B2FC2',
  primaryPressed: '#5E28AB',
  primaryLight: '#7A38D8',
  primaryMuted: 'rgba(122, 56, 216, 0.15)',
  primaryGlow: 'rgba(122, 56, 216, 0.25)',
  // Prosecution (warm rose)
  prosecute: '#E8627A',
  prosecuteBg: 'rgba(232, 98, 122, 0.08)',
  prosecuteGlow: 'rgba(232, 98, 122, 0.20)',
  // Defense (cool teal-blue)
  defend: '#4ECDC4',
  defendBg: 'rgba(78, 205, 196, 0.08)',
  defendGlow: 'rgba(78, 205, 196, 0.20)',
  // Text
  textBright: '#F5F0FF',
  textPrimary: '#E8E0F5',
  textSecondary: '#A99BC4',
  textMuted: '#6B5C85',
  textDim: '#4A3D64',
  // Misc
  surface: '#ffffff',
  divider: 'rgba(122, 56, 216, 0.10)',
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
  { grade: '극형', label: '도화살 낭비죄', range: '13년+', color: C.prosecute, bg: C.prosecuteBg },
  { grade: '강력범', label: '매력 은닉죄', range: '8~12년', color: '#B07AFF', bg: 'rgba(176, 122, 255, 0.08)' },
  { grade: '중범죄', label: '연애 태만죄', range: '4~7년', color: C.primary, bg: C.primaryMuted },
  { grade: '경범죄', label: '초범', range: '~3년', color: C.textMuted, bg: 'rgba(107, 92, 133, 0.10)' },
];

const COURT_CHARACTERS = [
  {
    id: 'yoon-taesan',
    name: '윤태산',
    role: '검사',
    desc: '팩폭 기소',
    thumbnail: '/characters/yoon-taesan.webp',
    accent: C.prosecute,
    accentBg: C.prosecuteBg,
    accentGlow: C.prosecuteGlow,
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
    accentBg: C.defendBg,
    accentGlow: C.defendGlow,
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
    <div style={{ height: '32px', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_CRIMES[index]}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: C.textBright,
            letterSpacing: '-0.4px',
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

// ── VS Divider ──
function VsDivider() {
  return (
    <div className="flex items-center justify-center" style={{ margin: '-4px 0', position: 'relative', zIndex: 2 }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.prosecute}, ${C.primary}, ${C.defend})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 20px ${C.primaryGlow}`,
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '1px',
        }}>
          VS
        </span>
      </div>
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: index * 0.12 } },
      }}
      style={{
        backgroundColor: C.bgCard,
        borderRadius: '20px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${char.accent}15`,
      }}
    >
      {/* 좌측 액센트 라인 */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '16px',
        bottom: '16px',
        width: '3px',
        borderRadius: '0 3px 3px 0',
        background: char.accent,
        opacity: 0.6,
      }} />

      {/* 상단: 캐릭터 정보 */}
      <div className="flex items-center gap-3">
        <div
          className="overflow-hidden transform-gpu shrink-0"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            border: `2px solid ${char.accent}30`,
            boxShadow: `0 0 16px ${char.accentGlow}`,
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
              color: C.textBright,
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
              backgroundColor: `${char.accent}18`,
              border: `1px solid ${char.accent}25`,
            }}>
              {char.role}
            </span>
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: 400,
            color: C.textMuted,
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
        backgroundColor: `${char.accent}08`,
        border: `1px solid ${char.accent}12`,
      }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 500,
          color: C.textSecondary,
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
          backgroundColor: C.primaryMuted,
          border: `1px solid ${C.primary}30`,
        }}
      >
        <span style={{
          fontSize: '13px',
          fontWeight: 700,
          color: C.primaryLight,
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
          color: C.textMuted,
          lineHeight: '19px',
          letterSpacing: '-0.26px',
        }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

// ── Scale Icon ──
function ScaleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primaryLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="m4 7 4-4 4 4" />
      <path d="m12 7 4-4 4 4" />
      <path d="M4 7h8" />
      <path d="M12 7h8" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  );
}

// ── Main ──
export default function CourtLanding({ onStart }: Props) {
  return (
    <div
      className="relative flex flex-col items-center overflow-x-hidden"
      style={{
        minHeight: '100dvh',
        backgroundColor: C.bgDeep,
        paddingBottom: '100px',
      }}
    >
      {/* ── Hero ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{
          paddingTop: '52px',
          paddingBottom: '32px',
          paddingLeft: '20px',
          paddingRight: '20px',
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C.primaryGlow} 0%, transparent 70%)`,
        }}
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
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: C.primaryMuted,
            border: `1px solid ${C.primary}25`,
            marginBottom: '20px',
          }}
        >
          <ScaleIcon />
          <span style={{ fontSize: '12px', fontWeight: 600, color: C.primaryLight, letterSpacing: '-0.24px' }}>
            사주 연애 법정
          </span>
        </motion.div>

        {/* 헤드라인 */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: C.textBright,
            textAlign: 'center',
            lineHeight: '38px',
            letterSpacing: '-0.56px',
          }}
        >
          연애 못한 죄,<br />
          <span style={{
            background: `linear-gradient(135deg, ${C.prosecute}, ${C.primary}, ${C.defend})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            징역 몇 년?
          </span>
        </motion.h1>

        {/* 서브카피 */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: C.textMuted,
            textAlign: 'center',
            marginTop: '14px',
            lineHeight: '22px',
            letterSpacing: '-0.28px',
          }}
        >
          사주로 당신의 연애 죄목을 기소하고<br />
          검사와 변호사가 실시간 재판합니다
        </motion.p>
      </motion.div>

      {/* ── 죄목 롤링 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '0 20px 28px' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      >
        <div style={{
          width: '100%',
          borderRadius: '16px',
          backgroundColor: C.bgCard,
          border: `1px solid ${C.primary}18`,
          padding: '18px 20px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            color: C.textMuted,
            marginBottom: '8px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            당신의 죄목은?
          </p>
          <CrimeRotator />
        </div>
      </motion.div>

      {/* ── 캐릭터 카드 (VS 구도) ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '0 20px' }}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } } }}
      >
        <CharacterCard char={COURT_CHARACTERS[0]} index={0} />
        <VsDivider />
        <CharacterCard char={COURT_CHARACTERS[1]} index={1} />
      </motion.div>

      {/* ── 진행 방식 ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '40px 20px 0', gap: '16px' }}
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
            color: C.textMuted,
            letterSpacing: '1px',
            textTransform: 'uppercase',
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
        style={{ padding: '36px 20px 0', gap: '6px' }}
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
            color: C.textMuted,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '6px',
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
              backgroundColor: g.bg,
              border: `1px solid ${g.color}12`,
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
                color: C.textSecondary,
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

      {/* ── 역설 인사이트 ── */}
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
          backgroundColor: C.primaryMuted,
          border: `1px solid ${C.primary}20`,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '15px',
            fontWeight: 700,
            color: C.textBright,
            lineHeight: '24px',
            letterSpacing: '-0.3px',
          }}>
            형량이 높을수록 = 매력이 높다는 뜻
          </p>
          <p style={{
            fontSize: '12px',
            fontWeight: 400,
            color: C.textMuted,
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
                border: `2px solid ${C.bgDeep}`,
                marginLeft: i > 0 ? '-8px' : '0',
                zIndex: 2 - i,
              }}
            >
              <img src={char.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: C.textMuted, letterSpacing: '-0.26px' }}>
          <span style={{ color: C.primaryLight, fontWeight: 600 }}>87,342</span>명 기소 완료
        </p>
      </motion.div>

      {/* ── 면책 ── */}
      <p style={{
        fontSize: '11px',
        color: C.textDim,
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
          background: `linear-gradient(to top, ${C.bgDeep} 60%, transparent)`,
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
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              boxShadow: `0 4px 24px ${C.primaryGlow}`,
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.99)';
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.99)';
              e.currentTarget.style.opacity = '0.9';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
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
          </div>
        </div>
      </div>
    </div>
  );
}
