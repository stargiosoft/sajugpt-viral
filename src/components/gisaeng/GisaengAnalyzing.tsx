'use client';

import AnalyzingScreen from '@/components/AnalyzingScreen';
import { ANALYZING_MESSAGES, CALCULATING_MESSAGES } from '@/constants/gisaeng';

interface Props {
  type: 'analyzing' | 'calculating';
}

export default function GisaengAnalyzing({ type }: Props) {
  const messages = type === 'analyzing' ? ANALYZING_MESSAGES : CALCULATING_MESSAGES;

  return (
    <AnalyzingScreen
      key={type}
      messages={messages.map(m => m.text)}
      staggerDelay={0.8}
      lottieColor="#B8423A"
      messageColor="#6B5F56"
      minHeight="100dvh"
      repeat
    />
  );
}
