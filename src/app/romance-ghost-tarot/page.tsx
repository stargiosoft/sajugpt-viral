import type { Metadata } from "next";
import { Suspense } from 'react';
import TarotClient from '@/components/tarot/TarotClient';
import { romanceTarotConfig } from '@/lib/tarot/configs/romance-tarot.config';

export const metadata: Metadata = {
  title: "귀신 타로 (연애편)",
  description: "당신에게 붙은 존재가 인연의 신호를 속삭입니다",
  openGraph: {
    title: "귀신타로 (연애편)",
    description: "이번달, 당신의 연애 기운을 확인하세요.",
    images: [{ url: "/romance-ghost-tarot/og-share.png", width: 1200, height: 600 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "귀신타로 (연애편)",
    description: "이번달, 당신의 연애 기운을 확인하세요.",
    images: [{ url: "/romance-ghost-tarot/og-share.png", width: 1200, height: 600 }],
  },
};

export default function RomanceGhostTarotPage() {
  return (
    <>
      {/* 검색엔진(특히 자바스크립트 렌더링을 잘 못하는 네이버)이 읽을 수 있도록
          서버에서부터 내려주는 텍스트 — 화면에는 보이지 않음(sr-only) */}
      <h1 className="sr-only">귀신 타로 (연애편)</h1>
      <p className="sr-only">
        당신에게 붙은 존재가 전하는 인연의 신호를 확인하세요. 무료 귀신타로 연애편으로
        이번 달 연애운을 점쳐보세요.
      </p>
      <Suspense>
        <TarotClient slug={romanceTarotConfig.slug} />
      </Suspense>
    </>
  );
}
