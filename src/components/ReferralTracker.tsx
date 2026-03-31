'use client';

import { useEffect, useRef } from 'react';
import { trackReferralVisit, type FeatureType } from '@/lib/analytics';

interface Props {
  featureType: FeatureType;
  referrerId: string;
}

/**
 * 공유 링크로 유입된 방문을 추적하는 무렌더 컴포넌트.
 * 동적 페이지 ([battleId], [autopsyId] 등)에 배치.
 */
export default function ReferralTracker({ featureType, referrerId }: Props) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackReferralVisit(featureType, referrerId);
  }, [featureType, referrerId]);

  return null;
}
