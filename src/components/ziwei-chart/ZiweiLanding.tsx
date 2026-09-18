'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
        className="w-full relative z-10 flex items-center justify-center"
        style={{ aspectRatio: '1448 / 1086', backgroundColor: '#E5E7EB', position: 'relative' }}
      >
        <Image
          src="/ziwei-chart/main-thumbnail.png" 
          alt="메인 썸네일"
          fill
          priority
          className="object-cover"
        />
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
            textStyle={{ 
              fontFamily: 'JoseonLogo, JoseonGulim, serif',
              fontWeight: 700, 
              fontSize: '16px' 
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}