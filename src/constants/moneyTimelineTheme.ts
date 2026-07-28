export const MONEY_COLORS = {
  pageBg: '#E9E7FE',
  cardBg: '#FFFFFF',
  cardBgGradient: '#FFFFFF',
  panelBg: '#FFFFFF',
  border: 'rgb(228, 226, 250)',

  gold: 'rgb(115, 94, 242)',
  goldHover: 'rgb(98, 80, 206)',
  goldDim: 'rgba(115,94,242,0.14)',
  goldBorder: 'rgb(205, 201, 250)',
  textOnGold: '#FFFFFF',

  text: '#231521',
  textSecondary: 'rgba(35,21,33,0.68)',
  textTertiary: 'rgba(35,21,33,0.46)',
  placeholder: 'rgba(35,21,33,0.32)',

  danger: '#E0456C',
  dangerBg: 'rgba(224,69,108,0.10)',
} as const;

export const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const;

export const BODY_TEXT_STYLE = {
  fontSize: '14.5px',
  fontWeight: 400,
  color: 'rgb(33, 33, 33)',
  lineHeight: '23px',
  letterSpacing: '-0.2px',
  WebkitTextStroke: '0.2px rgb(33, 33, 33)',
} as const;
