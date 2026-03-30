'use client';

import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
}

export default function NightLanding({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh', padding: '0 24px' }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p style={{ fontSize: '14px', color: '#8b7aaa', letterSpacing: '3px', fontWeight: 500 }}>
          은밀한 기록이 유출되었습니다
        </p>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
        style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#f0e6ff',
          marginTop: '16px',
          lineHeight: '1.3',
          letterSpacing: '-0.5px',
        }}
      >
        밤(夜) 설명서
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
        style={{
          fontSize: '15px',
          color: '#9990ad',
          marginTop: '12px',
          lineHeight: '1.6',
        }}
      >
        시종들의 은밀한 난상토론이<br />
        유출되었습니다
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-center"
        style={{
          fontSize: '13px',
          color: '#6b6080',
          marginTop: '24px',
          lineHeight: '1.6',
        }}
      >
        사주 기반 은밀한 체질 평가표를 받고<br />
        시종 3명이 마마를 두고 벌이는<br />
        쟁탈전을 엿들어보세요
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        whileTap={{ scale: 0.96 }}
        onClick={onStart}
        style={{
          marginTop: '48px',
          width: '100%',
          maxWidth: '280px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: '#7A38D8',
          border: 'none',
          cursor: 'pointer',
          fontSize: '17px',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.3px',
          boxShadow: '0 4px 24px rgba(122, 56, 216, 0.4)',
        }}
      >
        엿듣기
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          fontSize: '11px',
          color: '#4a4460',
          marginTop: '16px',
        }}
      >
        가입 없이 생년월일만으로 진단
      </motion.p>
    </motion.div>
  );
}
