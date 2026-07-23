'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  message: string | null;
  paddingY?: string;
}

// 화면 하단 고정 토스트 — 링크 복사 등 짧은 성공 피드백용 공용 컴포넌트
export default function Toast({ message, paddingY = '12px' }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed left-1/2 -translate-x-1/2 z-50"
          style={{ bottom: 'calc(24px + env(safe-area-inset-bottom))' }}
        >
          <div
            style={{
              backgroundColor: 'rgba(20,20,20,0.92)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              padding: `${paddingY} 20px`,
              borderRadius: '12px',
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
