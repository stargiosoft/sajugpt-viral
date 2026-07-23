'use client';

import Image from 'next/image';
import type { LoveChatCharacter } from '@/types/love-chat';

interface Props {
  character: LoveChatCharacter;
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF4D6D" style={{ display: 'inline-block', verticalAlign: '-3px' }}>
      <path d="M12 21s-6.7-4.35-9.5-8.28C.8 10.28 1.2 6.6 4.1 4.9c2.2-1.3 4.9-.7 6.4 1.2l1.5 1.9 1.5-1.9c1.5-1.9 4.2-2.5 6.4-1.2 2.9 1.7 3.3 5.38 1.6 7.82C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

function renderQuote(quote: string) {
  return quote.split('❤️').flatMap((part, i, arr) =>
    i < arr.length - 1 ? [part, <HeartIcon key={i} />] : [part]
  );
}

function OutlineStar({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgb(199, 217, 245)"
      strokeWidth="1.5"
      strokeLinejoin="round"
      style={{ position: 'absolute', ...style }}
    >
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}

export default function CharacterProfile({ character }: Props) {
  return (
    <div className="flex flex-col items-center" style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: '17px',
            fontWeight: 500,
            color: 'rgb(28, 35, 51)',
            marginTop: '4px',
            marginBottom: '4px',
          }}
        >
          내 연애 카톡 캐릭터는...
        </p>

        <h1
          style={{
            fontSize: '40px',
            fontWeight: 500,
            color: 'rgb(28, 35, 51)',
            letterSpacing: '-0.4px',
            lineHeight: 1.35,
            fontFamily: "'Ongeulip Minmi', sans-serif",
            marginBottom: '0px',
          }}
        >
          {character.name}
        </h1>

        {character.image && (
          <div className="flex items-center justify-center" style={{ position: 'relative', width: '204px', height: '204px', marginBottom: '6px' }}>
            <div style={{ position: 'absolute', width: '190px', height: '190px', borderRadius: '50%', background: 'rgb(239, 243, 253)' }} />
            <OutlineStar size={16} style={{ top: '4px', left: '2px' }} />
            <OutlineStar size={10} style={{ top: '18px', right: '10px' }} />
            <OutlineStar size={10} style={{ bottom: '18px', left: '10px' }} />
            <OutlineStar size={22} style={{ bottom: '2px', right: '0px' }} />
            <Image src={character.image} alt={character.name} width={204} height={204} style={{ position: 'relative', width: '204px', height: '204px', objectFit: 'contain' }} />
          </div>
        )}

        {character.quote && (
          <div
            style={{
              width: 'fit-content',
              maxWidth: '100%',
              background: '#FEE500',
              borderRadius: '14px',
              paddingTop: '5.5px',
              paddingBottom: '2px',
              paddingLeft: '11px',
              paddingRight: '11px',
              marginBottom: '10px',
            }}
          >
            <p style={{ fontSize: '17px', fontWeight: 500, color: '#333333', lineHeight: 1.6, whiteSpace: 'nowrap' }}>
              &quot;&nbsp;{renderQuote(character.quote)}&nbsp;&quot;
            </p>
          </div>
        )}

        <div className="flex flex-nowrap justify-center" style={{ gap: '5px' }}>
          {character.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: '15px',
                fontWeight: 200,
                color: 'rgb(43, 78, 161)',
                background: 'rgb(230, 237, 255)',
                borderRadius: '999px',
                padding: '4px 10px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
    </div>
  );
}
