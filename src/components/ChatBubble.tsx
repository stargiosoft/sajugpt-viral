// deno-lint-ignore-file no-sloppy-imports
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
    <div 
      className="flex flex-col gap-3.5" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: '16px', 
        padding: '16px 14px' 
      }}
    >
      {/* 상단 메신저 헤더 라벨 */}
      <div className="flex items-center justify-center gap-1.5" style={{ marginBottom: '4px' }}>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: isDM ? '#E1306C' : '#FEE500' }} />
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontWeight: 700, letterSpacing: '0.5px' }}>
          {isDM ? '실시간 인스타 DM' : '단톡방 아수라장'}
        </div>
      </div>

      {messages.map((msg, i) => {
        const char = CHARACTERS.find(c => c.id === msg.characterId);
        if (!char) return null;

        return (
          <div key={i} className="flex items-start gap-2.5">
            <CharacterAvatar src={char.thumbnail} name={char.name} size={34} />
            <div className="flex flex-col" style={{ gap: '3px' }}>
              {/* 캐릭터 이름 */}
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, paddingLeft: '2px' }}>
                {char.name}
              </span>
              
              <div
                style={{
                  backgroundColor: isDM ? 'rgba(255,255,255,0.08)' : 'rgba(254,229,0,0.12)', 
                  border: isDM ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(254,229,0,0.15)',
                  borderRadius: '0px 14px 14px 14px', 
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: isDM ? '#ffffff' : '#FFEFA0', 
                  fontWeight: 500,
                  lineHeight: '1.45',
                  maxWidth: '250px',
                  wordBreak: 'break-all',
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