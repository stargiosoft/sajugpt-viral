'use client';

import Link from 'next/link';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

const oneMobilePop = localFont({ src: '../../fonts/ONEMobilePOP.ttf' });

interface PolicyLayoutProps {
  title: string;
  effectiveDate?: string;
  children: ReactNode;
}

// 이용약관/개인정보처리방침/소개 등 정책·안내 문서 공용 레이아웃 — 홈 상단 네비와 톤을 맞춘 헤더 + 카드형 본문
export default function PolicyLayout({ title, effectiveDate, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ backgroundColor: '#FAFAFA' }}>
      <div
        className="sticky top-0 z-20 flex items-center w-full px-5 py-3 md:px-6 lg:px-8"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          borderBottom: '1px solid #F0F0F2',
        }}
      >
        <Link href="/" className="flex items-center" style={{ textDecoration: 'none' }}>
          <img src="/home/fire.svg" alt="" style={{ width: '26px', height: '26px', marginRight: '6px' }} />
          <span
            className={oneMobilePop.className}
            style={{ fontSize: '22px', color: '#0d0d0d', letterSpacing: '-0.55px', position: 'relative', top: '2px' }}
          >
            {'모아모아'.split('').map((char, i) => (
              <span key={i} style={{ display: 'inline-block', transform: char === '모' ? 'none' : 'rotate(-5deg)' }}>
                {char}
              </span>
            ))}
          </span>
        </Link>
      </div>

      <div className="w-full max-w-[680px] px-5 py-8 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center"
          style={{ fontSize: '12px', color: '#aaa', textDecoration: 'none', gap: '5px', marginBottom: '16px' }}
        >
          모아모아 <span aria-hidden style={{ color: '#ccc' }}>›</span> {title}
        </Link>

        <div className="flex items-center flex-wrap" style={{ gap: '10px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0d0d0d', letterSpacing: '-0.4px' }}>
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

        <div
          className="flex flex-col [&>section]:py-6 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0 [&>section:not(:last-child)]:border-b [&>section:not(:last-child)]:border-[#F0F0F2]"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #F0F0F2',
            borderRadius: '20px',
            padding: '8px 24px',
          }}
        >
          {children}
        </div>

        <div style={{ height: '60px' }} />
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
      <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '8px' }}>
        <span style={{ color: '#FF7A1A' }}>제{no}조</span>{' '}
        <span style={{ color: '#0d0d0d' }}>({title})</span>
      </h2>
      <div className="flex flex-col" style={{ gap: '6px' }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: '13.5px', color: '#555', letterSpacing: '-0.1px', lineHeight: 1.7 }}>
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
      <h2 className="flex items-center" style={{ gap: '7px', fontSize: '15px', fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.3px', marginBottom: '8px' }}>
        <span aria-hidden style={{ width: '6px', height: '6px', borderRadius: '999px', backgroundColor: '#FF7A1A', flexShrink: 0 }} />
        {title}
      </h2>
      <div className="flex flex-col" style={{ gap: '6px' }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: '13.5px', color: '#555', letterSpacing: '-0.1px', lineHeight: 1.7 }}>
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
