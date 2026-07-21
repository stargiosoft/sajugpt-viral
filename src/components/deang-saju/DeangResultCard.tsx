'use client';

import { forwardRef } from 'react';
import type { DeangProfileData } from '@/types/deang-saju';
import DeangProfile from './DeangProfile';
import DeangResultContent from './DeangResultContent';
import { DEANG_COLORS as C } from '@/constants/deangTheme';
import useIsNarrow from '@/hooks/useIsNarrow';

interface Props {
  profile: DeangProfileData;
}

const DeangResultCard = forwardRef<HTMLDivElement, Props>(({ profile }, ref) => {
  const isNarrow = useIsNarrow();
  return (
    <div
      ref={ref}
      className="transform-gpu"
      style={{ backgroundColor: C.pageBg, borderRadius: '24px', padding: isNarrow ? '8px 8px 16px' : '8px 12px 20px' }}
    >
      <DeangProfile breed={profile.breed} quip={profile.quip} />
      <DeangResultContent profile={profile} />
    </div>
  );
});

DeangResultCard.displayName = 'DeangResultCard';

export default DeangResultCard;
