'use client';

import { useEffect, useRef } from 'react';
import { trackLandingVisit, type FeatureType } from '@/lib/analytics';

interface Props {
  featureType: FeatureType;
}

/**
 * 랜딩 페이지 유입을 추적하는 무렌더 컴포넌트.
 * 각 기능의 메인 page.tsx에 배치.
 */
export default function LandingTracker({ featureType }: Props) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackLandingVisit(featureType);
  }, [featureType]);

  return null;
}
