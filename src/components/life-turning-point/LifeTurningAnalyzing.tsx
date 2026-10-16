"use client";

import { useEffect, useState } from "react";

const C = {
  pageBg: "#120B2A",
  panelBg: "rgba(31, 20, 60, 0.85)",
  cardBg: "rgba(45, 30, 85, 0.6)",
  text: "#F3EAFF",
  textSecondary: "#D8C7F0",
  textTertiary: "#9E8EB8",
  accent: "#9D52E8",
  accentYellow: "#FFE662",
  border: "rgba(180, 130, 255, 0.25)",
  borderActive: "rgba(216, 170, 255, 0.6)",
};

const messages = [
  "태어난 날짜를 바탕으로 사주 흐름을 살펴보고 있어요.",
  "현재의 흐름과 변화의 실마리를 분석하고 있어요.",
  "나에게 힘이 되는 귀인운을 확인하고 있어요.",
  "기회를 준비하기 위한 행동 가이드를 정리하고 있어요.",
];

export default function Analyzing() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4"
      aria-live="polite"
      aria-busy="true"
      style={{ backgroundColor: C.pageBg, color: C.text }}
    >
      {/* 몽환적인 우주별빛 펄스 효과 애니메이션 영역 */}
      <div className="relative mb-9 flex h-32 w-32 items-center justify-center">
        {/* 퍼지는 빛 효과 */}
        <div
          className="absolute inset-0 animate-ping rounded-full opacity-30"
          style={{ backgroundColor: C.accent }}
        />

        {/* 회전하는 보라빛 대시 테두리 */}
        <div
          className="absolute inset-2 animate-spin rounded-full border-2 border-dashed"
          style={{ borderColor: `${C.accent}88` }}
        />

        {/* 중앙 별 아이콘 박스 */}
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-xl backdrop-blur-md"
          style={{
            backgroundColor: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: "0 0 20px rgba(157, 82, 232, 0.3)",
          }}
        >
          ✨
        </div>
      </div>

      <p
        className="text-sm font-bold tracking-[0.18em]"
        style={{ color: C.accentYellow }}
      >
        FIND YOUR TURNING POINT
      </p>

      <h1
        className="mt-4 text-2xl font-black leading-snug"
        style={{ color: C.text }}
      >
        당신의 인생 흐름을
        <br />
        읽고 있어요
      </h1>

      <p
        className="mt-4 min-h-12 max-w-sm text-sm leading-6"
        style={{ color: C.textSecondary }}
      >
        {messages[messageIndex]}
      </p>

      {/* 로딩 프로그레스바 */}
      <div
        className="mt-7 h-1.5 w-56 overflow-hidden rounded-full"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div
          className="h-full w-1/2 animate-pulse rounded-full"
          style={{
            background: "linear-gradient(135deg, #A855F7 0%, #FFE662 100%)",
          }}
        />
      </div>

      <p className="mt-4 text-xs" style={{ color: C.textTertiary }}>
        잠시만 기다려 주세요.
      </p>
    </section>
  );
}