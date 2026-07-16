import type { Metadata } from "next";
import { Suspense } from 'react';
import TarotClient from '@/components/tarot/TarotClient';
import { ghostTarotConfig } from '@/lib/tarot/configs/ghost-tarot.config';

export const metadata: Metadata = {
  title: "귀신타로(운세편)",
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
    <>
      {/* 검색엔진(특히 자바스크립트 렌더링을 잘 못하는 네이버)이 읽을 수 있도록
          서버에서부터 내려주는 텍스트 — 화면에는 보이지 않음(sr-only) */}
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