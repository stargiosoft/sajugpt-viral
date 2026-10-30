'use client';

import Link from 'next/link';
import MoaMoaWordmark from '@/components/MoaMoaWordmark';
import SajuGptLogoButton from '@/components/SajuGptLogoButton';
import { SAJUGPT_URL } from '@/constants/links';

const SUPPORT_EMAIL = 'support@stargio.co.kr';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

// 서비스 링크 / 약관 링크 두 묶음 — 좁은 화면에서는 묶음 단위로 줄바꿈되어 3개씩 두 줄이 된다
const LINK_GROUPS: FooterLink[][] = [
  [
    { label: '사주GPT', href: SAJUGPT_URL, external: true },
    { label: '의견보내기', href: '/feedback' },
    { label: '제휴 문의', href: '/partner' },
  ],
  [
    { label: '이용약관', href: '/terms' },
    { label: '개인정보처리방침', href: '/privacy' },
    { label: '광필연구소 소개', href: '/about' },
  ],
];

interface InfoItem {
  label: string;
  value: string;
  href?: string;
}

// 두 줄로 의미 단위를 나눈다 — 위: 사업자 식별 정보 / 아래: 소재지·고객 문의 (한 줄에 억지로 이어 붙이지 않아 고아 줄이 생기지 않는다)
const BUSINESS_INFO_LINES: InfoItem[][] = [
  [
    { label: '법인명', value: '(주)스타지오소프트' },
    { label: '대표자', value: '서지현' },
    { label: '사업자등록번호', value: '827-88-01815' },
    { label: '통신판매업신고번호', value: '2024-서울영등포-2084' },
  ],
  [
    { label: '소재지', value: '서울시 영등포구 양평로 149, 1507호' },
    { label: '고객문의 이메일', value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
    { label: '고객문의 연락처', value: '070-8080-1495', href: 'tel:070-8080-1495' },
  ],
];

// 홈 화면 맨 아래 푸터 — 전부 왼쪽 정렬 한 단으로: 로고 → 링크(두 묶음) → 사업자 정보 문단 → 저작권
export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #EDEDF0', paddingTop: '28px' }}>
      <div className="flex items-center" style={{ gap: '6px' }}>
        <img src="/home/symbol.svg" alt="" style={{ width: '19px', height: '19px', display: 'block', transform: 'translateY(-0.5px)' }} />
        <MoaMoaWordmark fontSize="17px" />
        <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1, color: '#0d0d0d' }}>x</span>
        <SajuGptLogoButton height="19px" width="53px" color="#0d0d0d" />
      </div>

      <nav className="flex flex-wrap" style={{ columnGap: '14px', rowGap: '6px', marginTop: '20px' }}>
        {LINK_GROUPS.map((group) => (
          <div key={group[0].label} className="flex" style={{ columnGap: '14px' }}>
            {group.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="transition-colors hover:text-[#0d0d0d]"
                style={{ fontSize: '12px', color: '#52525B', fontWeight: 600, letterSpacing: '-0.2px', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ marginTop: '16px', fontSize: '11px', lineHeight: 1.7, letterSpacing: '-0.1px', color: '#7C7C83', fontWeight: 500 }}>
        {BUSINESS_INFO_LINES.map((line) => (
          <p key={line[0].label} className="flex flex-wrap" style={{ columnGap: '12px' }}>
            {line.map(({ label, value, href }) => (
              <span key={label} style={{ whiteSpace: 'nowrap' }}>
                {label}{' '}
                {href ? <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{value}</a> : value}
              </span>
            ))}
          </p>
        ))}
      </div>

      <p style={{ marginTop: '6px', fontSize: '10px', color: '#94949A', fontWeight: 500, letterSpacing: '-0.1px' }}>
        © 2026 (주)스타지오소프트. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}
