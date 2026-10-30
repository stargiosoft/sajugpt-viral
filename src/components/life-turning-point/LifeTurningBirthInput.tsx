"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Gender } from "@/types/battle";

import BirthInput from "@/components/BirthInput";
import GenderSelect from "@/components/GenderSelect";
import TimeSelectSheet from "@/components/TimeSelectSheet";
import FieldLabel from "@/components/FieldLabel";
import PressableButton from "@/components/PressableButton";

import useIsNarrow from "@/hooks/useIsNarrow";

interface Props {
  birthDate: string;
  onBirthDateChange: (value: string) => void;

  birthTime: string;
  unknownTime: boolean;
  onTimeSelect: (displayTime: string, isUnknown: boolean) => void;

  gender: Gender;
  onGenderChange: (value: Gender) => void;

  calendar: "solar" | "lunar";
  onCalendarChange: (value: "solar" | "lunar") => void;

  isValid: boolean;
  error: string | null;
  onSubmit: () => void;
  onBack: () => void;
}

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
  danger: "#FF6B6B",
  dangerBg: "rgba(255, 107, 107, 0.15)",
};

const FADE_UP = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function LifeTurningBirthInput({
  birthDate,
  onBirthDateChange,
  birthTime,
  unknownTime,
  onTimeSelect,
  gender,
  onGenderChange,
  calendar,
  onCalendarChange,
  isValid,
  error,
  onSubmit,
  onBack,
}: Props) {
  const isNarrow = useIsNarrow();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="life-turning-input-wrapper min-h-screen w-full"
      style={{
        backgroundColor: C.pageBg,
        color: C.text,
        padding: "12px 8px 48px",
      }}
    >
      {/* 뒤로 가기 */}
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 rounded-lg px-1 py-2 text-sm transition hover:opacity-80"
        style={{ color: C.textSecondary }}
      >
        <span aria-hidden="true">←</span>
        처음으로
      </button>

      {/* 상단 안내 박스 */}
      <div
        className="flex flex-col items-center justify-center rounded-[28px] shadow-2xl backdrop-blur-md overflow-hidden"
        style={{
          marginTop: "12px",
          padding: "8px",
          backgroundColor: C.panelBg,
          border: `1px solid ${C.border}`,
          width: "100%",
        }}
      >
        <div
          className="relative w-full overflow-hidden rounded-[22px]"
          style={{
            aspectRatio: "7 / 3",
          }}
        >
          <Image
            src="/life-turning-point/og-share.png"
            alt="내 인생의 반전은 언제 시작될까? 생년월일시로 지금의 운 흐름과 앞으로의 변화 가능성을 살펴보세요."
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* 입력 폼 */}
      <div style={{ marginTop: "12px" }}>
        <div
          className="flex flex-col rounded-[28px] shadow-2xl backdrop-blur-md"
          style={{
            padding: isNarrow ? "28px 20px 32px" : "36px 32px 40px",
            backgroundColor: C.panelBg,
            border: `1px solid ${C.border}`,
          }}
        >
          <motion.div
            className="flex w-full flex-col"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {/* 성별 */}
            <motion.div className="flex w-full flex-col" variants={FADE_UP}>
              <FieldLabel
                color={C.textSecondary}
                fontSize="13px"
                marginBottom="6px"
              >
                성별
              </FieldLabel>

              <GenderSelect
                value={gender}
                onChange={onGenderChange}
                accentColor={C.accent}
                bgColor={C.cardBg}
                fontSize="16px"
                height="44px"
                unselectedColor={C.textTertiary}
                textStrokeWidth="0px"
                border={`1px solid ${C.border}`}
                indicatorBoxShadow="0 0 12px rgba(157, 82, 232, 0.4)"
              />
            </motion.div>

            {/* 양력 / 음력 */}
            <motion.div
              className="mt-6 flex w-full flex-col"
              variants={FADE_UP}
            >
              <FieldLabel
                color={C.textSecondary}
                fontSize="13px"
                marginBottom="8px"
              >
                달력 기준
              </FieldLabel>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "solar", label: "양력" },
                    { value: "lunar", label: "음력" },
                  ] as const
                ).map((option) => {
                  const selected = calendar === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onCalendarChange(option.value)}
                      className="rounded-xl transition-all"
                      style={{
                        height: "44px",
                        border: `1px solid ${
                          selected ? C.accentYellow : C.border
                        }`,
                        backgroundColor: selected
                          ? "rgba(157, 82, 232, 0.25)"
                          : C.cardBg,
                        color: selected ? C.accentYellow : C.textTertiary,
                        fontSize: "15px",
                        fontWeight: selected ? 700 : 500,
                        boxShadow: selected
                          ? "0 0 10px rgba(255, 230, 98, 0.2)"
                          : "none",
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <p
                className="mt-2 text-xs leading-5"
                style={{ color: C.textTertiary }}
              >
                음력 생일이라면 음력을 선택해 주세요.
              </p>
            </motion.div>

            {/* 생년월일 */}
            <motion.div
              className="flex w-full flex-col"
              style={{
                marginTop: isNarrow ? "24px" : "32px",
              }}
              variants={FADE_UP}
            >
              <FieldLabel
                color={C.textSecondary}
                fontSize="13px"
                marginBottom="6px"
              >
                생년월일
              </FieldLabel>

              <BirthInput
                value={birthDate}
                onChange={onBirthDateChange}
                accentColor={C.accent}
                bgColor={C.cardBg}
                borderColor={C.border}
                borderWidth="1px"
                textColor={C.text}
                fontSize="17px"
                height="52px"
                onEnter={onSubmit}
              />
            </motion.div>

            {/* 태어난 시간 */}
            <motion.div
              className="flex w-full flex-col"
              style={{
                marginTop: isNarrow ? "24px" : "32px",
              }}
              variants={FADE_UP}
            >
              <FieldLabel
                color={C.textSecondary}
                fontSize="13px"
                marginBottom="6px"
              >
                태어난 시간
              </FieldLabel>

              <TimeSelectSheet
                value={birthTime}
                unknownTime={unknownTime}
                onSelect={onTimeSelect}
                accentColor={C.accent}
                bgColor={C.cardBg}
                borderColor={`1px solid ${C.border}`}
                textColor={C.text}
                placeholderColor={C.textTertiary}
                sheetBgColor="#1D123A"
                sheetTextColor={C.text}
                dragHandleColor={C.border}
                hoverBgClass="hover:bg-purple-900/40"
                selectedBgColor="rgba(157, 82, 232, 0.3)"
                selectedTextColor={C.accentYellow}
                fontSize="17px"
                height="52px"
                arrowColor={C.textSecondary}
                sheetTitleFontWeight={700}
                sheetTitleTextStrokeWidth="0px"
                sheetTitleLetterSpacing="-0.5px"
              />

              <p
                className="mt-2 text-xs leading-5"
                style={{ color: C.textTertiary }}
              >
                태어난 시간을 모른다면 모름으로 선택해도 괜찮아요. 시간에 따라
                해석이 달라질 수 있어요.
              </p>
            </motion.div>

            {/* 에러 메시지 */}
            {error && (
              <motion.div
                className="mt-5 flex items-start rounded-xl"
                role="alert"
                style={{
                  borderRadius: "12px",
                  padding: "12px 16px",
                  backgroundColor: C.dangerBg,
                  border: `1px solid ${C.danger}88`,
                }}
                variants={FADE_UP}
              >
                <p
                  style={{
                    color: C.danger,
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  {error}
                </p>
              </motion.div>
            )}

            {/* 분석 버튼 */}
            <motion.div
              style={{
                marginTop: "32px",
              }}
              variants={FADE_UP}
            >
              <PressableButton
                onClick={isValid ? onSubmit : undefined}
                disabled={!isValid}
                label={
                  <span style={{ fontWeight: 800 }}>
                    내 인생의 반전 시기 알아보기
                  </span>
                }
                style={{
                  height: "56px",
                  borderRadius: "16px",
                }}
                bgStyle={{
                  background: isValid
                    ? "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)"
                    : "rgba(255, 255, 255, 0.12)",
                  borderRadius: "16px",
                  border: isValid
                    ? "1px solid rgba(255, 255, 255, 0.2)"
                    : `1px solid ${C.border}`,
                  boxShadow: isValid
                    ? "0 8px 24px rgba(124, 58, 237, 0.4)"
                    : "none",
                }}
                hoverBackground="#6D28D9"
                textStyle={{
                  color: isValid ? "#FFFFFF" : C.textTertiary,
                  fontWeight: 800,
                  fontSize: isNarrow ? "15.5px" : "17px",
                  lineHeight: "24px",
                  letterSpacing: "-0.32px",
                }}
              />
            </motion.div>

            {/* 안내 문구 */}
            <motion.p
              className="mt-4 text-center"
              style={{
                color: C.textTertiary,
                fontSize: "11.5px",
                lineHeight: 1.7,
              }}
              variants={FADE_UP}
            >
              분석 결과는 자기 이해를 위한 참고용이며, 미래를 확정적으로
              예측하지 않아요.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}