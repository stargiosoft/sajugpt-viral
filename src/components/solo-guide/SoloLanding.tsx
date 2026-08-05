'use client';

import { motion } from 'framer-motion';
import LandingCTAButton from '@/components/LandingCTAButton';
import ShareRow from '@/components/ShareRow';
import CommentBoard from '@/components/CommentBoard';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import { SOLO_COLORS as C } from '@/constants/soloGuideTheme';
import { LANDING_GAPS } from '@/constants/layoutGaps';

export default function SoloLanding({ onStart }: { onStart: () => void }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ backgroundColor: C.frameBg }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
        style={{ position: 'relative', aspectRatio: '1448 / 1086' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/solo-guide/landing-thumbnail.png"
          alt="솔로 탈출 지침서"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      <div style={{ padding: `${LANDING_GAPS.heroToCta}px 16px 0` }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LandingCTAButton
            onClick={onStart}
            label="시작하기"
            background={C.primary}
            color={C.textOnPrimary}
            hoverBackground={C.primaryHover}
            height="56px"
            borderRadius="18px"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ marginTop: LANDING_GAPS.ctaToShare, textAlign: 'center' }}
        >
          <ShareRow
            shareContent={{
              featureType: 'solo_guide',
              title: '솔로 탈출 지침서💕',
              description: '연애는 용기보다, 나를 아는 것부터',
              shareUrl: origin ? `${origin}/solo-guide` : '',
              imageUrl: origin ? `${origin}/solo-guide/og-share.jpg` : '/solo-guide/og-share.jpg',
              testId: 'solo-guide',
            }}
            copyColor={C.primary}
            copyHoverColor={C.primaryHover}
            copyIconColor={C.textOnPrimary}
          />
          <SajuGPTLinkButton featureType="solo_guide" color="rgb(248 72 132)" hoverColor="rgb(236 27 98)" label="사주GPT 연애상담하기" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ marginTop: LANDING_GAPS.shareToComment, marginBottom: '200px' }}
        >
          <CommentBoard
            featureType="solo_guide"
            storageKey="solo_guide_liked_comments"
            placeholder="나의 연애 유형은 뭐였나요?"
            themeColor={C.primary}
            inputBg="#FFFFFF"
            disabledBg="rgb(237 237 237)"
            emptyStateColor="rgb(124 124 124)"
            metaColor="rgb(126 126 126)"
            heartIdleColor="rgb(190 190 190)"
            moreButtonFontSize="12.5px"
            moreButtonHoverBg="rgba(252, 181, 209, 0.64)"
            submitButtonHoverBg={C.primaryHover}
          />
        </motion.div>
      </div>
    </div>
  );
}
