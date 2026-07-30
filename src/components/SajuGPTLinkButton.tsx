'use client';

import { motion } from 'framer-motion';
import { SAJUGPT_URL } from '@/constants/links';
import { trackSajuGPTClick, type FeatureType } from '@/lib/analytics';

interface Props {
  featureType: FeatureType;
  color: string;
  hoverColor?: string;
}

// 모든 테스트 랜딩 화면 공용 "사주GPT 바로가기" 링크 — 공유 아이콘 3개 바로 아래 고정 갭/타이포로 배치, color만 테스트별로 다르게
export default function SajuGPTLinkButton({ featureType, color, hoverColor }: Props) {
  return (
    <motion.a
      href={SAJUGPT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackSajuGPTClick(featureType)}
      whileHover={hoverColor ? { color: hoverColor } : { opacity: 0.8 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        display: 'block',
        marginTop: '24px',
        textAlign: 'center',
        color,
        fontFamily: 'Pretendard',
        fontSize: '13px',
        fontWeight: 600,
        textDecoration: 'none',
      }}
    >
      사주GPT 바로가기
    </motion.a>
  );
}
