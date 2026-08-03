'use client';

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  color: string;
  fontSize?: string;
  marginBottom?: string;
}

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
