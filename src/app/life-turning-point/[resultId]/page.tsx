"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Gender } from "@/types/battle";
import type { LifeTurningPointResult } from "@/types/life-turning-point/types";

import LifeTurningBirthInput from "@/components/life-turning-point/LifeTurningBirthInput";
import ResultCard from "@/components/life-turning-point/LifeTurningResultCard";

import TestTopNav from "@/components/TestTopNav";
import PressableButton from "@/components/PressableButton";
import OutlineBoxButton from "@/components/OutlineBoxButton";
import ShareRow from "@/components/ShareRow";
import ResultFooterSections from "@/components/ResultFooterSections";

import { trackEvent, trackSajuGPTClick } from "@/lib/analytics";
import { incrementTestStat } from "@/lib/testStats";
import { useShareActions } from "@/lib/useShareActions";
import { SAJUGPT_URL } from "@/constants/links";

const FEATURE_TYPE = "life_turning_point";
const TEST_ID = "life-turning-point";

const THEME_COLOR = "#9D52E8";
const ACCENT_YELLOW = "#FFE662";
const BG_COLOR = "#120B2A";
const TEXT_COLOR = "#F3EAFF";
const CARD_BG = "rgba(31, 20, 60, 0.85)";
const BORDER_COLOR = "rgba(180, 130, 255, 0.25)";

type ApiResponse = {
  success: boolean;
  resultId?: string;
  result?: LifeTurningPointResult;
  data?: LifeTurningPointResult;
  error?: string;
};

export default function LifeTurningResultPage() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(true);
  const [calendar, setCalendar] = useState<"solar" | "lunar">("solar");
  const [gender, setGender] = useState<Gender>("female");

  const [result, setResult] = useState<LifeTurningPointResult | null>(null);
  const [resultId, setResultId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultCardRef = useRef<HTMLDivElement>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl =
    origin && resultId
      ? `${origin}/life-turning-point/${resultId}`
      : origin
      ? `${origin}/life-turning-point`
      : "";

  const { saving, handleSave } = useShareActions({
    featureType: FEATURE_TYPE,
    resultId,
    getShareText: () => shareUrl,
    imageFilename: `인생반전시기_${resultId || "결과"}.png`,
    onSave: () => incrementTestStat(TEST_ID, "share"),
  });

  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [result]);

  const isFormValid = () => {
    const numbers = birthDate.replace(/[^\d]/g, "");
    if (numbers.length !== 8) return false;

    const parts = birthDate.split("-");
    if (parts.length !== 3) return false;

    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return false;

    if (
      year < 1900 ||
      year > new Date().getFullYear() ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return false;
    }

    return true;
  };

  const handleTimeSelect = (displayTime: string, isUnknown: boolean) => {
    setUnknownTime(isUnknown);
    setBirthTime(displayTime);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("생년월일 8자리를 정확히 입력해 주세요.");
      return;
    }

    trackEvent("life_turning_point_input_start");
    setLoading(true);
    setError(null);

    try {
      const normalizedBirthDate = birthDate.replace(/-/g, "");
      const effectiveBirthTime = unknownTime ? "1200" : birthTime.replace(":", "");

      const { data, error: functionError } = await supabase.functions.invoke(
        "analyze-life-turningpoint",
        {
          body: {
            birthDate: normalizedBirthDate,
            birthTime: effectiveBirthTime,
            unknownTime,
            calendar,
            gender,
          },
        }
      );

      if (functionError) {
        throw new Error("분석 요청 중 오류가 발생했어요.");
      }

      const response = data as ApiResponse;
      const analysisResult = response?.result || response?.data;

      if (!response?.success || !analysisResult) {
        throw new Error(response?.error || "분석 결과를 불러오지 못했어요.");
      }

      if (response.resultId) {
        setResultId(response.resultId);
        window.history.replaceState(null, "", `/life-turning-point/${response.resultId}`);
      }
      setResult(analysisResult);

      trackEvent("life_turning_point_result", { calendar, unknownTime });
      incrementTestStat(TEST_ID, "play");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "분석 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setResultId("");
    setError(null);
    window.history.replaceState(null, "", "/life-turning-point");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="flex min-h-dvh justify-center"
      style={{
        backgroundColor: BG_COLOR,
        color: TEXT_COLOR,
      }}
    >
      <div className="flex h-full w-full max-w-110 flex-col md:max-w-150">
        <div className="w-full flex-1 overflow-auto">
          {/* 상단 네비게이션 */}
          <TestTopNav
            bgColor={BG_COLOR}
            logoColor={THEME_COLOR}
            xColor={TEXT_COLOR}
          />

          <div className="px-3 pb-12">
            {!result ? (
              <LifeTurningBirthInput
                birthDate={birthDate}
                onBirthDateChange={setBirthDate}
                birthTime={birthTime}
                unknownTime={unknownTime}
                onTimeSelect={handleTimeSelect}
                gender={gender}
                onGenderChange={setGender}
                calendar={calendar}
                onCalendarChange={setCalendar}
                isValid={isFormValid() && !loading}
                error={error}
                onSubmit={handleSubmit}
                onBack={() => {
                  window.history.back();
                }}
              />
            ) : (
              <motion.div
                id="life-turning-point-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4 scroll-mt-5"
              >
                {/* 결과 카드 */}
                <div ref={resultCardRef}>
                  <ResultCard result={result} />
                </div>

                {/* 하단 버튼 및 액션들 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="flex flex-col gap-3 mt-2"
                >
                  <div className="flex gap-2">
                    {/* 다시하기 버튼 */}
                    <PressableButton
                      onClick={resetAnalysis}
                      label="다시하기"
                      style={{ flex: 1, height: "52px" }}
                      bgStyle={{
                        backgroundColor: "rgba(45, 30, 85, 0.6)",
                        borderRadius: "16px",
                        border: `1px solid ${BORDER_COLOR}`,
                      }}
                      textStyle={{
                        color: TEXT_COLOR,
                        fontSize: "15px",
                        fontWeight: 700,
                      }}
                    />

                    {/* 이미지 저장 버튼 */}
                    <PressableButton
                      onClick={() => handleSave(resultCardRef)}
                      label={saving ? "저장 중..." : "이미지 저장"}
                      disabled={saving}
                      style={{ flex: 1, height: "52px" }}
                      bgStyle={{
                        background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)",
                        borderRadius: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
                      }}
                      hoverBackground="#6D28D9"
                      textStyle={{
                        color: "#FFFFFF",
                        fontSize: "15px",
                        fontWeight: 800,
                      }}
                    />
                  </div>

                  {/* 사주GPT 질문하기 버튼 (가독성 높은 진한 보라 글씨 적용) */}
                  <OutlineBoxButton
                    onClick={() => {
                      trackSajuGPTClick(FEATURE_TYPE, resultId);
                      window.open(SAJUGPT_URL, "_blank", "noopener,noreferrer");
                    }}
                    height="52px"
                    color="#6D28D9"
                    background="#FFFFFF"
                    border="1px solid rgba(255, 255, 255, 0.3)"
                    borderRadius="16px"
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        letterSpacing: "-0.3px",
                        fontWeight: 800,
                        color: "#6D28D9",
                      }}
                    >
                      내 사주 고민, 사주GPT에게 물어보기
                    </span>
                  </OutlineBoxButton>

                  <div className="py-2">
                    <ShareRow
                      shareContent={{
                        featureType: FEATURE_TYPE,
                        title: "✨ 내 인생의 반전은 언제 시작될까?",
                        description:
                          "지금의 운 흐름과 귀인운, 앞으로의 전환 시기를 확인해 보세요.",
                        shareUrl,
                        imageUrl: origin
                          ? `${origin}/life-turning-point/og-share.png`
                          : "/life-turning-point/og-share.png",
                        testId: TEST_ID,
                      }}
                      copyColor={THEME_COLOR}
                      copyHoverColor="#7C3AED"
                      copyIconColor="#FFFFFF"
                    />
                  </div>
                </motion.div>

                {/* 하단 댓글/추천 섹션 (다크 테마 설정 적용) */}
                <div className="mt-4">
                  <ResultFooterSections
                    excludeId={TEST_ID}
                    titleStyle={{
                      fontSize: "16px",
                      fontWeight: 700,
                      letterSpacing: "-0.9px",
                      color: TEXT_COLOR,
                      paddingLeft: "2px",
                    }}
                    cardBg={CARD_BG}
                    cardTitleColor={TEXT_COLOR}
                    featureType={FEATURE_TYPE}
                    resultId={resultId}
                    storageKey="life_turning_point_liked_comments"
                    placeholder="나의 인생 반전 시기에 대해 이야기해 봐요 :)"
                    themeColor={THEME_COLOR}
                    inputBg="rgba(45, 30, 85, 0.6)"
                    disabledBg="rgba(31, 20, 60, 0.5)"
                    shareToRecommendGap={24}
                    dark={true} 
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}