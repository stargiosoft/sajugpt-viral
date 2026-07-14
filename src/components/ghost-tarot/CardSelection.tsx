'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { GhostCardData } from '@/types/ghost-tarot';
import GhostCard from './GhostCard';
import GhostSealButton from './GhostSealButton';
import { GHOST_PALETTE } from '@/lib/ghost-tarot/theme';
import { DESKTOP_BREAKPOINT } from '@/lib/ghost-tarot/useBreakpoint';

interface Props {
  cards: GhostCardData[];
  loading?: boolean;
  onSelect: (cardId: string) => void;
}

// 나다운세 TarotGame.tsx의 부채꼴/셔플 로직을 참고해 이식 + 반응형 스케일링
const BASE_CONTAINER_WIDTH = 340;
const BASE_CARD_WIDTH = 46;
const BASE_CARD_HEIGHT = 69;
const BASE_MAX_ARC_HEIGHT = 60;
const BASE_GAP = 26;
const ANGLE_RANGE = 84;

type CardPos = { left: number; top: number; rotate: number };
type ShufflePhase = 'mixing' | 'gathered' | 'spreading' | 'idle';

// 실제 앱 프레임 너비(GhostTarotClient의 max-w-[440px] md:max-w-[600px]와 동일 breakpoint)
// 기준 좌우 16px 인셋에 딱 맞는 너비 — 카드가 그 안에 꽉 차게 펼쳐짐, 화면 밖으로 안 넘침
function getContainerWidth(windowWidth: number) {
  const frameMax = windowWidth >= DESKTOP_BREAKPOINT ? 600 : 440;
  const frame = Math.min(windowWidth, frameMax);
  return Math.max(260, frame - 32);
}

export default function CardSelection({
  cards,
  loading,
  onSelect,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(() => getContainerWidth(typeof window !== 'undefined' ? window.innerWidth : 400));
  const [phase, setPhase] = useState<ShufflePhase>('mixing');
  const [mixingPositions, setMixingPositions] = useState<CardPos[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setContainerWidth(getContainerWidth(window.innerWidth));
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scale = containerWidth / BASE_CONTAINER_WIDTH;
  const cardWidth = BASE_CARD_WIDTH * scale;
  const cardHeight = BASE_CARD_HEIGHT * scale;
  const maxArcHeight = BASE_MAX_ARC_HEIGHT * scale;
  const gap = BASE_GAP * scale;
  const fanAreaHeight = maxArcHeight + cardHeight;
  const containerHeight = fanAreaHeight + gap + cardHeight;

  // 카드가 회전하면 실제 차지하는 폭/높이가 원래보다 커짐 — 대각선 기준 여유 마진을 둬서
  // 부채꼴(idle)이든 셔플 중(mixing, 임의 회전)이든 프레임 밖으로 넘치지 않게 함
  const diagonal = Math.sqrt(cardWidth * cardWidth + cardHeight * cardHeight);
  const marginX = Math.max(0, (diagonal - cardWidth) / 2);
  const marginY = Math.max(0, (diagonal - cardHeight) / 2);

  const shuffledCards = useMemo(() => {
    if (!Array.isArray(cards)) return [];
    return cards.length > 0 ? [...cards].sort(() => Math.random() - 0.5) : [];
  }, [cards]);
  const count = shuffledCards.length;

  const fanPositions = useMemo<CardPos[]>(() => {
    const centerIndex = (count - 1) / 2;
    const usableWidth = Math.max(0, containerWidth - cardWidth - 2 * marginX);
    const spacing = count > 1 ? usableWidth / (count - 1) : 0;
    return Array.from({ length: count }, (_, i) => {
      const left = marginX + i * spacing;
      const distanceFromCenter = Math.abs(i - centerIndex);
      const normalized = centerIndex > 0 ? distanceFromCenter / centerIndex : 0;
      const top = maxArcHeight * Math.pow(normalized, 2);
      const rotate = count > 1 ? -ANGLE_RANGE / 2 + (i / (count - 1)) * ANGLE_RANGE : 0;
      return { left, top, rotate };
    });
  }, [count, containerWidth, cardWidth, maxArcHeight, marginX]);

  // 카드를 모을 때 사선(-45deg)이 아니라 수직으로 똑바르게
  const gatheredPosition: CardPos = useMemo(() => ({
    left: (containerWidth - cardWidth) / 2,
    top: (fanAreaHeight - cardHeight) / 2,
    rotate: 0,
  }), [containerWidth, cardWidth, fanAreaHeight, cardHeight]);

  const slotPosition: CardPos = useMemo(() => ({
    left: (containerWidth - cardWidth) / 2,
    top: fanAreaHeight + gap - 16,
    rotate: 0,
  }), [containerWidth, cardWidth, fanAreaHeight, gap]);

  const runShuffle = () => {
    if (count === 0) return () => {};
    setSelectedIndex(null);
    let cancelled = false;

    (async () => {
      for (let round = 0; round < 5; round++) {
        if (cancelled) return;
        setMixingPositions(
          Array.from({ length: count }, () => ({
            left: marginX + Math.random() * Math.max(0, containerWidth - cardWidth - 2 * marginX),
            top: marginY + Math.random() * Math.max(0, fanAreaHeight - cardHeight - 2 * marginY),
            rotate: Math.random() * 360,
          }))
        );
        setPhase('mixing');
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      if (cancelled) return;
      setPhase('gathered');
      await new Promise(resolve => setTimeout(resolve, 700));
      if (cancelled) return;
      setPhase('spreading');
      await new Promise(resolve => setTimeout(resolve, 750));
      if (cancelled) return;
      setPhase('idle');
    })();

    return () => { cancelled = true; };
  };

  useEffect(() => {
    if (count === 0) return;
    return runShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const buttonLabel = phase !== 'idle'
    ? '섞는 중...'
    : selectedIndex !== null
      ? '선택 완료'
      : '카드 섞기';

  const handleButtonClick = () => {
    if (phase !== 'idle') return;
    if (selectedIndex !== null) {
      onSelect(shuffledCards[selectedIndex].id);
      return;
    }
    runShuffle();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100dvh',
        padding: '40px 16px 60px',
        background: `${GHOST_PALETTE.bg} url(/ghost-tarot/bg-texture.png) center / 100% 100% no-repeat`,
        position: 'relative',
      }}
    >
      {/* 좌측 상단이 배경 텍스처 특성상 허옇게 뜨는 걸 완화하는 검정 비네트 */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: 'radial-gradient(ellipse 65% 55% at 0% 0%, rgba(0,0,0,.6), transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <p
        style={{
          marginTop: 20,
          textAlign: 'center',
          color: GHOST_PALETTE.inkDim,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        봉인된 카드 한 장을 선택하세요
      </p>

      {loading && count === 0 ? (
        <p
          className="animate-pulse"
          style={{
            marginTop: 60,
            textAlign: 'center',
            color: GHOST_PALETTE.inkDim,
            fontSize: 14,
          }}
        >
          카드를 불러오는 중...
        </p>
      ) : (
        <>
          <div style={{ position: 'relative', width: containerWidth, height: containerHeight, margin: '62px auto 0' }}>
            {/* 뽑은 카드가 놓일 점선 슬롯 — 카드 크기에 비례해서 살짝만 작게 (카드가 얹혔을 때 점선이 안 보이는 선에서)
                셔플이 끝나고 부채꼴로 다 펼쳐진 뒤(phase === 'idle')에만 자연스럽게 페이드인 */}
            <motion.div
              initial={false}
              animate={{ opacity: phase === 'idle' ? 0.55 : 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: slotPosition.left + cardWidth * 0.04,
                top: slotPosition.top + cardHeight * 0.04,
                width: cardWidth * 0.92,
                height: cardHeight * 0.92,
                borderRadius: 6 * scale,
                border: `1.5px dashed ${GHOST_PALETTE.gold}`,
              }}
            />

            {shuffledCards.map((card, i) => {
              const isSelected = selectedIndex === i;
              const pos = isSelected
                ? slotPosition
                : phase === 'mixing'
                  ? (mixingPositions[i] ?? fanPositions[i])
                  : phase === 'gathered'
                    ? gatheredPosition
                    : fanPositions[i];
              const canClick = phase === 'idle' && (selectedIndex === null || isSelected);

              return (
                <motion.div
                  key={card.id}
                  style={{
                    position: 'absolute',
                    width: cardWidth,
                    height: cardHeight,
                    zIndex: isSelected ? 100 : (phase === 'idle' || phase === 'spreading' ? i : count - i),
                  }}
                  animate={{ left: pos.left, top: pos.top, rotate: pos.rotate }}
                  transition={
                    isSelected || selectedIndex !== null
                      ? { type: 'spring', stiffness: 260, damping: 24 }
                      : phase === 'idle'
                        ? { type: 'spring', stiffness: 320, damping: 28 }
                        : {
                            duration: phase === 'spreading' ? 0.7 : phase === 'gathered' ? 0.6 : 0.28,
                            ease: 'easeInOut',
                            delay: phase === 'spreading' ? i * 0.03 : 0,
                          }
                  }
                  whileHover={canClick && !isSelected ? { top: pos.top - 14 * scale } : undefined}
                  whileTap={canClick ? { scale: 0.97 } : undefined}
                >
                  <GhostCard
                    card={card}
                    glow={isSelected}
                    onClick={() => {
                      if (!canClick) return;
                      setSelectedIndex(isSelected ? null : i);
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          <div style={{ marginTop: 52 }}>
            <GhostSealButton
              variant="primary"
              onClick={handleButtonClick}
              disabled={phase !== 'idle'}
              fontSize={21}
              webFontSize={23}
              narrowFontSize={20}
            >
              {buttonLabel}
            </GhostSealButton>
          </div>
        </>
      )}
    </motion.div>
  );
}
