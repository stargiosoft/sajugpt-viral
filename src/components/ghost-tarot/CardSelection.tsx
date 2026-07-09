'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { GhostCardData } from '@/types/ghost-tarot';
import GhostCard from './GhostCard';

interface Props {
  cards: GhostCardData[];
  onSelect: (cardId: string) => void;
}

export default function CardSelection({
  cards,
  onSelect,
}: Props) {
  // 카드 배열을 랜덤하게 셔플
  const shuffledCards = useMemo(() => {
    if (!Array.isArray(cards)) return [];
    return cards.length > 0 ? [...cards].sort(() => Math.random() - 0.5) : [];
  }, [cards]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100dvh',
        padding: '40px 24px',
        background: 'radial-gradient(circle at center, #241034 0%, #08070b 100%)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: 32,
            fontWeight: 900,
            textShadow: '0 0 10px #8b5cf6',
          }}
        >
          귀신 타로
        </h1>
        <p
          style={{
            color: '#c4b5fd',
            marginTop: 10,
            fontSize: 15,
          }}
        >
          마음이 끌리는 봉인된 카드 한 장을 선택하세요
        </p>
      </div>

      <motion.div
        className="grid grid-cols-5 gap-3"
        style={{
          marginTop: 40,
          maxWidth: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
          justifyItems: 'center',
        }}
      >
        {shuffledCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileTap={{ scale: 0.92 }}
            style={{ display: 'inline-block' }}
          >
            <GhostCard
              card={card}
              onClick={() => onSelect(card.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}