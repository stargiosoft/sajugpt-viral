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
      className="flex flex-col gap-2"
      style={{
        backgroundColor: isDM ? '#2a2a3e' : '#1e1e32',
        borderRadius: '16px',
        padding: '16px',
      }}
    >
      {/* Header */}
      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', textAlign: 'center' }}>
        {isDM ? 'DM' : '단톡방'}
      </div>

      {messages.map((msg, i) => {
        const char = CHARACTERS.find(c => c.id === msg.characterId);
        if (!char) return null;

        return (
          <div key={i} className="flex items-start gap-2">
            <CharacterAvatar src={char.thumbnail} name={char.name} size={32} />
            <div className="flex flex-col">
              <span style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px', fontWeight: 600 }}>
                {char.name}
              </span>
              <div
                style={{
                  backgroundColor: '#3a3a52',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#eee',
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
