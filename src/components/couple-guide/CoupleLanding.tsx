'use client';

import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import { COUPLE_COLORS as C, FADE_UP } from '@/constants/coupleGuideTheme';

interface Props {
  onStart: () => void;
}

export default function CoupleLanding({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '32px 20px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <motion.div variants={FADE_UP} initial="hidden" animate="visible" className="flex flex-col items-center">
        {/* TODO: /couple-guide/landing-title.png 같은 브랜드 이미지로 교체 */}
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: C.text, textAlign: 'center', lineHeight: 1.35 }}>
          우리 둘, 진짜 잘 맞을까?
        </h1>
        <p style={{ marginTop: '10px', fontSize: '15px', color: C.textTertiary, textAlign: 'center' }}>
          생년월일시로 알아보는 우리 커플의 겉궁합
        </p>
      </motion.div>

      <motion.div
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        style={{
          marginTop: '32px',
          width: '100%',
          maxWidth: '360px',
          aspectRatio: '1 / 1',
          borderRadius: '28px',
          backgroundColor: C.primaryDim,
          border: `2px solid ${C.frameBorder}`,
        }}
        // TODO: 커플 일러스트 이미지 배경으로 교체
      />

      <motion.div
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        style={{ marginTop: '32px', width: '100%', maxWidth: '360px' }}
      >
        <PressableButton
          onClick={onStart}
          label="궁합 보러가기"
          style={{ height: '56px' }}
          bgStyle={{ backgroundColor: C.primary, borderRadius: '18px', border: 'none' }}
          hoverBackground={C.primaryHover}
          textStyle={{ color: C.textOnPrimary, fontWeight: 600, fontSize: '16px' }}
        />
      </motion.div>
    </motion.div>
  );
}