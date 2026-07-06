'use client';

import AnalyzingScreen from '@/components/AnalyzingScreen';
import { ANALYZING_MESSAGES } from '@/constants/court';

export default function CourtAnalyzing() {
  return (
    <AnalyzingScreen
      messages={ANALYZING_MESSAGES}
      emoji="⚖️"
      ringColor="rgba(122, 56, 216, 0.4)"
      ringBorderWidth="2px"
      messageColor="#6B5C85"
    />
  );
}
