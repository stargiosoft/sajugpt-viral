'use client';

import { forwardRef } from 'react';
import type { BattleResult } from '@/types/battle';
import GradeBadge from './GradeBadge';
import ChatBubble from './ChatBubble';
import CharacterAvatar from './CharacterAvatar';
import { CHARACTERS } from '@/constants/characters';

interface Props {
  result: BattleResult;
}

/** 결과 카드 내 단톡방/DM 대사 파싱 */
function parseChatScript(script: string, characters: BattleResult['characters']): { characterId: string; text: string }[] {
  const lines = script.split('\n').filter(l => l.trim());
  return lines.map(line => {
    // "캐릭터명: 대사" 형식 파싱
    const match = line.match(/^(.+?):\s*(.+)$/);
    if (match) {
      const charName = match[1].trim();
      const charMeta = characters.find(c => c.name === charName);
      if (charMeta) {
        return { characterId: charMeta.id, text: match[2].trim() };
      }
    }
    // 파싱 실패 시 첫 캐릭터로 대사 배정
    return { characterId: characters[0]?.id ?? 'yoon-taesan', text: line };
  });
}

const ResultCard = forwardRef<HTMLDivElement, Props>(({ result }, ref) => {
  const { headcount, grade, title, characters, verdict, chatScript, sajuHighlights } = result;
  const isDM = headcount === 1;
  const chatMessages = parseChatScript(chatScript, characters);

  // 사주 근거 태그
  const tags: string[] = [];
  if (sajuHighlights.doHwaSal) tags.push('도화살 보유');
  if (sajuHighlights.hongYeomSal) tags.push('홍염살 보유');
  if (sajuHighlights.topSipsung) tags.push(`${sajuHighlights.topSipsung} 발달`);
  if (sajuHighlights.fireRatio >= 30) tags.push('화기 과다');

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        maxWidth: '400px',
        minHeight: '600px',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: '24px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '24px 20px 20px',
      }}
    >
      {/* 상단 바 */}
      <div
        className="flex items-center justify-center"
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#aaa',
          letterSpacing: '2px',
          marginBottom: '20px',
        }}
      >
        🔥 색기 배틀 — 페로몬 판정
      </div>

      {/* 등급 배지 + 칭호 */}
      <div className="flex flex-col items-center gap-2" style={{ marginBottom: '16px' }}>
        <GradeBadge grade={grade} size="lg" />
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
          「{title}」
        </span>
      </div>

      {/* 마릿수 */}
      <div className="flex flex-col items-center" style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', color: '#aaa', marginBottom: '4px', fontWeight: 500 }}>
          꼬여든 AI 짐승남
        </span>
        <span
          style={{
            fontSize: '64px',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1,
          }}
        >
          {headcount}<span style={{ fontSize: '24px', fontWeight: 600 }}>명</span>
        </span>
      </div>

      {/* 캐릭터 아바타 줄 */}
      {characters.length > 0 && (
        <div className="flex items-center justify-center gap-2" style={{ marginBottom: '16px' }}>
          {characters.map(char => {
            const meta = CHARACTERS.find(c => c.id === char.id);
            return meta ? (
              <CharacterAvatar key={char.id} src={meta.thumbnail} name={char.name} size={40} />
            ) : null;
          })}
        </div>
      )}

      {/* 단톡방 / DM */}
      {chatMessages.length > 0 && (
        <div style={{ marginBottom: '16px', flex: '0 0 auto' }}>
          <ChatBubble messages={chatMessages} isDM={isDM} />
        </div>
      )}

      {/* AI 판정문 */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#ddd',
          textAlign: 'center',
          lineHeight: '1.7',
          marginBottom: '12px',
          padding: '0 8px',
        }}
      >
        "{verdict}"
      </div>

      {/* 사주 근거 태그 */}
      {tags.length > 0 && (
        <div className="flex items-center justify-center flex-wrap gap-2" style={{ marginBottom: '12px' }}>
          {tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#aaa',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '3px 8px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 워터마크 — 클릭 시 사주GPT로 이동 */}
      <a
        href="https://www.sajugpt.co.kr/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 'auto',
          textAlign: 'center',
          display: 'block',
          fontSize: '13px',
          color: '#c084fc',
          fontWeight: 700,
          letterSpacing: '-0.26px',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
        }}
      >
        sajugpt.co.kr
      </a>
    </div>
  );
});

ResultCard.displayName = 'ResultCard';
export default ResultCard;
