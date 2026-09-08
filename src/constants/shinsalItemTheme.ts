export const SKILL_ITEM_COLORS = {
  accent: '#8B5FC7',
  accentHover: '#7547B0',
  textOnAccent: '#FFFFFF',
  textPrimary: '#2D2438',
  textSecondary: '#62566D',
  textTertiary: '#8D8197',
  panelBg: '#F6F1FA',
  cardBg: '#FFFFFF',
  border: 'rgba(126, 87, 168, 0.16)',
  navBg: '#F6F1FA',
  navText: '#2D2438',
};

export const FADE_UP = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};