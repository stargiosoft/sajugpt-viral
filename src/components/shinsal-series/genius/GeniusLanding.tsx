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
      
      {/* 썸네일 영역 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
        <div style={{ width: '100%', aspectRatio: '1448 / 1086', borderBottom: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <img
            src="/shinsal-series/images/genius_main.png"
            alt="내 안의 숨은 괴짜 천재력 메인 썸네일"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </motion.div>

      <div className="w-full flex flex-col items-center" style={{ padding: '32px 16px 0' }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full" style={{ marginBottom: '24px' }}>
          <LandingCTAButton
            onClick={onStart}
            label="내 괴짜 천재력 확인하기"
            background={C.accent}
            color={C.textOnAccent}
            hoverBackground={C.accentHover}
            textStyle={{ fontWeight: 700, fontSize: '16px', fontFamily: 'HSJandari' }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full">
          <ShareRow
            shareContent={{
              featureType: 'shinsal_genius',
              testId: 'analyze-shinsal-genius',
              title: '사주로 보는 내 안의 괴짜 천재력',
              description: '귀문관살부터 백호살까지! 내 사주 속 숨겨진 천재 스탯을 분석해 드려요.',
              shareUrl: `${origin}/shinsal-series/analyze-shinsal-genius`,
              imageUrl: `${origin}/shinsal-series/analyze-shinsal-genius/og-share.png`,
            }}
            copyColor={C.accent}
            copyHoverColor={C.accentHover}
            copyIconColor={C.textOnAccent}
          />
          <SajuGPTLinkButton featureType="shinsal_genius" color={C.textTertiary} hoverColor={C.accent} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="w-full rounded-2xl p-4 md:p-6"
          style={{ 
            marginTop: '40px',
            backgroundColor: C.panelBg || '#1e1e24',
            border: `1px solid ${C.border || '#333'}`,
          }}
        >
          
          <div className="w-full">
            <CommentBoard
              featureType="shinsal_genius"
              storageKey="genius_liked_comments"
              placeholder="제 괴짜 천재 지수는 몇 %인가요?"
              themeColor={C.accent}
              inputBg={C.panelBg}
              disabledBg="#333"
              dark={true}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}