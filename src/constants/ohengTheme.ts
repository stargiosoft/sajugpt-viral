// 오행 테스트 라이트 테마 — 토스 스타일 블루 포인트 컬러
export const OHENG_COLORS = {
  bg: '#FFFFFF',
  panelBg: '#F7F9FC',
  border: '#E5E8EB',

  blue: '#3182F6',
  blueHover: '#1B64DA',
  blueDim: 'rgba(49,130,246,0.10)',
  blueBorder: 'rgba(49,130,246,0.35)',
  textOnBlue: '#FFFFFF',

  text: '#191F28',
  textSecondary: '#4E5968',
  textTertiary: '#8B95A1',
  placeholder: '#B0B8C1',

  danger: '#F04452',
  dangerBg: 'rgba(240,68,82,0.10)',
} as const;

export const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const;
