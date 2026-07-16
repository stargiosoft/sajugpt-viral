import type { TarotConfig } from '@/types/tarot';

// "🚨 통장에 구멍난다" → "통장에 구멍난다" — 앞에 붙은 이모지와 "7월:" 접두어만 제거
function cleanJulyTitle(title: string) {
  return title
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^7월\s*[:：]?\s*/, '')
    .trim();
}

export const ghostTarotConfig: TarotConfig = {
  slug: 'ghost-tarot',
  table: 'ghost_tarot_results',
  featureType: 'ghost_tarot',
  fallbackCards: [
    { id: '04d178fa-712d-4007-80a2-43a7d9bcb433', card_name: '업신 (숨겨진 조력자)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/30_Eopsin.webp' },
    { id: '2f461c81-e47f-4e04-a018-6ce0b6d1d735', card_name: '창귀 (호랑이의 앞잡이)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/08_Changgwi.webp' },
    { id: '3164e13f-74c3-4b93-9b89-f9bccde68644', card_name: '강림도령 (降臨都令)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/01_Ganglim.webp' },
    { id: '5a4cfc5e-7e62-488c-86de-ab870a72a321', card_name: '해원상생 (축제의 굿판)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/36_Sangsaeng.webp' },
    { id: '7108a8c7-0074-4974-b86c-b3492ea7b878', card_name: '당산나무 (절대 안전 구역)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/26_Dangsan.webp' },
    { id: '819edd7e-8c08-48ed-9a31-d579d8828594', card_name: '환생꽃 (새로운 피어남)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/31_RebirthFlower.webp' },
    { id: '89bf2958-1f3a-48bc-bb41-b2f8fd48fb3d', card_name: '동자신 (순수한 영감)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/33_Dongja.webp' },
    { id: '95c712a7-8166-4b18-99ce-f9935919771b', card_name: '무지개 다리 (순조로운 도약)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/32_RainbowBridge.webp' },
    { id: 'a670073e-f949-491c-ab8d-a2a4fb197795', card_name: '손각시 (집착의 굴레)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/09_Songaksi.webp' },
    { id: 'c6c8f6fd-48f4-4d6c-8e20-00b47236fcd6', card_name: '악귀 (원한의 형상)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/07_Akgwi.webp' },
    { id: 'e10f5ea5-ccdc-4cbc-9afb-c03fa5452fdf', card_name: '도깨비 (어둠의 브로커)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/06_Dokkaebi.webp' },
    { id: 'f79b6cec-4829-47df-9aa7-84a41312f69c', card_name: '생명수 (바리공주의 약수)', front_image: 'https://tdrmvbsmxcewwaeuoqdx.supabase.co/storage/v1/object/public/tarot-cards/25_LifeWater.webp' },
  ],
  // mode=5 일 때 무조건 이 5개 안에서만 결과가 나오도록 ID 고정 (레거시 A/B 훅, 귀신타로 전용)
  modeOverridePool: [
    '819edd7e-8c08-48ed-9a31-d579d8828594', // 환생꽃
    'a670073e-f949-491c-ab8d-a2a4fb197795', // 손각시
    'c6c8f6fd-48f4-4d6c-8e20-00b47236fcd6', // 악귀
    '89bf2958-1f3a-48bc-bb41-b2f8fd48fb3d', // 동자신
    '95c712a7-8166-4b18-99ce-f9935919771b', // 무지개다리
  ],
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
  assets: {
    heroImage: '/ghost-tarot/hero-v4.png',
    backImage: '/ghost-tarot/card-back.png',
    bgTexture: '/ghost-tarot/bg-texture.png',
    resultBg: '/ghost-tarot/result-bg.png',
    resultBgMobile: '/ghost-tarot/result-bg-mobile.png',
    chineseKnot: '/ghost-tarot/chinese-knot.svg',
    badgeBrush: '/ghost-tarot/july-badge-brush.webp',
    shareBoxBg: '/ghost-tarot/share-bg.png',
  },
  copy: {
    heroAlt: '귀신 타로',
    landingBadge: '너의 7월을 알려주마',
    landingCta: '시작하기',
    selectionPrompt: '봉인된 카드 한 장을 선택하세요',
    cardBackAlt: '봉인된 귀신 카드 뒷면',
    ctaLabel: '귀신타로 이어보기',
    ctaAppUrlIOS: 'https://apps.apple.com/kr/app/fortune-gpt/id1547399137',
    ctaAppUrlAndroid: 'https://play.google.com/store/apps/details?id=kr.semaphore.sajugpt',
    filenameSuffix: '_귀신타로.png',
    shareText: (cardName, title) => `👻 ${cardName}\n나에게 붙은 존재가 남긴 기록...\n${title}\n너에게 찾아온 귀신도 확인해봐`,
    defaultShareText: '👻 귀신 타로 — 당신에게 붙은 존재가 이번 달 운세를 속삭입니다.\n봉인된 카드를 열어보세요',
    kakaoTitle: '👻 귀신 타로',
    kakaoDescription: '당신에게 붙은 존재가 이번 달 운세를 속삭입니다',
    kakaoButtonText: '나도 카드 열어보기',
    badgeLabel: (title) => `7월 · ${cleanJulyTitle(title)}`,
    shareBox: {
      headline: '귀신이 아직\n당신을 보고 있습니다.',
      headlineHighlight: '보고',
      subtextBefore: '공유하면 ',
      subtextHighlight: '관심',
      subtextAfter: '이 다른 곳으로 향할지도...',
    },
  },
  toResultContent: (row) => ({
    title: (row.july_title as string) ?? '',
    message: (row.july_message as string) ?? '',
    summary: (row.july_summary as string) ?? '',
  }),
};
