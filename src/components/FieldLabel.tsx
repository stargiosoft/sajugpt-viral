'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  color: string;
  fontSize?: string;
  marginBottom?: string;
}

// 입력 필드 상단 라벨("성별", "생년월일", "태어난 시간" 등) 공용 컴포넌트 —
// 타이포는 고정, 색상만 테스트별로 다르게 넘긴다.
export default function FieldLabel({ children, color, fontSize = '12px', marginBottom = '8px' }: Props) {
  return (
    <p
      style={{
        fontSize,
        fontWeight: 400,
        color,
        lineHeight: '16px',
        letterSpacing: '-0.24px',
        padding: '0 4px',
        marginBottom,
      }}
    >
      {children}
    </p>
  );
}
