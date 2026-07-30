'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import GhostSealButton from '@/components/ghost-tarot/GhostSealButton';
import GhostCommentSection from '@/components/ghost-tarot/GhostCommentSection';
import type { CommentFeatureType } from '@/lib/ghost-tarot/comments';
import { GHOST_BRUSH_FONT } from '@/lib/ghost-tarot/theme';
import TarotShareRow from './TarotShareRow';
import SajuGPTLinkButton from '@/components/SajuGPTLinkButton';
import type { TarotConfig } from '@/types/tarot';

interface Props {
  config: TarotConfig;
  onStart: () => void;
}

export default function TarotLanding({
  config,
  onStart,
}: Props) {
  const { palette } = config.theme;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100dvh',
        paddingBottom: 60,
        background: `${palette.bg} url(${config.assets.bgTexture}) center top / 100% 100% no-repeat`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .8 }}
        style={{ position: 'relative', width: '100%', aspectRatio: '1448 / 1086' }}
      >
        <Image
          src={config.assets.heroImage}
          alt={config.copy.heroAlt}
          fill
          priority
          style={{
            objectFit: 'cover',
            maskImage: 'linear-gradient(to bottom, #000 70%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 70%, transparent)',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .5, duration: .5 }}
        style={{
          marginTop: 32,
          marginLeft: 24,
          marginRight: 24,
          position: 'relative',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(232,223,208,0.06)',
            padding: '10px 20px 20px',
            textAlign: 'center',
            clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 16px), calc(100% - 6px) calc(100% - 10px), calc(50% + 8px) calc(100% - 10px), 50% 100%, calc(50% - 8px) calc(100% - 10px), 6px calc(100% - 10px), 0 calc(100% - 16px), 0 6px)',
          }}
        >
          <span style={{ display: 'inline-block', paddingTop: 2, fontFamily: 'Pretendard', fontSize: 14, fontWeight: 600, color: 'rgb(199 199 199)' }}>
            {config.copy.landingBadge}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: .65, duration: .5 }}
        style={{ marginTop: 10, position: 'relative', zIndex: 2, textAlign: 'center' }}
      >
        <span style={{ fontFamily: GHOST_BRUSH_FONT, fontSize: 22.5, fontWeight: 500, color: 'rgb(255 255 255 / 75%)', letterSpacing: '-0.2px' }}>
          같은 달에 본 운명을 다시 탐하지 마라
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .7, duration: .5 }}
        style={{ marginTop: 15, marginLeft: 16, marginRight: 16, position: 'relative', zIndex: 2 }}
      >
        <GhostSealButton variant="primary" onClick={onStart} fontSize={21} webFontSize={23} narrowFontSize={20}>
          {config.copy.landingCta}
        </GhostSealButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: .5 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <TarotShareRow config={config} hideLabel />
        <SajuGPTLinkButton featureType={config.featureType} color="rgb(166 166 166)" hoverColor="rgb(199 199 199)" />
      </motion.div>

      {(config.slug === 'ghost-tarot' || config.slug === 'romance-ghost-tarot') && (
        <div style={{ marginTop: 80, marginLeft: 16, marginRight: 16, position: 'relative', zIndex: 2 }}>
          <GhostCommentSection featureType={config.featureType as CommentFeatureType} />
        </div>
      )}
    </motion.div>
  );
}
