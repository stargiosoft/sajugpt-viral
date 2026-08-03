'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import DeangShareRow from './DeangShareRow';
import CommentBoard from '@/components/CommentBoard';
import { DEANG_COLORS as C } from '@/constants/deangTheme';
import { LANDING_GAPS } from '@/constants/layoutGaps';

const SHARE_ROW_HIDDEN_PADDING = 12;

interface Props {
  onStart: () => void;
}

export default function DeangLanding({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center" style={{ paddingBottom: '40px' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
        style={{ position: 'relative', aspectRatio: '1448 / 1086', boxSizing: 'border-box' }}
      >
        <Image
          src="/deang-saju/title-v6.png"
          alt="댕BTI — 사주로 보는 내 안의 강아지"
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
        >
          <PressableButton
            onClick={onStart}
            label={<span style={{ WebkitTextStroke: '0.3px #FFFFFF' }}>시작하기</span>}
            style={{ height: '54px' }}
            bgStyle={{ backgroundColor: '#58B889', borderRadius: '16px', border: 'none' }}
            hoverBackground="#4ba679"
            textStyle={{ color: '#FFFFFF', fontWeight: 500, fontSize: '17px', lineHeight: '24px', letterSpacing: '-0.32px' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ marginTop: LANDING_GAPS.ctaToShare - SHARE_ROW_HIDDEN_PADDING }}
        >
          <DeangShareRow />
          <div style={{ marginTop: -SHARE_ROW_HIDDEN_PADDING }}>
            <SajuGPTLinkButton featureType="deang_saju" color="#A8A8A8" hoverColor={C.ink} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full"
          style={{ marginTop: LANDING_GAPS.shareToComment }}
        >
          <CommentBoard
            featureType="deang_saju"
            storageKey="deang_saju_liked_comments"
            placeholder="같이 이야기해요 :)"
            themeColor="#58B889"
          />
        </motion.div>
      </div>
    </div>
  );
}
