'use client';

import { useEffect, useRef, useState } from 'react';

const labelStyle = { fontSize: '14px', fontWeight: 600, color: '#0d0d0d', letterSpacing: '-0.2px' } as const;

function fieldBorder(focused: boolean) {
  return focused ? '1px solid #FF7A1A' : '1px solid #e7e7e7';
}

interface InquiryInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function InquiryInput({ label, value, onChange, placeholder, type = 'text' }: InquiryInputProps) {
  const [focused, setFocused] = useState(false);
  const isEmail = type === 'email';

  return (
    <div className="flex flex-col" style={{ gap: '8px' }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        inputMode={isEmail ? 'email' : undefined}
        autoComplete={isEmail ? 'email' : undefined}
        autoCapitalize={isEmail ? 'none' : undefined}
        autoCorrect={isEmail ? 'off' : undefined}
        spellCheck={isEmail ? false : undefined}
        className="w-full outline-none"
        style={{
          fontSize: '14.5px',
          color: '#151515',
          letterSpacing: '-0.2px',
          border: fieldBorder(focused),
          borderRadius: '14px',
          padding: '14px 16px',
          backgroundColor: '#fff',
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  );
}

interface InquiryTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const TEXTAREA_MIN_HEIGHT = 120;

export function InquiryTextarea({ label, value, onChange, placeholder, rows = 6 }: InquiryTextareaProps) {
  const [focused, setFocused] = useState(false);
  const [height, setHeight] = useState<number>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 네이티브 리사이즈 그립은 색/두께를 스타일링할 수 없어 resize: none 처리하고
  // 커스텀 아이콘 + 드래그 핸들러로 직접 구현
  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = textareaRef.current?.offsetHeight ?? TEXTAREA_MIN_HEIGHT;

    const handleMove = (moveEvent: PointerEvent) => {
      const next = Math.max(TEXTAREA_MIN_HEIGHT, startHeight + (moveEvent.clientY - startY));
      setHeight(next);
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  return (
    <div className="flex flex-col" style={{ gap: '8px' }}>
      <label style={labelStyle}>{label}</label>
      <div className="relative w-full" style={{ borderRadius: '14px', overflow: 'hidden' }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={rows}
          className="w-full outline-none"
          style={{
            fontSize: '14.5px',
            color: '#151515',
            letterSpacing: '-0.2px',
            lineHeight: 1.6,
            border: fieldBorder(focused),
            borderRadius: '14px',
            padding: '14px 16px',
            backgroundColor: '#fff',
            transition: 'border-color 0.15s',
            resize: 'none',
            height: height ? `${height}px` : undefined,
            minHeight: `${TEXTAREA_MIN_HEIGHT}px`,
          }}
        />
        <div
          onPointerDown={handleResizeStart}
          className="absolute"
          style={{ right: '0px', bottom: '6px', width: '16px', height: '16px', cursor: 'ns-resize', touchAction: 'none' }}
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path d="M12 2L2 12" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M12 6.5L6.5 12" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface InquirySelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

// 네이티브 select 대신 직접 그린 리스트 — OS 기본 드롭다운 스타일이 아닌 브랜드 톤(오렌지 호버)을 적용하기 위함
export function InquirySelect({ label, value, options, onChange }: InquirySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="flex flex-col" style={{ gap: '8px' }} ref={rootRef}>
      <label style={labelStyle}>{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between outline-none"
          style={{
            fontSize: '14.5px',
            color: '#151515',
            letterSpacing: '-0.2px',
            border: fieldBorder(open),
            borderRadius: '14px',
            padding: '14px 16px',
            backgroundColor: '#fff',
            transition: 'border-color 0.15s',
          }}
        >
          {value}
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ position: 'relative', top: '2px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
          >
            <path d="M6 9l6 6 6-6" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-10 overflow-hidden"
            style={{
              top: 'calc(100% + 6px)',
              backgroundColor: '#fff',
              border: '1px solid #e7e7e7',
              borderRadius: '14px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              padding: '6px',
            }}
          >
            {options.map((option) => {
              const selected = option === value;
              return (
                <li
                  key={option}
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between cursor-pointer transition-colors"
                  style={{
                    fontSize: '14.5px',
                    letterSpacing: '-0.2px',
                    color: selected ? '#FF7A1A' : '#151515',
                    fontWeight: selected ? 700 : 400,
                    borderRadius: '10px',
                    padding: '11px 12px',
                    backgroundColor: selected ? '#FFF1E6' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) e.currentTarget.style.backgroundColor = '#FFF1E6';
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {option}
                  {selected && (
                    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#FF7A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
