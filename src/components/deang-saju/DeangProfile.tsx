'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { DeangBreed } from '@/types/deang-saju';
import DeangOutlineBox from './DeangOutlineBox';
import useIsNarrow from '@/hooks/useIsNarrow';

interface Props {
  breed: DeangBreed;
  quip: string;
}

export default function DeangProfile({ breed, quip }: Props) {
  const isNarrow = useIsNarrow();

  // 방어 코드: breed 또는 hashtags가 전달되지 않을 경우 기본값 처리
  const breedName = breed?.breedName || '댕댕이';
  const title = breed?.title ? breed.title.replace(breedName, '').trim() : breedName;
  const hashtagsText = Array.isArray(breed?.hashtags) ? breed.hashtags.join('   ') : '';
  const imageKey = breed?.key || 'gap';
  const displayQuip = quip ? quip.replace(/\.$/, '') : '오늘도 행복한 하루!';

  return (
    <div className="flex flex-col" style={{ gap: '8px' }}>
      <DeangOutlineBox
        radius={22}
        stitch
        stitchRadius={16}
        stitchColor="rgb(202, 230, 218)"
        style={{
          padding: '8px 20px 36px',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url(/deang-saju/title-bg2.png)',
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
        }}
      >
        <div style={{ marginBottom: '3px' }}>
          <p
            style={{
              fontSize: isNarrow ? '16px' : '20px',
              letterSpacing: '-1.5px',
              fontWeight: 500,
              color: '#000000',
              WebkitTextStroke: '0.2px #000000',
              paddingTop: '24px',
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: isNarrow ? '34px' : '44px',
              letterSpacing: '-2.5px',
              fontWeight: 500,
              color: '#000000',
              WebkitTextStroke: '1.5px #000000',
              marginTop: isNarrow ? '-4px' : '-6px',
            }}
          >
            {breedName}
          </p>
        </div>
        <div className="flex justify-center" style={{ marginTop: '-2px' }}>
          <DeangOutlineBox radius={999} strokeWidth={2} strokeColor="rgb(202, 230, 218)" backgroundColor="#FFFFFF" style={{ padding: isNarrow ? '2px 10px 2px' : '4px 12px 3px' }}>
            <span style={{ fontSize: isNarrow ? '13.5px' : '15.5px', letterSpacing: '-0.3px', color: 'rgb(45, 117, 81)', fontWeight: 500, whiteSpace: 'nowrap', WebkitTextStroke: '0.1px rgb(45, 117, 81)' }}>
              {hashtagsText}
            </span>
          </DeangOutlineBox>
        </div>

        <div className="transform-gpu flex flex-col items-center">
          <div style={{ position: 'relative', transform: `translateY(${isNarrow ? '-24px' : '-32px'}) translateZ(0)` }}>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ position: 'relative', width: isNarrow ? '210px' : '260px', height: isNarrow ? '210px' : '260px', marginTop: '4px', marginBottom: '8px' }}
            >
              <Image src={`/deang-saju/breeds/${imageKey}.png`} alt={breedName} fill unoptimized style={{ objectFit: 'contain' }} />
            </motion.div>
          </div>

          <DeangOutlineBox
            className="deang-quip-badge"
            radius={18}
            strokeWidth={0}
            backgroundColor="rgb(88, 184, 136)"
            stitch
            stitchInset={6}
            stitchRadius={12}
            stitchWidth={1.5}
            stitchColor="rgb(58, 148, 108)"
            stitchDasharray="8 5"
            style={{
              marginTop: '-59px',
              width: 'max-content',
              maxWidth: 'calc(100vw - 64px)',
              zIndex: 5,
              padding: '12px 24px',
              textAlign: 'center',
              overflow: 'visible',
            }}
          >
            <p style={{ fontSize: '18px', letterSpacing: '-0.5px', color: '#FFFFFF', fontWeight: 500, WebkitTextStroke: '0.2px #FFFFFF', lineHeight: '1.5', wordBreak: 'keep-all' }}>
              &ldquo; {displayQuip} &rdquo;
            </p>
          </DeangOutlineBox>
        </div>
      </DeangOutlineBox>
    </div>
  );
}