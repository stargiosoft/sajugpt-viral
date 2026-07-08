'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Lottie from 'lottie-react';
import squareShapeLoading from '@/lottie/square-shape-loading-11.json';
import { recolorLottie } from '@/lib/lottieRecolor';

const DEFAULT_LOTTIE_LAYER_OPACITIES = [0.4, 0.7, 1];
const HOLD_AFTER_STACKED_MS = 1200;

interface Props {
  messages: string[];
  emoji?: ReactNode;
  ringColor?: string;
  ringBorderWidth?: string;
  emojiFontSize?: string;
  /** 지정하면 펄싱 링+이모지 대신 이 색으로 재색칠한 Lottie 로딩 애니메이션을 사용 */
  lottieColor?: string;
  lottieSize?: string;
  /** 레이어별 투명도(0~1, data.layers 순서 대응) — 톤온톤 그라데이션용. 기본값은 위(0.4)에서 아래(1)로 진해짐 */
  lottieLayerOpacities?: number[];
  messageColor?: string;
  messageFontSize?: string;
  messageLetterSpacing?: string;
  minHeight?: string;
  heading?: string;
  headingColor?: string;
  staggerDelay?: number;
  wrapWithMotion?: boolean;
  /** 분석 시간이 길어서 메시지가 다 쌓인 뒤에도 대기해야 할 때 — 잠시 멈췄다 처음부터 다시 쌓는다 */
  repeat?: boolean;
}

// "분석 중" 대기 화면 — 펄싱 링(또는 Lottie) + 순차 등장 메시지. gisaeng은 메시지가 하나씩 누적되며
// 이전 메시지가 흐려지는 별도 연출이라 이 컴포넌트로 통합하지 않았다.
export default function AnalyzingScreen({
  messages,
  emoji = '🔥',
  ringColor = '#FF7A1A',
  ringBorderWidth = '3px',
  emojiFontSize = '40px',
  lottieColor,
  lottieSize = '160px',
  lottieLayerOpacities = DEFAULT_LOTTIE_LAYER_OPACITIES,
  messageColor = '#666',
  messageFontSize = '15px',
  messageLetterSpacing,
  minHeight = '60vh',
  heading,
  headingColor,
  staggerDelay = 0.6,
  wrapWithMotion = false,
  repeat = false,
}: Props) {
  const lottieData = useMemo(
    () => (lottieColor ? recolorLottie(squareShapeLoading, lottieColor, lottieLayerOpacities) : null),
    [lottieColor, lottieLayerOpacities]
  );

  const [round, setRound] = useState(0);
  const roundDurationMs = (messages.length - 1) * staggerDelay * 1000 + 400 + HOLD_AFTER_STACKED_MS;

  useEffect(() => {
    if (!repeat) return;
    const timer = setTimeout(() => setRound(prev => prev + 1), roundDurationMs);
    return () => clearTimeout(timer);
  }, [repeat, round, roundDurationMs]);

  const content = (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{ minHeight, padding: '0 12px' }}
    >
      {lottieData ? (
        <div style={{ width: lottieSize, height: lottieSize, marginBottom: '24px' }}>
          <Lottie animationData={lottieData} loop autoplay />
        </div>
      ) : (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: `${ringBorderWidth} solid ${ringColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            fontSize: emojiFontSize,
          }}
        >
          {emoji}
        </motion.div>
      )}

      {heading && (
        <p style={{ fontSize: '18px', fontWeight: 700, color: headingColor, marginBottom: '24px' }}>
          {heading}
        </p>
      )}

      {messages.map((msg, i) => (
        <motion.p
          key={`${round}-${i}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * staggerDelay, duration: 0.4 }}
          style={{
            fontSize: messageFontSize,
            fontWeight: 500,
            color: messageColor,
            marginBottom: '8px',
            textAlign: 'center',
            letterSpacing: messageLetterSpacing,
          }}
        >
          {msg}
        </motion.p>
      ))}
    </div>
  );

  if (!wrapWithMotion) return content;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {content}
    </motion.div>
  );
}
