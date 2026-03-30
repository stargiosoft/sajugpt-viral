'use client';

import { useRef, useState, useCallback } from 'react';

interface Props {
  value: string;           // "오후 02:30" 또는 숫자 중간 입력
  onChange: (value: string) => void;
  unknownTime: boolean;
  onUnknownTimeToggle: () => void;
}

export default function BirthTimeInput({ value, onChange, unknownTime, onUnknownTimeToggle }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();

  const handleChange = useCallback((raw: string) => {
    // 이미 포맷된 값("오전/오후")이 들어오면 리셋
    if (raw.includes('오전') || raw.includes('오후')) {
      onChange('');
      return;
    }
    const numbers = raw.replace(/[^\d]/g, '');
    if (numbers.length > 4) return;
    onChange(numbers);

    if (numbers.length === 4) {
      const hour = Number(numbers.slice(0, 2));
      const minute = numbers.slice(2, 4);
      if (hour >= 0 && hour <= 23 && Number(minute) >= 0 && Number(minute) <= 59) {
        const period = hour < 12 ? '오전' : '오후';
        const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
        onChange(`${period} ${String(displayHour).padStart(2, '0')}:${minute}`);
        setError(undefined);
      } else {
        setError('태어난 시를 정확하게 입력해주세요.');
      }
    } else {
      setError(undefined);
    }
  }, [onChange]);

  const hasValidTime = value.includes('오전') || value.includes('오후');

  return (
    <div className="flex gap-6 items-start w-full">
      {/* 시간 입력 */}
      <div className="flex-1 flex flex-col gap-1">
        <div
          className="relative w-full"
          style={{
            height: '48px',
            borderRadius: '12px',
            border: unknownTime
              ? '1.5px solid #e7e7e7'
              : error
                ? '1.5px solid #FF0000'
                : hasValidTime
                  ? '1.5px solid #7A38D8'
                  : '1.5px solid #e7e7e7',
            backgroundColor: unknownTime ? '#f5f5f5' : '#fff',
            transition: 'border-color 0.2s, background-color 0.2s',
          }}
        >
          <div className="flex items-center h-full" style={{ padding: '0 12px' }}>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={value}
              onChange={e => handleChange(e.target.value)}
              placeholder="예: 21:00"
              disabled={unknownTime}
              autoComplete="off"
              className="flex-1 outline-none bg-transparent w-full"
              style={{
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '-0.45px',
                color: unknownTime ? '#b7b7b7' : '#151515',
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

      {/* 모르겠어요 토글 */}
      <div
        onClick={onUnknownTimeToggle}
        className="flex gap-1 items-center shrink-0 cursor-pointer"
        style={{ paddingTop: '12px' }}
      >
        <p style={{ fontSize: '15px', lineHeight: '20px', letterSpacing: '-0.45px', color: '#525252', whiteSpace: 'nowrap' }}>
          모르겠어요
        </p>
        <div className="flex items-center justify-center" style={{ width: '44px', height: '44px' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: unknownTime ? '#7A38D8' : '#fff',
              border: unknownTime ? 'none' : '1px solid #e7e7e7',
              transition: 'background-color 0.2s',
            }}
          >
            {unknownTime && (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M7 11.625L10.3294 16L17 9" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
