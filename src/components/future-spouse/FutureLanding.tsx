'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import ShareRow from '@/components/ShareRow';
import CommentBoard from '@/components/CommentBoard';

const SPOUSE_COLORS = {
  primary: 'rgb(235, 85, 108)',
  primaryHover: 'rgb(220, 70, 95)',
  primaryDim: 'rgb(255, 248, 249)',
  textOnPrimary: '#FFFFFF',
  pageBg: '#FFFFFF', 
};

const LANDING_GAPS = {
  heroToCta: 20,
  ctaToShare: 24,
  shareToComment: 32,
};

const FADE_UP = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
    },
  },
};

interface Props {
  onStart: () => void;
}

export default function FutureSpouseLanding({ onStart }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="flex flex-col items-center min-h-screen" style={{ paddingBottom: '48px', backgroundColor: SPOUSE_COLORS.pageBg }}>
      {/* 랜딩 타이틀 히어로 이미지 (너비 꽉 참) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
        style={{ position: 'relative', aspectRatio: '1448 / 1086', boxSizing: 'border-box' }}
      >
        <Image
          src="/future-spouse/landing-title.png"
          alt="나의 미래 배우자 얼굴 & 특징 보고서"
          fill
          priority
          sizes="(max-width: 440px) 100vw, (max-width: 768px) 440px, 600px"
          style={{ objectFit: 'cover' }}
        />
      </motion.div>

      {/* 액션 및 설명 콘텐츠 영역 */}
      <div className="w-full flex flex-col items-center" style={{ padding: `${LANDING_GAPS.heroToCta}px 16px 0` }}>
        {/* 시작하기 버튼 */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <PressableButton
            onClick={onStart}
            label="미래 배우자 보러가기"
            style={{ height: '56px' }}
            bgStyle={{
              backgroundColor: SPOUSE_COLORS.primary,
              borderRadius: '18px',
              border: 'none',
            }}
            hoverBackground={SPOUSE_COLORS.primaryHover}
            textStyle={{
              color: SPOUSE_COLORS.textOnPrimary,
              fontWeight: 600,
              fontSize: '16px',
            }}
          />
        </motion.div>

        {/* 공유하기 영역 */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="w-full"
          style={{ marginTop: `${LANDING_GAPS.ctaToShare}px` }}
        >
          <ShareRow
            shareContent={{
              featureType: 'future_spouse',
              title: '나의 미래 배우자 얼굴 & 특징 보고서💍',
              description: '내 운명의 배우자는 어떤 사람일까? 사주 기반 AI 미래 배우자 분석',
              shareUrl,
              imageUrl: origin
                ? `${origin}/future-spouse/og-share.jpg`
                : '/future-spouse/og-share.jpg',
              testId: 'future-spouse',
            }}
            copyColor={SPOUSE_COLORS.primary}
            copyHoverColor={SPOUSE_COLORS.primaryHover}
            copyIconColor={SPOUSE_COLORS.textOnPrimary}
          />
        </motion.div>

        {/* 댓글 게시판 영역 */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="w-full"
          style={{ marginTop: `${LANDING_GAPS.shareToComment}px` }}
        >
          <CommentBoard
            featureType="future_spouse"
            storageKey="future_spouse_liked_comments"
            placeholder="미래 배우자 특징이 상상했던 것과 비슷한가요?"
            themeColor={SPOUSE_COLORS.primary}
            inputBg="rgb(244, 246, 247)"
            disabledBg="rgb(235 236 236)"
            emptyStateColor="rgb(124 124 124)"
            metaColor="rgb(126 126 126)"
            heartIdleColor="rgb(190 190 190)"
            moreButtonFontSize="12.5px"
            moreButtonHoverBg="rgba(255, 194, 207, 0.32)"
            submitButtonHoverBg={SPOUSE_COLORS.primaryHover}
          />
        </motion.div>
      </div>
    </div>
  );
}