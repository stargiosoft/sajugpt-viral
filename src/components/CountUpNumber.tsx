'use client';

import { useCountUp } from '@/lib/useCountUp';

/** 카운트업 렌더링을 별도 컴포넌트로 분리 — 매 프레임 setState가 부모(전체 랜딩) 리렌더로 번지면
 *  같은 시점에 도는 다른 진입 애니메이션이 끊겨 보이므로, 재렌더 범위를 숫자 자신으로만 격리 */
export default function CountUpNumber({ target, duration, delay }: { target: number; duration?: number; delay?: number }) {
  const value = useCountUp(target, duration, delay);
  return <>{value.toLocaleString()}</>;
}
