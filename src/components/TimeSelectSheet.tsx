'use client';

import { useCallback, useState } from 'react';
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
}

// 태어난 시간을 12띠시 단위로 고르는 공용 바텀시트 — 모든 테스트가 이 컴포넌트로 시간을 입력받는다.
export default function TimeSelectSheet({
  value,
  unknownTime,
  onSelect,
  accentColor = '#FF4438',
  bgColor = 'rgba(255,255,255,0.06)',
  borderColor = 'none',
  textColor = '#ffffff',
  placeholderColor = 'rgba(255,255,255,0.35)',
}: Props) {
  const [open, setOpen] = useState(false);
  const dragControls = useDragControls();

  const selected = unknownTime
    ? TIME_BLOCKS[0]
    : TIME_BLOCKS.find(b => toDisplayTime(b) === value && !b.isUnknown);

  const handlePick = useCallback((block: TimeBlock) => {
    onSelect(block.isUnknown ? '오후 12:00' : toDisplayTime(block), !!block.isUnknown);
    setOpen(false);
  }, [onSelect]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative w-full flex items-center justify-between"
        style={{
          height: '56px',
          borderRadius: '16px',
          border: borderColor,
          backgroundColor: bgColor,
          padding: '0 16px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: '-0.45px',
            color: selected ? textColor : placeholderColor,
          }}
        >
          {selected ? (selected.isUnknown ? '모름' : `${selected.label} (${selected.range})`) : '태어난 시간을 선택해 주세요'}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, position: 'relative', top: '2px' }}>
          <path d="M6 9l6 6 6-6" stroke={placeholderColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 90 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="sheet"
              className="fixed left-0 right-0 bottom-0 flex flex-col"
              style={{
                zIndex: 91,
                maxWidth: '768px',
                margin: '0 auto',
                backgroundColor: '#1E1E22',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                paddingBottom: 'env(safe-area-inset-bottom)',
                maxHeight: '78vh',
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
                className="flex justify-center"
                style={{ padding: '10px 0 2px', flexShrink: 0, cursor: 'grab', touchAction: 'none' }}
              >
                <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              </div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', textAlign: 'left', padding: '30px 20px 14px', flexShrink: 0 }}>
                태어난 시간을 선택해 주세요
              </p>
              <div className="overflow-y-auto" style={{ padding: '0 12px 12px' }}>
                {TIME_BLOCKS.map(block => {
                  const isSelected = selected?.key === block.key;
                  return (
                    <button
                      key={block.key}
                      type="button"
                      onClick={() => handlePick(block)}
                      className="w-full text-left transition-colors duration-150 hover:bg-white/10"
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: isSelected ? `${accentColor}22` : undefined,
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: block.isUnknown ? 700 : 500,
                          color: isSelected ? accentColor : '#ffffff',
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
          </>
        )}
      </AnimatePresence>
    </>
  );
}
