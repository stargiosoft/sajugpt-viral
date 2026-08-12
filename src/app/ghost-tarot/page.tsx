import type { Metadata } from "next";
import { Suspense } from 'react';
import TarotClient from '@/components/tarot/TarotClient';
import { ghostTarotConfig } from '@/lib/tarot/configs/ghost-tarot.config';

export const metadata: Metadata = {
  title: "귀신타로(운세편) — 타로테스트·사주테스트 | 광필연구소",
  description: "당신에게 붙은 귀신이 전하는 이번 달 운세를 확인하는 무료 타로테스트예요.",
  keywords: ['타로테스트', '사주테스트', '무료 타로', '이달의 운세', '온라인 타로'],
  openGraph: {
    title: "귀신타로(운세편)",
    description: "이번 달, 당신을 찾아올 경고를 확인하세요.",
    images: [{ url: "/ghost-tarot/og-share.png", width: 1200, height: 600 }],
    type: "website",
  },
};

export default function GhostTarotPage() {
  return (
    <>
      <h1 className="sr-only">귀신 타로 (운세편)</h1>
      <p className="sr-only">
        당신에게 붙은 귀신이 전하는 이번 달 운세를 확인하세요. 무료로 즐기는 귀신타로,
        봉인된 카드 한 장을 뽑아 나에게 붙은 존재의 메시지를 알아보세요.
      </p>
      <Suspense>
        <TarotClient slug={ghostTarotConfig.slug} />
      </Suspense>
    </>
  );
}