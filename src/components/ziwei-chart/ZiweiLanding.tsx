'use client';

import { motion } from 'framer-motion';
import LandingCTAButton from '@/components/LandingCTAButton';
import { ZIWEI_PALETTE as C } from '@/lib/ziwei-chart/theme';

interface Props {
  onStart: () => void;
}

export default function ZiweiLanding({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center" style={{ paddingBottom: '40px' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full flex items-center justify-center"
        style={{ aspectRatio: '1448 / 1086', backgroundColor: '#E5E7EB', position: 'relative' }}
      >
        <p style={{ color: '#6B7280', fontSize: '16px', fontWeight: 600 }}>메인 썸네일 이미지 영역</p>
      </motion.div>

      <div className="w-full flex flex-col items-center" style={{ padding: '40px 16px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <LandingCTAButton
            onClick={onStart}
            label="내 명반 확인하기"
            background={C.primary}
            color="#FFFFFF"
            hoverBackground="#5A26A6"
            textStyle={{ fontWeight: 700, fontSize: '16px' }}
          />
        </motion.div>
      </div>
    </div>
  );
}