import { useEffect, useState } from 'react';
import useIsNarrowHook from '@/hooks/useIsNarrow';

export const DESKTOP_BREAKPOINT = 768;
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
  return useIsNarrowHook(NARROW_BREAKPOINT);
}
