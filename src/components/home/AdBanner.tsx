'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SAJUGPT_URL } from '@/constants/links';
import { MOAMOA_ORANGE } from '@/constants/theme';

const IS_PROD = process.env.NODE_ENV === 'production';
const DISMISS_KEY = 'moamoa_ad_banner_dismissed_date';

const ROTATING_TEXTS = [
  '💍 나, 언제 결혼할까?',
  '💔 연애가 잘 안 풀린다면?',
  '🤔 썸인지 착각인지 헷갈린다면?',
];
const ROTATE_INTERVAL_MS = 3000;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// 홈 상단 고정 광고 띠 배너
// 운영(배포) 환경: 닫으면 그날 하루만 숨기고 다음날 재노출 (localStorage에 닫은 날짜 기억)
// 로컬 개발 환경: 새로고침마다 항상 노출 (디자인 확인 편의를 위해 기억하지 않음)
export default function AdBanner() {
  const [dismissed, setDismissed] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!IS_PROD) {
      setDismissed(false);
      return;
    }
    setDismissed(localStorage.getItem(DISMISS_KEY) === todayKey());
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [dismissed]);

  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.div
          key="ad-banner"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => { window.open(SAJUGPT_URL, '_blank', 'noopener,noreferrer'); }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              width: '100%',
              padding: '6px clamp(16px, 8vw, 40px)',
              background: `linear-gradient(90deg, rgb(248 140 149) 0%, ${MOAMOA_ORANGE} 100%)`,
              cursor: 'pointer',
            }}
          >
            <div style={{ width: 'clamp(140px, 52vw, 234px)', textAlign: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={textIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{ display: 'inline-block', fontSize: '14px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.2px' }}
                >
                  {ROTATING_TEXTS[textIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <motion.span
              whileHover={{ backgroundColor: '#ffe3e6' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: MOAMOA_ORANGE,
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '4px 11px 4px 10px',
                whiteSpace: 'nowrap',
              }}
            >
              지금 시작하기
            </motion.span>
            <button
              type="button"
              aria-label="배너 닫기"
              onClick={(e) => {
                e.stopPropagation();
                if (IS_PROD) {
                  localStorage.setItem(DISMISS_KEY, todayKey());
                }
                setDismissed(true);
              }}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
