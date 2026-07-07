'use client';

import AnalyzingScreen from '@/components/AnalyzingScreen';
import { ANALYZING_MESSAGES } from '@/constants/stock';

export default function StockAnalyzing() {
  return (
    <AnalyzingScreen
      messages={ANALYZING_MESSAGES}
      lottieColor="#7A38D8"
      messageColor="#8B95A1"
      messageLetterSpacing="-0.3px"
      repeat
    />
  );
}
