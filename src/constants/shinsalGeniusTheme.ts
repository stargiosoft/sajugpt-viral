export const GENIUS_COLORS = {
  pageBg: '#212226',
  panelBg: '#2A2B30',
  cardBg: '#32343B',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB', 
  textTertiary: '#9CA3AF',
  accent: '#B026FF',    
  accentHover: '#9010DE',
  textOnAccent: '#FFFFFF',
  border: '#41434C',
  success: '#10B981',
  danger: '#EF4444',
  dangerBg: '#5c1717',
};

export const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
} as const;