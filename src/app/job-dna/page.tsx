import type { Metadata } from 'next';
import JobDnaClient from '@/components/job-dna/JobDnaClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '직업운 DNA — 사주로 알아보는 나의 천직 테스트 | 광필연구소',
  description: '생년월일과 성별만 입력하면 내 사주 원국을 바탕으로 타고난 직업운과 천직을 알려주는 무료 사주·심리테스트예요.',
  keywords: ['사주테스트', '직업운 테스트', '직업 찾기', '커리어 사주', '무료 사주'],
  openGraph: {
    title: '내 사주에 숨겨진 천직 & 직업운 DNA 🧬',
    description: '회원가입 없이 1초만에 확인하는 나의 타고난 밥벌이 픽!',
    images: [{ url: '/job-dna/og-share.png', width: 1200, height: 600 }],
    type: 'website',
    siteName: '광필연구소',
  },
};

export default function JobDnaHomePage() {
  return (
    <>
      <LandingTracker featureType="job_dna" />
      <h1 className="sr-only">직업운 DNA — 사주로 알아보는 천직 테스트</h1>
      <p className="sr-only">
        생년월일과 성별만 입력하면 내 사주 원국을 바탕으로 타고난 천직과 직업운 DNA를 
        분석해주는 무료 사주테스트이자 심리테스트예요. 
      </p>
      <JobDnaClient />
    </>
  );
}