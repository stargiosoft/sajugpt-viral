// "시작하기" 버튼 기준 공용 프레스/호버 효과 — 박스 스타일 버튼 전반에서 색상만 다르게 재사용
export const PRESS_HOVER_PROPS = {
  whileHover: { filter: 'brightness(1.08)' },
  whileTap: { filter: 'brightness(0.88)', scale: 0.998 },
  transition: { duration: 0.15, ease: 'easeOut' as const },
};
