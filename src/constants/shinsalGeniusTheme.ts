// src/constants/shinsalGeniusTheme.ts

export const GENIUS_COLORS = {
  pageBg: '#0A0A0A',
  panelBg: '#141414',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  accent: '#B026FF',      // 광기/천재성 포인트 컬러 (퍼플)
  accentHover: '#9010DE',
  textOnAccent: '#FFFFFF',
  border: '#27272A',
  cardBg: '#1C1C1E',
  success: '#10B981',
  danger: '#EF4444',
  dangerBg: '#450a0a',
};

export const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const;