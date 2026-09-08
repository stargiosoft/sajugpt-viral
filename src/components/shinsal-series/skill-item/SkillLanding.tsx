'use client';

import { motion } from 'framer-motion';

import LandingCTAButton from '@/components/LandingCTAButton';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import CommentBoard from '@/components/CommentBoard';
import ShareRow from '@/components/ShareRow';

import { SKILL_ITEM_COLORS as C } from '@/constants/shinsalItemTheme';

interface SkillLandingProps {
  onStart: () => void;
}

export default function SkillLanding({
  onStart,
}: SkillLandingProps) {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : '';

  return (
    <div
      className="flex flex-col items-center"
      style={{
        paddingBottom: '40px',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <div
          style={{
            width: '100%',
            aspectRatio: '1448 / 1086',
            borderBottom: `1px solid ${C.border}`,
            overflow: 'hidden',
          }}
        >
          <img
            src="/shinsal-series/images/skill_item_main.png"
            alt="나의 12신살 메인 이미지"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </motion.div>

      <div
        className="w-full flex flex-col items-center"
        style={{
          padding: '32px 16px 0',
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="w-full"
          style={{
            marginBottom: '24px',
          }}
        >
          <LandingCTAButton
            onClick={onStart}
            label="내 신살 확인하기"
            background={C.accent}
            color={C.textOnAccent}
            hoverBackground={C.accentHover}
            textStyle={{
              fontWeight: 700,
              fontSize: '16px',
              fontFamily: 'HSJandari',
            }}
          />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="w-full"
        >
          <ShareRow
            shareContent={{
              featureType: 'shinsal_skill',
              testId: 'analyze-shinsal-skillitem',
              title: '사주로 보는 나의 12신살 ✨',
              description:
                '내 사주에는 어떤 신살이 함께하고 있을까요? 생년월일로 나의 12신살을 확인해보세요.',
              shareUrl: `${origin}/shinsal-series/skill-item`,
              imageUrl: `${origin}/shinsal-series/skill-item/og-share.jpg`,
            }}
            copyColor={C.accent}
            copyHoverColor={C.accentHover}
            copyIconColor={C.textOnAccent}
          />

          <SajuGPTLinkButton
            featureType="shinsal_skill"
            color={C.textTertiary}
            hoverColor={C.accent}
          />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="w-full rounded-2xl p-4 md:p-6"
          style={{
            marginTop: '40px',
            backgroundColor:
              C.panelBg || '#1e1e24',
            border: `1px solid ${
              C.border || '#333'
            }`,
          }}
        >
          <CommentBoard
            featureType="shinsal_skill"
            storageKey="skill_item_comments"
            placeholder="어떤 신살이 나오셨나요?"
            themeColor="#8B5FC7"
            inputBg="#FFFFFF"
            disabledBg="#F3EEF7"
            emptyStateColor="#8D8197"
            metaColor="#8D8197"
            heartIdleColor="#B8ADBF"
            moreButtonFontSize="13px"
          />
        </motion.div>
      </div>
    </div>
  );
}