'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  onKakao: () => void;
  onX: () => void;
  onFacebook: () => void;
  onCopy: () => void;
  copied: boolean;
}

// 640px 미만은 모바일 바텀시트, 그 이상은 데스크톱 중앙 모달로 전환
function useIsDesktopViewport(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

// Web Share API 미지원 브라우저용 폴백 공유 UI — 카카오/X/Facebook/링크복사.
// 모바일 폭에서는 바텀시트, 데스크톱 폭에서는 중앙 모달로 렌더링된다.
export default function ShareModal({ open, onClose, onKakao, onX, onFacebook, onCopy, copied }: Props) {
  const isDesktop = useIsDesktopViewport();

  const options = [
    { key: 'kakao', label: '카카오톡', emoji: '💬', onClick: onKakao, bg: '#FEE500', color: '#191919' },
    { key: 'x', label: 'X', emoji: '𝕏', onClick: onX, bg: '#000000', color: '#ffffff' },
    { key: 'facebook', label: 'Facebook', emoji: 'f', onClick: onFacebook, bg: '#1877F2', color: '#ffffff' },
    { key: 'copy', label: copied ? '복사됨!' : '링크 복사', emoji: '🔗', onClick: onCopy, bg: 'rgba(255,255,255,0.08)', color: '#ffffff' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="panel"
            className={isDesktop ? 'fixed left-1/2 top-1/2 z-50 w-full' : 'fixed left-0 right-0 bottom-0 z-50'}
            style={
              isDesktop
                ? {
                    maxWidth: '360px',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '24px',
                    backgroundColor: '#1E1E22',
                    paddingTop: '24px',
                    paddingRight: '24px',
                    paddingBottom: '24px',
                    paddingLeft: '24px',
                  }
                : {
                    maxWidth: '768px',
                    margin: '0 auto',
                    borderRadius: '24px 24px 0 0',
                    backgroundColor: '#1E1E22',
                    paddingTop: '24px',
                    paddingRight: '24px',
                    paddingLeft: '24px',
                    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
                  }
            }
            initial={isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }}
            animate={isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }}
            transition={isDesktop ? { duration: 0.15 } : { type: 'spring', damping: 32, stiffness: 320 }}
          >
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
              공유하기
            </p>
            <div className="grid grid-cols-4" style={{ gap: '12px' }}>
              {options.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={opt.onClick}
                  className="flex flex-col items-center transform-gpu"
                  style={{ gap: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: opt.bg,
                      color: opt.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 700,
                    }}
                  >
                    {opt.emoji}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
