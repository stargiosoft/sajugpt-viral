'use client';

import { useEffect, useState } from 'react';

export default function useIsNarrow(threshold = 360) {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth <= threshold);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [threshold]);

  return isNarrow;
}
