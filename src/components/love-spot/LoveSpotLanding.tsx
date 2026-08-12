'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import LandingCTAButton from '@/components/LandingCTAButton';
import ShareRow from '@/components/ShareRow';
import CommentBoard from '@/components/CommentBoard';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import { LOVE_SPOT_COLORS as C } from '@/constants/loveSpotTheme';
import { LANDING_GAPS } from '@/constants/layoutGaps';

const CARD_FONT_FAMILY = '"Dongle", sans-serif';

export default function LoveSpotLanding({ onStart }: { onStart: () => void }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ backgroundColor: C.frameBg, padding: '12px 8px 48px' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'relative',
          backgroundImage: 'url(/love-spot/heart-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '28px',
          padding: '32px 20px 28px',
          border: '2.5px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 16px 40px rgba(255, 150, 175, 0.2), inset 0 2px 6px rgba(255, 255, 255, 0.8)',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '38px', marginBottom: '8px' }}>💘</div>
          <Image
            src="/love-spot/love-spot-title.png"
            alt="내 반쪽은 어디에?"
            width={260}
            height={170}
            style={{ width: 'auto', height: 'auto', maxHeight: '130px', objectFit: 'contain' }}
            priority
          />
        </div>

        {/* 서브 타이틀 이미지 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
          <Image
            src="/love-spot/love-spot-subtitle.png"
            alt="설레는 만남이 시작되는 곳"
            width={200}
            height={32}
            style={{ width: 'auto', height: 'auto', maxHeight: '30px', objectFit: 'contain' }}
          />
        </div>

        {/* 카드 형태의 소개 문구 박스 */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            borderRadius: '20px',
            padding: '18px 20px',
            border: '1.5px solid #FFF0F3',
            boxShadow: '0 8px 20px rgba(216, 90, 127, 0.08)',
            fontFamily: CARD_FONT_FAMILY,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '28px',
              color: '#555555',
              lineHeight: 1.25,
              fontWeight: 600,
              wordBreak: 'keep-all',
              fontFamily: CARD_FONT_FAMILY,
            }}
          >
            내 사주 타고난 기운으로 찾아보는<br />
            설레는 인연 스팟과 연애 팁 ✨
          </p>
        </div>
      </motion.div>

      <div style={{ padding: `${LANDING_GAPS.heroToCta}px 8px 0` }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LandingCTAButton
            onClick={onStart}
            label="내 인연 스팟 찾기 💕"
            background="linear-gradient(135deg, #FF8A9E 0%, #FF9AAD 50%, #FFB3C6 100%)"
            color={C.textOnPrimary}
            hoverBackground={C.primaryHover}
            height="58px"
            borderRadius="20px"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{ marginTop: LANDING_GAPS.ctaToShare, textAlign: 'center' }}
        >
          <ShareRow
            shareContent={{
              featureType: 'love_spot',
              title: '내 인연은 어디에?💘',
              description: '사주로 알아보는, 설레는 만남이 시작되는 곳',
              shareUrl: origin ? `${origin}/love-spot` : '',
              imageUrl: origin ? `${origin}/love-spot/og-share.jpg` : '/love-spot/og-share.jpg',
              testId: 'love-spot',
            }}
            copyColor={C.primary}
            copyHoverColor={C.primaryHover}
            copyIconColor={C.textOnPrimary}
          />
          <div style={{ marginTop: '8px' }}>
            <SajuGPTLinkButton
              featureType="love_spot"
              color="rgb(248 72 132)"
              hoverColor="rgb(236 27 98)"
              label="사주GPT 연애상담하기 💬"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ marginTop: LANDING_GAPS.shareToComment, marginBottom: '160px' }}
        >
          <CommentBoard
            featureType="love_spot"
            storageKey="love_spot_liked_comments"
            placeholder="내 인연을 만나는 스팟은 어디인가요?"
            themeColor={C.primary}
            inputBg="#FFFFFF"
            disabledBg="rgb(237 237 237)"
            emptyStateColor="rgb(124 124 124)"
            metaColor="rgb(126 126 126)"
            heartIdleColor="rgb(190 190 190)"
            moreButtonFontSize="14px"
            moreButtonHoverBg="rgba(255,126,179,0.24)"
            submitButtonHoverBg={C.primaryHover}
          />
        </motion.div>
      </div>
    </div>
  );
}