import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MoneyTypeClient from "@/components/money-type/MoneyTypeClient";
import type {
  MoneyTypeResultData,
  MoneyTypeCode,
} from "@/components/money-type/MoneyTypeClient";
import LandingTracker from "@/components/LandingTracker";
import { supabase } from "@/lib/supabase";

type PageProps = {
  params: Promise<{
    resultId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { resultId } = await params;

  const { data: result } = await supabase
    .from("money_type_results")
    .select("type_code")
    .eq("result_id", resultId)
    .maybeSingle();

  if (!result) {
    return {
      title: "나는 돈을 어떻게 버는 사람일까? | 광필연구소",
      description: "사주로 알아보는 나의 돈 버는 방식 테스트",
    };
  }

  const { data: content } = await supabase
    .from("money_types")
    .select("title, emoji, keyword, description")
    .eq("code", result.type_code)
    .eq("is_active", true)
    .maybeSingle();

  return {
    title: `${content?.title ?? "나의 돈 버는 방식"} ${content?.emoji ?? "💰"} — 나는 돈을 어떻게 버는 사람일까? | 광필연구소`,
    description:
      content?.description ?? "생년월일로 알아보는 나의 돈 버는 방식 테스트",
    openGraph: {
      title: `${content?.title ?? "나의 돈 버는 방식"} ${content?.emoji ?? "💰"}`,
      description:
        content?.description ?? "사주로 알아보는 나의 돈 버는 방식",
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
}

export default async function MoneyTypeResultPage({ params }: PageProps) {
  const { resultId } = await params;

  /* 1. 결과 조회 */
  const { data: result, error: resultError } = await supabase
    .from("money_type_results")
    .select("result_id, type_code, reason, scores")
    .eq("result_id", resultId)
    .maybeSingle();

  if (resultError || !result) {
    console.error("money_type_results 조회 실패:", resultError, result);
    notFound();
  }

  /* 2. 콘텐츠 조회 */
  const { data: content, error: contentError } = await supabase
    .from("money_types")
    .select(
        "code, title, emoji, keyword, description, money_formula, strengths, caution"
    )
    .eq("code", result.type_code)
    .eq("is_active", true)
    .maybeSingle();

  if (contentError || !content) {
    console.error("money_types 조회 실패:", contentError, content);
    notFound();
  }

  /* 3. 클라이언트 컴포넌트가 기대하는 모양으로 변환 */
  const initialData: MoneyTypeResultData = {
    resultId: result.result_id,
    code: result.type_code as MoneyTypeCode,
    scores: (result.scores ?? {}) as Record<string, number>,
    reason: Array.isArray(result.reason) ? result.reason : [],
    typeInfo: {
        code: content.code as MoneyTypeCode,
        title: content.title,
        emoji: content.emoji,
        keyword: content.keyword,
        description: content.description,
        money_formula: content.money_formula,
        strengths: Array.isArray(content.strengths) ? content.strengths : [],
        caution: content.caution,
    },
  };

  return (
    <>
      <LandingTracker featureType="money_type_result" />

      <h1 className="sr-only">
        {content.title} — 나의 돈 버는 방식 테스트 결과
      </h1>

      <p className="sr-only">
        사주를 바탕으로 분석한 나의 돈 버는 방식은 {content.title}입니다.{" "}
        {content.description}
      </p>

      <MoneyTypeClient resultId={resultId} initialData={initialData} />
    </>
  );
}