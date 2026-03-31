import type { Metadata } from 'next';
import SexyBattleClient from '@/components/SexyBattleClient';
import LandingTracker from '@/components/LandingTracker';

export const metadata: Metadata = {
  title: '색기 배틀 — 사주GPT',
  description: '얼굴 가리고 사주만으로 남자를 홀려보세요. 나한테 꼬인 AI 짐승남은 몇 명?',
  openGraph: {
    title: '색기 배틀 — 누가 더 야한 사주인가 🔥',
    description: '얼굴 가리고 사주만으로 남자를 홀려보세요',
  },
};

export default function SexyBattlePage() {
  return (<><LandingTracker featureType="sexy_battle" /><SexyBattleClient /></>);
}
