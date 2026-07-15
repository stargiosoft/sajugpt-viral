import type { Metadata } from "next";
import { Suspense } from 'react';
import TarotClient from '@/components/tarot/TarotClient';
import { romanceTarotConfig } from '@/lib/tarot/configs/romance-tarot.config';

export const metadata: Metadata = {
  title: "귀신 타로 연애편",
  description: "당신에게 붙은 존재가 인연의 신호를 속삭입니다",
  openGraph: {
    title: "귀신 타로 연애편",
    description: "당신에게 붙은 존재가 전하는 인연의 신호를 확인하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "귀신 타로 연애편",
    description: "당신에게 붙은 존재가 전하는 인연의 신호를 확인하세요.",
  },
};

export default function RomanceGhostTarotPage() {
  return (
    <Suspense>
      <TarotClient slug={romanceTarotConfig.slug} />
    </Suspense>
  );
}
