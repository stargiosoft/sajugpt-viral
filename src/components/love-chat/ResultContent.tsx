'use client';

import Image from 'next/image';
import { CHARACTERS } from '@/data/characters';
import type { LoveChatCharacter } from '@/types/love-chat';
import CharacterProfile from './CharacterProfile';

function SectionTitle({ icon, iconSize = 16, children }: { icon: string; iconSize?: number; children: string }) {
  return (
    <div className="flex items-center" style={{ gap: '4px', marginBottom: '4px' }}>
      <span
        className="flex items-center justify-center"
        style={{ width: '32px', height: '32px', flexShrink: 0 }}
      >
        <img src={icon} alt="" width={iconSize + 4} height={iconSize + 4} />
      </span>
      <p style={{ fontSize: '22px', fontWeight: 500, color: '#1C2333', fontFamily: "'Ongeulip Minmi', sans-serif" }}>
        {children}
      </p>
    </div>
  );
}

function Bubble({ children, hug, backgroundImage }: { children: React.ReactNode; hug?: boolean; backgroundImage?: string }) {
  return (
    <div
      style={{
        width: hug ? 'fit-content' : undefined,
        background: backgroundImage ? `#FFFFFF url(${backgroundImage}) center / cover no-repeat` : '#FFFFFF',
        borderRadius: '4px 16px 16px 16px',
        padding: '18px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </div>
  );
}

function MatchCard({ label, emoji, image, name, tone }: { label: string; emoji: string; image?: string; name: string; tone: 'good' | 'bad' }) {
  const badgeBg = tone === 'good' ? '#FEE500' : '#333333';
  const badgeColor = tone === 'good' ? '#333333' : '#FFFFFF';
  return (
    <div
      className="flex-1 flex flex-col items-center"
      style={{ gap: '0px' }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 'fit-content',
          fontSize: '16px',
          fontWeight: 500,
          color: badgeColor,
          background: badgeBg,
          borderRadius: '999px',
          paddingTop: '3px',
          paddingBottom: '2px',
          paddingLeft: '40px',
          paddingRight: '40px',
        }}
      >
        {label}
      </span>
      <span
        className="flex items-center justify-center"
        style={{ position: 'relative', width: '100%', maxWidth: '124px', aspectRatio: '1 / 1', fontSize: '52px', marginTop: '8px' }}
      >
        {image ? (
          <Image src={image} alt={name} fill sizes="124px" style={{ objectFit: 'contain' }} />
        ) : (
          emoji
        )}
      </span>
      <span style={{ fontSize: '15px', fontWeight: 500, color: '#1C2333', textAlign: 'center', lineHeight: 1.4, marginTop: '8px' }}>
        {name}
      </span>
    </div>
  );
}

function Avatar() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        flexShrink: 0,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Image src="/love-chat/bot-avatar.png" alt="" width={72} height={72} style={{ width: '38px', height: '38px', maxWidth: 'none', objectFit: 'cover' }} />
    </div>
  );
}

export default function ResultContent({ character }: { character: LoveChatCharacter }) {
  const goodMatch = CHARACTERS.find(c => c.id === character.goodMatch.characterId);
  const badMatch = CHARACTERS.find(c => c.id === character.badMatch.characterId);

  return (
    <div className="flex flex-col" style={{ gap: '6px', paddingTop: '2px' }}>
      <div className="flex items-center" style={{ gap: '8px' }}>
        <Avatar />
        <p style={{ fontSize: '17px', fontWeight: 500, color: '#555555' }}>톡도사</p>
      </div>

      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #C7D9F5',
          borderRadius: '4px 20px 20px 20px',
          padding: '20px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <CharacterProfile character={character} />
      </div>

      <Bubble>
          <SectionTitle icon="/love-chat/icons/section-love-style.svg">연애 스타일</SectionTitle>
          <p style={{ fontSize: '17px', fontWeight: 300, color: 'rgb(86, 91, 95)', lineHeight: 1.6, marginLeft: '36px' }}>{character.loveStyle}</p>
        </Bubble>

        <Bubble>
          <SectionTitle icon="/love-chat/icons/section-traits.svg">성격 특징</SectionTitle>
          <ul className="flex flex-col" style={{ gap: '4px', marginLeft: '36px' }}>
            {character.traits.map(trait => (
              <li key={trait} className="flex" style={{ gap: '8px', fontSize: '17px', fontWeight: 300, color: 'rgb(86, 91, 95)', lineHeight: 1.6 }}>
                <span style={{ color: '#FEE500', fontWeight: 500 }}>•</span>
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </Bubble>

        <Bubble>
          <SectionTitle icon="/love-chat/icons/section-stats.svg" iconSize={18}>성향 스탯</SectionTitle>
          <div className="flex flex-col" style={{ gap: '14px', marginLeft: '36px', paddingBottom: '8px' }}>
            {character.stats.map(stat => (
              <div key={stat.label}>
                <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 500, color: 'rgb(86, 91, 95)' }}>{stat.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgb(131, 131, 131)', letterSpacing: '0.5px' }}>{stat.value} / 100</span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#F2F2F2', overflow: 'hidden' }}>
                  <div style={{ width: `${stat.value}%`, height: '100%', borderRadius: '999px', background: '#FEE500' }} />
                </div>
              </div>
            ))}
          </div>
        </Bubble>

        <div
          className="flex"
          style={{ borderRadius: '4px 16px 16px 16px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
        >
          <div className="flex-1" style={{ background: 'rgb(252, 250, 244)', padding: '18px' }}>
            <MatchCard label="찰떡" emoji={character.goodMatch.emoji} image={goodMatch?.image} name={goodMatch?.name ?? character.goodMatch.label} tone="good" />
          </div>
          <div style={{ width: '1px', background: 'rgb(243, 242, 239)' }} />
          <div className="flex-1" style={{ background: 'rgb(239, 242, 250)', padding: '18px' }}>
            <MatchCard label="상극" emoji={character.badMatch.emoji} image={badMatch?.image} name={badMatch?.name ?? character.badMatch.label} tone="bad" />
          </div>
        </div>
      </div>
  );
}

