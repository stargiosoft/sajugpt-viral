import type { Metadata } from "next";
import { Suspense } from 'react';
import TarotClient from '@/components/tarot/TarotClient';
import { romanceTarotConfig } from '@/lib/tarot/configs/romance-tarot.config';

export const metadata: Metadata = {
  title: "귀신 타로 연애편",
  description: "당신에게 붙은 존재가 인연의 신호를 속삭입니다",
  openGraph: {
    title: "7월 귀신타로 (연애편)",
    description: "이번달, 당신의 연애 기운을 확인하세요.",
    images: [{ url: "/romance-ghost-tarot/share-square.png", width: 1254, height: 1254 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "7월 귀신타로 (연애편)",
    description: "이번달, 당신의 연애 기운을 확인하세요.",
    images: [{ url: "/romance-ghost-tarot/share-landscape.png", width: 1200, height: 630 }],
  },
};

export default function RomanceGhostTarotPage() {
  return (
    <Suspense>
      <TarotClient slug={romanceTarotConfig.slug} />
    </Suspense>
  );
}
