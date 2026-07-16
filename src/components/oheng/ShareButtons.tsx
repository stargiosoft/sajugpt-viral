'use client';

import { useState } from 'react';

export default function ShareButtons({ shareText }: { shareText: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '내 오행 처방전', text: shareText, url });
      } catch {
        // 사용자 취소 등은 무시
      }
    } else {
      handleCopy();
    }
  };

  const handleX = () => {
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(intent, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard 실패는 조용히 무시
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
      <IconCircle onClick={handleNativeShare} label="공유">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 12a8 8 0 1016 0 8 8 0 00-16 0z" stroke="#2B2013" strokeWidth="1.6" />
          <path d="M8 13l3 3 5-6" stroke="#2B2013" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconCircle>
      <IconCircle onClick={handleX} label="X 공유">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18.3 3H21l-6.7 7.6L22 21h-6.1l-4.8-6.3L5.6 21H3l7.1-8.1L2 3h6.2l4.4 5.8L18.3 3z" fill="#2B2013" />
        </svg>
      </IconCircle>
      <IconCircle onClick={handleCopy} label="링크 복사">
        {copied ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#2B2013" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M10 14a4 4 0 005.66 0l2.83-2.83a4 4 0 10-5.66-5.66l-1.06 1.06" stroke="#2B2013" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M14 10a4 4 0 00-5.66 0L5.5 12.83a4 4 0 105.66 5.66l1.06-1.06" stroke="#2B2013" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </IconCircle>
    </div>
  );
}

function IconCircle({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#FBF3E1',
        border: '1.5px solid #2B2013',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
