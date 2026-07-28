import type { TarotConfig } from '@/types/tarot';
import { GHOST_THEME, GHOST_SHARED_ASSETS, GHOST_SHARED_COPY, toGhostResultContent } from './ghost-shared';

const CARD_POOL = [
  '819edd7e-8c08-48ed-9a31-d579d8828594',
  'a670073e-f949-491c-ab8d-a2a4fb197795',
  'c6c8f6fd-48f4-4d6c-8e20-00b47236fcd6',
  '89bf2958-1f3a-48bc-bb41-b2f8fd48fb3d',
  '95c712a7-8166-4b18-99ce-f9935919771b',
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
  theme: GHOST_THEME,
  assets: {
    ...GHOST_SHARED_ASSETS,
    heroImage: '/romance-ghost-tarot/hero-v4.png',
    shareBoxBg: '/romance-ghost-tarot/share-bg.png',
  },
  copy: {
    ...GHOST_SHARED_COPY,
    heroAlt: '귀신 타로 연애편',
    filenameSuffix: '_귀신타로_연애편.png',
    shareText: (cardName, title) => `👻 ${cardName}\n나에게 붙은 존재가 남긴 인연의 기록...\n${title}\n너에게 찾아온 귀신도 확인해봐`,
    defaultShareText: '👻 귀신 타로 연애편 — 당신에게 붙은 존재가 인연의 신호를 속삭입니다.\n봉인된 카드를 열어보세요',
    kakaoTitle: '👻 귀신 타로 연애편',
    kakaoDescription: '당신에게 붙은 존재가 인연의 신호를 속삭입니다',
  },
  toResultContent: toGhostResultContent,
};
