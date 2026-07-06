'use client';

import AnalyzingScreen from '@/components/AnalyzingScreen';

export default function NightAnalyzing() {
  return (
    <AnalyzingScreen
      wrapWithMotion
      messages={[
        '사주 원국 펼치는 중...',
        '도화살·홍염살 감지 중...',
        '은밀한 체질 분석 중...',
        '시종 3명 소집 중...',
      ]}
      emoji="🌙"
      ringColor="#7A38D8"
      ringBorderWidth="2px"
      messageColor="#8b7aaa"
      messageFontSize="14px"
      minHeight="100dvh"
      heading="밤의 장막이 내려오는 중..."
      headingColor="#f0e6ff"
      staggerDelay={0.7}
    />
  );
}
