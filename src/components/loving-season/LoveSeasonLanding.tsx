'use client';

import { motion } from 'framer-motion';
import LandingCTAButton from '@/components/LandingCTAButton';
import ShareRow from '@/components/ShareRow';
import CommentBoard from '@/components/CommentBoard';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import { SOLO_COLORS as C } from '@/constants/soloGuideTheme';
import { LANDING_GAPS } from '@/constants/layoutGaps';

interface Props {
  onStart: () => void;
}

const PIXEL_FONT = "'DungGeunMo', 'NeoDunggeunmo', monospace";

export function LoveSeasonLanding({ onStart }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ backgroundColor: C.frameBg, minHeight: '100vh', overflowX: 'hidden' }}>
      <style jsx global>{`
        @font-face {
          font-family: 'DungGeunMo';
          src: url('https://cdn.jsdelivr.net/gh/fontbee/font@main/Orioncactus/DungGeunMo.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'NeoDunggeunmo';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.3/NeoDunggeunmo.woff') format('woff');
          font-weight: normal;
          font-display: swap;
        }
      `}</style>

      {/* 1. 히어로 메인 비주얼 영역 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
        style={{ position: 'relative', aspectRatio: '1448 / 1086' }}
      >
        <img
          src="/loving-season/landing-thumbnail.png"
          alt="나는 대체 언제 연애하나?"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.div>

      <div style={{ padding: `${LANDING_GAPS.heroToCta}px 20px 0` }}>
        {/* 2. 직관적인 헤드라인 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '24px' }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '7px 14px',
              backgroundColor: 'rgba(255, 75, 114, 0.08)',
              border: `1.5px solid rgba(255, 75, 114, 0.35)`,
              color: C.primary,
              borderRadius: '10px',
              fontFamily: PIXEL_FONT,
              fontSize: '12px',
              fontWeight: 400,
              letterSpacing: '0.4px',
              marginBottom: '10px',
            }}
          >
            🔥 사주로 보는 솔로 탈출 타이밍
          </span>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 900,
              color: C.text,
              lineHeight: 1.3,
              wordBreak: 'keep-all',
              letterSpacing: '-0.5px',
            }}
          >
            <span style={{ color: C.primary }}>나는 언제 연애하려나..?</span>
          </h1>
          <p
            style={{
              marginTop: '10px',
              fontSize: '15px',
              color: '#555555',
              lineHeight: 1.5,
              wordBreak: 'keep-all',
              fontWeight: 500,
            }}
          >
            운명의 상대가 찾아오는 달을 콕 짚어드려요.
          </p>
        </motion.div>

        {/* 3. 직관적인 메인 CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <LandingCTAButton
            onClick={onStart}
            label="내 연애 타이밍 확인하기 💘"
            background={C.primary}
            color={C.textOnPrimary}
            hoverBackground={C.primaryHover}
            height="58px"
            borderRadius="18px"
          />
        </motion.div>

        {/* 4. 공유 및 상담 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            marginTop: LANDING_GAPS.ctaToShare,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <ShareRow
            shareContent={{
              featureType: 'loving_season',
              title: '나는 언제 연애하려나..',
              description: '내 사주에 연애운 들어오는 시기 솔직하게 알아보기',
              shareUrl: origin ? `${origin}/loving-season` : '',
              imageUrl: origin ? `${origin}/loving-season/og-share.jpg` : '/loving-season/og-share.jpg',
              testId: 'loving-season',
            }}
            copyColor={C.primary}
            copyHoverColor={C.primaryHover}
            copyIconColor={C.textOnPrimary}
          />
          <SajuGPTLinkButton
            featureType="loving_season"
            color="rgb(248, 72, 132)"
            hoverColor="rgb(236, 27, 98)"
            label="사주GPT 연애상담하기"
          />
        </motion.div>

        {/* 5. 댓글 카드 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          style={{
            marginTop: LANDING_GAPS.shareToComment,
            marginBottom: '100px',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px 16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          }}
        >
          <CommentBoard
            featureType="loving_season"
            storageKey="loving_season_liked_comments"
            placeholder="다들 언제 연애운 터지나요? 한 마디 남겨보세요!"
            themeColor={C.primary}
            inputBg="#F8F9FA"
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