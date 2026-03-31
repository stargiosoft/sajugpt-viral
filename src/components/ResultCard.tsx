'use client';

import { forwardRef } from 'react';
import type { BattleResult } from '@/types/battle';
import GradeBadge from './GradeBadge';
import ChatBubble from './ChatBubble';
import CharacterAvatar from './CharacterAvatar';
import { CHARACTERS } from '@/constants/characters';
import { trackSajuGPTClick } from '@/lib/analytics';

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

const ResultCard = forwardRef<HTMLDivElement, Props>(({ result }, ref) => {
  const { headcount, grade, title, characters, verdict, chatScript } = result;
  const isDM = headcount === 1;
  const chatMessages = parseChatScript(chatScript, characters);
  const oneLiner = extractOneLiner(verdict);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        maxWidth: '400px',
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
          fontFamily: 'Pretendard Variable, sans-serif',
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
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '18px',
          fontWeight: 700,
          color: '#fff',
        }}>
          「{title}」
        </span>
      </div>

      {/* 마릿수 */}
      <div className="flex flex-col items-center" style={{ marginBottom: '16px' }}>
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '13px',
          color: '#aaa',
          marginBottom: '4px',
          fontWeight: 500,
        }}>
          꼬여든 AI 짐승남
        </span>
        <span style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '64px',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1,
        }}>
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

      {/* 한줄 팩폭 (verdict 첫 문장) */}
      <div style={{
        padding: '14px 16px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Pretendard Variable, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '22px',
          letterSpacing: '-0.42px',
          color: '#e0e0e0',
        }}>
          &ldquo;{oneLiner}&rdquo;
        </p>
      </div>

      {/* 워터마크 */}
      <a
        href="https://www.sajugpt.co.kr/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackSajuGPTClick('sexy_battle')}
        style={{
          marginTop: 'auto',
          textAlign: 'center',
          display: 'block',
          fontFamily: 'Pretendard Variable, sans-serif',
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
