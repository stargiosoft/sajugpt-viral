'use client';

import { motion } from 'framer-motion';
import type { TurnChoice, TurnData, UserChoice } from '@/types/stock';
import { CREW_MEMBERS } from '@/constants/stock';

interface Props {
  turnData: TurnData;
  onChoice: (choice: UserChoice) => void;
}

const COLOR_BG = '#191F28';
const COLOR_TEXT_PRIMARY = '#F2F3F5';
const COLOR_TEXT_SECONDARY = '#8B95A1';

function ArrowIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ display: 'inline-block', flexShrink: 0, transform: 'rotate(180deg)' }}>
      <path
        fill={color}
        d="m 15.970695,3.001955 a 1.0000999,1.0000999 0 0 0 -0.6875,0.30274 l -7.9902299,7.98828 a 1.0000999,1.0000999 0 0 0 0,1.41406 l 7.9902299,7.98828 a 1.0000999,1.0000999 0 1 0 1.41407,-1.41406 l -7.2832099,-7.28125 7.2832099,-7.28125 a 1.0000999,1.0000999 0 0 0 -0.72657,-1.7168 z"
      />
    </svg>
  );
}

// 순수 CSS :hover(Tailwind group)로 처리 — JS state 재렌더링으로 생기던 호버 깜빡임 제거.
// 네이티브 :hover는 리렌더 없이 컴포지터에서 처리되어 깜빡일 여지가 없음.
function ChoiceButton({ choice, onChoice }: { choice: TurnChoice; onChoice: (choice: UserChoice) => void }) {
  const crew = CREW_MEMBERS[choice.characterId];

  return (
    <motion.button
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={() => onChoice(choice.id)}
      className="group w-full flex items-center gap-3 text-left cursor-pointer border-none rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[#7A38D8] transition-colors duration-200"
      style={{ padding: '20px 16px' }}
    >
      <div className="overflow-hidden transform-gpu shrink-0" style={{
        width: '36px', height: '36px', borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.15)',
      }}>
        <img src={crew.image} alt={crew.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div className="flex flex-col items-start" style={{ flex: 1 }}>
        <span
          className="text-[#8B95A1] group-hover:text-white transition-colors duration-200"
          style={{ fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}
        >
          {crew.name}
        </span>
        <span
          className="text-[#F2F3F5] group-hover:text-white transition-colors duration-200"
          style={{ fontSize: '14px', fontWeight: 500, lineHeight: '20px', letterSpacing: '-0.3px' }}
        >
          {choice.label}
        </span>
      </div>
      <span className="inline-flex text-[#4E5968] group-hover:text-white transition-colors duration-200">
        <ArrowIcon color="currentColor" />
      </span>
    </motion.button>
  );
}

export default function StockTurn({ turnData, onChoice }: Props) {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        minHeight: '100dvh',
        backgroundColor: COLOR_BG,
        padding: '0 20px',
        paddingBottom: '120px',
      }}
    >
      {/* Turn title */}
      <div style={{ paddingTop: '48px' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: COLOR_TEXT_SECONDARY,
            letterSpacing: '-0.3px',
            marginBottom: '16px',
          }}
        >
          {turnData.title}
        </motion.p>
      </div>

      {/* Dialog bubbles — 단체 대화방처럼 하나의 카드로 감싼 채팅 버블 */}
      <div
        className="flex flex-col"
        style={{
          gap: '24px',
          padding: '28px 24px',
          borderRadius: '18px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          marginBottom: '52px',
        }}
      >
        {turnData.dialogs.map((dialog, i) => {
          const crew = CREW_MEMBERS[dialog.characterId];
          return (
            <motion.div
              key={`${dialog.characterId}-${i}`}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.4, duration: 0.45 }}
              className="flex items-start gap-3"
            >
              <div className="overflow-hidden transform-gpu shrink-0" style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.15)',
              }}>
                <img src={crew.image} alt={crew.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="flex flex-col items-start" style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: COLOR_TEXT_PRIMARY, marginBottom: '6px' }}>
                  {dialog.characterName}
                  <span style={{ fontSize: '11px', fontWeight: 500, color: COLOR_TEXT_SECONDARY, marginLeft: '6px' }}>
                    {dialog.position}
                  </span>
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: COLOR_TEXT_PRIMARY,
                    lineHeight: '21px',
                    letterSpacing: '-0.3px',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    borderTopLeftRadius: '4px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }}
                >
                  {dialog.lines}
                </p>
              </div>
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
          fontSize: '20px',
          fontWeight: 600,
          color: COLOR_TEXT_PRIMARY,
          lineHeight: '28px',
          letterSpacing: '-0.3px',
          marginBottom: '16px',
        }}
      >
        {turnData.question}
      </motion.p>

      {/* Choice buttons — 선택 가능한 버튼임을 명확히 (호버 시 브랜드 컬러 강조 + 화살표) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: turnData.dialogs.length * 0.4 + 0.5, duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        {turnData.choices.map((choice) => (
          <ChoiceButton key={choice.id} choice={choice} onChoice={onChoice} />
        ))}
      </motion.div>
    </div>
  );
}
