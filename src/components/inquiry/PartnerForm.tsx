'use client';

import { useState } from 'react';
import { InquiryInput, InquiryTextarea } from './InquiryField';

const SUPPORT_EMAIL = 'support@stargio.co.kr';

const GUIDE_PLACEHOLDER = `아래 내용을 포함해주시면 더 빠르게 확인할 수 있어요 :)

- 브랜드명:
- 제휴/광고 제안 내용:
- 희망 진행 일정:
- 예산 규모:
- 연락 가능한 연락처:`;

export default function PartnerForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const canSubmit = email.trim().length > 0 && message.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const subject = '[모아모아] 제휴 문의';
    const body = [`회신 이메일: ${email}`, '', message].join('\n');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <InquiryInput label="이메일" value={email} onChange={setEmail} placeholder="회신받을 이메일을 적어주세요." type="email" />
      <InquiryTextarea
        label="제휴 및 광고 문의"
        value={message}
        onChange={setMessage}
        placeholder={GUIDE_PLACEHOLDER}
        rows={9}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full transform-gpu transition-opacity active:opacity-80 disabled:cursor-not-allowed"
        style={{
          height: '54px',
          borderRadius: '16px',
          backgroundColor: canSubmit ? '#FF7A1A' : '#F2F2F2',
          color: canSubmit ? '#ffffff' : '#c7c7c7',
          fontSize: '15px',
          fontWeight: 600,
          letterSpacing: '-0.2px',
          marginTop: '8px',
        }}
      >
        보내기
      </button>
    </div>
  );
}
