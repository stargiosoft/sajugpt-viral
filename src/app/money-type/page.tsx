import type { Metadata } from "next";

import MoneyTypeClient from "@/components/money-type/MoneyTypeClient";
import LandingTracker from "@/components/LandingTracker";

export const metadata: Metadata = {
  title:
    "나는 돈을 어떻게 버는 사람일까? — 사주로 보는 돈 버는 방식 테스트 | 광필연구소",

  description:
    "생년월일로 알아보는 나의 돈 버는 방식 테스트. 월급형, 사업형, 재능형, 투자형, 기회형, 사람복형 중 나는 어떤 타입일까요?",

  keywords: [
    "사주테스트",
    "돈 버는 방식 테스트",
    "재물운 테스트",
    "돈복 테스트",
    "무료 사주",
    "사주 재물운",
    "돈 타입 테스트",
  ],

  openGraph: {
    title:
      "나는 돈을 어떻게 버는 사람일까? 💰",

    description:
      "생년월일로 알아보는 나의 돈 버는 방식. 나는 월급형? 사업형? 기회형?",

    type: "website",

    siteName: "광필연구소",

    images: [
      {
        url: "/money-type/og-share.png?v=1",
        width: 1200,
        height: 600,
      },
    ],
  },
};

export default function MoneyTypePage() {
  return (
    <>
      <LandingTracker featureType="money_type" />

      <h1 className="sr-only">
        나는 돈을 어떻게 버는 사람일까?
        — 사주로 보는 돈 버는 방식 테스트
      </h1>

      <p className="sr-only">
        생년월일을 입력하면 사주를 바탕으로 내가
        어떤 방식으로 돈을 벌 때 강점을 발휘하는지
        알아보는 무료 사주테스트예요.
        월급형, 사업형, 재능형, 투자형, 기회형,
        사람복형 중 나에게 맞는 돈 버는 방식을
        확인해보세요.
      </p>

      <MoneyTypeClient />
    </>
  );
}