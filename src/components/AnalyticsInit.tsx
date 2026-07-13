'use client';

import { useEffect } from 'react';
import { initViralAnalytics } from '@/lib/analytics';

export default function AnalyticsInit() {
  useEffect(() => {
    initViralAnalytics();
  }, []);

  return null;
}
