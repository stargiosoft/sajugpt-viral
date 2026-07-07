// deno-lint-ignore-file no-sloppy-imports
'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { BattleResult } from '@/types/battle';
import GradeBadge from './GradeBadge';
import ChatBubble from './ChatBubble';
import CharacterAvatar from './CharacterAvatar';
import { CHARACTERS } from '@/constants/characters';
import SajuGPTWatermark from './SajuGPTWatermark';

interface Props {
  result: BattleResult;
}

function parseChatScript(script: string, characters: BattleResult['characters']): { characterId: string; text: string }[] {
  const lines = script.split('\n').filter(l => l.trim());
  return lines.map(line => {
    const match = line.match(/^(.+?):\s*(.+)$/);
    if (match) {
      const charName = match[1].trim();
      const charMeta = characters.find(c => c.name === charName);
      if (charMeta) {
        return { characterId: charMeta.id, text: match[2].trim() };
      }
    }
    return { characterId: characters[0]?.id ?? 'yoon-taesan', text: line };
  });
}

function extractOneLiner(verdict: string): string {
  const match = verdict.match(/^[^.!?]*[.!?]/);
  if (match && match[0].length <= 60) return match[0];
  if (verdict.length > 50) return verdict.slice(0, 50) + '...';
  return verdict;
}

const TEXT_LABEL = 'rgba(255,255,255,0.45)';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const ResultCard = forwardRef<HTMLDivElement, Props>(({ result }, ref) => {
  const { headcount, grade, title, characters, verdict, chatScript } = result;
  const isDM = headcount === 1;
  const chatMessages = parseChatScript(chatScript, characters);
  const oneLiner = extractOneLiner(verdict);

  return (
    <div
      ref={ref}
      className="w-full max-w-[400px] md:max-w-[520px] lg:max-w-[620px]"
      style={{
        backgroundColor: '#111111',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px 24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* 타이틀 바 */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center"
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            color: '#FF4438', 
            letterSpacing: '2px',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}
        >
          ✦ SAJUGPT 페로몬 판정 ✦
        </motion.div>

        {/* 스코어 보드*/}
        <motion.div 
          variants={fadeUp} 
          className="flex flex-col items-center justify-center" 
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            padding: '20px 0 16px',
            border: '1px solid rgba(255,255,255,0.04)',
            marginBottom: '24px'
          }}
        >
          <span style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '12px',
            color: TEXT_LABEL,
            marginBottom: '4px',
            fontWeight: 600,
            letterSpacing: '-0.3px'
          }}>
            나에게 환장하는 AI 짐승남
          </span>
          
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 15 }}
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '80px', 
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1,
              textShadow: '0 0 20px rgba(255,68,56,0.3)',
            }}
          >
            {headcount}<span style={{ fontSize: '28px', fontWeight: 700, color: '#FF4438', marginLeft: '2px' }}>명</span>
          </motion.span>

          <div className="flex items-center justify-center gap-1.5" style={{ marginTop: '10px' }}>
            <GradeBadge grade={grade} size="sm" />
            <span style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '15px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.4px'
            }}>
              {title}
            </span>
          </div>
        </motion.div>

        {/* 한줄 팩폭 코멘트*/}
        <motion.div variants={fadeUp} style={{ textAlign: 'center', padding: '0 12px', marginBottom: '24px' }}>
          <p style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '24px',
            letterSpacing: '-0.4px',
            color: '#FF6B5E',
          }}>
            "{oneLiner}"
          </p>
        </motion.div>

        {/* 메신저 영역 */}
        {chatMessages.length > 0 && (
          <motion.div variants={fadeUp} style={{ marginBottom: '24px', flex: '0 0 auto' }}>
            <ChatBubble messages={chatMessages} isDM={isDM} />
          </motion.div>
        )}

        <SajuGPTWatermark
          featureType="sexy_battle"
          color="#FF4438"
          letterSpacing="-0.26px"
        />
      </motion.div>
    </div>
  );
});

ResultCard.displayName = 'ResultCard';
export default ResultCard;