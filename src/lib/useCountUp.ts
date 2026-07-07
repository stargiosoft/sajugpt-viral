import { useEffect, useState } from 'react';

/** 지정된 지연 후 0에서 목표값까지 이징을 태워 올라가는 카운트업 — 지연은 부모 motion 진입 애니메이션과 맞춰 등장과 동시에 체감되게 함 */
export function useCountUp(target: number, duration = 1600, delay = 400): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    let cancelled = false;
    const startTimer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return value;
}
