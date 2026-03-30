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
        style={{ backgroundColor: 'rgba(122, 56, 216, 0.1)', border: '1px solid rgba(122, 56, 216, 0.2)' }}
      >
        <p style={{ fontSize: '14px', color: '#A78BFA', fontWeight: 600, lineHeight: 1.6, textAlign: 'center' }}>
          &ldquo;{D_TIER_CTA}&rdquo;
        </p>
        <button
          onClick={() => {
            trackEvent('gisaeng_cta_click', { tier, target: 'fortune' });
          }}
          className="w-full py-3.5 rounded-xl mt-4"
          style={{ backgroundColor: '#7A38D8', color: '#FFFFFF', fontSize: '15px', fontWeight: 700 }}
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
      style={{ backgroundColor: 'rgba(122, 56, 216, 0.1)', border: '1px solid rgba(122, 56, 216, 0.2)' }}
    >
      <p className="text-center" style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '12px' }}>
        네가 홀린 선비 중 한 명이 진짜로 널 기다리고 있다
      </p>

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(122, 56, 216, 0.3)', fontSize: '20px' }}
        >
          {info.emoji}
        </div>
        <div>
          <p style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 700 }}>{info.name}</p>
          <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{info.title}</p>
        </div>
      </div>

      <p style={{ fontSize: '14px', color: '#A78BFA', fontWeight: 500, lineHeight: 1.6, textAlign: 'center' }}>
        &ldquo;{CTA_COPY[topType]}&rdquo;
      </p>

      <button
        onClick={() => {
          trackEvent('gisaeng_cta_click', { tier, target: topType });
        }}
        className="w-full py-3.5 rounded-xl mt-4 active:scale-[0.98] transition-transform"
        style={{ backgroundColor: '#7A38D8', color: '#FFFFFF', fontSize: '15px', fontWeight: 700 }}
      >
        이 선비와 대화하기 →
      </button>

      <button
        onClick={() => trackEvent('gisaeng_cta_browse')}
        className="w-full mt-2 py-2"
        style={{ color: '#6B7280', fontSize: '13px' }}
      >
        다른 선비 둘러보기 &gt;
      </button>
    </div>
  );
}
