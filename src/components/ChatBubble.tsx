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
    <div className="flex flex-col gap-3">
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontWeight: 600, letterSpacing: '1px' }}>
        {isDM ? 'DM' : '단톡방'}
      </div>

      {messages.map((msg, i) => {
        const char = CHARACTERS.find(c => c.id === msg.characterId);
        if (!char) return null;

        return (
          <div key={i} className="flex items-start gap-2">
            <CharacterAvatar src={char.thumbnail} name={char.name} size={32} />
            <div className="flex flex-col" style={{ gap: '4px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                {char.name}
              </span>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 400,
                  lineHeight: '1.5',
                  maxWidth: '240px',
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
