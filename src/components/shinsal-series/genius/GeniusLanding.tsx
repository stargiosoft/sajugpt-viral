'use client';

import { motion } from 'framer-motion';
import LandingCTAButton from '@/components/LandingCTAButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import CommentBoard from '@/components/CommentBoard';
import ShareRow from '@/components/ShareRow';
import { GENIUS_COLORS as C } from '@/constants/shinsalGeniusTheme';

interface Props {
  onStart: () => void;
}

export default function GeniusLanding({ onStart }: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="flex flex-col items-center" style={{ paddingBottom: '40px' }}>
      
      {/* 썸네일 엑박 영역 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
        <div style={{ width: '100%', aspectRatio: '1448 / 1086', backgroundColor: C.panelBg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ color: C.textSecondary }}>[ 메인 썸네일 엑박 영역 ]</span>
        </div>
      </motion.div>

      <div className="w-full flex flex-col items-center" style={{ padding: '32px 16px 0' }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full" style={{ marginBottom: '24px' }}>
          <LandingCTAButton
            onClick={onStart}
            label="내 또라이 지수 확인하기"
            background={C.accent}
            color={C.textOnAccent}
            hoverBackground={C.accentHover}
            textStyle={{ fontWeight: 700, fontSize: '16px' }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full">
          <ShareRow
            shareContent={{
              featureType: 'shinsal_genius',
              testId: 'shinsal-genius',
              title: '천재성과 광기 테스트',
              description: '내 사주 속 숨겨진 천재성과 똘끼를 분석해 드려요.',
              shareUrl: `${origin}/shinsal-series/genius`,
              imageUrl: `${origin}/shinsal-series/genius/og-share.png`,
            }}
            copyColor={C.accent}
            copyHoverColor={C.accentHover}
            copyIconColor={C.textOnAccent}
          />
          <SajuGPTLinkButton featureType="shinsal_genius" color={C.textTertiary} hoverColor={C.accent} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full" style={{ marginTop: '40px' }}>
          <CommentBoard
            featureType="shinsal_genius"
            storageKey="genius_liked_comments"
            placeholder="제 똘끼 지수는요..."
            themeColor={C.accent}
            inputBg={C.panelBg}
            disabledBg="#333"
          />
        </motion.div>
      </div>
    </div>
  );
}