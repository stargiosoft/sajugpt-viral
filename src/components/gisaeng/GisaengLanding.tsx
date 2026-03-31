'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
}

// ─── 조선 컬러 팔레트 ──────────────────────────────────
const C = {
  hanji: '#F5F0E8',       // 한지
  hanjiDark: '#EDE6D8',   // 한지 진한
  ink: '#1A1715',          // 먹
  inkSoft: '#3D3530',      // 먹 연한
  inkMuted: '#6B5F56',     // 먹 회색
  inkFaint: '#A69A8E',     // 먹 흐린
  vermillion: '#B8423A',   // 주칠 (주홍)
  vermillionDark: '#9C342E', // 주칠 진한
  gold: '#C9A96E',         // 황금
  goldMuted: '#B89B5E',    // 황금 진한
  border: '#DDD5C8',       // 테두리
  cardBg: '#FAF7F2',       // 카드 배경
};

// ─── 선비 데이터 ───────────────────────────────────────
const SEONBI = [
  { name: '윤태산', title: '좌의정의 아들', trait: '의심 많음', hanja: '權', color: C.gold, thumbnail: '/characters/yoon-taesan.webp' },
  { name: '서휘윤', title: '한양 최고 시인', trait: '진심만 원함', hanja: '情', color: C.vermillion, thumbnail: '/characters/seo-hwiyoon.webp' },
  { name: '도해결', title: '무관 출신 장수', trait: '독점욕 강함', hanja: '怒', color: C.inkSoft, thumbnail: '/characters/do-haegyeol.webp' },
];

const TIERS = [
  { tier: 'S', label: '전설의 명기', salary: '1,095냥', modern: '5,475만원', color: C.gold },
  { tier: 'A', label: '위태로운 해어화', salary: '680냥', modern: '3,400만원', color: C.vermillion },
  { tier: 'B', label: '쏠쏠한 기생', salary: '420냥', modern: '2,100만원', color: C.inkSoft },
  { tier: 'C', label: '외길 춘향', salary: '180냥', modern: '900만원', color: C.inkMuted },
  { tier: 'D', label: '기방 추방', salary: '0냥', modern: '0원', color: C.inkFaint },
];

// ─── 애니메이션 ────────────────────────────────────────
const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const brushReveal = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const inkDrop = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

export default function GisaengLanding({ onStart }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative flex flex-col items-center overflow-x-hidden"
      style={{
        minHeight: '100dvh',
        backgroundColor: C.hanji,
        paddingBottom: '120px',
        fontFamily: 'Pretendard Variable, sans-serif',
      }}
    >
      {/* ── 한지 텍스처 오버레이 ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A96E' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Hero Section ── */}
      <motion.div
        className="relative z-10 flex flex-col items-center w-full"
        style={{ paddingTop: '64px', paddingBottom: '8px' }}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* 기방 간판 스타일 라벨 */}
        <motion.div
          variants={inkDrop}
          style={{
            backgroundColor: C.vermillion,
            padding: '6px 20px',
            borderRadius: '2px',
            marginBottom: '28px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: C.hanji, letterSpacing: '3px' }}>
            기방 시뮬레이션
          </span>
        </motion.div>

        {/* 한자 장식 */}
        <motion.p
          variants={brushReveal}
          style={{
            fontSize: '40px',
            fontWeight: 200,
            color: C.inkFaint,
            letterSpacing: '16px',
            marginBottom: '16px',
            opacity: 0.4,
          }}
        >
          解語花
        </motion.p>

        {/* 메인 헤드카피 */}
        <motion.h1
          variants={brushReveal}
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: C.ink,
            textAlign: 'center',
            lineHeight: 1.45,
            letterSpacing: '-0.56px',
          }}
        >
          조선시대 기생이었다면
          <br />
          <span style={{ color: C.vermillion }}>넌 밤새 얼마를 벌었을까</span>
        </motion.h1>

        {/* 서브 카피 */}
        <motion.p
          variants={fadeIn}
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: C.inkMuted,
            textAlign: 'center',
            marginTop: '16px',
            lineHeight: 1.7,
            letterSpacing: '-0.28px',
          }}
        >
          사주로 기생 능력치를 뽑고
          <br />
          선비 3명을 동시에 관리해보세요
        </motion.p>
      </motion.div>

      {/* ── 먹 브러시 디바이더 ── */}
      <div className="w-full flex justify-center" style={{ padding: '32px 0' }}>
        <svg width="120" height="8" viewBox="0 0 120 8" fill="none">
          <path
            d="M2 4C2 4 20 2 40 3C60 4 80 2 100 3C110 3.5 118 4 118 4"
            stroke={C.inkFaint}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* ── 선비 3명 프리뷰 ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '0 24px', gap: '16px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeIn}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: C.inkFaint,
            letterSpacing: '2px',
          }}
        >
          오늘 밤, 셋 다 왔다
        </motion.p>

        <div className="flex gap-3">
          {SEONBI.map((s) => (
            <motion.div
              key={s.name}
              variants={inkDrop}
              className="flex-1 flex flex-col items-center transform-gpu"
              style={{
                backgroundColor: C.cardBg,
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                padding: '16px 8px 14px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 한자 워터마크 */}
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-4px',
                  fontSize: '64px',
                  fontWeight: 200,
                  color: s.color,
                  opacity: 0.06,
                  lineHeight: 1,
                  pointerEvents: 'none',
                }}
              >
                {s.hanja}
              </span>

              {/* 아바타 */}
              <div
                className="overflow-hidden transform-gpu"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: `2px solid ${s.color}`,
                }}
              >
                <img src={s.thumbnail} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <p style={{ fontSize: '14px', fontWeight: 600, color: C.ink, marginTop: '8px', letterSpacing: '-0.28px' }}>
                {s.name}
              </p>
              <p style={{ fontSize: '11px', fontWeight: 400, color: C.inkMuted, marginTop: '2px', letterSpacing: '-0.22px' }}>
                {s.title}
              </p>

              {/* 특성 태그 */}
              <div
                style={{
                  marginTop: '6px',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  backgroundColor: `${s.color}0D`,
                  border: `1px solid ${s.color}1A`,
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 500, color: s.color }}>
                  {s.trait}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 진행 방식 ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '40px 24px 0', gap: '0' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeIn}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: C.inkFaint,
            letterSpacing: '2px',
            marginBottom: '20px',
          }}
        >
          진행 방식
        </motion.p>

        {[
          {
            num: '壹',
            title: '생년월일 입력',
            desc: '3초면 기방 문이 열린다',
          },
          {
            num: '貳',
            title: '기생 능력치 카드',
            desc: '화술·요염·지성·밀당·눈치 5가지 스탯 판정',
          },
          {
            num: '參',
            title: '선비 3명 동시 관리',
            desc: '3라운드 동안 들키지 않고 셋을 돌려라',
          },
          {
            num: '肆',
            title: '최종 결산',
            desc: '기생 티어 + 월 급여를 냥(현대 만원)으로 환산',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={brushReveal}
            className="flex items-start gap-4"
            style={{
              padding: '16px 0',
              borderBottom: i < 3 ? `1px solid ${C.border}` : 'none',
            }}
          >
            {/* 한자 번호 */}
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: i === 0 ? C.vermillion : 'transparent',
                border: i === 0 ? 'none' : `1px solid ${C.border}`,
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: i === 0 ? C.hanji : C.inkMuted,
                }}
              >
                {item.num}
              </span>
            </div>

            <div style={{ paddingTop: '2px' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: C.ink, letterSpacing: '-0.3px', marginBottom: '3px' }}>
                {item.title}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 400, color: C.inkMuted, lineHeight: 1.5, letterSpacing: '-0.26px' }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── 티어 프리뷰 ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '40px 24px 0', gap: '8px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeIn}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: C.inkFaint,
            letterSpacing: '2px',
            marginBottom: '12px',
          }}
        >
          기생 등급
        </motion.p>

        {TIERS.map((t) => (
          <motion.div
            key={t.tier}
            className="flex items-center justify-between transform-gpu"
            variants={fadeIn}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: C.cardBg,
              border: `1px solid ${C.border}`,
            }}
          >
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: t.color,
                  width: '24px',
                  letterSpacing: '-0.3px',
                }}
              >
                {t.tier}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: C.inkSoft, letterSpacing: '-0.26px' }}>
                {t.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '13px', fontWeight: 600, color: t.color, letterSpacing: '-0.26px' }}>
                {t.salary}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 400, color: C.inkFaint }}>
                ({t.modern})
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── 면책 ── */}
      <p
        style={{
          fontSize: '11px',
          fontWeight: 400,
          color: C.inkFaint,
          textAlign: 'center',
          padding: '32px 28px 24px',
          lineHeight: 1.5,
        }}
      >
        본 테스트는 재미로 보는 콘텐츠이며, 실제 운세 진단이 아닙니다
      </p>

      {/* ── Fixed Bottom CTA ── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-10 pointer-events-auto"
        style={{
          maxWidth: '440px',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background: `linear-gradient(to top, ${C.hanji} 60%, ${C.hanji}CC 80%, transparent 100%)`,
        }}
      >
        <div style={{ padding: '12px 20px 24px' }}>
          <motion.div
            onClick={onStart}
            className="transform-gpu cursor-pointer"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            style={{
              height: '56px',
              borderRadius: '14px',
              backgroundColor: C.vermillion,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(184, 66, 58, 0.25)',
            }}
          >
            <p style={{ fontSize: '16px', fontWeight: 600, color: C.hanji, letterSpacing: '-0.32px' }}>
              기방 문 열기
            </p>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke={C.hanji} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          <p style={{ fontSize: '11px', fontWeight: 400, color: C.inkFaint, textAlign: 'center', marginTop: '8px' }}>
            가입 없이 생년월일만 입력
          </p>
        </div>
      </div>
    </div>
  );
}
