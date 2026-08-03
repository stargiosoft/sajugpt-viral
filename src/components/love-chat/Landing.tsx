'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import TestTopNav from '@/components/TestTopNav';
import LandingCTAButton from '@/components/LandingCTAButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import ShareRow from '@/components/ShareRow';
import CommentBoard from '@/components/CommentBoard';
import { LANDING_GAPS } from '@/constants/layoutGaps';

interface Props {
  onStart: () => void;
}

export default function Landing({ onStart }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg,#F5F8FD 0%,#E7EFFC 100%)' }}>
      <TestTopNav bgColor="rgb(245, 248, 253)" logoColor="#1C2333" xColor="#0d0d0d" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', width: '100%', aspectRatio: '1448 / 1086' }}
      >
        <Image src="/love-chat/thumbnail-v2.png" alt="카톡 습관만 봐도 연애 스타일이 보인다" fill style={{ objectFit: 'cover' }} priority />
      </motion.div>

      <div style={{ padding: '20px 16px 40px' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontSize: '14px', color: '#8A93A6', textAlign: 'center', marginTop: '0px', marginBottom: LANDING_GAPS.heroToCta }}
        >
          질문 5~7개 · 소요시간 약 1분
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{ marginBottom: LANDING_GAPS.ctaToShare }}
        >
          <LandingCTAButton
            onClick={onStart}
            label={<span style={{ fontFamily: "'Ongeulip Minmi', sans-serif", fontSize: '22px', fontWeight: 500, paddingTop: '2px', display: 'inline-block' }}>시작하기</span>}
            background="#3D6FE0"
            height="56px"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <ShareRow
            shareContent={{
              featureType: 'love_chat',
              title: '카톡 연애도감',
              description: '카톡 습관만 봐도 연애 스타일이 보인다.',
              shareUrl: `${origin}/love-chat`,
              imageUrl: `${origin}/love-chat/thumbnail-v2.png`,
            }}
            copyColor="#3D6FE0"
            copyHoverColor="#2F58B8"
          />
          <SajuGPTLinkButton featureType="love_chat" color="#8A93A6" hoverColor="#3D6FE0" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          style={{ marginTop: LANDING_GAPS.shareToComment }}
        >
          <CommentBoard
            featureType="love_chat"
            storageKey="love_chat_liked_comments"
            placeholder="여러분은 어떤 카톡 스타일인가요?"
            themeColor="#3D6FE0"
            inputBg="#FFFFFF"
            disabledBg="#DCE0E5"
          />
        </motion.div>
      </div>
    </div>
  );
}
