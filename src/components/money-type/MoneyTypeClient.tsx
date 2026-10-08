"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import OutlineBoxButton from "@/components/OutlineBoxButton";
import PressableButton from "@/components/PressableButton";
import ShareRow from "@/components/ShareRow";
import ResultFooterSections from "@/components/ResultFooterSections";

import { SAJUGPT_URL } from "@/constants/links";
import { trackEvent, trackSajuGPTClick } from "@/lib/analytics";
import { incrementTestStat } from "@/lib/testStats";
import { useShareActions } from "@/lib/useShareActions";

import MoneyTypeAnalyzing from "./MoneyTypeAnalyzing";
import MoneyTypeBirthInput from "./MoneyTypeBirthInput";
import MoneyTypeLanding from "./MoneyTypeLanding";
import MoneyTypeResultCard from "./MoneyTypeResultCard";

type Step = "landing" | "input" | "analyzing" | "result";

export type MoneyTypeCode =
  | "stable"
  | "talent"
  | "business"
  | "investment"
  | "opportunity"
  | "network";

export type MoneyTypeInfo = {
  id?: string;
  code: MoneyTypeCode;
  title: string;
  emoji: string;
  keyword: string;
  description: string;
  money_formula: string;
  strengths: string[];
  caution: string;
  is_active?: boolean;
  sort_order?: number;
};

export type MoneyTypeResultData = {
  resultId: string;
  code: MoneyTypeCode;
  scores: Record<string, number>;
  reason: string[];
  typeInfo: MoneyTypeInfo | null;
};

interface MoneyTypeClientProps {
  resultId?: string;
  initialData?: MoneyTypeResultData | null;
}

const THEME_COLOR = "#E98C72";
const THEME_HOVER = "#d97a60";
const TEXT_COLOR = "#493C35";
const BORDER_COLOR = "#F0E5DB";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const EDGE_FUNCTION_NAME = "analyze-money-type";

function getEdgeFunctionUrl() {
  return `${SUPABASE_URL}/functions/v1/${EDGE_FUNCTION_NAME}`;
}

function normalizeResult(
  raw: any,
  fallbackResultId?: string,
): MoneyTypeResultData | null {
  if (!raw) return null;

  const resultId = raw.resultId ?? raw.result_id ?? fallbackResultId;
  const innerData = raw.data ?? raw;

  const code =
    innerData.code ??
    innerData.type_code ??
    innerData.typeCode;

  if (!resultId || !code) {
    console.error("❌ 정규화 실패 데이터:", raw);
    return null;
  }

  const scores =
    innerData.scores && typeof innerData.scores === "object"
      ? innerData.scores
      : {};

  const reason = Array.isArray(innerData.reason)
    ? innerData.reason
    : Array.isArray(innerData.reasons)
    ? innerData.reasons
    : [];

  const typeInfo =
    innerData.typeInfo ??
    innerData.type ??
    innerData.moneyType ??
    innerData.money_type ??
    null;

  return {
    resultId,
    code,
    scores,
    reason,
    typeInfo,
  };
}

export default function MoneyTypeClient({
  resultId,
  initialData = null,
}: MoneyTypeClientProps) {
  const [step, setStep] = useState<Step>(
    resultId || initialData ? "result" : "landing",
  );
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(true);
  const [gender, setGender] = useState<"female" | "male">("female");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MoneyTypeResultData | null>(
    initialData ?? null,
  );
  const [currentResultId, setCurrentResultId] = useState<string | null>(
    initialData?.resultId ?? resultId ?? null,
  );
  const [isLoadingResult, setIsLoadingResult] = useState(false);

  const resultCardRef = useRef<HTMLDivElement>(null);

  // 결과 공유 URL 생성 
  const resultUrl = useMemo(() => {
    if (!currentResultId) return "";
    const path = `/money-type/${currentResultId}`;
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
   }, [currentResultId]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const { saving, handleSave } = useShareActions({
    featureType: "money_type",
    resultId: currentResultId ?? "",
    getShareText: () => resultUrl,
    imageFilename: `돈버는방식_${currentResultId ?? "result"}.png`,
    onSave: () => incrementTestStat("money-type", "share"),
  });

  const loadResult = useCallback(async (targetResultId: string) => {
    if (!targetResultId) return;

    setIsLoadingResult(true);
    setError(null);

    try {
      const url = `${getEdgeFunctionUrl()}?resultId=${encodeURIComponent(targetResultId)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        cache: "no-store",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "결과를 불러오지 못했습니다.");
      }

      const normalized = normalizeResult(payload, targetResultId);
      if (!normalized) {
        throw new Error("결과 데이터가 올바르지 않습니다.");
      }

      setResult(normalized);
      setCurrentResultId(normalized.resultId);
      setStep("result");
    } catch (err) {
      console.error("💰 돈 버는 방식 결과 불러오기 실패:", err);
      setError(
        err instanceof Error ? err.message : "결과를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoadingResult(false);
    }
  }, []);

  useEffect(() => {
    if (!resultId) return;
    if (initialData && initialData.resultId === resultId) {
      setResult(initialData);
      setCurrentResultId(resultId);
      setStep("result");
      return;
    }
    void loadResult(resultId);
  }, [resultId, initialData, loadResult]);

  useEffect(() => {
    if (!initialData) return;
    setResult(initialData);
    setCurrentResultId(initialData.resultId);
    setStep("result");
  }, [initialData]);

  useEffect(() => {
    if (resultId) return;
    if (step !== "result" || !result) return;
    incrementTestStat("money-type", "play");
  }, [step, result, resultId]);

  const isValidBirthDate = useMemo(() => {
    const value = birthDate.replace(/[^\d]/g, "");
    if (value.length !== 8) return false;

    const year = Number(value.slice(0, 4));
    const month = Number(value.slice(4, 6));
    const day = Number(value.slice(6, 8));

    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;

    const lastDay = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDay) return false;

    return true;
  }, [birthDate]);

  const handleStart = () => {
    setError(null);
    setStep("input");
  };

  const handleTimeSelect = (value: string, isUnknown = false) => {
    setBirthTime(value);
    setUnknownTime(isUnknown);
  };

  const handleSubmit = async () => {
    setError(null);
    const cleanBirthday = birthDate.replace(/[^\d]/g, "");

    if (!isValidBirthDate) {
      setError("올바른 생년월일을 입력해주세요.");
      return;
    }

    if (!gender) {
      setError("성별을 선택해주세요.");
      return;
    }

    trackEvent("money_type_input_start");
    setStep("analyzing");

    try {
      const response = await fetch(getEdgeFunctionUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          birthday: cleanBirthday,
          birthTime: unknownTime ? "" : birthTime,
          birthTimeUnknown: unknownTime,
          gender,
          calendarType: "solar",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "사주 분석에 실패했습니다.");
      }

      const normalized = normalizeResult(payload);
      if (!normalized) {
        throw new Error("분석 결과를 받아오지 못했습니다.");
      }

      setResult(normalized);
      setCurrentResultId(normalized.resultId);
      trackEvent("money_type_result", { typeCode: normalized.code });

      setStep("result");
    } catch (err) {
      console.error("💰 돈 버는 방식 분석 실패:", err);
      setError(
        err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.",
      );
      setStep("input");
    }
  };

  const handleReset = () => {
  setBirthDate("");
  setBirthTime("");
  setUnknownTime(true);
  setGender("female");
  setError(null);
  setResult(null);
  setCurrentResultId(null);

  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", "/money-type");
  }

  setStep("landing");
};

  if (isLoadingResult && !result) {
    return <MoneyTypeAnalyzing />;
  }

  const typeTitle = result?.typeInfo?.title ?? "";

  return (
    <main className="min-h-screen bg-[#FFF9F2]">
      <AnimatePresence mode="wait" initial={false}>
        {step === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <MoneyTypeLanding onStart={handleStart} />
          </motion.div>
        )}

        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <MoneyTypeBirthInput
              birthDate={birthDate}
              onBirthDateChange={setBirthDate}
              birthTime={birthTime}
              unknownTime={unknownTime}
              onTimeSelect={handleTimeSelect}
              gender={gender}
              onGenderChange={setGender}
              isValid={isValidBirthDate}
              error={error}
              onSubmit={handleSubmit}
            />
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MoneyTypeAnalyzing />
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MoneyTypeResultCard
                ref={resultCardRef}
                result={result}
                content={result.typeInfo}
                onReset={handleReset}
            >
              <div className="flex flex-col gap-2.5">
                <div style={{ display: "flex", gap: "8px" }}>
                  <PressableButton
                    onClick={handleReset}
                    label="다시하기"
                    style={{ flex: 1, height: "48px" }}
                    bgStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: `1px solid ${BORDER_COLOR}`,
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
                    hoverBackground={THEME_HOVER}
                    textStyle={{
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  />
                </div>

                <OutlineBoxButton
                  onClick={() => {
                    trackSajuGPTClick("money_type", currentResultId ?? "");
                    window.open(SAJUGPT_URL, "_blank");
                  }}
                  height="48px"
                  color={THEME_COLOR}
                  background="#ffffff"
                  border={`1px solid ${BORDER_COLOR}`}
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

                <div style={{ paddingTop: "6px", paddingBottom: "6px" }}>
                  <ShareRow
                    shareContent={{
                      featureType: "money_type",
                      title: "💰 나는 돈을 어떻게 버는 사람일까?",
                      description: typeTitle
                        ? `사주로 알아본 나의 돈 버는 방식은 '${typeTitle}'! 지금 확인해보세요.`
                        : "사주로 알아보는 나의 돈 버는 방식! 지금 확인해보세요.",
                      shareUrl: resultUrl,
                      imageUrl: origin
                        ? `${origin}/money-type/og-share.png`
                        : "/money-type/og-share.png",
                      testId: "money-type",
                    }}
                    copyColor={THEME_COLOR}
                    copyHoverColor={THEME_HOVER}
                    copyIconColor="#ffffff"
                  />
                </div>

                <div style={{ marginTop: "8px" }}>
                  <ResultFooterSections
                    excludeId="money-type"
                    titleStyle={{
                      fontSize: "16px",
                      fontWeight: 700,
                      letterSpacing: "-0.9px",
                      color: TEXT_COLOR,
                      paddingLeft: "2px",
                    }}
                    cardBg="#ffffff"
                    cardTitleColor={TEXT_COLOR}
                    featureType="money_type"
                    resultId={currentResultId ?? ""}
                    storageKey="money_type_liked_comments"
                    placeholder="내 돈 버는 방식에 대해 이야기해봐요 :)"
                    themeColor={THEME_COLOR}
                    inputBg="#ffffff"
                    disabledBg={BORDER_COLOR}
                    shareToRecommendGap={24}
                    dark={false}
                  />
                </div>
              </div>
            </MoneyTypeResultCard>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}