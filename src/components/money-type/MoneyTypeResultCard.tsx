"use client";

import { forwardRef, useMemo } from "react";
import type { ReactNode } from "react";

import TestTopNav from "@/components/TestTopNav";

export type MoneyTypeCode =
  | "stable"
  | "talent"
  | "business"
  | "investment"
  | "opportunity"
  | "network";

export type MoneyScores = Record<MoneyTypeCode, number>;

export interface MoneyTypeResultData {
  id?: string;
  result_id?: string;
  code: MoneyTypeCode;
  scores: MoneyScores;
  reason: string[];
  created_at?: string;
}

export interface MoneyTypeInfo {
  id?: string;
  code: MoneyTypeCode;
  title: string;
  emoji: string;
  image?: string;
  keyword: string;
  description: string;
  money_formula: string;
  strengths: string[];
  caution: string;
}

interface MoneyTypeResultCardProps {
  result?: MoneyTypeResultData | null;
  content?: MoneyTypeInfo | null;
  onReset?: () => void;
  children?: ReactNode;
}

const ALL_TYPES = [
  { code: "stable", name: "안정수입형", emoji: "💼", image: "/money-type/stable.png", desc: "꾸준히 쌓는 자산" },
  { code: "talent", name: "재능수익형", emoji: "🎨", image: "/money-type/talent.png", desc: "나만의 능력 활용" },
  { code: "business", name: "사업개척형", emoji: "🚀", image: "/money-type/business.png", desc: "새로운 판 구축" },
  { code: "investment", name: "자산증식형", emoji: "📈", image: "/money-type/investment.png", desc: "돈이 일하는 구조" },
  { code: "opportunity", name: "기회포착형", emoji: "🧲", image: "/money-type/opportunity.png", desc: "타이밍과 정보" },
  { code: "network", name: "인맥재물형", emoji: "🤝", image: "/money-type/network.png", desc: "사람을 통한 확장" },
];

function normalizeStrengths(strengths: unknown): string[] {
  if (Array.isArray(strengths)) {
    return strengths
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function getFallbackTypeInfo(code: MoneyTypeCode): MoneyTypeInfo {
  const fallbackMap: Record<MoneyTypeCode, MoneyTypeInfo> = {
    stable: {
      code: "stable",
      title: "안정수입형",
      emoji: "💼",
      image: "/money-type/stable.png",
      keyword: "꾸준히 쌓는 돈",
      description:
        "한 번에 큰돈을 노리기보다 안정적인 수입을 꾸준히 쌓아갈 때 강점을 발휘하는 타입입니다.",
      money_formula: "안정적인 수입 + 꾸준한 관리 = 탄탄한 자산",
      strengths: [
        "꾸준한 수입을 만드는 힘",
        "계획적인 자산 관리",
        "장기적으로 안정적인 선택",
      ],
      caution: "안정을 너무 중시하면 좋은 기회를 놓칠 수 있어요.",
    },
    talent: {
      code: "talent",
      title: "재능수익형",
      emoji: "🎨",
      image: "/money-type/talent.png",
      keyword: "능력을 돈으로",
      description:
        "자신만의 능력이나 아이디어를 활용해 수익을 만들어내는 타입입니다.",
      money_formula: "나만의 재능 + 차별화 = 수익",
      strengths: [
        "자신만의 능력을 활용하는 힘",
        "아이디어를 수익으로 연결하는 능력",
        "콘텐츠와 전문성 활용",
      ],
      caution: "잘하는 일과 돈이 되는 일을 구분해서 바라보는 것이 중요해요.",
    },
    business: {
      code: "business",
      title: "사업개척형",
      emoji: "🚀",
      image: "/money-type/business.png",
      keyword: "판을 만드는 돈",
      description:
        "스스로 기회를 만들고 새로운 일을 벌일 때 돈의 흐름이 커지는 타입입니다.",
      money_formula: "도전 + 실행력 + 확장 = 수익",
      strengths: [
        "새로운 일을 시작하는 추진력",
        "기회를 사업으로 연결하는 능력",
        "확장과 성장에 강한 성향",
      ],
      caution: "너무 많은 일을 동시에 벌이지 않도록 관리하는 것이 중요해요.",
    },
    investment: {
      code: "investment",
      title: "자산증식형",
      emoji: "📈",
      image: "/money-type/investment.png",
      keyword: "돈이 돈을 만드는 타입",
      description:
        "직접 일해서 버는 돈뿐 아니라 자산을 관리하고 굴리면서 돈을 키우는 데 강점이 있는 타입입니다.",
      money_formula: "자본 + 분석 + 장기적인 관리 = 자산증식",
      strengths: [
        "돈의 흐름을 보는 감각",
        "자산을 관리하는 능력",
        "장기적인 관점에서 판단하는 힘",
      ],
      caution: "수익 가능성만큼 손실 가능성도 함께 고려해야 해요.",
    },
    opportunity: {
      code: "opportunity",
      title: "기회포착형",
      emoji: "🧲",
      image: "/money-type/opportunity.png",
      keyword: "기회를 돈으로",
      description:
        "한 가지 길만 고집하기보다 새로운 기회를 빠르게 발견하고 잡을 때 돈이 들어오는 타입입니다.",
      money_formula: "정보 + 타이밍 + 실행 = 기회수익",
      strengths: [
        "새로운 기회를 빠르게 발견하는 능력",
        "변화에 유연하게 대응하는 힘",
        "좋은 타이밍을 잡는 감각",
      ],
      caution: "기회가 많을수록 선택과 집중이 중요해요.",
    },
    network: {
      code: "network",
      title: "인맥재물형",
      emoji: "🤝",
      image: "/money-type/network.png",
      keyword: "사람을 통해 커지는 돈",
      description:
        "혼자 모든 것을 해결하기보다 좋은 사람들과의 연결과 협업을 통해 기회와 수익을 만드는 타입입니다.",
      money_formula: "사람 + 신뢰 + 연결 = 재물",
      strengths: [
        "사람을 통해 기회를 만드는 능력",
        "협업과 네트워크 활용",
        "좋은 관계를 장기적으로 유지하는 힘",
      ],
      caution: "사람을 믿는 것과 금전적인 판단은 분리해서 생각하는 것이 좋아요.",
    },
  };

  return fallbackMap[code] ?? fallbackMap.opportunity;
}

const MoneyTypeResultCard = forwardRef<HTMLDivElement, MoneyTypeResultCardProps>(
  function MoneyTypeResultCard({ result, content, onReset, children }, ref) {
    const typeInfo = useMemo(() => {
      if (!result) return getFallbackTypeInfo("opportunity");
      
      const fallback = getFallbackTypeInfo(result.code);
      const targetContent = content ?? fallback;

      const imageUrl = targetContent.image || fallback.image;

      return {
        ...targetContent,
        image: imageUrl,
        strengths: normalizeStrengths(targetContent.strengths),
      };
    }, [result, content]);

    if (!result) {
      return null;
    }

    return (
      <div className="min-h-screen bg-linear-to-b from-[#FFF9F2] via-[#FFF3EC] to-[#FCEFE8] pb-20">
        {/* 폰트 정의 */}
        <style jsx global>{`
          @font-face {
            font-family: 'KerisKeduLine';
            src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-3@1.0/KERISKEDU_Line.woff2') format('woff2');
            font-weight: normal;
            font-display: swap;
          }
          .font-keris {
            font-family: 'KerisKeduLine', sans-serif;
          }
        `}</style>

        {/* 상단 네비게이션 바 */}
        <TestTopNav
          title="돈 버는 방식 테스트"
          bgColor="transparent"
          logoColor="#493C35"
          xColor="#493C35"
          onReset={onReset}
        />

        <section className="px-4 pt-4">
          <div className="mx-auto w-full max-w-130">
            <div ref={ref} className="bg-transparent pb-2">
              <div className="mb-5 text-center pt-2">
                <span className="inline-block rounded-full bg-[#FFEFEA] px-4 py-1 text-xs font-bold tracking-wider text-[#E98C72] shadow-sm">
                  ✨ ANALYSIS RESULT
                </span>
                <h1 className="font-keris mt-2 text-[30px] font-black tracking-tight text-[#493C35]">
                  내가 부자되는 방법
                </h1>
              </div>

              {/* 메인 결과 카드 */}
              <div className="relative overflow-hidden rounded-4xl border border-[#F2E3D5] bg-white shadow-[0_12px_35px_rgba(73,60,53,0.06)]">
                {/* 상단 포인트 블러 장식 */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FFEFEA] opacity-80 blur-2xl pointer-events-none" />

                {/* 타입 헤더 */}
                <div className="relative bg-linear-to-b from-[#FFF5F0] via-[#FFF9F6] to-white px-6 pb-8 pt-9 text-center border-b border-[#F7EFEA]">
                  <div className="mx-auto flex h-37.5 w-37.5 items-center justify-center overflow-hidden rounded-[28px] bg-white shadow-[0_8px_20px_rgba(233,140,114,0.15)] ring-4 ring-[#FFF2EE]">
                    {typeInfo.image ? (
                      <img
                        src={typeInfo.image}
                        alt={typeInfo.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[42px]">{typeInfo.emoji}</span>
                    )}
                  </div>

                  <p className="mt-4 text-[11px] font-extrabold uppercase tracking-widest text-[#E98C72]">
                    Target Money Type
                  </p>

                  <h2 className="mt-1 text-[32px] font-black tracking-tight text-[#493C35]">
                    {typeInfo.title}
                  </h2>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFEFEA] px-4 py-1.5 text-xs font-bold text-[#E98C72] shadow-sm">
                    <span>💡</span>
                    <span>{typeInfo.keyword}</span>
                  </div>
                </div>

                {/* 설명 영역 */}
                <div className="px-6 py-6">
                  <p className="text-center text-[15px] font-medium leading-relaxed text-[#665951]">
                    {typeInfo.description}
                  </p>

                  {/* 돈 공식 카드 */}
                  <div className="mt-5 rounded-[22px] border border-[#F5EBE1] bg-linear-to-r from-[#FFF9F2] to-[#FFF4EC] p-4.5 text-center shadow-inner">
                    <p className="text-[10px] font-extrabold tracking-wider text-[#A89990]">
                      MONEY FORMULA
                    </p>
                    <p className="mt-1.5 text-[14px] font-black text-[#493C35]">
                      {typeInfo.money_formula}
                    </p>
                  </div>
                </div>
              </div>

              {/* 스펙트럼 영역 */}
              <div className="mt-4 rounded-[28px] border border-[#F2E3D5] bg-white px-6 py-6 shadow-[0_8px_30px_rgba(73,60,53,0.04)]">
                <div className="text-center mb-5">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#E98C72] uppercase">
                    MESSY TO CLEAR FLOW
                  </span>
                  <h3 className="mt-0.5 text-[16px] font-black text-[#493C35]">
                    6가지 돈 버는 방식 스펙트럼
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {ALL_TYPES.map((t) => {
                    const isCurrent = t.code === result.code;
                    return (
                      <div
                        key={t.code}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                          isCurrent
                            ? "bg-[#FFF5F0] border-[#E98C72] shadow-sm"
                            : "bg-[#FAFAF9] border-[#F2E3D5]/60 opacity-80"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{t.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <p className={`text-xs font-bold truncate ${isCurrent ? "text-[#E98C72]" : "text-[#493C35]"}`}>
                              {t.name}
                            </p>
                            {isCurrent && (
                              <span className="text-[9px] font-black bg-[#E98C72] text-white px-1.5 py-0.2 rounded-full shrink-0">
                                내 유형
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#A89990] truncate mt-0.5">
                            {t.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 분석 이유 섹션 */}
              {result.reason && result.reason.length > 0 && (
                <div className="mt-4 rounded-[28px] border border-[#F2E3D5] bg-white px-6 py-6 shadow-[0_8px_30px_rgba(73,60,53,0.04)]">
                  <h3 className="text-[16px] font-black text-[#493C35]">
                    🔍 왜 이런 유형일까요?
                  </h3>
                  <div className="mt-4 space-y-3">
                    {result.reason.slice(0, 5).map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex items-start gap-3"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFEFEA] text-[10px] font-black text-[#E98C72]">
                          {index + 1}
                        </div>
                        <p className="pt-0.5 text-xs font-medium leading-relaxed text-[#665951]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 강점 섹션 */}
              {typeInfo.strengths && typeInfo.strengths.length > 0 && (
                <div className="mt-4 rounded-[28px] border border-[#F2E3D5] bg-white px-6 py-6 shadow-[0_8px_30px_rgba(73,60,53,0.04)]">
                  <h3 className="text-[16px] font-black text-[#493C35]">
                    ✨ 돈을 벌 때 이런 점이 강해요
                  </h3>
                  <div className="mt-4 space-y-2.5">
                    {typeInfo.strengths.map((strength, index) => (
                      <div
                        key={`${strength}-${index}`}
                        className="flex items-start gap-3 rounded-2xl border border-[#F5EBE1] bg-linear-to-r from-[#FFF9F2] to-[#FFF5EC] px-4 py-3.5"
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E98C72] text-[9px] font-bold text-white">
                          ✓
                        </span>
                        <p className="text-xs font-semibold leading-relaxed text-[#665951]">
                          {strength}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 주의사항 섹션 */}
              {typeInfo.caution && (
                <div className="mt-4 rounded-[28px] border border-[#F2E3D5] bg-white px-6 py-6 shadow-[0_8px_30px_rgba(73,60,53,0.04)]">
                  <h3 className="text-[16px] font-black text-[#493C35]">
                    ⚠️ 돈을 다룰 때 주의할 점
                  </h3>
                  <div className="mt-4 rounded-2xl border border-[#FEEBE7] bg-[#FFF8F6] px-4 py-4">
                    <p className="text-xs font-medium leading-relaxed text-[#8C6D63]">
                      {typeInfo.caution}
                    </p>
                  </div>
                </div>
              )}

              {/* 디스클레이머 */}
              <p className="pt-5 text-center text-[11px] leading-relaxed text-[#B9AAA1]">
                본 테스트는 사주 데이터를 바탕으로 재미와
                <br />
                자기 이해를 돕기 위한 콘텐츠입니다.
              </p>
            </div>

            {children && <div className="mt-6">{children}</div>}
          </div>
        </section>
      </div>
    );
  }
);

MoneyTypeResultCard.displayName = "MoneyTypeResultCard";

export default MoneyTypeResultCard;