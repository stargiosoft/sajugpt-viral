'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { TarotCardData, TarotConfig } from '@/types/tarot';
import TarotCard from './TarotCard';
import GhostSealButton from '@/components/ghost-tarot/GhostSealButton';
import { DESKTOP_BREAKPOINT } from '@/lib/ghost-tarot/useBreakpoint';

interface Props {
  config: TarotConfig;
  cards: TarotCardData[];
  loading?: boolean;
  onSelect: (cardId: string) => void;
}

const BASE_CONTAINER_WIDTH = 340;
const BASE_CARD_WIDTH = 46;
const BASE_CARD_HEIGHT = 69;
const BASE_MAX_ARC_HEIGHT = 60;
const BASE_GAP = 26;
const ANGLE_RANGE = 84;

type CardPos = { left: number; top: number; rotate: number };
type ShufflePhase = 'mixing' | 'gathered' | 'spreading' | 'idle';

function getContainerWidth(windowWidth: number) {
  const frameMax = windowWidth >= DESKTOP_BREAKPOINT ? 600 : 440;
  const frame = Math.min(windowWidth, frameMax);
  return Math.max(260, frame - 32);
}

export default function TarotCardSelection({
  config,
  cards,
  loading,
  onSelect,
}: Props) {
  const { palette } = config.theme;
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
        background: `${palette.bg} url(${config.assets.bgTexture}) center / 100% 100% no-repeat`,
        position: 'relative',
      }}
    >
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
          color: palette.inkDim,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {config.copy.selectionPrompt}
      </p>

      {loading && count === 0 ? (
        <p
          className="animate-pulse"
          style={{
            marginTop: 60,
            textAlign: 'center',
            color: palette.inkDim,
            fontSize: 14,
          }}
        >
          카드를 불러오는 중...
        </p>
      ) : (
        <>
          <div style={{ position: 'relative', width: containerWidth, height: containerHeight, margin: '62px auto 0' }}>
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
                border: `1.5px dashed ${palette.gold}`,
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
                  <TarotCard
                    card={card}
                    backImage={config.assets.backImage}
                    backAlt={config.copy.cardBackAlt}
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
