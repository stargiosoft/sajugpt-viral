'use client';

import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import ShareRow from '@/components/ShareRow';
import CommentBoard from '@/components/CommentBoard';
import { COUPLE_COLORS as C, FADE_UP } from '@/constants/coupleGuideTheme';
import { LANDING_GAPS } from '@/constants/layoutGaps';

interface Props {
  onStart: () => void;
}

export default function CoupleLanding({ onStart }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '0 20px 48px' }}
    >
      <motion.div
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        style={{
          width: '100%',
          aspectRatio: '1448 / 1086',
          backgroundColor: C.primaryDim,
          backgroundImage: 'url(/couple-guide/landing-title.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <motion.div
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        style={{ marginTop: `${LANDING_GAPS.heroToCta}px`, width: '100%' }}
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

      <motion.div
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        style={{ marginTop: `${LANDING_GAPS.ctaToShare}px` }}
      >
        <ShareRow
          shareContent={{
            featureType: 'couple_guide',
            title: '우리 사이 궁합 설명서💕',
            description: '100일 후에도 만날 사이일까? 사주 기반 AI 궁합 분석',
            shareUrl: origin ? `${origin}/couple-guide` : '',
            imageUrl: origin ? `${origin}/couple-guide/og-share.jpg` : '/couple-guide/og-share.jpg',
            testId: 'couple-guide',
          }}
          copyColor={C.primary}
          copyHoverColor={C.primaryHover}
          copyIconColor={C.textOnPrimary}
        />
      </motion.div>

      <motion.div
        variants={FADE_UP}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        style={{ marginTop: `${LANDING_GAPS.shareToComment}px` }}
      >
        <CommentBoard
          featureType="couple_guide"
          storageKey="couple_guide_liked_comments"
          placeholder="우리 커플 궁합은 몇 점이었나요?"
          themeColor={C.primary}
          inputBg="rgb(244, 246, 247)"
          disabledBg="rgb(235 236 236)"
          emptyStateColor="rgb(124 124 124)"
          metaColor="rgb(126 126 126)"
          heartIdleColor="rgb(190 190 190)"
          moreButtonFontSize="12.5px"
          moreButtonHoverBg="rgba(252, 181, 209, 0.64)"
          submitButtonHoverBg={C.primaryHover}
        />
      </motion.div>
    </motion.div>
  );
}