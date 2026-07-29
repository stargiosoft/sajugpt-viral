import type { Metadata } from 'next';
import PolicyLayout from '@/components/policy/PolicyLayout';
import FeedbackForm from '@/components/inquiry/FeedbackForm';

export const metadata: Metadata = {
  title: '의견 보내기 | 광필연구소',
};

export default function FeedbackPage() {
  return (
    <PolicyLayout title="의견 보내기" description="여러분의 소중한 의견을 기다리고 있어요.">
      <div className="flex flex-col items-center" style={{ paddingBottom: '20px' }}>
        <img src="/about/gwangpil-feedback.png" alt="" style={{ width: '180px', height: 'auto', paddingRight: '20px' }} />
      </div>
      <FeedbackForm />
    </PolicyLayout>
  );
}
