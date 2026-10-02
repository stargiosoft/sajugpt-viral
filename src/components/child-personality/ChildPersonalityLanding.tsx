'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import CommentBoard from '@/components/CommentBoard';
import { LANDING_GAPS } from '@/constants/layoutGaps';
import ShareRow from '@/components/ShareRow';

const SHARE_ROW_HIDDEN_PADDING = 12;

const TEXT_COLOR = '#493C35';
const SUB_TEXT_COLOR = '#A89990';
const ACCENT_COLOR = '#E98C72';
const ACCENT_HOVER = '#d87b61';
const BORDER_COLOR = '#F0E5DB';
const PAGE_BG = '#FFF9F2';

function ChildPersonalityShareRow() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <ShareRow
      shareContent={{
        featureType: 'child_personality',
        testId: 'child-personality',
        title: '🧸 우리 아이 사용설명서',
        description: '사주로 알아보는 우리 아이의 성향과 공부 스타일',
        shareUrl,
        imageUrl: origin ? `${origin}/child-personality/og-share.png` : '/child-personality/og-share.png',
      }}
      copyColor={ACCENT_COLOR}
      copyHoverColor={ACCENT_HOVER}
      copyIconColor="#ffffff"
    />
  );
}

interface Props {
  onStart: () => void;
}

export default function ChildPersonalityLanding({
  onStart,
}: Props) {
  return (
    <>

      <div
        className="flex flex-col items-center min-h-screen"
        style={{
          backgroundColor: PAGE_BG,
          color: TEXT_COLOR,
          fontFamily: "'Cafe24Surround', 'Pretendard', sans-serif",
          paddingBottom: '40px',
        }}
      >
        {/* 타이틀 및 메인 이미지 영역 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full"
          style={{ position: 'relative', aspectRatio: '1448 / 1086', boxSizing: 'border-box' }}
        >
          <Image
            src="/child-personality/child-title.png"
            alt="우리 아이 사용설명서 — 사주로 알아보는 우리 아이 성향 테스트"
            fill
            priority
            sizes="(max-width: 440px) 100vw, (max-width: 768px) 440px, 600px"
            style={{ objectFit: 'cover' }}
          />
        </motion.div>
        
        <div
          className="flex flex-col items-center w-full"
          style={{ maxWidth: '440px', padding: '0 20px', marginTop: '30px', marginBottom: '20px'}}
        >
          {/* 시작하기 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full"
          >
            <PressableButton
              onClick={onStart}
              label={<span style={{ WebkitTextStroke: '0.3px #ffffff' }}>우리 아이 성향 알아보기</span>}
              style={{ height: '54px' }}
              bgStyle={{ backgroundColor: ACCENT_COLOR, borderRadius: '16px', border: 'none' }}
              hoverBackground={ACCENT_HOVER}
              textStyle={{ color: '#ffffff', fontWeight: 800, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.32px', fontFamily: "'Cafe24Surround', 'Pretendard', sans-serif" }}
            />
          </motion.div>

          {/* 공유 및 사주GPT 링크 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="w-full"
            style={{ marginTop: LANDING_GAPS.ctaToShare - SHARE_ROW_HIDDEN_PADDING }}
          >
            <ChildPersonalityShareRow />
            <div style={{ marginTop: -SHARE_ROW_HIDDEN_PADDING }}>
              <SajuGPTLinkButton featureType="child_personality" color={SUB_TEXT_COLOR} hoverColor={TEXT_COLOR} />
            </div>
          </motion.div>

          {/* 댓글 게시판 */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full"
            style={{ marginTop: LANDING_GAPS.shareToComment }}
          >
            <CommentBoard
              featureType="child_personality"
              storageKey="child_personality_liked_comments"
              placeholder="우리 아이 성향에 대해 이야기해봐요 :)"
              themeColor={ACCENT_COLOR}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}