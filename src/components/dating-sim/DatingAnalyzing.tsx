'use client';

import AnalyzingScreen from '@/components/AnalyzingScreen';
import type { DatingStep } from '@/types/dating';

interface Props {
  phase: DatingStep;
}

const PHASE_CONFIG: Record<string, { messages: string[] }> = {
  analyzing: {
    messages: [
      '사주 데이터를 분석하고 있습니다...',
      '도화살, 홍염살 탐지 중...',
      '궁합 좋은 캐릭터를 찾고 있어요...',
      '캐릭터별 성공률 계산 중...',
    ],
  },
  preparing: {
    messages: [
      '캐릭터가 당신의 사주를 읽고 있어요...',
      '대화 시나리오 준비 중...',
      '선택지를 만들고 있어요...',
      '호감도 기준을 설정하는 중...',
    ],
  },
  calculating: {
    messages: [
      '캐릭터가 점수를 매기고 있어요...',
      '전체 유저 등수를 계산하는 중...',
      '같은 사주 유저와 비교 중...',
      '팩폭 코멘트 작성 중...',
    ],
  },
};

export default function DatingAnalyzing({ phase }: Props) {
  const config = PHASE_CONFIG[phase] ?? PHASE_CONFIG.analyzing;

  return (
    <AnalyzingScreen
      key={phase}
      messages={config.messages}
      lottieColor="#FF4D8D"
      messageColor="#666666"
      messageLetterSpacing="-0.3px"
      repeat
    />
  );
}
