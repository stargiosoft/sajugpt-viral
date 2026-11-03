'use client';

export type CalendarType = 'solar' | 'lunar';

interface Props {
  value: CalendarType;
  onChange: (value: CalendarType) => void;
  accentColor: string;
  textColor: string;
  bgColor?: string;
}

const OPTIONS: { value: CalendarType; label: string }[] = [
  { value: 'solar', label: '양력' },
  { value: 'lunar', label: '음력' },
];

// 양력 / 음력 선택 (생년월일 입력 공통)
export default function CalendarToggle({ value, onChange, accentColor, textColor, bgColor = '#f7f7f7' }: Props) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            style={{
              flex: 1,
              height: '44px',
              borderRadius: '12px',
              border: 'none',
              background: selected ? accentColor : bgColor,
              color: selected ? '#ffffff' : textColor,
              fontSize: '15px',
              fontWeight: selected ? 700 : 500,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
