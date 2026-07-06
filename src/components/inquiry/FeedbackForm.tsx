'use client';

import { useState } from 'react';
import { InquiryInput, InquirySelect, InquiryTextarea } from './InquiryField';

const SUPPORT_EMAIL = 'support@stargio.co.kr';

const CATEGORIES = ['이런 테스트 있으면 좋겠어요', '버그를 발견했어요', '모아모아를 응원해요', '그냥 편하게 얘기할래요'];

const PLACEHOLDER_BY_CATEGORY: Record<string, string> = {
  '이런 테스트 있으면 좋겠어요': '어떤 테스트나 기능이 있으면 좋을지 편하게 적어주세요.',
  '버그를 발견했어요': '언제, 어떤 화면에서 어떤 문제가 있었는지 최대한 자세히 적어주시면 빠르게 확인할게요.',
  '모아모아를 응원해요': '모아모아에게 하고 싶은 응원의 한마디를 남겨주세요 :)',
  '그냥 편하게 얘기할래요': '어떤 이야기든 편하게 남겨주세요.',
};

export default function FeedbackForm() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const canSubmit = message.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const subject = `[모아모아] 의견 보내기 - ${category}`;
    const body = [`분류: ${category}`, `회신 이메일: ${email || '(작성 안 함)'}`, '', message].join('\n');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <InquirySelect label="어떤 이야기인가요?" value={category} options={CATEGORIES} onChange={setCategory} />
      <InquiryInput label="이메일" value={email} onChange={setEmail} placeholder="회신받을 이메일을 적어주세요. (선택)" type="email" />
      <InquiryTextarea
        label="의견을 남겨주세요"
        value={message}
        onChange={setMessage}
        placeholder={PLACEHOLDER_BY_CATEGORY[category]}
        rows={7}
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
