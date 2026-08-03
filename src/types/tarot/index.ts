import type { FeatureType } from '@/lib/analytics';

export interface TarotCardData {
  id: string;
  card_name: string;
  front_image: string;
}

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
  shareBoxBg?: string;
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
  badgeLabel?: (title: string) => string;
  shareBox?: {
    headline: string;
    headlineHighlight?: string;
    subtextBefore: string;
    subtextHighlight: string;
    subtextAfter: string;
  };
}

export interface TarotConfig {
  slug: string;
  table: string;
  featureType: FeatureType;
  fallbackCards: TarotCardData[];
  modeOverridePool?: string[];
  cardPool?: string[];
  theme: TarotTheme;
  assets: TarotAssets;
  copy: TarotCopy;
  toResultContent: (row: Record<string, unknown>) => TarotResultContent;
}
