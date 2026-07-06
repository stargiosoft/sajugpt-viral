'use client';

import AnalyzingScreen from '@/components/AnalyzingScreen';
import { ANALYZING_MESSAGES } from '@/constants/autopsy';

interface Props {
  coronerName: string;
}

export default function AnalyzingAutopsy({ coronerName }: Props) {
  const messages = ANALYZING_MESSAGES.map((msg) =>
    msg.replace('검시관', `검시관 ${coronerName}`)
  );

  return (
    <AnalyzingScreen
      messages={messages}
      emoji="🔬"
      ringColor="#7A38D8"
      staggerDelay={0.5}
    />
  );
}
