import type { CSSProperties } from 'react';
import type { FeatureType } from '@/lib/analytics';

export interface TarotCardData {
  id: string;
  card_name: string;
  front_image: string;
}

/** DB row에서 뽑아낸, 화면에 실제로 렌더링되는 결과 3필드 (제목/본문/요약) */
export interface TarotResultContent {
  title: string;
  message: string;
  summary: string;
}

export interface TarotResult extends TarotCardData, TarotResultContent {
  created_at?: string;
}

export interface TarotTheme {
  brushFont: string;
  myungjoFont: string;
  palette: {
    bg: string;
    bgSoft: string;
    ink: string;
    inkDim: string;
    red: string;
    redDim: string;
    gold: string;
  };
}

export interface TarotAssets {
  heroImage: string;
  backImage: string;
  bgTexture: string;
  resultBg: string;
  resultBgMobile: string;
  chineseKnot: string;
  badgeBrush?: string;
}

export interface TarotCopy {
  heroAlt: string;
  landingBadge: string;
  landingCta: string;
  selectionPrompt: string;
  cardBackAlt: string;
  ctaLabel: string;
  ctaAppUrlIOS: string;
  ctaAppUrlAndroid: string;
  filenameSuffix: string;
  shareText: (cardName: string, title: string) => string;
  defaultShareText: string;
  kakaoTitle: string;
  kakaoDescription: string;
  kakaoButtonText: string;
  /** 결과 카드 상단, 카드명 아래 뱃지 라벨. 없으면 뱃지 자체를 숨김 */
  badgeLabel?: (title: string) => string;
}

export interface TarotConfig {
  slug: string;
  table: string;
  featureType: FeatureType;
  fallbackCards: TarotCardData[];
  /** 레거시 ?mode=5 A/B 훅 — 지정된 풀 안에서만 랜덤 결과가 나오도록 강제. 없으면 비활성 */
  modeOverridePool?: string[];
  /** 이 슬러그가 항상 이 ID들로만 카드를 보여주도록 고정 (선택 화면 자체가 이 개수로 제한됨) */
  cardPool?: string[];
  theme: TarotTheme;
  assets: TarotAssets;
  copy: TarotCopy;
  /** DB row(어떤 컬럼명이든) → 공용 title/message/summary로 매핑 */
  toResultContent: (row: Record<string, unknown>) => TarotResultContent;
}

export interface TarotButtonBgStyle extends CSSProperties {}
