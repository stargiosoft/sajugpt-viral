'use client';

import { useRef, useState, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  onEnter?: () => void;
  accentColor?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  errorColor?: string;
}

export default function BirthInput({
  value,
  onChange,
  onComplete,
  onEnter,
  accentColor = '#8A5A2B',
  bgColor = '#FBF3E1',
  textColor = '#2B2013',
  borderColor = '#D9C79E',
  errorColor = '#B23A2E',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [isFocused, setIsFocused] = useState(false);

  const isValidDate = useCallback((dateStr: string): boolean => {
    if (dateStr.length !== 10) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, []);

  const handleChange = useCallback((raw: string) => {
    const numbers = raw.replace(/[^\d]/g, '');
    if (numbers.length > 8) return;

    let formatted = numbers;
    if (numbers.length >= 5) {
      formatted = `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}${numbers.length > 6 ? `-${numbers.slice(6, 8)}` : ''}`;
    }
    onChange(formatted);

    if (numbers.length === 8) {
      const fullDate = `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
      if (!isValidDate(fullDate)) {
        setError('생년월일을 정확하게 입력해주세요.');
      } else {
        setError(undefined);
        onComplete?.();
      }
    } else {
      setError(undefined);
    }
  }, [onChange, onComplete, isValidDate]);

  return (
    <div className="flex flex-col w-full" style={{ position: 'relative' }}>
      <div
        className="relative w-full"
        style={{
          height: '56px',
          borderRadius: '16px',
          border: error ? `1.5px solid ${errorColor}` : isFocused ? `1.5px solid ${accentColor}` : `1.5px solid ${borderColor}`,
          backgroundColor: bgColor,
          transition: 'border-color 0.2s',
        }}
      >
        <div className="flex items-center h-full" style={{ padding: '0 14px' }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onEnter?.(); } }}
            placeholder="1999.01.01"
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 outline-none bg-transparent w-full"
            style={{
              fontSize: '16px',
              lineHeight: '20px',
              letterSpacing: '-0.3px',
              color: textColor,
            }}
          />
        </div>
      </div>
      {error && (
        <p style={{ color: errorColor, fontSize: '13px', lineHeight: '20px', padding: '0 4px', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
}
