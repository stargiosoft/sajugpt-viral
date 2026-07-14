import type { Metadata } from "next";
import GhostTarotClient from '@/components/ghost-tarot/GhostTarotClient';

export const metadata: Metadata = {
  title: "귀신 타로",
  description: "당신에게 붙은 귀신이 전하는 이번 달 운세",
  openGraph: {
    title: "7월 귀신타로",
    description: "이번 달, 당신을 찾아올 경고를 확인하세요.",
  },
  twitter: {
    title: "7월 귀신타로",
    description: "이번 달, 당신을 찾아올 경고를 확인하세요.",
  },
};

export default function GhostTarotPage() {
  return <GhostTarotClient />;
}