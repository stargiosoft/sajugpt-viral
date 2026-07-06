import type { Metadata } from 'next';
import PolicyLayout from '@/components/policy/PolicyLayout';
import PartnerForm from '@/components/inquiry/PartnerForm';

export const metadata: Metadata = {
  title: '제휴 문의 | 모아모아',
};

export default function PartnerPage() {
  return (
    <PolicyLayout title="모아모아와 제휴하기" description="모아모아와 함께하고 싶은 프로젝트가 있나요?">
      <PartnerForm />
    </PolicyLayout>
  );
}
