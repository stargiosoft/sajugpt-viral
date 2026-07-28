'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import LandingCTAButton from '@/components/LandingCTAButton';
import MoneyCommentBoard from './MoneyCommentBoard';
import { MONEY_COLORS as C } from '@/constants/moneyTimelineTheme';

interface Props {
  onStart: () => void;
}

export default function MoneyLanding({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center"
      style={{ paddingBottom: '40px' }}
    >
      <div className="w-full" style={{ position: 'relative', aspectRatio: '1448 / 1086' }}>
        <Image
          src="/money-timeline/thumbnail-v3.png"
          alt="내 돈복 테스트"
          fill
          priority
          sizes="(max-width: 440px) 100vw, (max-width: 768px) 440px, 600px"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="w-full flex flex-col items-center" style={{ padding: '20px 16px 0' }}>
        <div className="w-full" style={{ marginBottom: '32px' }}>
          <LandingCTAButton
            onClick={onStart}
            label="시작하기"
            background={C.gold}
            color={C.textOnGold}
            hoverBackground={C.goldHover}
            textStyle={{ fontWeight: 500, fontSize: '16px', WebkitTextStroke: `0.6px ${C.textOnGold}` }}
          />
        </div>

        <div className="w-full">
          <MoneyCommentBoard />
        </div>
      </div>
    </motion.div>
  );
}
