'use client';

import { motion } from 'framer-motion';
import ShareRow from '@/components/ShareRow';
import CommentBoard from '@/components/CommentBoard';
import LandingCTAButton from '@/components/LandingCTAButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import { OHENG_COLORS as C } from '@/constants/ohengTheme';

export default function Landing({ onStart, thumbnailSrc }: { onStart: () => void; thumbnailSrc?: string }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
        style={{ position: 'relative', aspectRatio: '1448 / 1086' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailSrc}
          alt="인간 사용설명서"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      <div style={{ padding: '20px 16px 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LandingCTAButton
            onClick={onStart}
            label="시작하기"
            background={C.blue}
            color={C.textOnBlue}
            hoverBackground={C.blueHover}
            height="56px"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ marginTop: '28px', textAlign: 'center' }}
        >
          <ShareRow
            shareContent={{
              featureType: 'oheng',
              title: '인간 사용설명서',
              description: '오행으로 분석한 나의 진짜 성향을 확인해보세요.',
              shareUrl: origin ? `${origin}/oheng` : '',
              imageUrl: origin ? `${origin}/oheng/og-share.jpg` : '/oheng/og-share.jpg',
              testId: 'oheng',
            }}
            copyColor={C.blue}
            copyHoverColor={C.blueHover}
            copyIconColor={C.textOnBlue}
          />
          <SajuGPTLinkButton featureType="oheng" color={C.textTertiary} hoverColor={C.blue} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ marginTop: '48px', marginBottom: '200px' }}
        >
          <CommentBoard
            featureType="oheng"
            storageKey="oheng_liked_comments"
            placeholder="여러분의 대표 오행은 무엇인가요?"
            themeColor={C.blue}
          />
        </motion.div>
      </div>
    </div>
  );
}
