'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface PolicyLayoutProps {
  title: string;
  description?: string;
  effectiveDate?: string;
  children: ReactNode;
}

// 이용약관/개인정보처리방침/소개/문의 폼 등 공용 레이아웃 — 홈 상단 네비와 톤을 맞춘 헤더 + 카드형 본문
export default function PolicyLayout({ title, description, effectiveDate, children }: PolicyLayoutProps) {
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
    <div className="fixed inset-0 flex justify-center" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="w-full max-w-[680px] h-full flex flex-col">
        <div className="flex-1 overflow-auto w-full">
          <div className="sticky top-0 z-20 flex items-center px-3 py-2 md:px-8" style={{ backgroundColor: '#FAFAFA' }}>
            <button
              type="button"
              onClick={handleBack}
              onMouseEnter={() => setBackHovered(true)}
              onMouseLeave={() => { setBackHovered(false); setBackPressed(false); }}
              onMouseDown={() => setBackPressed(true)}
              onMouseUp={() => setBackPressed(false)}
              aria-label="뒤로가기"
              className="flex items-center justify-center"
              style={{
                width: '38px',
                height: '38px',
                marginLeft: '-4px',
                borderRadius: '999px',
                backgroundColor: backHovered ? '#FFF1E6' : 'transparent',
                color: backHovered ? '#FF7A1A' : '#0d0d0d',
                transform: backPressed ? 'scale(0.9)' : 'scale(1)',
                transition: 'background-color 0.15s, color 0.15s, transform 0.1s',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="w-full px-3 py-8 md:px-8">
            <div className="flex items-center flex-wrap" style={{ gap: '10px', marginBottom: description ? '10px' : '28px', paddingLeft: '4px' }}>
              <h1 style={{ fontSize: '25px', fontWeight: 800, color: '#0d0d0d', letterSpacing: '-0.4px' }}>
                {title}
              </h1>
              {effectiveDate && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#FF7A1A',
                    backgroundColor: '#FFF1E6',
                    padding: '5px 11px',
                    borderRadius: '999px',
                    letterSpacing: '-0.1px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  시행일 {effectiveDate}
                </span>
              )}
            </div>

            {description && (
              <p style={{ fontSize: '14px', color: '#8a8a8a', letterSpacing: '-0.1px', marginBottom: '28px', paddingLeft: '5px' }}>
                {description}
              </p>
            )}

            <div
              className="flex flex-col [&>section]:py-7 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0 [&>section:not(:last-child)]:border-b [&>section:not(:last-child)]:border-border-light"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #F0F0F2',
                borderRadius: '20px',
                padding: '20px 26px',
              }}
            >
              {children}
            </div>

            <div style={{ height: '60px' }} />
          </div>
        </div>
      </div>
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
        <span style={{ color: '#FF7A1A' }}>제{no}조</span>{' '}
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
  paragraphs: string[];
}

// 소개 페이지 등 조항 번호 없이 제목+본문만 필요한 섹션 렌더링
export function InfoSection({ title, paragraphs }: InfoSectionProps) {
  return (
    <section>
      <h2 className="flex items-center" style={{ gap: '8px', fontSize: '16.5px', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.3px', marginBottom: '11px' }}>
        <span aria-hidden style={{ width: '6px', height: '6px', borderRadius: '999px', backgroundColor: '#FF7A1A', flexShrink: 0 }} />
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
