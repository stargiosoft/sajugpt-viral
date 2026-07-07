import CharacterAvatar from './CharacterAvatar';
import { CHARACTERS } from '@/constants/characters';

interface ChatMessage {
  characterId: string;
  text: string;
}

interface Props {
  messages: ChatMessage[];
  isDM?: boolean;
}

export default function ChatBubble({ messages, isDM = false }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontWeight: 600, letterSpacing: '1px' }}>
        {isDM ? '그가 당신만 본 순간' : '그들이 당신을 본 순간'}
      </div>

      {messages.map((msg, i) => {
        const char = CHARACTERS.find(c => c.id === msg.characterId);
        if (!char) return null;

        return (
          <div key={i} className="flex items-start gap-2">
            <CharacterAvatar src={char.thumbnail} name={char.name} size={32} />
            {/* flex:1 + minWidth:0 — 이 래퍼가 행의 남은 폭만큼 정확한(definite) 너비를 갖게 해서, 아래 버블의 % 기반 max-width가 제대로 계산되게 함 */}
            <div className="flex flex-col" style={{ gap: '4px', flex: '1 1 0%', minWidth: 0 }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                {char.name}
              </span>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 400,
                  lineHeight: '1.5',
                  width: 'fit-content',
                  maxWidth: 'min(100%, 420px)',
                  wordBreak: 'keep-all',
                }}
              >
                {msg.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
