"use client";

import { motion } from "framer-motion";

export default function MoneyTypeAnalyzing() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-5">
      <div className="flex w-full max-w-107.5 flex-col items-center text-center">
        {/* 아이콘 */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFEFEA] text-[50px]"
        >
          💰
        </motion.div>

        {/* 타이틀 */}
        <h1 className="text-[24px] font-extrabold leading-[1.35] tracking-[-0.04em] text-[#493C35]">
          당신의 돈 버는 방식을
          <br />
          분석하고 있어요
        </h1>

        {/* 설명 */}
        <p className="mt-4 text-[14px] leading-6 text-[#A89990]">
          사주 속 재성·식상·비겁 등의 흐름을 살펴
          <br />
          나에게 맞는 돈 버는 유형을 찾는 중...
        </p>

        {/* 점 애니메이션 */}
        <div className="mt-7 flex items-center gap-1.5">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.15,
                ease: "easeInOut",
              }}
              className="h-2 w-2 rounded-full bg-[#E98C72]"
            />
          ))}
        </div>

        {/* 하단 문구 */}
        <p className="mt-8 text-xs text-[#B9AAA1]">
          잠시만 기다려주세요 :)
        </p>
      </div>
    </section>
  );
}