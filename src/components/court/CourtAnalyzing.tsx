'use client';

import AnalyzingScreen from '@/components/AnalyzingScreen';
import { ANALYZING_MESSAGES } from '@/constants/court';

export default function CourtAnalyzing() {
  return (
    <AnalyzingScreen
      messages={ANALYZING_MESSAGES}
      lottieColor="#7A38D8"
      messageColor="#6B5C85"
      repeat
    />
  );
}
