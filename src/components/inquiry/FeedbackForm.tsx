'use client';

import { useState } from 'react';
import { InquiryInput, InquirySelect, InquiryTextarea, InquirySubmitButton, sendInquiryMail, useEmailField } from './InquiryField';

const CATEGORIES = ['이런 테스트 있으면 좋겠어요', '버그를 발견했어요', '광필연구소를 응원해요', '그냥 편하게 얘기할래요'];

const PLACEHOLDER_BY_CATEGORY: Record<string, string> = {
  '이런 테스트 있으면 좋겠어요': '어떤 테스트나 기능이 있으면 좋을지 편하게 적어주세요.',
  '버그를 발견했어요': '언제, 어떤 화면에서 어떤 문제가 있었는지 최대한 자세히 적어주시면 빠르게 확인할게요.',
  '광필연구소를 응원해요': '광필연구소에게 하고 싶은 응원의 한마디를 남겨주세요 :)',
  '그냥 편하게 얘기할래요': '어떤 이야기든 편하게 남겨주세요.',
};

export default function FeedbackForm() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const email = useEmailField();
  const [message, setMessage] = useState('');

  const canSubmit = email.isValid && message.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const subject = `[광필연구소] 의견 보내기 - ${category}`;
    sendInquiryMail(subject, [`분류: ${category}`, `회신 이메일: ${email.value}`, '', message]);
  };

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <InquirySelect label="어떤 이야기인가요?" value={category} options={CATEGORIES} onChange={setCategory} />
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
        label="의견을 남겨주세요"
        value={message}
        onChange={setMessage}
        placeholder={PLACEHOLDER_BY_CATEGORY[category]}
        rows={7}
      />
      <InquirySubmitButton canSubmit={canSubmit} onClick={handleSubmit} />
    </div>
  );
}
