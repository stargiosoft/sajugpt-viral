'use client';

import { motion } from 'framer-motion';

export default function ZiweiAnalyzing() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative min-h-[70vh] w-full flex flex-col items-center justify-center p-6 text-center overflow-hidden"
      style={{ fontFamily: "'JoseonLogo', serif" }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/30 rounded-full blur-[70px] pointer-events-none animate-pulse" />

      <div className="relative flex items-center justify-center w-36 h-36 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-cyan-400/50 border-t-purple-200 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
        />

        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border-2 border-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.6)]"
        >
          <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-pulse">
            🔮
          </span>
        </motion.div>

        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="absolute w-full h-full text-xs text-white"
        >
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 drop-shadow-[0_0_8px_rgba(255,255,255,1)]">
            ✨
          </span>
        </motion.span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 z-10"
      >
        {/* 메인 타이틀 */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          명반을 조립하고 있어요
        </h2>

        {/* 서브 문구 */}
        <p className="text-base sm:text-lg text-cyan-300 font-bold tracking-wide flex items-center justify-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <span>12궁의 별자리 배치 중</span>
          <span className="inline-flex gap-1 text-amber-300">
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
            >
              •
            </motion.span>
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
            >
              •
            </motion.span>
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
            >
              •
            </motion.span>
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}