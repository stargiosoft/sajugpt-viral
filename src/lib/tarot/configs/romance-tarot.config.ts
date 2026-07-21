import type { TarotConfig } from '@/types/tarot';

// "🚨 통장에 구멍난다" → "통장에 구멍난다" — 앞에 붙은 이모지와 "7월:" 접두어만 제거 (귀신타로와 동일 로직)
function cleanJulyTitle(title: string) {
  return title
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^7월\s*[:：]?\s*/, '')
    .trim();
}

// 동료 확인: 귀신타로 연애편(5장)은 별도 테이블/콘텐츠가 아니라 귀신타로의 기존 ?mode=5 A/B 훅이 쓰던
// 5장(환생꽃·손각시·악귀·동자신·무지개다리)을 그대로 재사용 — 이미지·7월 결과 문구 전부 포함.
// 그래서 새 Supabase 테이블을 만들지 않고 ghost_tarot_results를 이 5개 ID로만 제한해서 그대로 읽는다.
const CARD_POOL = [
  '819edd7e-8c08-48ed-9a31-d579d8828594', // 환생꽃
  'a670073e-f949-491c-ab8d-a2a4fb197795', // 손각시
  'c6c8f6fd-48f4-4d6c-8e20-00b47236fcd6', // 악귀
  '89bf2958-1f3a-48bc-bb41-b2f8fd48fb3d', // 동자신
  '95c712a7-8166-4b18-99ce-f9935919771b', // 무지개다리
];

export const romanceTarotConfig: TarotConfig = {
  slug: 'romance-ghost-tarot',
  table: 'ghost_tarot_results',
  featureType: 'romance_tarot',
  cardPool: CARD_POOL,
  fallbackCards: [
    { id: '819edd7e-8c08-48ed-9a31-d579d8828594', card_name: '환생꽃 (새로운 피어남)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/31_RebirthFlower.webp' },
    { id: 'a670073e-f949-491c-ab8d-a2a4fb197795', card_name: '손각시 (집착의 굴레)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/09_Songaksi.webp' },
    { id: 'c6c8f6fd-48f4-4d6c-8e20-00b47236fcd6', card_name: '악귀 (원한의 형상)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/07_Akgwi.webp' },
    { id: '89bf2958-1f3a-48bc-bb41-b2f8fd48fb3d', card_name: '동자신 (순수한 영감)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/33_Dongja.webp' },
    { id: '95c712a7-8166-4b18-99ce-f9935919771b', card_name: '무지개 다리 (순조로운 도약)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/32_RainbowBridge.webp' },
  ],
  modeOverridePool: undefined,
  // 디자인·애니메이션은 귀신타로와 동일하게 유지 — 팔레트/폰트/에셋을 그대로 재사용
  theme: {
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
  },
  // 히어로 이미지는 "귀신타로 연애편" 전용 아트로 교체(사용자 제공) — 나머지 프레임 에셋은 귀신타로와 동일 재사용
  assets: {
    heroImage: '/romance-ghost-tarot/hero-v4.png',
    backImage: '/ghost-tarot/card-back.png',
    bgTexture: '/ghost-tarot/bg-texture.png',
    resultBg: '/ghost-tarot/result-bg.png',
    resultBgMobile: '/ghost-tarot/result-bg-mobile.png',
    chineseKnot: '/ghost-tarot/chinese-knot.svg',
    badgeBrush: '/ghost-tarot/july-badge-brush.webp',
    shareBoxBg: '/romance-ghost-tarot/share-bg.png',
  },
  copy: {
    heroAlt: '귀신 타로 연애편',
    landingBadge: '너의 8월을 알려주마',
    landingCta: '시작하기',
    selectionPrompt: '봉인된 카드 한 장을 선택하세요',
    cardBackAlt: '봉인된 귀신 카드 뒷면',
    ctaLabel: '귀신타로 이어보기',
    ctaAppUrlIOS: 'https://apps.apple.com/kr/app/fortune-gpt/id1547399137',
    ctaAppUrlAndroid: 'https://play.google.com/store/apps/details?id=kr.semaphore.sajugpt',
    filenameSuffix: '_귀신타로_연애편.png',
    shareText: (cardName, title) => `👻 ${cardName}\n나에게 붙은 존재가 남긴 인연의 기록...\n${title}\n너에게 찾아온 귀신도 확인해봐`,
    defaultShareText: '👻 귀신 타로 연애편 — 당신에게 붙은 존재가 인연의 신호를 속삭입니다.\n봉인된 카드를 열어보세요',
    kakaoTitle: '👻 귀신 타로 연애편',
    kakaoDescription: '당신에게 붙은 존재가 인연의 신호를 속삭입니다',
    kakaoButtonText: '나도 카드 열어보기',
    badgeLabel: (title) => `8월 · ${cleanJulyTitle(title)}`,
    shareBox: {
      headline: '귀신이 아직\n당신을 보고 있습니다.',
      headlineHighlight: '보고',
      subtextBefore: '공유하면 ',
      subtextHighlight: '관심',
      subtextAfter: '이 다른 곳으로 향할지도...',
    },
  },
  // ghost_tarot_results를 그대로 읽으므로 어댑터도 귀신타로와 동일하게 july_* 컬럼을 매핑
  toResultContent: (row) => ({
    title: (row.august_title as string) ?? '',
    message: (row.august_message as string) ?? '',
    summary: (row.august_summary as string) ?? '',
  }),
};
