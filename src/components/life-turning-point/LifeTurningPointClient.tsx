"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Gender } from "@/types/battle";

import TestTopNav from "@/components/TestTopNav";
import OutlineBoxButton from "@/components/OutlineBoxButton";
import PressableButton from "@/components/PressableButton";
import ShareRow from "@/components/ShareRow";
import ResultFooterSections from "@/components/ResultFooterSections";

import LifeTurningLanding from "./LifeTurningLanding";
import LifeTurningBirthInput from "./LifeTurningBirthInput";
import LifeTurningAnalyzing from "./LifeTurningAnalyzing";
import LifeTurningResultCard from "./LifeTurningResultCard";

import { trackEvent, trackSajuGPTClick } from "@/lib/analytics";
import { incrementTestStat } from "@/lib/testStats";
import { loadSelfSaju, saveSelfSaju } from "@/lib/sajuCache";
import { useShareActions } from "@/lib/useShareActions";
import { SAJUGPT_URL } from "@/constants/links";
import useIsNarrow from "@/hooks/useIsNarrow";

import type { LifeTurningPointResult } from "@/components/life-turning-point/types";

type LifeTurningPointStep =
  | "landing"
  | "input"
  | "analyzing"
  | "result";

type LifeTurningPointClientProps = {
  resultId?: string;
  initialData?: LifeTurningPointResult | null;
};

const FEATURE_TYPE = "life_turning_point";
const TEST_ID = "life-turning-point";
const STORAGE_KEY = "life_turning_point_saju";
const THEME_COLOR = "#9D52E8";
const BG_COLOR = "#120B2A";
const TEXT_COLOR = "#F3EAFF";

export default function LifeTurningPointClient({
  resultId: propResultId,
  initialData,
}: LifeTurningPointClientProps) {
  const isNarrow = useIsNarrow();

  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(true);
  const [calendar, setCalendar] = useState<"solar" | "lunar">("solar");
  const [gender, setGender] = useState<Gender>("female");

  const [step, setStep] = useState<LifeTurningPointStep>(
    initialData ? "result" : "landing"
  );
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<LifeTurningPointResult | null>(
    initialData ?? null
  );

  const resultCardRef = useRef<HTMLDivElement>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const currentResultId = (result as any)?.resultId || propResultId || "";

  const shareUrl =
    origin && currentResultId
      ? `${origin}/life-turning-point/${currentResultId}`
      : origin
      ? `${origin}/life-turning-point`
      : "";

  const { saving, handleSave } = useShareActions({
    featureType: FEATURE_TYPE,
    resultId: currentResultId,
    getShareText: () => shareUrl,
    imageFilename: `인생반전시기_${currentResultId || "결과"}.png`,
    onSave: () => incrementTestStat(TEST_ID, "share"),
  });

  // 1. 로컬 캐시에서 입력값 불러오기 (마운트 시)
  useEffect(() => {
    const cached = loadSelfSaju(STORAGE_KEY);
    if (!cached) return;

    if (cached.birthDate) setBirthDate(cached.birthDate);
    if (cached.birthTime) setBirthTime(cached.birthTime);
    if (cached.unknownTime !== undefined) setUnknownTime(cached.unknownTime);
    if (cached.gender) setGender(cached.gender as Gender);
    if (cached.calendar === "solar" || cached.calendar === "lunar") {
      setCalendar(cached.calendar);
    }
  }, []);

  // 2. 입력값 변경 시 캐시 저장
  useEffect(() => {
    saveSelfSaju(STORAGE_KEY, {
      birthDate,
      birthTime,
      unknownTime,
      gender,
      calendar,
    });
  }, [birthDate, birthTime, unknownTime, gender, calendar]);

  // 3. 공유 URL 결과 조회 핸들러
  useEffect(() => {
    if (!propResultId || initialData) return;

    let isMounted = true;
    setStep("analyzing");

    if (isMounted) {
      setError("저장된 결과를 불러오는 기능은 준비 중이에요.");
      setStep("input");
    }

    return () => {
      isMounted = false;
    };
  }, [propResultId, initialData]);

  // 생년월일 입력값 유효성 검증
  const isFormValid = useCallback(() => {
    const cleanDate = birthDate.replace(/[^\d]/g, "");
    if (cleanDate.length !== 8) return false;

    let year: number, month: number, day: number;

    if (birthDate.includes("-")) {
      const parts = birthDate.split("-");
      if (parts.length !== 3) return false;
      [year, month, day] = parts.map(Number);
    } else {
      year = Number(cleanDate.slice(0, 4));
      month = Number(cleanDate.slice(4, 6));
      day = Number(cleanDate.slice(6, 8));
    }

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

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return false;
    }

    if (!unknownTime && !birthTime) return false;

    return true;
  }, [birthDate, birthTime, unknownTime]);

  const handleTimeSelect = useCallback(
    (displayTime: string, isUnknown: boolean) => {
      setUnknownTime(isUnknown);
      setBirthTime(displayTime);
    },
    []
  );

  // 사주 분석 실행
  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError("생년월일과 입력 정보를 정확히 확인해 주세요.");
      return;
    }

    trackEvent("life_turning_point_input_start");

    setStep("analyzing");
    setError(null);
    setResult(null);

    const minDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1500);
    });

    try {
      const normalizedBirthDate = birthDate.replace(/[^\d]/g, "").slice(0, 8);
      const effectiveBirthTime = unknownTime
        ? "1200"
        : birthTime.replace(/[^\d]/g, "");

      const requestPromise = (async () => {
        const { supabase } = await import("@/lib/supabase");

        const { data, error: functionError } =
          await supabase.functions.invoke("analyze-life-turningpoint", {
            body: {
              birthDate: normalizedBirthDate,
              birthTime: effectiveBirthTime,
              unknownTime,
              calendar,
              gender,
            },
          });

        if (functionError) {
          console.error("Edge Function 오류:", functionError);
          throw new Error(
            "인생 반전 분석에 실패했어요. 잠시 후 다시 시도해 주세요."
          );
        }

        if (!data || !data.success) {
          throw new Error(
            data?.error ||
              "분석 결과를 불러오지 못했어요. 다시 시도해 주세요."
          );
        }

        const analysis = data.result ?? data.data;
        if (!analysis) {
          throw new Error("분석 결과를 불러오지 못했어요. 다시 시도해 주세요.");
        }

        return { ...analysis, resultId: data.resultId } as LifeTurningPointResult;
      })();

      const [generated] = await Promise.all([requestPromise, minDelay]);

      setResult(generated);
      trackEvent("life_turning_point_result", { calendar, unknownTime });
      setStep("result");

      const generatedResultId = (generated as any)?.resultId;
      if (generatedResultId) {
        window.history.pushState(
          {},
          "",
          `/life-turning-point/${generatedResultId}`
        );
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("인생 반전 시기 분석 실패:", err);
      setError(
        err instanceof Error
          ? err.message
          : "분석 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요."
      );
      setStep("input");
    }
  };

  // 다시하기
  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep("input");

    window.history.pushState({}, "", "/life-turning-point");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (propResultId) return;
    if (step !== "result" || !result) return;
    incrementTestStat(TEST_ID, "play");
  }, [step, result, propResultId]);

  return (
    <div
      className="flex h-dvh justify-center"
      style={{
        backgroundColor: BG_COLOR,
        color: TEXT_COLOR,
      }}
    >
      <div className="flex h-full w-full max-w-110 flex-col md:max-w-150">
        <div className="w-full flex-1 overflow-auto">
          <TestTopNav
            bgColor={BG_COLOR}
            logoColor={THEME_COLOR}
            xColor={TEXT_COLOR}
          />

          <AnimatePresence mode="wait">
            {step === "landing" && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <LifeTurningLanding
                  onStart={() => {
                    setError(null);
                    setStep("input");
                  }}
                />
              </motion.div>
            )}

            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
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
                  isValid={isFormValid()}
                  error={error}
                  onSubmit={handleSubmit}
                  onBack={() => {
                    setError(null);
                    setStep("landing");
                  }}
                />
              </motion.div>
            )}

            {step === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LifeTurningAnalyzing />
              </motion.div>
            )}

            {step === "result" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col"
                style={{
                  padding: isNarrow ? "0 8px 48px" : "0 12px 48px",
                  gap: "16px",
                }}
              >
                {/* 캡처 대상 결과 카드 */}
                <div ref={resultCardRef}>
                  <LifeTurningResultCard result={result} />
                </div>

                {/* 결과 액션 버튼 및 링크 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2">
                    <PressableButton
                      onClick={handleReset}
                      label="다시하기"
                      style={{ flex: 1, height: "48px" }}
                      bgStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #E9DCD3",
                      }}
                      textStyle={{
                        color: THEME_COLOR,
                        fontSize: "15px",
                        fontWeight: 700,
                      }}
                    />

                    <PressableButton
                      onClick={() => handleSave(resultCardRef)}
                      label={saving ? "저장 중..." : "이미지 저장"}
                      disabled={saving}
                      style={{ flex: 1, height: "48px" }}
                      bgStyle={{
                        backgroundColor: THEME_COLOR,
                        borderRadius: "12px",
                        border: "none",
                      }}
                      hoverBackground="#C96F54"
                      textStyle={{
                        color: "#FFFFFF",
                        fontSize: "15px",
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  <OutlineBoxButton
                    onClick={() => {
                      trackSajuGPTClick(FEATURE_TYPE, currentResultId);
                      window.open(SAJUGPT_URL, "_blank", "noopener,noreferrer");
                    }}
                    height="48px"
                    color={THEME_COLOR}
                    background="#FFFFFF"
                    border="1px solid #E9DCD3"
                    borderRadius="12px"
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        letterSpacing: "-0.3px",
                        fontWeight: 700,
                        color: TEXT_COLOR,
                      }}
                    >
                      내 사주 고민, 사주GPT에게 물어보기
                    </span>
                  </OutlineBoxButton>

                  <div className="py-2">
                    <ShareRow
                      shareContent={{
                        featureType: FEATURE_TYPE,
                        title: "내 인생의 반전은 언제 시작될까?",
                        description:
                          "지금의 운 흐름과 귀인운, 앞으로의 전환 시기를 확인해 보세요.",
                        shareUrl,
                        imageUrl: origin
                          ? `${origin}/life-turning-point/og-share.png`
                          : "/life-turning-point/og-share.png",
                        testId: TEST_ID,
                      }}
                      copyColor={THEME_COLOR}
                      copyHoverColor="#C96F54"
                      copyIconColor="#FFFFFF"
                    />
                  </div>
                </motion.div>

                {/* 하단 댓글 및 추천 테스트 */}
                <div className="mt-2">
                  <ResultFooterSections
                    excludeId={TEST_ID}
                    titleStyle={{
                      fontSize: "16px",
                      fontWeight: 700,
                      letterSpacing: "-0.9px",
                      color: "#F3EAFF",
                      paddingLeft: "2px",
                    }}
                    cardBg="rgba(31, 20, 60, 0.75)"
                    cardTitleColor={TEXT_COLOR}
                    featureType={FEATURE_TYPE}
                    resultId={currentResultId}
                    storageKey="life_turning_point_liked_comments"
                    placeholder="나의 인생 반전 시기에 대해 이야기해 봐요 :)"
                    themeColor={THEME_COLOR}
                    inputBg="#FFFFFF"
                    disabledBg="#E9DCD3"
                    shareToRecommendGap={24}
                    dark={true}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}