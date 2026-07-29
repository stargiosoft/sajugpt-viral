'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MoaMoaWordmark from '@/components/MoaMoaWordmark';
import { MOAMOA_ORANGE, MOAMOA_ORANGE_DARK } from '@/constants/theme';

const MotionLink = motion.create(Link);

const SUPPORT_EMAIL = 'support@stargio.co.kr';

const TEXT_LINKS: { label: string; href?: string }[] = [
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '광필연구소 소개', href: '/about' },
];

const ACTION_LINKS: { label: string; href: string; variant: 'outline' | 'solid' }[] = [
  { label: '의견보내기', href: '/feedback', variant: 'outline' },
  { label: '제휴 문의', href: '/partner', variant: 'solid' },
];

const BUSINESS_INFO: { label: string; value: string; href?: string }[] = [
  { label: '법인명', value: '(주)스타지오소프트' },
  { label: '대표자', value: '서지현' },
  { label: '사업자등록번호', value: '827-88-01815' },
  { label: '통신판매업신고번호', value: '2024-서울영등포-2084' },
  { label: '소재지', value: '서울시 영등포구 양평로 149, 1507호' },
  { label: '고객문의 이메일', value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
  { label: '고객문의 연락처', value: '070-8080-1495', href: 'tel:070-8080-1495' },
];

// 홈 화면 맨 아래 푸터 — 로고+CTA로 브랜드 마무리, 구분선 아래 사업자 정보(좌)/약관(우) 2단 배치
export default function Footer() {
  return (
    <footer>
      <div
        style={{
          borderRadius: '20px',
          backgroundColor: '#F4F4F5',
          padding: '24px',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" style={{ gap: '24px' }}>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <img src="/home/symbol.svg" alt="" style={{ width: '20px', height: '20px', position: 'relative', top: '2px' }} />
            <MoaMoaWordmark top="3px" />
          </div>

          <div className="flex items-center" style={{ gap: '6px' }}>
            {ACTION_LINKS.map((link) => (
              <MotionLink
                key={link.label}
                href={link.href}
                whileHover={link.variant === 'solid' ? { opacity: 0.9 } : { backgroundColor: '#EAEAEC' }}
                whileTap={{ scale: 0.995, backgroundColor: link.variant === 'solid' ? MOAMOA_ORANGE_DARK : '#E4E4E8' }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                className="flex items-center justify-center flex-1 sm:flex-none sm:w-[84px] transform-gpu"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '-0.2px',
                  textDecoration: 'none',
                  borderRadius: '14px',
                  padding: '11px 0',
                  ...(link.variant === 'solid'
                    ? { color: '#ffffff', backgroundColor: MOAMOA_ORANGE }
                    : { color: '#777', backgroundColor: 'transparent', border: '1px solid #D9D9DC' }),
                }}
              >
                {link.label}
              </MotionLink>
            ))}
          </div>
        </div>

        <div style={{ height: '24px' }} />

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end" style={{ gap: '18px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#555', letterSpacing: '-0.2px', marginBottom: '12px', paddingLeft: '3px' }}>
              사업자 정보
            </p>
            <div className="grid grid-cols-[auto_auto]" style={{ columnGap: '32px', rowGap: '9px', paddingLeft: '5px' }}>
              {BUSINESS_INFO.map(({ label, value, href }) => {
                const valueStyle = { fontSize: '11.5px', color: '#777', fontWeight: 600, letterSpacing: '-0.1px', whiteSpace: 'nowrap' } as const;
                return (
                  <Fragment key={label}>
                    <span
                      style={{ fontSize: '11.5px', color: '#666', fontWeight: 700, letterSpacing: '-0.1px', whiteSpace: 'nowrap' }}
                    >
                      {label}
                    </span>
                    {href ? (
                      <a href={href} style={{ ...valueStyle, textDecoration: 'none' }}>
                        {value}
                      </a>
                    ) : (
                      <span style={valueStyle}>{value}</span>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#E4E4E7' }} className="lg:hidden" />

          <div className="flex flex-col items-center lg:items-end shrink-0" style={{ gap: '10px' }}>
            <div className="flex items-center flex-wrap justify-center lg:justify-end" style={{ gap: '10px', paddingRight: '5px' }}>
              {TEXT_LINKS.map(({ label, href }, i) => {
                const linkStyle = {
                  fontSize: '12px',
                  color: '#777',
                  fontWeight: 600,
                  letterSpacing: '-0.2px',
                  padding: '4px 6px',
                  margin: '-4px -6px',
                  borderRadius: '8px',
                } as const;

                return (
                  <span key={label} className="flex items-center" style={{ gap: '10px' }}>
                    {i > 0 && <span aria-hidden style={{ width: '1.5px', height: '5px', backgroundColor: '#ddd' }} />}
                    {href ? (
                      <Link
                        href={href}
                        className="cursor-pointer transition-colors hover:bg-[#EFEFF2] active:bg-[#E4E4E8]"
                        style={{ ...linkStyle, textDecoration: 'none' }}
                      >
                        {label}
                      </Link>
                    ) : (
                      <span
                        className="cursor-pointer transition-colors hover:bg-[#EFEFF2] active:bg-[#E4E4E8]"
                        style={linkStyle}
                      >
                        {label}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>

            <p style={{ fontSize: '10px', color: 'rgb(164 164 164)', fontWeight: 600, letterSpacing: '-0.1px', paddingRight: '2px' }}>
              © 2026 (주)스타지오소프트. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
