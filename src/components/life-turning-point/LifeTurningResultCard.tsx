"use client";

import type {
  LifeTurningPointResult,
  LifeTurningPointSection,
} from "@/types/life-turning-point/type.ts";

type ResultCardProps = {
  result?: LifeTurningPointResult | null;
};

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
  borderAccent: "rgba(255, 230, 98, 0.4)",
  badgeBg: "rgba(157, 82, 232, 0.2)",
};

function parseSectionData(section: LifeTurningPointSection | string | undefined) {
  if (!section) return { title: "", description: "" };

  if (typeof section === "string") {
    return { title: section, description: "" };
  }

  const title =
    section.title ||
    section.subtitle ||
    section.timing ||
    section.ganji ||
    "";

  const description =
    section.description ||
    section.summary ||
    section.detail ||
    section.advice ||
    "";

  return { title, description };
}

function parseActionData(action: LifeTurningPointResult["action"]): string[] {
  if (!action) return [];

  if (Array.isArray(action)) {
    return action.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof action === "string" && action.trim()) {
    return action
      .split(/\n|•|(?<=\.)\s+/)
      .map((item) => item.replace(/^[\s\-·]+/, "").trim())
      .filter(Boolean);
  }

  if (typeof action === "object") {
    const text =
      (action as any).advice ||
      (action as any).description ||
      (action as any).summary ||
      (action as any).detail ||
      "";

    if (text) {
      return text
        .split(/\n|•|(?<=\.)\s+/)
        .map((item: string) => item.replace(/^[\s\-·]+/, "").trim())
        .filter(Boolean);
    }
  }

  return [];
}

function ResultSection({
  emoji,
  label,
  title,
  description,
  accent = false,
  children,
}: {
  emoji: string;
  label: string;
  title: string;
  description: string;
  accent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[28px] border p-5 sm:p-6 shadow-xl backdrop-blur-md transition-all"
      style={{
        backgroundColor: C.panelBg,
        borderColor: accent ? C.borderAccent : C.border,
        boxShadow: accent ? "0 0 20px rgba(255, 230, 98, 0.15)" : "none",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">
          {emoji}
        </span>
        <p className="text-xs font-bold tracking-wide" style={{ color: C.accentYellow }}>
          {label}
        </p>
      </div>

      <h2 className="mt-3 text-lg font-black leading-snug" style={{ color: C.text }}>
        {title || "운의 흐름을 분석하고 있어요"}
      </h2>

      {description && (
        <p className="mt-3 whitespace-pre-line text-sm leading-7" style={{ color: C.textSecondary }}>
          {description}
        </p>
      )}

      {children}
    </section>
  );
}

export default function ResultCard({ result }: ResultCardProps) {
  if (!result) {
    return null;
  }

  const currentData = parseSectionData(result.current);
  const currentObj = typeof result.current === "object" ? result.current : {};
  const currentPeriod = (currentObj as any)?.period;
  const sajuStrength = (currentObj as any)?.sajuStrength;

  const helperData = parseSectionData(result.helper);
  const helperObj = typeof result.helper === "object" ? result.helper : {};
  
  const rawHelperEvidence: string[] = (helperObj as any)?.evidence || [];
  const helperEvidence = rawHelperEvidence.filter(
    (item) => typeof item === "string" && item.trim().length > 0 && item.trim().length <= 15
  );

  const turningData = parseSectionData(result.turningPoint);
  const turningObj = typeof result.turningPoint === "object" ? result.turningPoint : {};
  const turningYears: number[] = (turningObj as any)?.years || [];

  const actions = parseActionData(result.action);

  return (
    <div
      id="result-card-area"
      className="space-y-6 w-full"
      style={{
        backgroundColor: C.pageBg,
        color: C.text,
        padding: "24px 16px",
        borderRadius: "32px",
      }}
    >
      {/* 헤더 */}
      <header className="pb-2 text-center">
        <p className="pt-2 text-xs font-bold tracking-[0.2em]" style={{ color: C.accentYellow, fontFamily: "'GMarketSans', sans-serif", }}>
          당신의 터닝포인트
        </p>

        <h1 className="mt-3 text-2xl font-black leading-snug sm:text-3xl" style={{ color: C.text, fontWeight: 700, fontFamily: "'GMarketSans', sans-serif", }}>
          내 인생의 반전,
          <br />
          <span style={{ color: C.accentYellow, fontFamily: "'GMarketSans', sans-serif", }}>어디서 시작될까?</span>
        </h1>

        <p className="mt-3 text-sm font-semibold leading-6" style={{ color: C.textSecondary }}>
          {"지금의 흐름을 돌아보고 앞으로의 기회를 준비해 봐요."}
        </p>
      </header>

      {/* 안내 카드 */}
      <div
        className="rounded-[28px] p-5 sm:p-6 shadow-xl backdrop-blur-md"
        style={{
          backgroundColor: C.cardBg,
          border: `1px solid ${C.border}`,
        }}
      >
        <p className="text-xs font-semibold tracking-wide" style={{ color: C.accentYellow }}>
          오늘 기억할 한 가지
        </p>

        <p className="mt-3 text-lg font-bold leading-8" style={{ color: C.text }}>
          인생의 반전은 기다리는 순간보다
          <br className="hidden sm:block" />
          작은 변화를 시작할 때 가까워져요.
        </p>

        <p className="mt-3 text-sm leading-6" style={{ color: C.textSecondary }}>
          사주 해석은 자신을 돌아보는 참고 자료로 활용하고,
          실제 선택은 현재 상황과 현실적인 조건을 함께 고려해 주세요.
        </p>
      </div>

      {/* 섹션 카드 목록 */}
      <div className="space-y-3">
        {/* 01 · CURRENT FLOW */}
        <ResultSection
          emoji="🌙"
          label="01 · 현재 운의 흐름"
          title={currentData.title || "현재 운의 흐름"}
          description={currentData.description}
        >
          {(currentPeriod || sajuStrength) && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {currentPeriod && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: C.badgeBg,
                    color: C.accentYellow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  📅 대운: {currentPeriod}
                </span>
              )}
              {sajuStrength && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: C.badgeBg,
                    color: C.accentYellow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  🔥 {sajuStrength}
                </span>
              )}
            </div>
          )}
        </ResultSection>

        {/* 02 · HELPER LUCK */}
        <ResultSection
          emoji="🫶"
          label="02 · 귀인 및 협력운"
          title={helperData.title || "귀인 및 협력운"}
          description={helperData.description}
        >
          {helperEvidence.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {helperEvidence.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: C.badgeBg,
                    color: C.accentYellow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  ✨ {item}
                </span>
              ))}
            </div>
          )}
        </ResultSection>

        {/* 03 · TURNING POINT */}
        <ResultSection
          emoji="🌅"
          label="03 · 터닝포인트"
          title={turningData.title || "변화를 준비할 시기"}
          description={turningData.description}
          accent
        >
          {turningYears.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {turningYears.map((year) => (
                <span
                  key={year}
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: C.badgeBg,
                    color: C.accentYellow,
                    border: `1px solid ${C.borderAccent}`,
                  }}
                >
                  🎯 {year}년
                </span>
              ))}
            </div>
          )}
        </ResultSection>
      </div>

      {/* 04 · 행동 가이드 */}
      {actions.length > 0 && (
        <section
          className="rounded-[28px] border p-5 sm:p-6 shadow-xl backdrop-blur-md"
          style={{
            backgroundColor: C.panelBg,
            borderColor: C.border,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              📝
            </span>
            <h2 className="text-lg font-black" style={{ color: C.text }}>
              반전을 위해 지금 준비할 것
            </h2>
          </div>

          <ul className="mt-5 space-y-4">
            {actions.map((action, index) => (
              <li key={`${index}-${action}`} className="flex gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: C.badgeBg,
                    color: C.accentYellow,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm leading-6" style={{ color: C.textSecondary }}>
                  {action}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-center text-xs leading-5" style={{ color: C.textTertiary }}>
        본 결과는 전통적인 사주 해석을 바탕으로 한 참고용 콘텐츠이며,
        실제 미래나 특정 사건의 발생을 보장하지 않아요.
      </p>
    </div>
  );
}