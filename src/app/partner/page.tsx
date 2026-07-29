import type { Metadata } from 'next';
import PolicyLayout from '@/components/policy/PolicyLayout';
import PartnerForm from '@/components/inquiry/PartnerForm';

export const metadata: Metadata = {
  title: '제휴 문의 | 광필연구소',
};

export default function PartnerPage() {
  return (
    <PolicyLayout title="광필연구소와 제휴하기" description="광필연구소와 함께하고 싶은 프로젝트가 있나요?">
      <div className="flex flex-col items-center" style={{ paddingBottom: '20px' }}>
        <img src="/about/gwangpil-partner.png" alt="" style={{ width: '150px', height: 'auto' }} />
      </div>
      <PartnerForm />
    </PolicyLayout>
  );
}
