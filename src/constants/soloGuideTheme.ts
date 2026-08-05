// 솔로 탈출 지침서 테마 — 로맨스 코랄/로즈 포인트 컬러 (기존 테스트와 겹치지 않는 신규 컬러)
export const SOLO_COLORS = {
  panelBg: '#F7F9FC',
  border: '#E5E8EB',
  inputBg: '#F2F4F6',

  primary: '#F84784',
  primaryHover: 'rgb(244 50 117)',
  primaryDim: 'rgba(248,71,132,0.10)',
  textOnPrimary: '#FFFFFF',

  text: '#191F28',
  textSecondary: '#4E5968',
  textTertiary: '#7C8794',
  placeholder: '#B0B8C1',

  // 결과 카드 프레임 — 카와이 핑크 톤
  frameBg: '#FFF2F6',
  frameBorder: '#FFC7D6',
} as const;

export const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const;
