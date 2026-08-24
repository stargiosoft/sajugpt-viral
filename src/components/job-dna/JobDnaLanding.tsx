'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PressableButton from '@/components/PressableButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import CommentBoard from '@/components/CommentBoard';
import { LANDING_GAPS } from '@/constants/layoutGaps';
import ShareRow from '@/components/ShareRow';
import { JOB_DNA_COLORS as C } from '@/constants/jobDnaTheme';

const SHARE_ROW_HIDDEN_PADDING = 12;

// 랜딩 페이지 전용 공유 행 컴포넌트
function JobDnaShareRow() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <ShareRow
      shareContent={{
        featureType: 'job_dna',
        title: '✨ 사주로 알아보는 나의 직업 DNA',
        description: '나의 직업운 DNA와 천직을 확인해보세요!',
        shareUrl,
        imageUrl: origin ? `${origin}/job-dna/og-share.png` : '/job-dna/og-share.png',
        testId: 'job-dna',
      }}
      copyColor="#ffab00"
      copyHoverColor="#e09600"
      copyIconColor="#1e1409"
    />
  );
}

interface Props {
  onStart: () => void;
}

export default function JobDnaLanding({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center min-h-screen" style={{ paddingBottom: '40px', backgroundColor: C.pageBg }}>
      {/* 타이틀 및 메인 이미지 영역 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
        style={{ position: 'relative', aspectRatio: '1448 / 1086', boxSizing: 'border-box' }}
      >
        <Image
          src="/job-dna/title-v1.png"
          alt="직업운 DNA — 사주로 알아보는 나의 천직 테스트"
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <PressableButton
            onClick={onStart}
            label={<span style={{ WebkitTextStroke: '0.3px #1e1409' }}>시작하기</span>}
            style={{ height: '54px' }}
            bgStyle={{ backgroundColor: '#ffab00', borderRadius: '16px', border: 'none' }}
            hoverBackground="#e09600"
            textStyle={{ color: '#1e1409', fontWeight: 700, fontSize: '17px', lineHeight: '24px', letterSpacing: '-0.32px' }}
          />
        </motion.div>

        {/* 공유 및 사주GPT 링크 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ marginTop: LANDING_GAPS.ctaToShare - SHARE_ROW_HIDDEN_PADDING }}
        >
          <JobDnaShareRow />
          <div style={{ marginTop: -SHARE_ROW_HIDDEN_PADDING }}>
            <SajuGPTLinkButton featureType="job_dna" color="#b8a694" hoverColor="#1e1409" />
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
            featureType="job_dna"
            storageKey="job_dna_liked_comments"
            placeholder="내 직업운에 대해 이야기해봐요 :)"
            themeColor="#ffab00"
          />
        </motion.div>
      </div>
    </div>
  );
}