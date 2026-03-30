'use client';

import type { SeonbiState, SeonbiType, GisaengTier } from '@/types/gisaeng';
import { SEONBI_INFO } from '@/constants/gisaeng';
import { trackEvent } from '@/lib/analytics';

interface Props {
  seonbi: Record<SeonbiType, SeonbiState>;
  tier: GisaengTier;
}

// 선비 유형 → CTA 카피
const CTA_COPY: Record<SeonbiType, string> = {
  kwonryeok: '권력을 쥔 남자가 네 앞에서 무릎 꿇었다. 이번엔 진짜로.',
  romantic: '시 100편을 바친 선비가 오늘 밤 마지막 한 편을 남겼다.',
  jealousy: '담을 넘어서라도 너한테 가겠다던 그 남자, 아직 기다리고 있다.',
};

const D_TIER_CTA = '기방에서 쫓겨났으면 운이라도 바꿔야지. 내가 도와줄게.';

export default function GisaengCTA({ seonbi, tier }: Props) {
  // D티어: 전용 CTA
  if (tier === 'D') {
    return (
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: '#FAF8FC', border: '1px solid #e7e7e7' }}
      >
        <p style={{ fontSize: '14px', color: '#7A38D8', fontWeight: 600, lineHeight: 1.6, textAlign: 'center', letterSpacing: '-0.28px' }}>
          &ldquo;{D_TIER_CTA}&rdquo;
        </p>
        <button
          onClick={() => {
            trackEvent('gisaeng_cta_click', { tier, target: 'fortune' });
          }}
          className="w-full flex items-center justify-center mt-4"
          style={{
            height: '48px',
            borderRadius: '16px',
            backgroundColor: '#7A38D8',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.3px',
            transition: 'all 0.15s ease',
          }}
          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
          onPointerUp={e => { e.currentTarget.style.transform = ''; }}
          onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
        >
          운명 상담받기 →
        </button>
      </div>
    );
  }

  // 가장 충성도 높은 선비
  const types: SeonbiType[] = ['kwonryeok', 'romantic', 'jealousy'];
  const aliveSeonbi = types
    .filter(t => seonbi[t].alive)
    .sort((a, b) => seonbi[b].loyalty - seonbi[a].loyalty);

  if (aliveSeonbi.length === 0) return null;

  const topType = aliveSeonbi[0];
  const info = SEONBI_INFO[topType];

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: '#FAF8FC', border: '1px solid #e7e7e7' }}
    >
      <p className="text-center" style={{ fontSize: '13px', color: '#848484', marginBottom: '12px', letterSpacing: '-0.26px' }}>
        네가 홀린 선비 중 한 명이 진짜로 널 기다리고 있다
      </p>

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#EDE5F7', fontSize: '20px' }}
        >
          {info.emoji}
        </div>
        <div>
          <p style={{ fontSize: '15px', color: '#151515', fontWeight: 700, letterSpacing: '-0.3px' }}>{info.name}</p>
          <p style={{ fontSize: '12px', color: '#848484', letterSpacing: '-0.24px' }}>{info.title}</p>
        </div>
      </div>

      <p style={{ fontSize: '14px', color: '#7A38D8', fontWeight: 500, lineHeight: 1.6, textAlign: 'center', letterSpacing: '-0.28px' }}>
        &ldquo;{CTA_COPY[topType]}&rdquo;
      </p>

      <button
        onClick={() => {
          trackEvent('gisaeng_cta_click', { tier, target: topType });
        }}
        className="w-full flex items-center justify-center mt-4"
        style={{
          height: '48px',
          borderRadius: '16px',
          backgroundColor: '#7A38D8',
          border: 'none',
          fontSize: '15px',
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '-0.3px',
          transition: 'all 0.15s ease',
        }}
        onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
        onPointerUp={e => { e.currentTarget.style.transform = ''; }}
        onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
      >
        이 선비와 대화하기 →
      </button>

      <button
        onClick={() => trackEvent('gisaeng_cta_browse')}
        className="w-full mt-2 flex items-center justify-center"
        style={{ height: '36px', color: '#848484', fontSize: '13px', letterSpacing: '-0.26px', border: 'none', backgroundColor: 'transparent' }}
      >
        다른 선비 둘러보기 &gt;
      </button>
    </div>
  );
}
