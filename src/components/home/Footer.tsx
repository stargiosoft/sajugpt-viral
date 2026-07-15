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
  { label: '모아모아 소개', href: '/about' },
];

const ACTION_LINKS: { label: string; href: string; variant: 'outline' | 'solid' }[] = [
  { label: '의견보내기', href: '/feedback', variant: 'outline' },
  { label: '제휴 문의', href: '/partner', variant: 'solid' },
];

const BUSINESS_INFO: [string, string][] = [
  ['법인명', '(주)스타지오소프트'],
  ['대표자', '서지현'],
  ['사업자등록번호', '827-88-01815'],
  ['통신판매업신고번호', '2024-서울영등포-2084'],
  ['소재지', '서울시 영등포구 양평로 149, 1507호'],
  ['고객문의 이메일', SUPPORT_EMAIL],
  ['고객문의 연락처', '070-8080-1495'],
];

// 홈 화면 맨 아래 푸터 — 로고+CTA로 브랜드 마무리, 구분선 아래 사업자 정보(좌)/약관(우) 2단 배치
export default function Footer() {
  return (
    <footer>
      <div
        style={{
          borderRadius: '20px',
          backgroundColor: '#F9F9F9',
          padding: '24px',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" style={{ gap: '16px' }}>
          <div className="flex items-center" style={{ gap: '6px' }}>
            <img src="/home/fire.svg" alt="" style={{ width: '28px', height: '28px' }} />
            <MoaMoaWordmark />
          </div>

          <div className="flex items-center" style={{ gap: '6px' }}>
            {ACTION_LINKS.map((link) => (
              <MotionLink
                key={link.label}
                href={link.href}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.995, backgroundColor: link.variant === 'solid' ? MOAMOA_ORANGE_DARK : '#E4E4E8' }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                className="flex items-center justify-center flex-1 sm:flex-none sm:w-[84px] transform-gpu"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '-0.2px',
                  textDecoration: 'none',
                  borderRadius: '14px',
                  padding: '9px 0',
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

        <div style={{ height: '36px' }} />

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end" style={{ gap: '18px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#555', letterSpacing: '-0.2px', marginBottom: '12px', paddingLeft: '3px' }}>
              사업자 정보
            </p>
            <div className="grid grid-cols-[auto_auto]" style={{ columnGap: '32px', rowGap: '9px', paddingLeft: '5px' }}>
              {BUSINESS_INFO.map(([label, value]) => (
                <Fragment key={label}>
                  <span
                    style={{ fontSize: '11.5px', color: '#777', fontWeight: 500, letterSpacing: '-0.1px', whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#888', letterSpacing: '-0.1px', whiteSpace: 'nowrap' }}>
                    {value}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#F0F0F2' }} className="lg:hidden" />

          <div className="flex flex-col items-center lg:items-end shrink-0" style={{ gap: '10px' }}>
            <div className="flex items-center flex-wrap justify-center lg:justify-end" style={{ gap: '10px', paddingRight: '5px' }}>
              {TEXT_LINKS.map(({ label, href }, i) => {
                const linkStyle = {
                  fontSize: '12px',
                  color: '#888',
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

            <p style={{ fontSize: '11px', color: '#999999', letterSpacing: '-0.1px', paddingRight: '2px' }}>
              © 2026 (주)스타지오소프트. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
