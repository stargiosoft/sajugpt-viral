'use client';

import { useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { formatKoreanTime } from '@/lib/koreanTime';

interface TimeBlock {
  key: string;
  label: string;
  range: string;
  hour: number;
  minute: number;
  isUnknown?: boolean;
}

const TIME_BLOCKS: TimeBlock[] = [
  { key: 'unknown', label: '모름', range: '', hour: 12, minute: 0, isUnknown: true },
  { key: 'yajasi', label: '야자시', range: '23:30~00:29', hour: 23, minute: 30 },
  { key: 'jasi', label: '자시', range: '00:30~01:29', hour: 0, minute: 30 },
  { key: 'chuksi', label: '축시', range: '01:30~03:29', hour: 1, minute: 30 },
  { key: 'insi', label: '인시', range: '03:30~05:29', hour: 3, minute: 30 },
  { key: 'myosi', label: '묘시', range: '05:30~07:29', hour: 5, minute: 30 },
  { key: 'jinsi', label: '진시', range: '07:30~09:29', hour: 7, minute: 30 },
  { key: 'sasi', label: '사시', range: '09:30~11:29', hour: 9, minute: 30 },
  { key: 'osi', label: '오시', range: '11:30~13:29', hour: 11, minute: 30 },
  { key: 'misi', label: '미시', range: '13:30~15:29', hour: 13, minute: 30 },
  { key: 'sinsi', label: '신시', range: '15:30~17:29', hour: 15, minute: 30 },
  { key: 'yusi', label: '유시', range: '17:30~19:29', hour: 17, minute: 30 },
  { key: 'sulsi', label: '술시', range: '19:30~21:29', hour: 19, minute: 30 },
  { key: 'haesi', label: '해시', range: '21:30~23:29', hour: 21, minute: 30 },
];

function toDisplayTime(block: TimeBlock): string {
  return formatKoreanTime(block.hour, block.minute);
}

interface Props {
  value: string;
  unknownTime: boolean;
  onSelect: (displayTime: string, isUnknown: boolean) => void;
  accentColor?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  placeholderColor?: string;
  sheetBgColor?: string;
  sheetTextColor?: string;
  dragHandleColor?: string;
  hoverBgClass?: string;
  selectedBgColor?: string;
  selectedTextColor?: string;
  fontSize?: string;
  arrowColor?: string;
  sheetTitleFontWeight?: number;
  sheetTitleFontSize?: string;
  sheetTitleTextStrokeWidth?: string;
  sheetTitleLetterSpacing?: string;
  sheetTitlePaddingBottom?: string;
  textStrokeWidth?: string;
  height?: string;
}

export default function TimeSelectSheet({
  value,
  unknownTime,
  onSelect,
  accentColor = '#FF4438',
  bgColor = 'rgba(255,255,255,0.06)',
  borderColor = 'none',
  textColor = '#ffffff',
  placeholderColor = 'rgba(255,255,255,0.35)',
  sheetBgColor = '#1E1E22',
  sheetTextColor = '#ffffff',
  dragHandleColor = 'rgba(255,255,255,0.2)',
  hoverBgClass = 'hover:bg-white/10',
  selectedBgColor = `${accentColor}22`,
  selectedTextColor = accentColor,
  fontSize = '16px',
  arrowColor = placeholderColor,
  sheetTitleFontWeight = 700,
  sheetTitleFontSize = '24px',
  sheetTitleTextStrokeWidth,
  sheetTitleLetterSpacing,
  sheetTitlePaddingBottom = '14px',
  textStrokeWidth,
  height = '56px',
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = unknownTime
    ? TIME_BLOCKS[0]
    : TIME_BLOCKS.find(b => toDisplayTime(b) === value && !b.isUnknown);

  const handlePick = useCallback((block: TimeBlock) => {
    onSelect(block.isUnknown ? '오후 12:00' : toDisplayTime(block), !!block.isUnknown);
    setOpen(false);
  }, [onSelect]);

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {/* 어두운 백드롭 배경 (투명도 60%로 뒤가 비치지 않게 확실히 가려줌) */}
          <motion.div
            key="backdrop"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />

          {/* 실제 바텀 시트 박스 */}
          <motion.div
            key="sheet"
            className="flex flex-col w-full max-w-110 md:max-w-150"
            style={{
              position: 'relative',
              backgroundColor: sheetBgColor,
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              paddingBottom: 'env(safe-area-inset-bottom)',
              maxHeight: '78vh',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.4)',
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 100 || info.velocity.y > 600) setOpen(false);
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
          >
            <div
              onPointerDown={e => dragControls.start(e)}
              style={{ flexShrink: 0, cursor: 'grab', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
            >
              <div className="flex justify-center" style={{ padding: '10px 0 2px' }}>
                <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: dragHandleColor }} />
              </div>
              <p
                style={{
                  fontSize: sheetTitleFontSize,
                  fontWeight: sheetTitleFontWeight,
                  color: sheetTextColor,
                  textAlign: 'left',
                  padding: `30px 20px ${sheetTitlePaddingBottom}`,
                  ...(sheetTitleLetterSpacing ? { letterSpacing: sheetTitleLetterSpacing } : {}),
                  ...(sheetTitleTextStrokeWidth ? { WebkitTextStroke: `${sheetTitleTextStrokeWidth} ${sheetTextColor}` } : {}),
                }}
              >
                태어난 시간을 선택해 주세요
              </p>
            </div>
            <div className="overflow-y-auto" style={{ padding: '0 12px 12px' }}>
              {TIME_BLOCKS.map(block => {
                const isSelected = selected?.key === block.key;
                return (
                  <button
                    key={block.key}
                    type="button"
                    onClick={() => handlePick(block)}
                    className={`w-full text-left transition-colors duration-150 ${hoverBgClass}`}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isSelected ? selectedBgColor : undefined,
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: isSelected ? selectedTextColor : sheetTextColor,
                        letterSpacing: '-0.3px',
                      }}
                    >
                      {block.isUnknown ? '모름' : `${block.label} (${block.range})`}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative w-full flex items-center justify-between"
        style={{
          height,
          borderRadius: '16px',
          border: borderColor,
          outline: 'none',
          backgroundColor: bgColor,
          padding: '0 16px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontSize,
            lineHeight: '20px',
            letterSpacing: '-0.45px',
            color: selected ? textColor : placeholderColor,
            ...(textStrokeWidth ? { WebkitTextStroke: `${textStrokeWidth} ${selected ? textColor : placeholderColor}` } : {}),
          }}
        >
          {selected ? (selected.isUnknown ? '모름' : `${selected.label} (${selected.range})`) : '태어난 시간을 선택해 주세요'}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, position: 'relative', top: '2px' }}>
          <path d="M6 9l6 6 6-6" stroke={arrowColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Next.js SSR 환경에서 안전하게 body로 포탈(Portal) 렌더링 */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}