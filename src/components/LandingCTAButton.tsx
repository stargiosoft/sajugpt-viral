'use client';

import type { CSSProperties, ReactNode } from 'react';
import PressableButton from '@/components/PressableButton';

interface Props {
  onClick: () => void;
  label: ReactNode;
  background: string;
  color?: string;
  hoverBackground?: string;
  height?: string;
  boxShadow?: string;
  textStyle?: CSSProperties;
}

// 랜딩 화면 히어로 CTA("시작하기") 공용 버튼 — 하단 고정 CTA(StickyCTAButton)와 동일한
// 타이포(16px/700/-0.32px)와 프레스·호버 피드백을 쓰고, 배경색만 테스트별로 다르게 넘긴다.
// textStyle은 타이포 미세조정(굵기/아웃라인 등)이 필요한 개별 테스트를 위한 선택적 오버라이드.
export default function LandingCTAButton({ onClick, label, background, color = '#fff', hoverBackground, height = '56px', boxShadow, textStyle }: Props) {
  return (
    <PressableButton
      onClick={onClick}
      label={label}
      style={{ height }}
      bgStyle={{ background, borderRadius: '16px', boxShadow }}
      hoverBackground={hoverBackground}
      textStyle={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.32px', color, ...textStyle }}
    />
  );
}
