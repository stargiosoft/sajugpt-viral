'use client';

import { useState } from 'react';
import { InquiryInput, InquiryTextarea, InquirySubmitButton, sendInquiryMail, useEmailField } from './InquiryField';

const GUIDE_PLACEHOLDER = `아래 내용을 포함해주시면 더 빠르게 확인할 수 있어요 :)

- 브랜드명:
- 제휴/광고 제안 내용:
- 희망 진행 일정:
- 예산 규모:
- 연락 가능한 연락처:`;

export default function PartnerForm() {
  const email = useEmailField();
  const [message, setMessage] = useState('');

  const canSubmit = email.isValid && message.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    sendInquiryMail('[광필연구소] 제휴 문의', [`회신 이메일: ${email.value}`, '', message]);
  };

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <InquiryInput
        label="이메일"
        value={email.value}
        onChange={email.onChange}
        onBlur={email.onBlur}
        placeholder="회신받을 이메일을 적어주세요."
        type="email"
        error={email.error}
      />
      <InquiryTextarea
        label="제휴 및 광고 문의"
        value={message}
        onChange={setMessage}
        placeholder={GUIDE_PLACEHOLDER}
        rows={9}
      />
      <InquirySubmitButton canSubmit={canSubmit} onClick={handleSubmit} />
    </div>
  );
}
