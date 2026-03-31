'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
}

// ─── 시종 프로필 ───
const SERVANTS = [
  { name: '윤태산', label: '야수형', color: '#e05252', quote: '"말이 필요합니까?"', personality: '직설적, 거침없음. 몸으로 증명하는 타입', thumbnail: '/characters/yoon-taesan.webp' },
  { name: '서휘윤', label: '시인형', color: '#5b9bd5', quote: '"천천히 불을 지펴야..."', personality: '감성적, 말이 무기. 분위기를 만드는 타입', thumbnail: '/characters/seo-hwiyoon.webp' },
  { name: '도해결', label: '집사형', color: '#6bb87a', quote: '"마마의 편안함이 최우선"', personality: '절제된 매너, 완벽한 준비. 복종하는 타입', thumbnail: '/characters/choi-seolgye.webp' },
];

// ─── 체질 유형 프리뷰 ───
const CONSTITUTIONS = [
  { name: '심화(心火)', concept: '불꽃형', color: '#e05252' },
  { name: '뇌전(雷電)', concept: '천둥형', color: '#c9a96e' },
  { name: '묘향(妙香)', concept: '향기형', color: '#b87ad8' },
  { name: '세우(細雨)', concept: '이슬비형', color: '#5b9bd5' },
  { name: '장강(長江)', concept: '강물형', color: '#4a9e8f' },
  { name: '용화(龍火)', concept: '전설', color: '#FFD700' },
];

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const } },
};

// ─── SVG 아이콘 ───
function MoonIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path
        d="M40 26.4C39.1 31.3 36.1 35.6 31.8 38.1C24.2 42.5 14.5 39.9 10.1 32.3C5.7 24.7 8.3 15 15.9 10.6C16.8 10.1 17.7 9.6 18.7 9.3C14.7 15.7 16.5 24.1 22.5 28.6C28.5 33.1 37 32.4 40 26.4Z"
        fill="#c9a96e"
        fillOpacity="0.9"
      />
      <circle cx="28" cy="14" r="1.5" fill="#c9a96e" fillOpacity="0.4" />
      <circle cx="35" cy="20" r="1" fill="#c9a96e" fillOpacity="0.3" />
    </svg>
  );
}

function ScrollIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function NightLanding({ onStart }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="relative flex flex-col items-center overflow-x-hidden"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #0d0d1a 0%, #12101f 30%, #16132a 60%, #0d0d1a 100%)',
        paddingBottom: '100px',
      }}
    >
      {/* ── 히어로 섹션 ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ paddingTop: '72px', paddingLeft: '24px', paddingRight: '24px' }}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <MoonIcon />
        </motion.div>

        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#c9a96e',
            letterSpacing: '3px',
            marginTop: '20px',
          }}
        >
          은밀한 기록 유출
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-center"
          style={{
            fontSize: '30px',
            fontWeight: 800,
            color: '#f0e6ff',
            marginTop: '12px',
            lineHeight: '1.35',
            letterSpacing: '-0.6px',
          }}
        >
          시종들이 마마를 두고<br />
          <span style={{ color: '#c9a96e' }}>은밀한 토론</span>을 벌였습니다
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-center"
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.45)',
            marginTop: '12px',
            lineHeight: '1.7',
            letterSpacing: '-0.28px',
          }}
        >
          사주 기반 은밀한 체질을 진단받고,<br />
          병풍 뒤에서 쟁탈전을 엿들어보세요
        </motion.p>
      </motion.div>

      {/* ── 한지 두루마리 프리뷰 카드 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '32px 24px 0' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.32, 0.72, 0, 1] as const }}
      >
        {/* 기울어진 그림자 카드 (깊이감) */}
        <div className="relative" style={{ maxWidth: '360px', margin: '0 auto' }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#1e1a30',
              borderRadius: '16px',
              transform: 'rotate(1.5deg)',
              opacity: 0.5,
            }}
          />

          {/* 메인 한지 카드 */}
          <div
            className="relative"
            style={{
              backgroundColor: '#1a1530',
              borderRadius: '16px',
              border: '1px solid rgba(201, 169, 110, 0.15)',
              padding: '24px 20px',
              overflow: 'hidden',
            }}
          >
            {/* 상단 장식선 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '20px',
                right: '20px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.3) 50%, transparent 100%)',
              }}
            />

            {/* 문서 헤더 */}
            <div className="flex items-center justify-between" style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 500, color: '#c9a96e', letterSpacing: '1.5px' }}>
                체질 평가표
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(201,169,110,0.4)' }}>
                제2026-****호
              </span>
            </div>

            <p style={{
              fontSize: '16px', fontWeight: 700, color: '#f0e6ff',
              letterSpacing: '-0.32px', marginBottom: '16px',
            }}>
              은밀한 체질 평가표
            </p>

            {/* 능력치 미리보기 (블러 처리) */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(122, 56, 216, 0.06)',
                border: '1px solid rgba(122, 56, 216, 0.1)',
                marginBottom: '14px',
              }}
            >
              {['감도', '지배력', '중독성', '민감도', '지구력'].map((stat, i) => (
                <div key={stat} className="flex items-center gap-3" style={{ marginBottom: i < 4 ? '6px' : 0 }}>
                  <span style={{ fontSize: '12px', color: '#8b7aaa', width: '40px', fontWeight: 600 }}>{stat}</span>
                  <div className="flex-1" style={{ height: '6px', backgroundColor: '#2a2440', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${[72, 45, 88, 63, 51][i]}%`,
                        backgroundColor: '#7A38D8',
                        borderRadius: '3px',
                        filter: 'blur(2px)',
                        opacity: 0.6,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b6080', width: '20px', fontWeight: 700, filter: 'blur(4px)' }}>
                    {[72, 45, 88, 63, 51][i]}
                  </span>
                </div>
              ))}
            </div>

            {/* 체질 결과 미리보기 */}
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: '11px', color: '#6b6080' }}>체질</p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#c9a96e', filter: 'blur(3px)' }}>묘향(妙香)</p>
              </div>
              <div className="text-right">
                <p style={{ fontSize: '11px', color: '#6b6080' }}>총 매혹력</p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#f0e6ff', filter: 'blur(3px)' }}>
                  319 <span style={{ fontSize: '11px', color: '#6b6080' }}>/ 500</span>
                </p>
              </div>
            </div>

            {/* 하단 장식선 */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '20px',
                right: '20px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.3) 50%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── 시종 3명 소개 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '32px 24px 0' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: '12px', fontWeight: 600, color: '#c9a96e',
            letterSpacing: '1.5px', marginBottom: '16px',
          }}
        >
          시종 3명이 대기 중
        </motion.p>

        <div className="flex flex-col gap-3">
          {SERVANTS.map((s) => (
            <motion.div
              key={s.name}
              variants={fadeUp}
              className="flex items-center gap-4"
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                backgroundColor: '#1a1530',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {/* 시종 아바타 */}
              <div
                className="shrink-0 overflow-hidden transform-gpu"
                style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  border: `2px solid ${s.color}40`,
                  boxShadow: `0 0 12px ${s.color}20`,
                }}
              >
                <img
                  src={s.thumbnail}
                  alt={s.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="eager"
                />
              </div>

              {/* 텍스트 */}
              <div className="flex-1" style={{ minWidth: 0 }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#f0e6ff', letterSpacing: '-0.3px' }}>
                    {s.name}
                  </span>
                  <span
                    style={{
                      fontSize: '10px', fontWeight: 600, color: s.color,
                      padding: '2px 6px', borderRadius: '6px',
                      backgroundColor: `${s.color}12`,
                      border: `1px solid ${s.color}20`,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#8b7aaa', marginTop: '3px', letterSpacing: '-0.24px' }}>
                  {s.personality}
                </p>
                <p style={{ fontSize: '13px', color: '#c9a96e', marginTop: '4px', letterSpacing: '-0.26px', fontWeight: 500 }}>
                  {s.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 구분선 ── */}
      <div className="w-full flex justify-center" style={{ padding: '32px 0' }}>
        <div style={{
          width: '40px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)',
        }} />
      </div>

      {/* ── 진행 방식 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '0 24px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{ fontSize: '12px', fontWeight: 600, color: '#c9a96e', letterSpacing: '1.5px', marginBottom: '16px' }}
        >
          진행 방식
        </motion.p>

        {[
          { icon: <StatsIcon />, title: '체질 평가표', desc: '사주 기반 5가지 능력치 진단' },
          { icon: <UsersIcon />, title: '시종 난상토론', desc: '3명이 마마를 두고 쟁탈전' },
          { icon: <ScrollIcon />, title: '시종 선택 + 결산', desc: '취향에 맞는 시종을 선택하고 결과 카드 발급' },
        ].map((step, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-start gap-4"
            style={{ marginBottom: i < 2 ? '16px' : 0 }}
          >
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                backgroundColor: 'rgba(201,169,110,0.08)',
                border: '1px solid rgba(201,169,110,0.12)',
              }}
            >
              {step.icon}
            </div>
            <div style={{ paddingTop: '2px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#f0e6ff', letterSpacing: '-0.28px' }}>
                {step.title}
              </p>
              <p style={{ fontSize: '12px', color: '#6b6080', marginTop: '2px', letterSpacing: '-0.24px' }}>
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── 구분선 ── */}
      <div className="w-full flex justify-center" style={{ padding: '32px 0' }}>
        <div style={{
          width: '40px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)',
        }} />
      </div>

      {/* ── 체질 유형 프리뷰 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '0 24px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{ fontSize: '12px', fontWeight: 600, color: '#c9a96e', letterSpacing: '1.5px', marginBottom: '16px' }}
        >
          6가지 체질 유형
        </motion.p>

        <div className="flex flex-col gap-2">
          {CONSTITUTIONS.map((c) => (
            <motion.div
              key={c.name}
              variants={fadeUp}
              className="flex items-center justify-between"
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: '#1a1530',
                border: '1px solid rgba(255,255,255,0.03)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: c.color, opacity: 0.7,
                  }}
                />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#f0e6ff', letterSpacing: '-0.28px' }}>
                  {c.name}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#6b6080' }}>
                {c.concept}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 면책 ── */}
      <motion.p
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: '11px', color: 'rgba(255,255,255,0.2)',
          marginTop: '32px', padding: '0 24px',
          lineHeight: '1.6',
        }}
      >
        생년월일만으로 진단 · 가입 불필요 · AI 기반 엔터테인먼트
      </motion.p>

      {/* ── 하단 고정 CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 flex justify-center"
        style={{
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          pointerEvents: 'none',
        }}
      >
        <div
          className="w-full"
          style={{
            maxWidth: '440px',
            padding: '0 24px',
            paddingTop: '16px',
            background: 'linear-gradient(to top, #0d0d1a 60%, transparent)',
            pointerEvents: 'auto',
          }}
        >
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={onStart}
            className="w-full"
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#7A38D8',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.32px',
              boxShadow: '0 4px 24px rgba(122, 56, 216, 0.4)',
              transition: 'all 0.15s ease',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.97)';
              e.currentTarget.style.backgroundColor = '#6B2FC2';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#7A38D8';
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.97)';
              e.currentTarget.style.backgroundColor = '#6B2FC2';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#7A38D8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#7A38D8';
            }}
          >
            병풍 뒤에서 엿듣기
          </motion.button>
        </div>
      </div>
    </div>
  );
}
