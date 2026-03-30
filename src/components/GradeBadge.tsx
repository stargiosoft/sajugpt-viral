import type { Grade } from '@/types/battle';

const GRADE_COLORS: Record<Grade, string> = {
  SSS: '#FFD700',
  SS: '#FF4444',
  S: '#7A38D8',
  A: '#4488FF',
  B: '#44BB44',
  CUT: '#888888',
};

interface Props {
  grade: Grade;
  size?: 'sm' | 'lg';
}

export default function GradeBadge({ grade, size = 'lg' }: Props) {
  const color = GRADE_COLORS[grade];
  const isLg = size === 'lg';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isLg ? '6px 20px' : '3px 10px',
        borderRadius: '8px',
        backgroundColor: `${color}22`,
        border: `2px solid ${color}`,
        color: color,
        fontSize: isLg ? '28px' : '14px',
        fontWeight: 800,
        letterSpacing: '2px',
      }}
    >
      {grade === 'CUT' ? '입구컷' : `${grade}등급`}
    </span>
  );
}
