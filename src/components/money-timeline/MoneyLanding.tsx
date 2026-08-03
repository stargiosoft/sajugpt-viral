'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import LandingCTAButton from '@/components/LandingCTAButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import CommentBoard from '@/components/CommentBoard';
import ShareRow from '@/components/ShareRow';
import { MONEY_COLORS as C } from '@/constants/moneyTimelineTheme';
import { LANDING_GAPS } from '@/constants/layoutGaps';

interface Props {
  onStart: () => void;
}

export default function MoneyLanding({ onStart }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="flex flex-col items-center" style={{ paddingBottom: '40px' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
        style={{ position: 'relative', aspectRatio: '1448 / 1086' }}
      >
        <Image
          src="/money-timeline/thumbnail-v3.png"
          alt="내 돈복 테스트"
          fill
          priority
          sizes="(max-width: 440px) 100vw, (max-width: 768px) 440px, 600px"
          style={{ objectFit: 'cover' }}
        />
      </motion.div>

      <div className="w-full flex flex-col items-center" style={{ padding: `${LANDING_GAPS.heroToCta}px 16px 0` }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
          style={{ marginBottom: LANDING_GAPS.ctaToShare }}
        >
          <LandingCTAButton
            onClick={onStart}
            label="시작하기"
            background={C.gold}
            color={C.textOnGold}
            hoverBackground={C.goldHover}
            textStyle={{ fontWeight: 500, fontSize: '14px', WebkitTextStroke: `0.6px ${C.textOnGold}` }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="w-full"
        >
          <ShareRow
            shareContent={{
              featureType: 'money_timeline',
              testId: 'money-timeline',
              title: '내 돈복 테스트',
              description: '내 사주 속 돈의 흐름을 분석해 드려요.',
              shareUrl: `${origin}/money-timeline?v=2`,
              imageUrl: `${origin}/money-timeline/og-share.png?v=2`,
            }}
            copyColor={C.gold}
            copyHoverColor="rgb(95, 74, 220)"
            copyIconColor={C.textOnGold}
          />
          <SajuGPTLinkButton featureType="money_timeline" color={C.textTertiary} hoverColor={C.gold} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full"
          style={{ marginTop: LANDING_GAPS.shareToComment }}
        >
          <CommentBoard
            featureType="money_timeline"
            storageKey="money_timeline_liked_comments"
            placeholder="내 돈복은 어떤가요?"
            themeColor="#735EF2"
            inputBg="#FFFFFF"
            disabledBg="#DCE0E5"
          />
        </motion.div>
      </div>
    </div>
  );
}
