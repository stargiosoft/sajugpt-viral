import { useEffect, useState } from 'react';

// 프로젝트 공통 md: 브레이크포인트(768px)와 동일 기준으로 웹/모바일 판별
export const DESKTOP_BREAKPOINT = 768;
// 320px급 좁은 화면(아이폰 SE 등) 전용 분기 — DESKTOP_BREAKPOINT와 별개
export const NARROW_BREAKPOINT = 360;

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isDesktop;
}

export function useIsNarrow() {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const update = () => setIsNarrow(window.innerWidth <= NARROW_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isNarrow;
}
