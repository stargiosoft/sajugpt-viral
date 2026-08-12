// 내 인연은 어디에? 테마 — 몽글몽글 파스텔 핑크 & 스카이 블루 무드
export const LOVE_SPOT_COLORS = {
  frameBg: '#FDEEEF', // 은은하고 포근한 파스텔 핑크 베이스
  frameGradient: 'linear-gradient(160deg, #FFF5F7 0%, #FFE4ED 50%, #FFD6E8 100%)', // 부드러운 핑크 파스텔 그라디언트
  frameBorder: '#FFFFFF',
  panelBg: '#FFFFFF',

  primary: '#FF8A9E', // 말랑한 체리 블로섬 핑크
  primaryHover: '#FF738B',
  primaryGradient: 'linear-gradient(135deg, #FF8A9E 0%, #FF9AAD 50%, #FFB3C6 100%)', // 입체감 있는 몽글 그라디언트
  textOnPrimary: '#FFFFFF',

  accent: '#D9658A',      // 사랑스럽고 포근한 포인트 핑크
  accentSoft: '#E8A5B7',

  // 이미지 속 청량한 별/방울 감성을 주는 스카이 블루 포인트 추가
  skyBlue: '#70D6FF',
  skyBlueBg: '#E8F7FF',

  text: '#3C3C3C',        // 세련된 다크 그레이
  textSecondary: '#9C7A85',
  textTertiary: '#E098AD',
  placeholder: '#C7B1B8',

  cardBg: 'rgba(255, 255, 255, 0.95)', // 맑고 깨끗한 화이트 투명 카드
  tipBg: '#FFF5F8',
  tipBorder: '#FFD1DC',
} as const;

export const FADE_UP = {
  hidden: { opacity: 0, y: 12, scale: 0.98 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
} as const;