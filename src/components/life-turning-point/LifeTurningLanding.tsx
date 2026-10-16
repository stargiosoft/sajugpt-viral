"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import PressableButton from "@/components/PressableButton";
import SajuGPTLinkButton from "@/components/SajuGPTLinkButton";
import CommentBoard from "@/components/CommentBoard";
import ShareRow from "@/components/ShareRow";

import { LANDING_GAPS } from "@/constants/layoutGaps";

const SHARE_ROW_HIDDEN_PADDING = 12;

const C = {
  pageBg: "#120B2A",
  accent: "#9D52E8",
  accentYellow: "#FFE662",
  hover: "#8738D6",
  cardBg: "rgba(31, 20, 60, 0.75)",
  cardBorder: "rgba(180, 130, 255, 0.25)",
  text: "#F3EAFF",
  muted: "#B2A3D0",
};

function LifeTurningShareRow() {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <ShareRow
      shareContent={{
        featureType: "life_turning_point",
        title: " 내 인생의 반전은 언제 시작될까?",
        description:
          "지금의 운 흐름과 귀인운, 앞으로의 인생 전환 시기를 확인해 보세요!",
        shareUrl,
        imageUrl: origin
          ? `${origin}/life-turning-point/og-share.png`
          : "/life-turning-point/og-share.png",
        testId: "life-turning-point",
      }}
      copyColor={C.accent}
      copyHoverColor={C.hover}
      copyIconColor="#FFFFFF"
    />
  );
}

interface Props {
  onStart: () => void;
}

export default function LifeTurningLanding({ onStart }: Props) {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center"
      style={{
        paddingBottom: "40px",
        backgroundColor: C.pageBg,
        color: C.text,
      }}
    >
      {/* 타이틀 및 메인 썸네일 이미지 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full shadow-2xl"
        style={{
          position: "relative",
          aspectRatio: "1448 / 1086",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Image
          src="/life-turning-point/title-v1.png"
          alt="내 인생의 반전 시기는? 사주로 알아보는 인생 전환점"
          fill
          priority
          sizes="(max-width: 440px) 100vw, (max-width: 768px) 440px, 600px"
          style={{ objectFit: "cover" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, ${C.pageBg})`,
          }}
        />
      </motion.div>

      {/* 액션 및 설명 콘텐츠 */}
      <div
        className="flex w-full flex-col items-center"
        style={{
          padding: `${LANDING_GAPS.heroToCta}px 16px 0`,
        }}
      >
        {/* 시작하기 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full"
        >
          <PressableButton
            onClick={onStart}
            label={
              <span className="flex items-center justify-center gap-1.5 font-black">
                <span
                  style={{
                    color: "#FFFFFF",
                    textShadow: "0 0 10px rgba(255,230,98,0.5)",
                  }}
                >
                  내 인생의 반전 시기 알아보기
                </span>
              </span>
            }
            style={{
              height: "56px",
            }}
            bgStyle={{
              background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
            }}
            hoverBackground="#6D28D9"
            textStyle={{
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "16.5px",
              lineHeight: "24px",
              letterSpacing: "-0.32px",
            }}
          />
        </motion.div>

        {/* 공유 및 사주GPT 링크 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col items-center w-full"
          style={{
            marginTop:
              LANDING_GAPS.ctaToShare - SHARE_ROW_HIDDEN_PADDING,
          }}
        >
          <LifeTurningShareRow />

          <div style={{ marginTop: -SHARE_ROW_HIDDEN_PADDING }}>
            <SajuGPTLinkButton
              featureType="life_turning_point"
              color={C.muted}
              hoverColor={C.accentYellow}
            />
          </div>
        </motion.div>

        {/* 콘텐츠 소개 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-6 grid w-full grid-cols-3 gap-2"
        >
          <div
            className="flex flex-col items-center rounded-2xl px-2 py-4 text-center backdrop-blur-md transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.cardBorder}`,
            }}
          >
            <span className="text-2xl" aria-hidden="true">
              🌙
            </span>
            <p className="mt-2 text-sm font-bold" style={{ color: C.text }}>
              지금의 흐름
            </p>
            <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
              정체기의 의미
            </p>
          </div>

          <div
            className="flex flex-col items-center rounded-2xl px-2 py-4 text-center backdrop-blur-md transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.cardBorder}`,
            }}
          >
            <span className="text-2xl" aria-hidden="true">
              🫶
            </span>
            <p className="mt-2 text-sm font-bold" style={{ color: C.text }}>
              나의 귀인
            </p>
            <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
              도움의 실마리
            </p>
          </div>

          <div
            className="flex flex-col items-center rounded-2xl px-2 py-4 text-center backdrop-blur-md transition-transform hover:scale-[1.02]"
            style={{
              backgroundColor: C.cardBg,
              border: `1px solid ${C.cardBorder}`,
            }}
          >
            <span className="text-2xl" aria-hidden="true">
              🌅
            </span>
            <p className="mt-2 text-sm font-bold" style={{ color: C.text }}>
              반전의 순간
            </p>
            <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
              변화의 준비
            </p>
          </div>
        </motion.div>

        {/* 댓글 게시판 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="w-full"
          style={{
            marginTop: LANDING_GAPS.shareToComment,
          }}
        >
          <CommentBoard
            featureType="life_turning_point"
            storageKey="life_turning_point_liked_comments"
            placeholder="나의 인생 반전 시기에 대해 이야기해 봐요 :)"
            themeColor={C.accent}
            dark={true}
          />
        </motion.div>

        <p className="mt-6 text-center text-xs leading-5" style={{ color: C.muted }}>
          생년월일로 알아보는 나의 운 흐름 · 광필연구소
        </p>
      </div>
    </div>
  );
}