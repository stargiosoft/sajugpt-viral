import type { TarotConfig } from '@/types/tarot';
import { GHOST_THEME, GHOST_SHARED_ASSETS, GHOST_SHARED_COPY, toGhostResultContent } from './ghost-shared';

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
  modeOverridePool: [
    '819edd7e-8c08-48ed-9a31-d579d8828594',
    'a670073e-f949-491c-ab8d-a2a4fb197795',
    'c6c8f6fd-48f4-4d6c-8e20-00b47236fcd6',
    '89bf2958-1f3a-48bc-bb41-b2f8fd48fb3d',
    '95c712a7-8166-4b18-99ce-f9935919771b',
  ],
  theme: GHOST_THEME,
  assets: {
    ...GHOST_SHARED_ASSETS,
    heroImage: '/ghost-tarot/hero-v4.png',
    shareBoxBg: '/ghost-tarot/share-bg.png',
  },
  copy: {
    ...GHOST_SHARED_COPY,
    heroAlt: '귀신 타로',
    filenameSuffix: '_귀신타로.png',
    shareText: (cardName, title) => `👻 ${cardName}\n나에게 붙은 존재가 남긴 기록...\n${title}\n너에게 찾아온 귀신도 확인해봐`,
    defaultShareText: '👻 귀신 타로 — 당신에게 붙은 존재가 이번 달 운세를 속삭입니다.\n봉인된 카드를 열어보세요',
    kakaoTitle: '👻 귀신 타로',
    kakaoDescription: '당신에게 붙은 존재가 이번 달 운세를 속삭입니다',
  },
  toResultContent: toGhostResultContent,
};
