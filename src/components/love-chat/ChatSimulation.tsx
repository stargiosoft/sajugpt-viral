'use client';

import type { LoveChatCharacter } from '@/types/love-chat';

function demoTime(index: number) {
  const totalMinutes = index; // 메시지마다 1분씩 자연스럽게 증가
  const hour = 2 + Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `오후 ${hour}:${String(minute).padStart(2, '0')}`;
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="rgb(75, 80, 93)" style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: '2px' }}>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.01l-2.2 2.21z" />
    </svg>
  );
}

function renderSystemNote(note: string) {
  return note.startsWith('📞') ? <>{<PhoneIcon />}{note.slice(2).trimStart()}</> : note;
}

export default function ChatSimulation({ character }: { character: LoveChatCharacter }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: '4px 16px 16px 16px', padding: '18px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center" style={{ gap: '8px', marginBottom: '14px' }}>
        <span
          className="flex items-center justify-center"
          style={{ width: '32px', height: '32px', flexShrink: 0 }}
        >
          <img src="/love-chat/icons/section-chat.svg" alt="" width={20} height={20} />
        </span>
        <p style={{ fontSize: '22px', fontWeight: 500, color: '#1C2333', fontFamily: "'Ongeulip Minmi', sans-serif" }}>
          우리 카톡은 이런 느낌
        </p>
      </div>

      <div style={{ background: 'rgb(230, 237, 255)', borderRadius: '14px', paddingTop: '17px', paddingBottom: '14px', paddingLeft: '17px', paddingRight: '17px', marginBottom: '12px', marginTop: '12px' }}>
        <div className="flex flex-col" style={{ gap: '0px' }}>
          {character.sampleChat.map((line, i) => {
            const isMe = line.from === 'me';
            const time = demoTime(i);
            return (
              <div key={i} className="flex flex-col" style={{ alignItems: isMe ? 'flex-end' : 'flex-start', gap: '2px', marginTop: i > 0 ? '8px' : undefined }}>
                <div
                  style={{
                    maxWidth: '92%',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    padding: '9px 13px',
                    borderRadius: isMe ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                    background: isMe ? '#FEE500' : '#FFFFFF',
                    color: '#333333',
                  }}
                >
                  {line.text}
                  {isMe && line.text.endsWith('...') && (
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'rgba(51, 51, 51, 0.55)', marginTop: '2px' }}>
                      더보기
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '11px', color: 'rgb(107, 111, 117)', letterSpacing: '2px', whiteSpace: 'nowrap', paddingLeft: isMe ? undefined : '2px', paddingRight: isMe ? '2px' : undefined }}>{time}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center" style={{ paddingTop: '8px', paddingBottom: '2px' }}>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgb(75, 80, 93)',
            background: 'rgb(230, 237, 255)',
            borderRadius: '999px',
            paddingTop: '6px',
            paddingBottom: '4px',
            paddingLeft: '12px',
            paddingRight: '12px',
            textAlign: 'center',
          }}
        >
          {renderSystemNote(character.chatSystemNote)}
        </span>
      </div>
    </div>
  );
}
