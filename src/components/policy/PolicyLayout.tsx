'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { MOAMOA_ORANGE } from '@/constants/theme';

interface PolicyLayoutProps {
  title: string;
  effectiveDate?: string;
  children: ReactNode;
}

// 이용약관/개인정보처리방침/소개/문의 폼 등 공용 레이아웃 — 홈(흰 배경, 블랙 메인 컬러, 12px 라운딩)과 톤을 맞춘 헤더(뒤로가기 + 가운데 타이틀) + 카드형 본문
export default function PolicyLayout({ title, effectiveDate, children }: PolicyLayoutProps) {
  const router = useRouter();
  const [backHovered, setBackHovered] = useState(false);
  const [backPressed, setBackPressed] = useState(false);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center" style={{ backgroundColor: '#ffffff' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="w-full max-w-[680px] h-full flex flex-col"
      >
        <div className="flex-1 overflow-auto w-full">
          <div
            className="sticky top-0 z-20 px-3 py-2 md:px-8"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
            }}
          >
            <div className="relative flex items-center justify-center" style={{ minHeight: '40px', padding: '0 48px' }}>
            <button
              type="button"
              onClick={handleBack}
              onMouseEnter={() => setBackHovered(true)}
              onMouseLeave={() => { setBackHovered(false); setBackPressed(false); }}
              onMouseDown={() => setBackPressed(true)}
              onMouseUp={() => setBackPressed(false)}
              aria-label="뒤로가기"
              className="absolute left-0 flex items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                marginLeft: '-4px',
                borderRadius: '12px',
                backgroundColor: backHovered ? '#F4F4F5' : 'transparent',
                color: '#0d0d0d',
                transform: backPressed ? 'scale(0.9)' : 'scale(1)',
                transition: 'background-color 0.15s, color 0.15s, transform 0.1s',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ transform: 'translateX(-1px)' }}>
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="truncate" style={{ fontSize: '17px', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.3px' }}>
              {title}
            </h1>
            </div>
          </div>

          <div className="w-full px-3 pt-4 pb-8 md:px-8">
            {effectiveDate && (
              <p style={{ fontSize: '12px', color: '#66666C', letterSpacing: '-0.1px', textAlign: 'center', marginBottom: '14px' }}>
                시행일 {effectiveDate}
              </p>
            )}

            <div
              className="flex flex-col [&>section]:py-7 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0 [&>section:not(:last-child)]:border-b [&>section:not(:last-child)]:border-border-light"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #E5E5E9',
                borderRadius: '12px',
                padding: '20px 26px',
              }}
            >
              {children}
            </div>

            <div style={{ height: '60px' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface PolicyArticleProps {
  no: number;
  title: string;
  paragraphs: string[];
}

// 정책 문서 내 개별 조항(제n조) 렌더링
export function PolicyArticle({ no, title, paragraphs }: PolicyArticleProps) {
  return (
    <section>
      <h2 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '11px' }}>
        <span style={{ color: MOAMOA_ORANGE }}>제{no}조</span>{' '}
        <span style={{ color: '#0d0d0d' }}>({title})</span>
      </h2>
      <div className="flex flex-col" style={{ gap: '9px' }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: '14.5px', color: '#4d4d4d', letterSpacing: '-0.1px', lineHeight: 1.8 }}>
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

interface InfoSectionProps {
  title: string;
  paragraphs: ReactNode[];
}

// 소개 페이지 등 조항 번호 없이 제목+본문만 필요한 섹션 렌더링
export function InfoSection({ title, paragraphs }: InfoSectionProps) {
  return (
    <section>
      <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.3px', marginBottom: '11px' }}>
        {title}
      </h2>
      <div className="flex flex-col" style={{ gap: '10px' }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: '14.5px', color: '#4d4d4d', letterSpacing: '-0.1px', lineHeight: 1.85 }}>
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
