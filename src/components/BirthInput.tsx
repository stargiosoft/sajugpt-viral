'use client';

import { useRef, useState, useCallback } from 'react';

interface Props {
  value: string;           // "YYYY-MM-DD" 또는 중간 입력 상태
  onChange: (value: string) => void;
  onComplete?: () => void; // 8자리 완성 시 다음 필드로 포커스
  onEnter?: () => void;    // 엔터 키 시 폼 제출
  accentColor?: string;
}

export default function BirthInput({ value, onChange, onComplete, onEnter, accentColor = '#7A38D8' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

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

  const valid = isValidDate(value);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className="relative w-full"
        style={{
          height: '56px',
          borderRadius: '16px',
          border: error ? '1.5px solid #FF0000' : valid ? `1.5px solid ${accentColor}` : '1.5px solid #e7e7e7',
          backgroundColor: '#fff',
          transition: 'border-color 0.2s',
        }}
      >
        <div className="flex items-center h-full" style={{ padding: '0 12px' }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={valid ? `${value} (양력)` : value}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onEnter?.(); } }}
            placeholder="예: 1992-07-15"
            autoComplete="off"
            autoFocus
            onFocus={() => {
              if (valid && inputRef.current) {
                inputRef.current.value = value;
              }
            }}
            className="flex-1 outline-none bg-transparent w-full"
            style={{
              fontSize: '16px',
              lineHeight: '20px',
              letterSpacing: '-0.45px',
              color: '#151515',
            }}
          />
        </div>
      </div>
      {error && (
        <div className="flex gap-1 items-center" style={{ padding: '0 4px' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8 11C7.72 11 7.5 10.78 7.5 10.5V8C7.5 7.72 7.72 7.5 8 7.5C8.28 7.5 8.5 7.72 8.5 8V10.5C8.5 10.78 8.28 11 8 11ZM8.5 6.5H7.5V5.5H8.5V6.5Z" fill="#FA5B4A" />
          </svg>
          <p style={{ color: '#fa5b4a', fontSize: '13px', lineHeight: '22px' }}>{error}</p>
        </div>
      )}
    </div>
  );
}
