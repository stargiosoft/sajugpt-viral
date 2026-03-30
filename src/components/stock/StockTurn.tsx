'use client';

import { motion } from 'framer-motion';
import type { TurnData, UserChoice } from '@/types/stock';
import { CREW_MEMBERS } from '@/constants/stock';

interface Props {
  turnData: TurnData;
  onChoice: (choice: UserChoice) => void;
}

export default function StockTurn({ turnData, onChoice }: Props) {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0a0a14',
        padding: '0 20px',
        paddingBottom: '120px',
      }}
    >
      {/* Turn title */}
      <div style={{ paddingTop: '48px', marginBottom: '24px' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#888',
            letterSpacing: '-0.3px',
          }}
        >
          {turnData.title}
        </motion.p>
      </div>

      {/* Dialog bubbles */}
      <div className="flex flex-col gap-3">
        {turnData.dialogs.map((dialog, i) => {
          const crew = CREW_MEMBERS[dialog.characterId];
          return (
            <motion.div
              key={`${dialog.characterId}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.4, duration: 0.45 }}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: '#1a1a2e',
              }}
            >
              {/* Character name + position */}
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: '8px' }}
              >
                <div className="overflow-hidden transform-gpu shrink-0" style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: `1.5px solid ${crew.color}`,
                }}>
                  <img src={crew.image} alt={crew.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: crew.color,
                  }}
                >
                  {dialog.characterName}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#666',
                  }}
                >
                  {dialog.position}
                </span>
              </div>

              {/* Dialog text */}
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#eee',
                  lineHeight: '24px',
                  letterSpacing: '-0.3px',
                }}
              >
                {dialog.lines}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Question */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: turnData.dialogs.length * 0.4 + 0.2, duration: 0.4 }}
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#ccc',
          lineHeight: '22px',
          letterSpacing: '-0.3px',
          marginTop: '24px',
          marginBottom: '16px',
        }}
      >
        {turnData.question}
      </motion.p>

      {/* Choice buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: turnData.dialogs.length * 0.4 + 0.5, duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        {turnData.choices.map((choice) => {
          const crew = CREW_MEMBERS[choice.characterId];
          return (
            <motion.button
              key={choice.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoice(choice.id)}
              className="w-full flex items-center gap-3"
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid #2a2a3e',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#7A38D8';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a3e';
              }}
            >
              <div className="overflow-hidden transform-gpu shrink-0" style={{
                width: '28px', height: '28px', borderRadius: '50%',
                border: `1.5px solid ${crew.color}`,
              }}>
                <img src={crew.image} alt={crew.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#ddd',
                  lineHeight: '20px',
                  letterSpacing: '-0.3px',
                }}
              >
                {choice.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
