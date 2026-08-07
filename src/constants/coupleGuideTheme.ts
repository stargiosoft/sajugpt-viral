// soloGuideTheme.ts 와 동일한 패턴의 couple-guide 전용 테마.
// 실제 색상 값은 디자인 확정 후 자유롭게 교체하세요 — 지금은 solo-guide와
// 구분되는 로즈/코랄 계열로 임시 지정해뒀습니다.

export const COUPLE_COLORS = {
  primary: 'rgb(255 107 129)',
  primaryHover: 'rgb(240 90 112)',
  primaryDim: 'rgb(255 230 233)',
  textOnPrimary: '#FFFFFF',

  frameBg: 'rgb(255 248 249)',
  frameBorder: 'rgb(255 214 220)',

  inputBg: 'rgb(255 246 247)',
  border: 'rgb(255 214 220)',

  text: 'rgb(60 45 48)',
  textTertiary: 'rgb(150 130 133)',
  placeholder: 'rgb(190 170 173)',
};

export const FADE_UP = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};