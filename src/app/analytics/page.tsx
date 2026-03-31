import type { Metadata } from 'next';
import ViralDashboard from '@/components/ViralDashboard';

export const metadata: Metadata = {
  title: '바이럴 애널리틱스 — 사주GPT',
  robots: 'noindex, nofollow',
};

export default function AnalyticsPage() {
  return <ViralDashboard />;
}
