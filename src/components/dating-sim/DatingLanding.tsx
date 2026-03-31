'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '@/constants/characters';

interface Props {
  onStart: () => void;
}

// ─── 대화 프리뷰 데이터 ──────────────────────────────────
const DEMO_CONVERSATIONS = [
  {
    charId: 'yoon-taesan',
    charName: '윤태산',
    situation: '카페에서 첫 만남',
    charLine: '흥. 네 사주에서 도화살 냄새가 나는데?',
    choices: [
      { text: '눈 안 피하고 마주 보기', type: 'bold' as const },
      { text: '당신 사주는 어떤데요?', type: 'witty' as const },
      { text: '아, 감사합니다...', type: 'safe' as const },
    ],
    reaction: '...재밌네. 보통은 눈을 피하는데.',
  },
  {
    charId: 'seo-hwiyoon',
    charName: '서휘윤',
    situation: '맛집 대화 중',
    charLine: '어떤 음식 좋아하세요? 저는 파스타요!',
    choices: [
      { text: '직접 해줄까? 잘 만들어', type: 'bold' as const },
      { text: '파스타 맛집 하나 알아요', type: 'witty' as const },
      { text: '저도 파스타 좋아해요', type: 'safe' as const },
    ],
    reaction: '진짜요?! 같이 가요 우리!',
  },
  {
    charId: 'choi-seolgye',
    charName: '최설계',
    situation: '가치관 탐색',
    charLine: '당신의 인생 포트폴리오에서 연애 비중은?',
    choices: [
      { text: '올인할 종목을 찾는 중', type: 'bold' as const },
      { text: '분산투자 중이에요', type: 'witty' as const },
      { text: '아직 모르겠어요', type: 'safe' as const },
    ],
    reaction: '흥미로운 전략이군요. 수익률이 기대됩니다.',
  },
];

const CHOICE_COLORS = {
  bold: { border: '#FF6B6B', bg: '#FFF5F5', text: '#FF6B6B' },
  witty: { border: '#7A38D8', bg: '#F7F2FA', text: '#7A38D8' },
  safe: { border: '#4488FF', bg: '#F0F5FF', text: '#4488FF' },
};

const SCORE_ITEMS = [
  { label: '매력도', value: 8, color: '#FF6B6B' },
  { label: '대화력', value: 4, color: '#4488FF' },
  { label: '센스', value: 7, color: '#7A38D8' },
  { label: '중독성', value: 3, color: '#FFB347' },
];

// ─── 애니메이션 상수 ─────────────────────────────────────
const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function DatingLanding({ onStart }: Props) {
  // ─── 타이핑 애니메이션 (캐릭터 대사) ─────────────────────
  const [demoIndex, setDemoIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showReaction, setShowReaction] = useState(false);

  const demo = DEMO_CONVERSATIONS[demoIndex];

  useEffect(() => {
    setTypedText('');
    setShowChoices(false);
    setSelectedChoice(null);
    setShowReaction(false);

    let i = 0;
    const text = demo.charLine;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowChoices(true), 400);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [demoIndex, demo.charLine]);

  // 선택지 자동 선택 → 반응 → 다음 대화
  useEffect(() => {
    if (!showChoices) return;

    const autoSelectTimer = setTimeout(() => {
      const pick = Math.floor(Math.random() * 3);
      setSelectedChoice(pick);
      setTimeout(() => setShowReaction(true), 500);
      setTimeout(() => {
        setDemoIndex((prev) => (prev + 1) % DEMO_CONVERSATIONS.length);
      }, 3000);
    }, 2200);

    return () => clearTimeout(autoSelectTimer);
  }, [showChoices]);

  const currentChar = CHARACTERS.find(c => c.id === demo.charId);

  return (
    <div
      className="relative flex flex-col items-center overflow-x-hidden"
      style={{
        minHeight: '100%',
        background: 'linear-gradient(180deg, #0f0a1a 0%, #1a1038 35%, #251545 65%, #1a1038 100%)',
        paddingBottom: '100px',
      }}
    >
      {/* ── Hero ── */}
      <motion.div
        className="flex flex-col items-center w-full"
        style={{ paddingTop: '64px', paddingBottom: '4px' }}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: '#e89bab',
            letterSpacing: '2px',
            marginBottom: '14px',
          }}
        >
          데이트 시뮬레이션
        </motion.p>

        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '28px',
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '1.35',
            letterSpacing: '-0.56px',
          }}
        >
          5턴 안에<br />
          <span style={{ color: '#f0a8bc' }}>데이트 따낼</span> 수 있어?
        </motion.h1>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.45)',
            textAlign: 'center',
            marginTop: '14px',
            lineHeight: '1.7',
            letterSpacing: '-0.28px',
          }}
        >
          사주 궁합으로 매칭된 AI 캐릭터와<br />
          선택지 대화로 마음을 사로잡으세요
        </motion.p>
      </motion.div>

      {/* ── 대화 프리뷰 (핵심 차별화 요소) ── */}
      <motion.div
        className="w-full"
        style={{ padding: '28px 20px 0' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {/* 대화 카드 */}
        <div
          className="w-full overflow-hidden transform-gpu"
          style={{
            borderRadius: '20px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* 카드 헤더: 턴 + 상황 */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#e89bab',
                }}
              >
                Turn {demoIndex + 1}
              </span>
              <span
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.25)',
                }}
              >
                {demo.situation}
              </span>
            </div>

            {/* 호감도 게이지 미니 */}
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                호감도
              </span>
              <div
                style={{
                  width: '48px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  style={{
                    height: '100%',
                    borderRadius: '2px',
                    backgroundColor: '#e89bab',
                  }}
                  animate={{ width: `${35 + demoIndex * 20}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>

          {/* 대화 영역 */}
          <div style={{ padding: '16px 18px', minHeight: '180px' }}>
            {/* 캐릭터 대사 */}
            <div className="flex items-start gap-3" style={{ marginBottom: '16px' }}>
              <div
                className="overflow-hidden transform-gpu shrink-0"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid rgba(232,155,171,0.4)',
                }}
              >
                {currentChar && (
                  <img
                    src={currentChar.thumbnail}
                    alt={demo.charName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.4)',
                    marginBottom: '6px',
                  }}
                >
                  {demo.charName}
                </p>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '14px',
                    borderTopLeftRadius: '4px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '1.55',
                      color: 'rgba(255,255,255,0.85)',
                      letterSpacing: '-0.28px',
                    }}
                  >
                    {typedText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      style={{ color: '#e89bab' }}
                    >
                      |
                    </motion.span>
                  </p>
                </div>
              </div>
            </div>

            {/* 선택지 */}
            <div className="flex flex-col gap-2" style={{ marginLeft: '48px' }}>
              {showChoices && demo.choices.map((choice, i) => {
                const cs = CHOICE_COLORS[choice.type];
                const isSelected = selectedChoice === i;

                return (
                  <motion.div
                    key={`${demoIndex}-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: isSelected ? 1 : selectedChoice !== null ? 0.3 : 1,
                      x: 0,
                      scale: isSelected ? 1.02 : 1,
                    }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '12px',
                      border: `1px solid ${isSelected ? cs.border : 'rgba(255,255,255,0.1)'}`,
                      backgroundColor: isSelected ? `${cs.border}15` : 'transparent',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Pretendard Variable, sans-serif',
                        fontSize: '13px',
                        fontWeight: isSelected ? 500 : 400,
                        color: isSelected ? cs.text : 'rgba(255,255,255,0.6)',
                        letterSpacing: '-0.26px',
                      }}
                    >
                      {choice.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* 캐릭터 반응 */}
            {showReaction && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
                style={{ marginTop: '12px' }}
              >
                <div className="shrink-0" style={{ width: '36px' }} />
                <div
                  style={{
                    padding: '9px 14px',
                    borderRadius: '14px',
                    borderTopLeftRadius: '4px',
                    backgroundColor: 'rgba(232,155,171,0.12)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#e89bab',
                      letterSpacing: '-0.26px',
                    }}
                  >
                    {demo.reaction}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── 점수표 프리뷰 (결과 미리보기) ── */}
      <motion.div
        className="w-full"
        style={{ padding: '24px 20px 0' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1.5px',
            marginBottom: '12px',
          }}
        >
          결과 예시
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="overflow-hidden transform-gpu"
          style={{
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '18px',
          }}
        >
          {/* 캐릭터 채점 헤더 */}
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div
              className="overflow-hidden transform-gpu"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid rgba(232,155,171,0.3)',
              }}
            >
              <img
                src="/characters/yoon-taesan.webp"
                alt="윤태산"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <p
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '-0.26px',
              }}
            >
              윤태산의 채점표
            </p>
          </div>

          {/* 점수 바 */}
          <div className="flex flex-col gap-3">
            {SCORE_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    width: '42px',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.4)',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </span>
                <div
                  className="flex-1"
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    style={{
                      height: '100%',
                      borderRadius: '3px',
                      backgroundColor: item.color,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value * 10}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    width: '32px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: item.value <= 4 ? '#FF6B6B' : 'rgba(255,255,255,0.6)',
                    flexShrink: 0,
                  }}
                >
                  {item.value}/10
                  {item.value <= 4 && (
                    <span style={{ fontSize: '9px', marginLeft: '2px' }}>←</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* 총점 + 팩폭 */}
          <div
            className="flex items-center justify-between"
            style={{
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '11px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.3)',
                lineHeight: '1.5',
                maxWidth: '60%',
              }}
            >
              &ldquo;10점 만점에 4.8...
              현실에서도 이 점수면 2번째 만남은 없어.&rdquo;
            </p>
            <div className="flex flex-col items-end">
              <span
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#e89bab',
                  letterSpacing: '-0.48px',
                }}
              >
                4.8
              </span>
              <span
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                / 10
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── 캐릭터 3명 프리뷰 ── */}
      <motion.div
        className="w-full"
        style={{ padding: '32px 20px 0' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1.5px',
            marginBottom: '14px',
          }}
        >
          데이트 상대
        </motion.p>

        <div className="flex flex-col gap-3">
          {[
            { char: CHARACTERS[0], rate: '12%', compat: '87%', line: '직진하는 타입이 좋아. 눈치 보지 마.' },
            { char: CHARACTERS[2], rate: '28%', compat: '72%', line: '솔직하고 편안한 사람이 좋아요!' },
            { char: CHARACTERS[4], rate: '15%', compat: '65%', line: '전략 없이 오면 퇴장이에요.' },
          ].map((item, i) => (
            <motion.div
              key={item.char.id}
              variants={fadeUp}
              className="flex items-center gap-3"
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="overflow-hidden transform-gpu shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '2px solid rgba(232,155,171,0.25)',
                }}
              >
                <img
                  src={item.char.thumbnail}
                  alt={item.char.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.85)',
                      letterSpacing: '-0.28px',
                    }}
                  >
                    {item.char.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Pretendard Variable, sans-serif',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#e89bab',
                    }}
                  >
                    성공률 {item.rate}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'Pretendard Variable, sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.35)',
                    marginTop: '4px',
                    letterSpacing: '-0.24px',
                  }}
                >
                  &ldquo;{item.line}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 진행 방식 ── */}
      <motion.div
        className="w-full flex flex-col"
        style={{ padding: '36px 28px 0', gap: '18px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1.5px',
            marginBottom: '2px',
          }}
        >
          진행 방식
        </motion.p>

        {[
          {
            num: '01',
            title: '생년월일만 입력',
            desc: '사주 분석으로 궁합 좋은 캐릭터 3명을 추천해요.',
          },
          {
            num: '02',
            title: '캐릭터 선택 + 5턴 대화',
            desc: '선택지를 골라 호감도를 올리세요. 눈치가 관건!',
          },
          {
            num: '03',
            title: '채점표 + 등수 공개',
            desc: '캐릭터가 매긴 점수와 전체 유저 중 등수를 확인.',
          },
        ].map((step) => (
          <motion.div
            key={step.num}
            className="flex gap-3 items-start"
            variants={fadeUp}
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: 'rgba(232,155,171,0.12)',
              }}
            >
              <span
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#e89bab',
                }}
              >
                {step.num}
              </span>
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '-0.28px',
                  marginBottom: '3px',
                }}
              >
                {step.title}
              </p>
              <p
                style={{
                  fontFamily: 'Pretendard Variable, sans-serif',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.38)',
                  lineHeight: '1.5',
                  letterSpacing: '-0.26px',
                }}
              >
                {step.desc}
              </p>
            </div>
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
        <div className="flex" style={{ marginRight: '4px' }}>
          {CHARACTERS.slice(0, 3).map((char, i) => (
            <div
              key={char.id}
              className="overflow-hidden transform-gpu"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid #1a1038',
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
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '-0.26px',
          }}
        >
          <span style={{ color: '#e89bab', fontWeight: 600 }}>12,847</span>명
          도전 완료
        </p>
      </motion.div>

      {/* ── Disclaimer ── */}
      <p
        style={{
          fontFamily: 'Pretendard Variable, sans-serif',
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
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-10 pointer-events-auto"
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
            className="cursor-pointer transform-gpu"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            style={{
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#7A38D8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 24px rgba(122,56,216,0.4)',
            }}
          >
            <p
              style={{
                fontFamily: 'Pretendard Variable, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '-0.32px',
                lineHeight: '25px',
              }}
            >
              5턴 데이트 도전하기
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
