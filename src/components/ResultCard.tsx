'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { BattleResult } from '@/types/battle';
import { getGradeLabel } from '@/constants/grades';
import ChatBubble from './ChatBubble';
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
  // 첫 문장 (마침표/물음표/느낌표 기준) — 길어도 자르지 않고 그대로 반환, 화면에서 2줄까지 자연스럽게 줄바꿈
  const match = verdict.match(/^[^.!?]*[.!?]/);
  return match ? match[0] : verdict;
}

// 카드 전체 라벨/캡션에 쓰는 톤을 하나로 통일 (기존엔 0.3~0.4가 제각각이었음)
const TEXT_LABEL = 'rgba(255,255,255,0.45)';

// 히어로 영역(마릿수/등급 필)에 쓰는 브랜드 레드 — 등급별 색과 무관하게 고정
const HERO_ACCENT = '#FF4438';

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
            fontSize: '26px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '1.5px',
            marginBottom: '8px',
          }}
        >
          페로몬 판정
        </motion.div>

        {/* 마릿수 — 카드의 핵심 히어로 */}
        <motion.div variants={fadeUp} className="flex flex-col items-center" style={{ marginBottom: '24px' }}>
          <span style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '14px',
            color: TEXT_LABEL,
            marginBottom: '32px',
            fontWeight: 500,
          }}>
            짐승남들이 꼬여든 결과
          </span>
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 16 }}
            className="flex items-baseline justify-center"
            style={{ fontFamily: 'Pretendard Variable, sans-serif', lineHeight: 1, gap: '4px' }}
          >
            <span
              style={{
                fontSize: 'clamp(56px, 18vw, 82px)',
                fontWeight: 900,
                backgroundImage: `linear-gradient(180deg, #FFD5CF 0%, #FF7A6B 45%, ${HERO_ACCENT} 100%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {headcount}
            </span>
            <span style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff' }}>명</span>
          </motion.span>
        </motion.div>

        {/* 등급 + 칭호 — 투명 배경 + 얇은 보더의 가로형 필, 세로 구분선으로 좌우 분리 */}
        <motion.div variants={fadeUp} className="flex items-center justify-center" style={{ marginBottom: '40px' }}>
          <div
            className="flex items-center"
            style={{
              padding: '10px 22px',
              borderRadius: '100px',
              backgroundImage: 'linear-gradient(135deg, #3a0c09 0%, #8a231a 30%, #ff6a52 50%, #8a231a 70%, #3a0c09 100%)',
              border: '1px solid rgba(255,180,160,0.4)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.35)',
            }}
          >
            <span style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: '#fff1ee',
              whiteSpace: 'nowrap',
            }}>
              {getGradeLabel(grade)}
            </span>
            <span style={{ width: '1px', height: '12px', backgroundColor: 'rgba(255,255,255,0.35)', margin: '0 14px' }} />
            <span style={{
              fontFamily: 'Pretendard Variable, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: '#ffffff',
              whiteSpace: 'nowrap',
            }}>
              {title}
            </span>
          </div>
        </motion.div>

        {/* 구분선 — 위(핵심 결과)와 아래(디테일)를 시각적으로 분리 */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '40px' }} />

        {/* 단톡방 / DM — 채팅 메시지가 없으면(0명/CUT) 이 블록과 아래 구분선을 함께 생략해 구분선이 연달아 겹치지 않게 함 */}
        {chatMessages.length > 0 && (
          <>
            <motion.div variants={fadeUp} style={{ marginBottom: '40px', flex: '0 0 auto' }}>
              <ChatBubble messages={chatMessages} isDM={isDM} />
            </motion.div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '38px' }} />
          </>
        )}

        {/* 한줄 팩폭 (verdict 첫 문장) — 채팅 버블과 톤을 맞춘 은은한 레드 틴트 박스로 카드의 결론임을 강조 */}
        <motion.div variants={fadeUp} style={{ marginBottom: '20px' }}>
          <p style={{
            fontFamily: 'Pretendard Variable, sans-serif',
            fontSize: '17px',
            fontWeight: 500,
            lineHeight: '32px',
            letterSpacing: '-0.3px',
            color: '#FF6B5E',
            textAlign: 'center',
            textWrap: 'balance',
            wordBreak: 'keep-all',
            backgroundColor: 'rgba(255,68,56,0.08)',
            borderRadius: '14px',
            padding: '16px 18px',
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
