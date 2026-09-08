'use client';

import { motion } from 'framer-motion';

import { SKILL_ITEM_COLORS as C } from '@/constants/shinsalItemTheme';

export default function SkillAnalyzing() {
  return (
    <div
      className="w-full h-full min-h-full flex-1 flex flex-col items-center justify-center gap-5 p-6"
      style={{
        backgroundColor: C.panelBg,
        color: C.textPrimary,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="
          w-20
          h-20
          rounded-full
          flex
          items-center
          justify-center
          border
        "
        style={{
          backgroundColor: 'rgba(139, 95, 199, 0.10)',
          borderColor: 'rgba(139, 95, 199, 0.20)',
        }}
      >
        <span className="text-3xl">
          ✨
        </span>
      </motion.div>

      {/* 로딩 */}
      <div
        className="w-10 h-10 border-2 rounded-full animate-spin"
        style={{
          borderColor: 'rgba(139, 95, 199, 0.18)',
          borderTopColor: C.accent,
        }}
      />

      {/* 텍스트 */}
      <div className="text-center mt-1">
        <p
          className="text-lg font-bold"
          style={{
            color: C.accent,
          }}
        >
          나의 12신살을 살펴보고 있어요
        </p>

        <p
          className="text-xs mt-2 leading-5"
          style={{
            color: C.textSecondary,
          }}
        >
          사주를 바탕으로
          <br />
          나에게 나타나는 신살을 확인하고 있어요.
        </p>
      </div>
    </div>
  );
}