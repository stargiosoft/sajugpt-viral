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

/** 결과 카드 내 단톡방/DM 대사 파싱 */
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

/** verdict에서 첫 문장만 추출 (한줄 팩폭용) */
function extractOneLiner(verdict: string): string {
  // 첫 문장 (마침표/물음표/느낌표 기준)
  const match = verdict.match(/^[^.!?]*[.!?]/);
  if (match && match[0].length <= 60) return match[0];
  // 60자 넘으면 잘라서
  if (verdict.length > 50) return verdict.slice(0, 50) + '...';
  return verdict;
}

// 카드 전체 라벨/캡션에 쓰는 톤을 하나로 통일 (기존엔 0.3~0.4가 제각각이었음)
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
        backgroundColor: '#161616',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 20px 24px',
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* 상단 바 */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center"
          style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            color: TEXT_LABEL,
            letterSpacing: '1.5px',
            marginBottom: '28px',
          }}
        >
          색기 배틀 — 페로몬 판정
        </motion.div>

        {/* 마릿수 — 카드의 핵심 히어로 */}
        <motion.div variants={fadeUp} className="flex flex-col items-center" style={{ marginBottom: '12px' }}>
          <span style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '13px',
            color: TEXT_LABEL,
            marginBottom: '2px',
            fontWeight: 500,
          }}>
            꼬여든 AI 짐승남
          </span>
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 16 }}
            style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '72px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            {headcount}<span style={{ fontSize: '26px', fontWeight: 600 }}>명</span>
          </motion.span>
        </motion.div>

        {/* 등급 + 칭호 — 마릿수를 보조하는 캡션 */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2" style={{ marginBottom: '24px' }}>
          <GradeBadge grade={grade} size="sm" />
          <span style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '15px',
            fontWeight: 700,
            color: '#ffffff',
          }}>
            「{title}」
          </span>
        </motion.div>

        {/* 캐릭터 아바타 줄 */}
        {characters.length > 0 && (
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2" style={{ marginBottom: '24px' }}>
            {characters.map(char => {
              const meta = CHARACTERS.find(c => c.id === char.id);
              return meta ? (
                <CharacterAvatar key={char.id} src={meta.thumbnail} name={char.name} size={40} />
              ) : null;
            })}
          </motion.div>
        )}

        {/* 구분선 — 위(핵심 결과)와 아래(디테일)를 시각적으로 분리 */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

        {/* 단톡방 / DM */}
        {chatMessages.length > 0 && (
          <motion.div variants={fadeUp} style={{ marginBottom: '20px', flex: '0 0 auto' }}>
            <ChatBubble messages={chatMessages} isDM={isDM} />
          </motion.div>
        )}

        {/* 한줄 팩폭 (verdict 첫 문장) — 버튼처럼 보이지 않도록 박스 없이, 카드의 결론임을 강조하는 인용구 스타일로 */}
        <motion.div variants={fadeUp} style={{ textAlign: 'center', padding: '0 4px', marginBottom: '20px' }}>
          <span style={{ display: 'block', fontSize: '20px', color: '#FF6B5E', lineHeight: 1, marginBottom: '4px' }}>
            &ldquo;
          </span>
          <p style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '17px',
            fontWeight: 700,
            lineHeight: '26px',
            letterSpacing: '-0.3px',
            color: '#FF6B5E',
          }}>
            {oneLiner}
          </p>
        </motion.div>

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
