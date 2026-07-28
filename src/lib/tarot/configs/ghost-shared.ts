import type { TarotConfig, TarotResultContent } from '@/types/tarot';

export function cleanMonthTitle(title: string) {
  return title
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^\d{1,2}월\s*[:：]?\s*/, '')
    .trim();
}

export const GHOST_THEME: TarotConfig['theme'] = {
  brushFont: "'East Sea Dokdo', cursive",
  myungjoFont: "'Bookk Myungjo', serif",
  palette: {
    bg: '#050403',
    bgSoft: '#0c0906',
    ink: '#e8dfd0',
    inkDim: '#a89a82',
    red: '#b3273a',
    redDim: '#7a2130',
    gold: '#8a6d3b',
  },
};

export const GHOST_SHARED_ASSETS = {
  backImage: '/ghost-tarot/card-back.png',
  bgTexture: '/ghost-tarot/bg-texture.png',
  resultBg: '/ghost-tarot/result-bg.png',
  resultBgMobile: '/ghost-tarot/result-bg-mobile.png',
  chineseKnot: '/ghost-tarot/chinese-knot.svg',
  badgeBrush: '/ghost-tarot/july-badge-brush.webp',
};

export const GHOST_SHARED_COPY = {
  landingBadge: '너의 이번 달을 알려주마',
  landingCta: '시작하기',
  selectionPrompt: '봉인된 카드 한 장을 선택하세요',
  cardBackAlt: '봉인된 귀신 카드 뒷면',
  ctaLabel: '귀신타로 이어보기',
  ctaAppUrlIOS: 'https://apps.apple.com/kr/app/fortune-gpt/id1547399137',
  ctaAppUrlAndroid: 'https://play.google.com/store/apps/details?id=kr.semaphore.sajugpt',
  kakaoButtonText: '나도 카드 열어보기',
  badgeLabel: (title: string) => cleanMonthTitle(title),
  shareBox: {
    headline: '귀신이 아직\n당신을 보고 있습니다.',
    headlineHighlight: '보고',
    subtextBefore: '공유하면 ',
    subtextHighlight: '관심',
    subtextAfter: '이 다른 곳으로 향할지도...',
  },
};

export function toGhostResultContent(row: Record<string, unknown>): TarotResultContent {
  return {
    title: (row.august_title as string) ?? '',
    message: (row.august_message as string) ?? '',
    summary: (row.august_summary as string) ?? '',
  };
}
