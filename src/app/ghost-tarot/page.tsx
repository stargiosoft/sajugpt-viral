import type { Metadata } from "next";
import { Suspense } from 'react';
import TarotClient from '@/components/tarot/TarotClient';
import { ghostTarotConfig } from '@/lib/tarot/configs/ghost-tarot.config';

export const metadata: Metadata = {
  title: "귀신 타로 (운세편)",
  description: "당신에게 붙은 귀신이 전하는 이번 달 운세",
  openGraph: {
    title: "7월 귀신타로(운세편)",
    description: "이번 달, 당신을 찾아올 경고를 확인하세요.",
    images: [{ url: "/ghost-tarot/share-square.png", width: 1254, height: 1254 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "7월 귀신타로(운세편)",
    description: "이번 달, 당신을 찾아올 경고를 확인하세요.",
    images: [{ url: "/ghost-tarot/share-landscape.png", width: 1200, height: 630 }],
  },
};

export default function GhostTarotPage() {
  return (
    <Suspense>
      <TarotClient slug={ghostTarotConfig.slug} />
    </Suspense>
  );
}