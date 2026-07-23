'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import TestTopNav from '@/components/TestTopNav';
import LandingCTAButton from '@/components/LandingCTAButton';
import ShareIconRow from './ShareIconRow';
import CommentBoard from './CommentBoard';

interface Props {
  onStart: () => void;
}

export default function Landing({ onStart }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100dvh', background: 'linear-gradient(180deg,#F5F8FD 0%,#E7EFFC 100%)' }}
    >
      <TestTopNav bgColor="rgb(245, 248, 253)" logoColor="#1C2333" />

      <div style={{ position: 'relative', width: '100%', aspectRatio: '1448 / 1086' }}>
        <Image src="/love-chat/thumbnail-v2.png" alt="카톡 습관만 봐도 연애 스타일이 보인다" fill style={{ objectFit: 'cover' }} priority />
      </div>

      <div style={{ padding: '20px 16px 40px' }}>
        <p style={{ fontSize: '14px', color: '#8A93A6', textAlign: 'center', marginTop: '0px', marginBottom: '18px' }}>
          질문 5~7개 · 소요시간 약 1분
        </p>

        <div style={{ marginBottom: '28px' }}>
          <LandingCTAButton
            onClick={onStart}
            label={<span style={{ fontFamily: "'Ongeulip Minmi', sans-serif", fontSize: '24px', fontWeight: 500 }}>시작하기</span>}
            background="#3D6FE0"
            height="56px"
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <ShareIconRow
            shareContent={{
              featureType: 'love_chat',
              title: '카톡 연애도감',
              description: '카톡 습관만 봐도 연애 스타일이 보인다.',
              shareUrl: `${origin}/love-chat`,
              imageUrl: `${origin}/love-chat/thumbnail-v2.png`,
            }}
          />
        </div>

        <CommentBoard />
      </div>
    </motion.div>
  );
}
