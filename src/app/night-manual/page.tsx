import type { Metadata } from 'next';
import NightManualClient from '@/components/night-manual/NightManualClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '밤(夜) 설명서 — 사주GPT',
  description: '사주 기반 은밀한 체질을 진단받고, 시종 3명의 쟁탈전을 엿들어보세요.',
  openGraph: {
    title: '밤(夜) 설명서 — 시종들의 은밀한 난상토론 🌙',
    description: '사주 기반 은밀한 체질을 진단받고, 시종 3명의 쟁탈전을 엿들어보세요.',
  },
};

export default function NightManualPage() {
  return (<><LandingTracker featureType="night_manual" /><NightManualClient /></>);
}
