import type { Grade } from '@/types/battle';
import { GRADE_COLOR_MAP, getGradeLabel } from '@/constants/grades';

interface Props {
  grade: Grade;
  size?: 'sm' | 'lg';
}

export default function GradeBadge({ grade, size = 'lg' }: Props) {
  const color = GRADE_COLOR_MAP[grade];
  const isLg = size === 'lg';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isLg ? '8px 22px' : '4px 12px',
        borderRadius: '100px',
        backgroundColor: color,
        color: '#ffffff',
        fontSize: isLg ? '26px' : '13px',
        fontWeight: 800,
        letterSpacing: '1px',
      }}
    >
      {getGradeLabel(grade)}
    </span>
  );
}
